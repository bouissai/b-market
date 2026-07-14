export type CsvParseResult = {
	headers: string[];
	rows: Record<string, string>[];
	errors: string[];
};

const FORMULA_PREFIXES = ['=', '+', '-', '@'];

export function escapeCsvCell(value: unknown): string {
	const raw = value == null ? '' : String(value);
	const safe =
		FORMULA_PREFIXES.some(prefix => raw.startsWith(prefix)) ? `'${raw}` : raw;
	return `"${safe.replaceAll('"', '""')}"`;
}

export function toCsv(headers: string[], rows: Array<Record<string, unknown>>) {
	const lines = [
		headers.map(escapeCsvCell).join(';'),
		...rows.map(row => headers.map(header => escapeCsvCell(row[header])).join(';')),
	];

	return `\uFEFF${lines.join('\r\n')}`;
}

export function parseCsv(input: string, maxRows = 500): CsvParseResult {
	const text = input.replace(/^\uFEFF/, '');
	const records: string[][] = [];
	const errors: string[] = [];
	let current = '';
	let row: string[] = [];
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const next = text[index + 1];

		if (char === '"') {
			if (inQuotes && next === '"') {
				current += '"';
				index += 1;
			} else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (char === ';' && !inQuotes) {
			row.push(current);
			current = '';
			continue;
		}

		if ((char === '\n' || char === '\r') && !inQuotes) {
			if (char === '\r' && next === '\n') index += 1;
			row.push(current);
			current = '';
			if (row.some(cell => cell.trim() !== '')) records.push(row);
			row = [];
			continue;
		}

		current += char;
	}

	if (inQuotes) {
		errors.push('Le fichier CSV contient une cellule entre guillemets non fermée.');
	}

	row.push(current);
	if (row.some(cell => cell.trim() !== '')) records.push(row);

	const [headers = [], ...dataRows] = records;
	const normalizedHeaders = headers.map(header => header.trim());

	if (dataRows.length > maxRows) {
		errors.push(`Le fichier contient ${dataRows.length} lignes. Limite: ${maxRows}.`);
	}

	const rows = dataRows.slice(0, maxRows).map((cells, rowIndex) => {
		const entry: Record<string, string> = {};
		normalizedHeaders.forEach((header, cellIndex) => {
			entry[header] = cells[cellIndex]?.trim() ?? '';
		});

		if (cells.length > normalizedHeaders.length) {
			errors.push(`Ligne ${rowIndex + 2}: trop de colonnes.`);
		}

		return entry;
	});

	return { headers: normalizedHeaders, rows, errors };
}

export function csvResponse(csv: string, filename: string) {
	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`,
			'Cache-Control': 'no-store',
		},
	});
}

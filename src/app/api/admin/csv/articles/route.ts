import {
	articleCsvTemplate,
	exportArticlesCsv,
	importArticlesCsv,
} from '@/lib/admin-csv';
import { requireAdmin } from '@/lib/helpers/requireAdmin';
import { csvResponse } from '@/lib/csv';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 1024 * 1024;

function datedFilename(prefix: string) {
	return `${prefix}-${new Date().toISOString().slice(0, 10)}.csv`;
}

export async function GET(req: NextRequest) {
	const adminCheck = await requireAdmin();
	if (adminCheck.error) return adminCheck.error;

	const { searchParams } = new URL(req.url);
	const template = searchParams.get('template') === 'true';
	const csv = template ? articleCsvTemplate() : await exportArticlesCsv();

	return csvResponse(
		csv,
		template ? 'modele-import-articles.csv' : datedFilename('articles-bmarket'),
	);
}

export async function POST(req: NextRequest) {
	const adminCheck = await requireAdmin();
	if (adminCheck.error) return adminCheck.error;

	const contentType = req.headers.get('content-type') ?? '';
	if (!contentType.includes('multipart/form-data')) {
		return NextResponse.json(
			{ message: 'Un fichier CSV multipart est attendu.' },
			{ status: 415 },
		);
	}

	const formData = await req.formData();
	const mode = formData.get('mode') === 'commit' ? 'commit' : 'preview';
	const file = formData.get('file');

	if (!(file instanceof File)) {
		return NextResponse.json({ message: 'Fichier CSV manquant.' }, { status: 400 });
	}

	if (!file.name.toLowerCase().endsWith('.csv') || file.type === 'application/json') {
		return NextResponse.json(
			{ message: 'Seuls les fichiers .csv sont acceptés.' },
			{ status: 415 },
		);
	}

	if (file.size > MAX_FILE_SIZE) {
		return NextResponse.json(
			{ message: 'Le fichier dépasse la limite de 1 Mo.' },
			{ status: 413 },
		);
	}

	const report = await importArticlesCsv(await file.text(), mode);

	return NextResponse.json(report, {
		status: mode === 'commit' && report.errors.length > 0 ? 422 : 200,
	});
}

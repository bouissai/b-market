import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeCsvCell, parseCsv, toCsv } from './csv';

test('toCsv exports semicolon CSV with UTF-8 BOM and escaped values', () => {
	const csv = toCsv(['name', 'description', 'empty'], [
		{
			name: 'Côte "premium"',
			description: 'ligne 1\nligne 2; avec accent é',
			empty: '',
		},
	]);

	assert.ok(csv.startsWith('\uFEFF'));
	assert.match(csv, /"Côte ""premium"""/);
	assert.match(csv, /"ligne 1\nligne 2; avec accent é"/);
	assert.match(csv, /"empty"/);
});

test('parseCsv reads quoted semicolons, quotes, new lines and empty cells', () => {
	const parsed = parseCsv(
		'\uFEFF"name";"description";"empty"\r\n"Côte ""premium""";"ligne 1\nligne 2; ok";""',
	);

	assert.deepEqual(parsed.errors, []);
	assert.deepEqual(parsed.headers, ['name', 'description', 'empty']);
	assert.equal(parsed.rows[0].name, 'Côte "premium"');
	assert.equal(parsed.rows[0].description, 'ligne 1\nligne 2; ok');
	assert.equal(parsed.rows[0].empty, '');
});

test('escapeCsvCell prevents CSV formula injection', () => {
	assert.equal(escapeCsvCell('=IMPORTXML("https://example.com")'), '"\'=IMPORTXML(""https://example.com"")"');
	assert.equal(escapeCsvCell('+SUM(1,1)'), '"\'+SUM(1,1)"');
	assert.equal(escapeCsvCell('-10'), '"\'-10"');
	assert.equal(escapeCsvCell('@cmd'), '"\'@cmd"');
});

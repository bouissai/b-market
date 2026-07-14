'use client';

import { useRef, useState } from 'react';
import { Download, FileUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type CsvRowPreview = {
	row: number;
	action: 'create' | 'update' | 'skip';
	id?: string;
	name?: string;
	title?: string;
	categoryName?: string;
	ingredientCount?: number;
	stepCount?: number;
};

type CsvReport = {
	created: number;
	updated: number;
	skipped: number;
	errors: Array<{ row: number; message: string }>;
	rows: CsvRowPreview[];
};

type CsvImportExportPanelProps = {
	title: string;
	description: string;
	endpoint: string;
	onImported?: () => Promise<void> | void;
};

export function CsvImportExportPanel({
	title,
	description,
	endpoint,
	onImported,
}: CsvImportExportPanelProps) {
	const { toast } = useToast();
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [report, setReport] = useState<CsvReport | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const runImport = async (mode: 'preview' | 'commit') => {
		if (!file) {
			toast({
				title: 'Fichier manquant',
				description: 'Sélectionnez un fichier CSV avant de lancer l’analyse.',
				variant: 'destructive',
			});
			return;
		}

		setIsLoading(true);
		const formData = new FormData();
		formData.append('file', file);
		formData.append('mode', mode);

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
			});
			const data = (await response.json()) as CsvReport | { message?: string };

			if (!response.ok && !('rows' in data)) {
				throw new Error(data.message ?? "L'import CSV a échoué.");
			}

			if ('rows' in data) {
				setReport(data);
				if (mode === 'commit' && data.errors.length === 0) {
					await onImported?.();
					toast({
						title: 'Import terminé',
						description: `${data.created} création(s), ${data.updated} mise(s) à jour.`,
					});
				}
			}
		} catch (error) {
			toast({
				title: 'Erreur CSV',
				description:
					error instanceof Error ? error.message : "Impossible de lire le fichier.",
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button asChild variant="outline" size="sm">
				<a href={endpoint}>
					<Download className="h-4 w-4" aria-hidden="true" />
					Exporter
				</a>
			</Button>
			<Button asChild variant="outline" size="sm">
				<a href={`${endpoint}?template=true`}>
					<FileUp className="h-4 w-4" aria-hidden="true" />
					Modèle CSV
				</a>
			</Button>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => setOpen(true)}>
				<Upload className="h-4 w-4" aria-hidden="true" />
				Importer
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="rounded-md border border-dashed p-4">
							<Input
								ref={inputRef}
								type="file"
								accept=".csv,text/csv"
								onChange={event => {
									const nextFile = event.target.files?.[0] ?? null;
									setFile(nextFile);
									setReport(null);
								}}
							/>
							<p className="mt-2 text-sm text-muted-foreground">
								CSV UTF-8, séparateur point-virgule, 1 Mo maximum. Lancez
								toujours une prévisualisation avant l’import.
							</p>
						</div>

						{report && (
							<div className="space-y-3">
								<div className="grid gap-2 text-sm sm:grid-cols-4">
									<div className="rounded-md bg-muted p-3">
										Créations: <strong>{report.created}</strong>
									</div>
									<div className="rounded-md bg-muted p-3">
										Mises à jour: <strong>{report.updated}</strong>
									</div>
									<div className="rounded-md bg-muted p-3">
										Ignorées: <strong>{report.skipped}</strong>
									</div>
									<div className="rounded-md bg-muted p-3">
										Erreurs: <strong>{report.errors.length}</strong>
									</div>
								</div>

								{report.errors.length > 0 && (
									<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
										<p className="font-medium text-destructive">
											Import bloqué tant que ces erreurs existent
										</p>
										<ul className="mt-2 list-disc space-y-1 pl-5">
											{report.errors.slice(0, 8).map(error => (
												<li key={`${error.row}-${error.message}`}>
													Ligne {error.row || '?'}: {error.message}
												</li>
											))}
										</ul>
									</div>
								)}

								<div className="max-h-64 overflow-auto rounded-md border">
									<table className="w-full text-left text-sm">
										<thead className="sticky top-0 bg-background">
											<tr>
												<th className="p-2">Ligne</th>
												<th className="p-2">Action</th>
												<th className="p-2">Nom / titre</th>
												<th className="p-2">Détail</th>
											</tr>
										</thead>
										<tbody>
											{report.rows.slice(0, 50).map(row => (
												<tr key={`${row.row}-${row.id}`} className="border-t">
													<td className="p-2">{row.row}</td>
													<td className="p-2">{row.action}</td>
													<td className="p-2">{row.name ?? row.title}</td>
													<td className="p-2 text-muted-foreground">
														{row.categoryName ??
															`${row.ingredientCount ?? 0} ingrédient(s), ${row.stepCount ?? 0} étape(s)`}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setOpen(false);
								setReport(null);
								setFile(null);
								if (inputRef.current) inputRef.current.value = '';
							}}>
							Fermer
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={isLoading || !file}
							onClick={() => void runImport('preview')}>
							Analyser
						</Button>
						<Button
							type="button"
							disabled={isLoading || !report || report.errors.length > 0}
							onClick={() => void runImport('commit')}>
							Confirmer l’import
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

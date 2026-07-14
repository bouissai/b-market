'use client';

import { Button } from '@/components/ui/button';
import { Printer, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type RecipeActionsProps = {
	title: string;
};

export default function RecipeActions({ title }: RecipeActionsProps) {
	const handlePrint = () => {
		window.print();
	};

	const handleShare = async () => {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({ title, url });
				return;
			} catch {
				// L'utilisateur a annulé ou erreur — fallback copie
			}
		}

		try {
			await navigator.clipboard.writeText(url);
			toast({
				title: 'Lien copié',
				description: 'Le lien de la recette a été copié dans le presse-papiers.',
			});
		} catch {
			toast({
				title: 'Erreur',
				description: 'Impossible de copier le lien.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="flex flex-wrap gap-2 print:hidden">
			<Button
				variant="outline"
				size="sm"
				className="gap-1"
				onClick={handlePrint}
				aria-label="Imprimer la recette">
				<Printer className="h-4 w-4" aria-hidden="true" />
				Imprimer
			</Button>
			<Button
				variant="outline"
				size="sm"
				className="gap-1"
				onClick={handleShare}
				aria-label="Partager la recette">
				<Share2 className="h-4 w-4" aria-hidden="true" />
				Partager
			</Button>
		</div>
	);
}

'use client';

import Image from 'next/image';
import { type ChangeEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { extractPublicId } from '@/lib/helpers/extractPublicId';
import { useImageStore } from '@/store/useImageStore';

type RecipeImageProps = {
	imageUrl: string;
	setImageUrl: (url: string) => void;
	onUploadSuccess?: (url: string) => void;
};

export function RecipeImage({
	imageUrl,
	setImageUrl,
	onUploadSuccess,
}: RecipeImageProps) {
	const { toast } = useToast();
	const { uploadRecipeImage, deleteImage, defaultImageUrl } = useImageStore();
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [cacheKey, setCacheKey] = useState(Date.now());
	const inputId = 'recipe-image-upload';

	useEffect(() => {
		setCacheKey(Date.now());
	}, [imageUrl]);

	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		try {
			const newImageUrl = await uploadRecipeImage(file);
			if (!newImageUrl) throw new Error("L'upload a échoué");
			setImageUrl(newImageUrl);
			onUploadSuccess?.(newImageUrl);
			toast({ title: 'Succès', description: 'Image téléversée.' });
		} catch {
			toast({
				title: 'Erreur',
				description: "Impossible de téléverser l'image.",
				variant: 'destructive',
			});
		} finally {
			setIsUploading(false);
			event.target.value = '';
		}
	};

	const handleDelete = async () => {
		if (!imageUrl || imageUrl === defaultImageUrl) return;

		setIsDeleting(true);
		try {
			const publicId = extractPublicId(imageUrl, defaultImageUrl);
			if (publicId) await deleteImage(publicId);
			setImageUrl(defaultImageUrl);
			toast({ title: 'Succès', description: 'Image supprimée.' });
		} catch {
			toast({
				title: 'Erreur',
				description: "Impossible de supprimer l'image.",
				variant: 'destructive',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const displayUrl = imageUrl || defaultImageUrl;
	const isDefault = displayUrl === defaultImageUrl;

	return (
		<div className="space-y-3">
			<Label htmlFor="recipeImageUrl">Image de la recette</Label>
			<div className="relative h-40 w-full overflow-hidden rounded-md border bg-muted/20">
				<Image
					src={`${displayUrl}?v=${cacheKey}`}
					alt="Aperçu de la recette"
					fill
					sizes="(max-width: 640px) 100vw, 480px"
					className="object-cover"
				/>
				{isUploading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white">
						Téléversement...
					</div>
				)}
			</div>
			<Input id="recipeImageUrl" value={displayUrl} disabled />
			<div className="flex flex-wrap gap-2">
				<Input
					id={inputId}
					type="file"
					accept="image/*"
					onChange={handleUpload}
					disabled={isUploading}
					className="hidden"
				/>
				<Button
					type="button"
					variant="outline"
					onClick={() => document.getElementById(inputId)?.click()}
					disabled={isUploading || isDeleting}>
					{isUploading ? 'Téléversement...' : 'Téléverser'}
				</Button>
				{!isDefault && (
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isUploading || isDeleting}>
						{isDeleting ? 'Suppression...' : 'Supprimer'}
					</Button>
				)}
			</div>
		</div>
	);
}

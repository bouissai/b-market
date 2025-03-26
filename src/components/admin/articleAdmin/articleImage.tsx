import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { extractPublicId } from '@/lib/helpers/extractPublicId';
import { useImageStore } from '@/store/useImageStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ArticleImageProps {
	imageUrl: string;
	setImageUrl: (url: string) => void;
	onUploadSuccess?: (url: string) => void; // ✅ nouvelle prop
}

export function ArticleImage({
	imageUrl,
	setImageUrl,
	onUploadSuccess,
}: ArticleImageProps) {
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const {
		uploadArticleImage: uploadImage,
		deleteImage,
		defaultImageUrl,
	} = useImageStore();
	const [cacheKey, setCacheKey] = useState(Date.now());

	// Réinitialiser le cacheKey quand l'imageUrl change
	useEffect(() => {
		setCacheKey(Date.now());
	}, [imageUrl]);

	// Gérer l'upload d'une nouvelle image
	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);

		try {
			// 1. Upload de la nouvelle image
			const newImageUrl = await uploadImage(files[0]);

			if (!newImageUrl) {
				throw new Error("L'upload a échoué");
			}

			// 2. Mettre à jour l'URL dans le composant parent
			setImageUrl(newImageUrl);
			onUploadSuccess?.(newImageUrl);
			setCacheKey(Date.now());

			toast({
				title: 'Succès',
				description: 'Image uploadée avec succès.',
				duration: 2000,
			});
		} catch (error) {
			console.error('Erreur upload:', error);
			toast({
				title: 'Erreur',
				description: "Impossible d'uploader l'image.",
				variant: 'destructive',
			});
		} finally {
			setIsUploading(false);
		}
	};

	// Gérer la suppression d'une image
	const handleDelete = async () => {
		// Ne rien faire si c'est déjà l'image par défaut
		if (imageUrl === defaultImageUrl) return;

		setIsDeleting(true);

		try {
			// 1. Extraire le publicId de l'image actuelle
			const publicId = extractPublicId(imageUrl, defaultImageUrl);

			if (publicId) {
				// 2. Supprimer l'image de Cloudinary
				await deleteImage(publicId);
			}

			// 3. Mettre à jour l'URL dans le composant parent
			setImageUrl(defaultImageUrl);
			setCacheKey(Date.now());

			toast({
				title: 'Succès',
				description: 'Image supprimée avec succès.',
				duration: 2000,
			});
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			toast({
				title: 'Erreur',
				description: "Impossible de supprimer l'image.",
				variant: 'destructive',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const isDefault = imageUrl === defaultImageUrl;

	return (
		<div className="space-y-2">
			<Label htmlFor="imageUrl">Image de l'article</Label>

			<div className="my-2 relative">
				<div className="relative w-[150px] h-[150px]">
					<Image
						src={`${imageUrl || defaultImageUrl}?v=${cacheKey}`}
						alt="Image de l'article"
						fill
						sizes="150px"
						className="object-contain"
						quality={10}
					/>
				</div>

				{isUploading && <Loading />}
			</div>

			<Input
				id="imageUrl"
				value={imageUrl || defaultImageUrl}
				disabled={true}
				className="cursor-not-allowed"
			/>

			<div className="flex items-center gap-2">
				<Input
					type="file"
					accept="image/*"
					onChange={handleUpload}
					disabled={isUploading}
					className="hidden"
					id="file-upload"
				/>
				<label htmlFor="file-upload" className="w-full">
					<Button
						type="button"
						disabled={isUploading}
						className="w-full"
						onClick={() =>
							document.getElementById('file-upload')?.click()
						}>
						{isUploading ? 'Téléchargement...' : 'Télécharger une image'}
					</Button>
				</label>

				{!isDefault && (
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isDeleting || isUploading}>
						{isDeleting ? 'Suppression...' : 'Supprimer'}
					</Button>
				)}
			</div>
		</div>
	);
}

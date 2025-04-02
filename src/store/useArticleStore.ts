import { toast } from '@/hooks/use-toast';
import type {
	ArticleDeleteDto,
	ArticleGetDto,
	ArticlePostDto,
	ArticlePutDto,
} from '@/types/article';
import { create } from 'zustand';
import { useImageStore } from './useImageStore';
import { extractPublicId } from '@/lib/helpers/extractPublicId';

type ArticleStore = {
	articles: ArticleGetDto[];
	selectedArticle: ArticlePutDto | ArticlePostDto | ArticleDeleteDto | null;
	mode: 'new' | 'edit' | 'delete' | null;
	isLoading: boolean;
	error: string | null;
	totalArticles: number;
	fetchArticles: (
		categoryId?: string,
		page?: number,
		limit?: number,
	) => Promise<void>;
	addArticle: (newArticle: ArticlePostDto) => Promise<ArticleGetDto | null>;
	updateArticle: (
		updatedArticle: ArticlePutDto,
	) => Promise<ArticleGetDto | null>;
	setSelectedArticle: (
		article: ArticlePutDto | ArticlePostDto | ArticleDeleteDto | null,
		mode: null | 'edit' | 'delete' | 'new',
	) => void;
	deleteArticle: () => Promise<boolean>;
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
	articles: [],
	selectedArticle: null,
	isLoading: false,
	error: null,
	mode: null,
	totalArticles: 0,

	fetchArticles: async (
		categoryId?: string,
		page?: number,
		limit?: number,
	) => {
		set({ isLoading: true, error: null });

		try {
			const url = new URL('/api/article', window.location.origin);
			if (categoryId) url.searchParams.append('categoryId', categoryId);
			if (page) url.searchParams.append('page', page.toString());
			if (limit) url.searchParams.append('limit', limit.toString());

			const response = await fetch(url);

			if (!response.ok)
				throw new Error('Erreur lors du chargement des articles');

			const data = await response.json();

			set({
				articles: data.articles,
				totalArticles: data.total,
				isLoading: false,
			});
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				isLoading: false,
			});
		}
	},

	setSelectedArticle: (
		article: ArticlePutDto | ArticlePostDto | ArticleDeleteDto | null,
		mode: null | 'edit' | 'delete' | 'new',
	) => {
		if (mode === 'delete' && article) {
			const { id, name, image } = article as ArticleDeleteDto;
			set({ selectedArticle: { id, name, image }, mode });
		} else {
			set({ selectedArticle: article, mode });
		}
	},
	addArticle: async (articleData: ArticlePostDto) => {
		set({ isLoading: true, error: null });

		try {
			console.log(JSON.stringify(articleData));
			const response = await fetch('/api/article', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(articleData),
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.message || 'Erreur inconnue');
			}

			const newArticle = await response.json();

			set(state => ({
				articles: [...state.articles, newArticle],
				isLoading: false,
			}));

			toast({
				title: 'Succès',
				description: 'Article ajouté avec succès',
			});

			return newArticle;
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				isLoading: false,
			});

			toast({
				title: 'Erreur',
				description:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				variant: 'destructive',
			});

			return null;
		}
	},

	updateArticle: async (articleData: ArticlePutDto) => {
		set({ isLoading: true, error: null });

		try {
			const response = await fetch(`/api/article/${articleData.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(articleData),
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.message || 'Erreur inconnue');
			}

			const updatedArticle = await response.json();

			set(state => ({
				articles: state.articles.map(a =>
					a.id === updatedArticle.id ? updatedArticle : a,
				),
				isLoading: false,
			}));

			toast({
				title: 'Succès',
				description: 'Article modifié avec succès',
			});

			return updatedArticle;
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				isLoading: false,
			});

			toast({
				title: 'Erreur',
				description:
					error instanceof Error
						? error.message
						: 'Une erreur est survenue',
				variant: 'destructive',
			});

			return null;
		}
	},

	deleteArticle: async () => {
		const { selectedArticle } = get();
		if (!selectedArticle || !('id' in selectedArticle)) return false;

		const { deleteImage, defaultImageUrl } = useImageStore.getState();
		const publicId = extractPublicId(selectedArticle.image, defaultImageUrl);

		try {
			const response = await fetch(`/api/article/${selectedArticle.id}`, {
				method: 'DELETE',
			});
			const data = await response.json();

			if (!response.ok) {
				toast({
					title: 'Erreur',
					description:
						data.message ||
						'Une erreur est survenue lors de la suppression',
					variant: 'destructive',
				});
				return false;
			}

			set(state => ({
				articles: state.articles.filter(a => a.id !== selectedArticle.id),
				selectedArticle: null,
			}));
			// Supprimer l'image de Cloudinary si elle existe
			if (publicId) {
				await deleteImage(publicId);
			}
			return true;
		} catch (error) {
			toast({
				title: 'Erreur',
				description: 'Une erreur est survenue lors de la suppression',
				variant: 'destructive',
			});
			return false;
		}
	},
}));

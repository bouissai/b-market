import { toast } from "@/hooks/use-toast";
import type { Article } from "@/types/article";
import { create } from "zustand";
import { useImageStore } from "./useImageStore";
import { extractPublicId } from "@/lib/helpers/extractPublicId";

type ArticleStore = {
    articles: Article[];
    selectedArticle: Article | null;
    mode: "new" | "edit" | "delete" | null;
    isLoading: boolean;
    error: string | null;
    fetchArticles: () => Promise<void>;
    addArticle: (newArticle: Partial<Article>) => Promise<Article | null>;
    updateArticle: (updatedArticle: Partial<Article>) => Promise<Article | null>;
    setSelectedArticle: (article: Article | null, mode: null | "edit" | "delete" | "new") => void;
    deleteArticle: () => Promise<boolean>;
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
    articles: [],
    selectedArticle: null,
    isLoading: false,
    error: null,
    mode: null,

    // Charger les articles depuis l'API
    fetchArticles: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch("/api/article");
            if (!response.ok) throw new Error("Erreur lors du chargement des articles");

            const data: Article[] = await response.json();
            set({ articles: data, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Une erreur est survenue",
                isLoading: false,
            });
        }
    },

    setSelectedArticle: (article, mode = null) => set({ selectedArticle: article, mode }), // 🔥 Mode "edit" ou "delete"

    // Ajouter un article
    addArticle: async (articleData) => {
        set({ isLoading: true, error: null });
        
        try {
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
            
            set((state) => ({
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
                error: error instanceof Error ? error.message : 'Une erreur est survenue',
                isLoading: false,
            });
            
            toast({
                title: 'Erreur',
                description: error instanceof Error ? error.message : 'Une erreur est survenue',
                variant: 'destructive',
            });
            
            return null;
        }
    },
    // Mettre à jour un article
    updateArticle: async (articleData) => {
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
            
            set((state) => ({
                articles: state.articles.map((a) =>
                    a.id === updatedArticle.id ? updatedArticle : a
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
                error: error instanceof Error ? error.message : 'Une erreur est survenue',
                isLoading: false,
            });
            
            toast({
                title: 'Erreur',
                description: error instanceof Error ? error.message : 'Une erreur est survenue',
                variant: 'destructive',
            });
            
            return null;
        }
    },
    
    // Supprimer un article
    deleteArticle: async () => {
        const { selectedArticle } = get();
        if (!selectedArticle) return false; // ❌ Aucun article sélectionné pour suppression
        
        const { deleteImage,defaultImageUrl } = useImageStore.getState();
        const publicId = extractPublicId(selectedArticle.image,defaultImageUrl)

        try {


            const response = await fetch(`/api/article/${selectedArticle.id}`, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: "Erreur",
                    description: data.message || "Une erreur est survenue lors de la suppression",
                    variant: "destructive",
                });
                return false;
            }

            set((state) => ({
                articles: state.articles.filter((a) => a.id !== selectedArticle.id),
                selectedArticle: null,
            }));
            // Supprimer l'image de Cloudinary si elle existe
            if (publicId) {
                await deleteImage(publicId);
            }
            return true;
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression",
                variant: "destructive",
            });
            return false;
        }
    },
}));

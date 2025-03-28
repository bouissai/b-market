import { toast } from "@/hooks/use-toast";
import type { Article } from "@/types/article";
import { create } from "zustand";

type ArticleStore = {
    articles: Article[];
    selectedArticle: Article | null;
    mode: "new" | "edit" | "delete" | null;
    isLoading: boolean;
    error: string | null;
    fetchArticles: () => Promise<void>;
    addArticle: (newArticle: Article) => void;
    updateArticle: (updatedArticle: Article) => void;
    setSelectedArticle: (article: Article | null, mode: null | "edit" | "delete" | "new") => void
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
    addArticle: (newArticle) =>
        set((state) => ({
            articles: [...state.articles, newArticle],
        })),

    // Mettre à jour un article
    updateArticle: (updatedArticle) =>
        set((state) => ({
            articles: state.articles.map((a) =>
                a.id === updatedArticle.id ? updatedArticle : a
            ),
        })),

    // Supprimer un article
    deleteArticle: async () => {
        const { selectedArticle } = get();
        if (!selectedArticle) return false; // ❌ Aucun article sélectionné pour suppression

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

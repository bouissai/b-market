import { toast } from "@/hooks/use-toast";
import type { Category } from "@/types/category";
import { create } from "zustand";

type CategoryStore = {
    categories: Category[];
    selectedCategory: Category | null;
    mode: "edit" | "delete" | "new" | null;
    isFormOpen: boolean;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    setSelectedCategory: (category: Category | null, mode: "edit" | "delete" | "new" | null) => void;
    setIsFormOpen: (isOpen: boolean) => void;
    addCategory: (newCategory: Category) => void;
    updateCategory: (updatedCategory: Category) => void;
    deleteCategory: () => Promise<boolean>;
    saveCategory: (category: Category, method: "POST" | "PUT", url: string) => Promise<Category>;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: [],
    selectedCategory: null,
    mode: null,
    isFormOpen: false,
    isLoading: false,
    isSubmitting: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch("/api/category");
            if (!response.ok) throw new Error("Erreur lors du chargement des catégories");

            const data: Category[] = await response.json();
            set({ categories: data, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Une erreur est survenue",
                isLoading: false,
            });
        }
    },

    setSelectedCategory: (category, mode) => set({ selectedCategory: category, mode }),

    setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),

    addCategory: (newCategory) =>
        set((state) => ({
            categories: [...state.categories, newCategory],
        })),

    updateCategory: (updatedCategory) =>
        set((state) => ({
            categories: state.categories.map((c) =>
                c.id === updatedCategory.id ? updatedCategory : c
            ),
        })),

    deleteCategory: async () => {
        const { selectedCategory } = get();
        if (!selectedCategory) return false;

        try {
            const response = await fetch(`/api/category/${selectedCategory.id}`, { method: "DELETE" });
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
                categories: state.categories.filter((c) => c.id !== selectedCategory.id),
                selectedCategory: null,
                mode: null,
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

    saveCategory: async (category, method, url) => {
        set({ isSubmitting: true });
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(category),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw { status: response.status, message: errorResponse.message || "Erreur inconnue" };
            }

            return await response.json();
        } catch (error) {
            throw error;
        } finally {
            set({ isSubmitting: false });
        }
    },
}));

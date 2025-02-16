import { Category } from "@/types/article";
import { useEffect, useState } from "react";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/category")
            if (!response.ok) throw new Error("Erreur lors du chargement des catégories")
            const data = await response.json()
            setCategories(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    const addCategory = (newCategory: Category) => {
        setCategories([...categories, newCategory])
    }

    const updateCategory = (updatedCategory: Category) => {
        setCategories(categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)))
    }

    const deleteCategory = async (id: string) => {
        const response = await fetch(`/api/category/${id}`, {method: "DELETE"});
        if (!response.ok) {
            const error = await response.json();
            throw {status: response.status, message: error.message};
        }
        setCategories(categories.filter((c) => c.id !== id));
        return response.json();
    }

    const saveCategory = async (category: Category, method: "POST" | "PUT", url: string) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(category),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw {status: response.status, message: errorResponse.message || "Erreur inconnue"};
            }

            return await response.json();
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        categories,
        isLoading,
        error,
        addCategory,
        updateCategory,
        isSubmitting,
        saveCategory,
        deleteCategory,
        fetchCategories
    }
}


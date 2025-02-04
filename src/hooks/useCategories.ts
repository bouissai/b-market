import {useEffect, useState} from "react"
import {Category} from "@/types/article";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
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
        try {
            const response = await fetch(`/api/category/${id}`, {method: "DELETE"})
            if (!response.ok) throw new Error("Erreur lors de la suppression de la catégorie")
            setCategories(categories.filter((c) => c.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la suppression")
        }
    }

    return {categories, isLoading, error, addCategory, updateCategory, deleteCategory, fetchCategories}
}


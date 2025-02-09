import {useEffect, useState} from "react"
import type {Article} from "@/types/article"
import {useToast} from "@/hooks/use-toast";

export function useArticles() {
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const {toast} = useToast()


    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/article")
            if (!response.ok) throw new Error("Erreur lors du chargement des articles")
            const data = await response.json()
            setArticles(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    const addArticle = (newArticle: Article) => {
        setArticles([...articles, newArticle])
    }

    const updateArticle = (updatedArticle: Article) => {
        setArticles(articles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a)))
    }

    const deleteArticle = async (id: string) => {
        try {
            const response = await fetch(`/api/article/${id}`, {method: "DELETE"})
            if (!response.ok) throw {message: response.json(), status: response.status};
            setArticles(articles.filter((a) => a.id !== id))
        } catch (error) {
            toast({
                title: "Aïe caramba ! 🤠",
                description: error?.message || "Erreur inconnue",
                variant: "destructive",
            });
        }
    }

    return {articles, isLoading, error, addArticle, updateArticle, deleteArticle, fetchArticles}
}


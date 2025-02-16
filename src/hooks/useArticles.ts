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
            const data = await response.json()
            
            if (!response.ok) {
                toast({
                    title: "Erreur",
                    description: data.message || "Une erreur est survenue lors de la suppression",
                    variant: "destructive",
                });
                return false;
            }
            
            setArticles(articles.filter((a) => a.id !== id))
            return true;
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression",
                variant: "destructive",
            });
            return false;
        }
    }

    return {articles, isLoading, error, addArticle, updateArticle, deleteArticle, fetchArticles}
}


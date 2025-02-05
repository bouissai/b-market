"use client"

import {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import type {Article} from "@/types/article"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    price: z.number().min(0, "Le prix doit être positif"),
    categoryName: z.string().min(1, "La catégorie est requise"),
    unit: z.string().min(1, "L'unité est requise"),
})

interface ArticleFormProps {
    article?: Article | null
    onClose: () => void
    onSave: (data: Article) => void
}

export function ArticleForm({article, onClose, onSave}: ArticleFormProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: article || {name: "", price: 0, categoryName: "", unit: ""},
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            const method = article ? "PUT" : "POST"
            const url = article ? `/api/article/${article.id}` : "/api/article"
            const response = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(values),
            })
            if (!response.ok) throw new Error("Erreur lors de la sauvegarde")
            const data = await response.json()
            onSave(data)
            toast({
                title: "Succès",
                description: article ? "Article modifié avec succès" : "Article ajouté avec succès",
            })
            onClose()
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la sauvegarde",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{article ? "Modifier l'article" : "Ajouter un article"}</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nom de l'article" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Prix</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Prix"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Catégorie</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Catégorie" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Unité</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Unité" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : article ? "Modifier" : "Ajouter"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


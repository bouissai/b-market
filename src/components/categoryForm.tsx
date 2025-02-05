"use client"

import {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {useToast} from "@/hooks/use-toast"
import {Category} from "@/types/article";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
})

interface CategoryFormProps {
    category?: Category | null
    onCloseAction: () => void
    onSaveAction: (data: Category) => void
}

export function CategoryForm({category, onCloseAction, onSaveAction}: CategoryFormProps) {
    const {toast} = useToast()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: category || {name: ""},
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            const method = category ? "PUT" : "POST"
            const url = category ? `/api/category/${category.id}` : "/api/category"
            const response = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(values),
            })
            if (!response.ok) throw new Error("Erreur lors de la sauvegarde")
            const data = await response.json()
            onSaveAction(data)
            toast({
                title: "Succès",
                description: category ? "Catégorie modifiée avec succès" : "Catégorie ajoutée avec succès",
            })
            onCloseAction()
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur: " + error,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open onOpenChange={onCloseAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
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
                                        <Input placeholder="Nom de la catégorie" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : category ? "Modifier" : "Ajouter"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


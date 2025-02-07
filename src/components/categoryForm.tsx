"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Category } from "@/types/article"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
        const method = category ? "PUT" : "POST"
        const url = category ? `/api/category/${category.id}` : "/api/category"
        fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values),
        })
        .then(response => {
            if (!response.ok) throw {status: response.status, message: response.json()}
            return response.json()
        })
        .then(data => {
            onSaveAction(data)
            toast({
            title: "Succès",
            description: category ? "Catégorie modifiée avec succès" : "Catégorie ajoutée avec succès",
            })
            onCloseAction()
        })
        .catch(error => {
            let descriptionError = "Une erreur est survenue lors de l'enregistrement."
            switch (error.status) {
                case 409:
                    descriptionError = "Cette catégorie existe déjà."
                    break
            }
            toast({
            title: "Erreur",
            description: descriptionError,
            variant: "destructive",
            })
        })
        .finally(() => {
            setIsSubmitting(false)
        })
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


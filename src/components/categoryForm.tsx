"use client"

import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Category} from "@/types/article"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {useCategories} from "@/hooks/useCategories";
import {useToast} from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
})

interface CategoryFormProps {
    category?: Category | null
    onCloseAction: () => void
    onSaveAction: (data: Category) => void
}

export function CategoryForm({category, onCloseAction, onSaveAction}: CategoryFormProps) {
    const {saveCategory, isSubmitting} = useCategories();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: category || {name: ""},
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const method = category ? "PUT" : "POST";
        const url = category ? `/api/category/${category.id}` : "/api/category";

        // Construire un objet Category valide
        const categoryData: Partial<Category> = category
            ? { ...category, name: values.name } // Modifier une catégorie existante
            : { name: values.name }; // Ajouter une nouvelle catégorie

        await saveCategory(categoryData as Category, method, url)
            .then((data) => {
                onSaveAction(data);
                toast({
                    title: "Succès",
                    description: method === "PUT" ? "Catégorie modifiée avec succès" : "Catégorie ajoutée avec succès",
                });
                onCloseAction();
            })
            .catch(error => {
                let descriptionError = "Une erreur est survenue lors de l'enregistrement.";

                if (error.status === 409) {
                    descriptionError = error.message || "Cette catégorie existe déjà.";
                }

                toast({
                    title: "Erreur",
                    description: descriptionError,
                    variant: "destructive",
                });
            });
    };

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


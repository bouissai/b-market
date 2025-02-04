import {NextRequest, NextResponse} from "next/server";
import {db} from "@/app/lib/db";

// 1. Récupérer tous les categories
export async function GET() {
    try {
        const categories = await db.category.findMany();
        return NextResponse.json(categories, {status: 200});
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            {error: "Failed to fetch categories"},
            {status: 500},
        );
    }
}

// 2. Ajouter une categorie
export async function POST(req: NextRequest) {
    try {
        const {name} = await req.json();

        // Validation champs obilgatoires
        if (!name) {
            return NextResponse.json(
                {error: "Name are required"},
                {status: 400},
            );
        }

        const newCategory = await db.category.create({
            data: {
                name
            },
        });

        return NextResponse.json(newCategory, {status: 201});
    } catch (error) {
        console.error("Failed to create category", error);
        return NextResponse.json(
            {error: "Failed to create category"},
            {status: 500},
        );
    }
}

// 3. Récupérer une catégorie par ID
export async function GET_CATEGORY_BY_ID(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const {id} = params;

        const category = await db.category.findUnique({
            where: {id},
        });

        if (!category) {
            return NextResponse.json(
                {error: "Category not found"},
                {status: 404}
            );
        }

        return NextResponse.json(category, {status: 200});
    } catch (error) {
        console.error("Failed to fetch category", error);
        return NextResponse.json(
            {error: "Failed to fetch category"},
            {status: 500}
        );
    }
}

// 4. Mettre à jour une catégorie par ID
export async function PUT(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const {id} = params;
        const {name} = await req.json();

        // Validation : vérifier si le champ "name" est fourni
        if (!name) {
            return NextResponse.json(
                {error: "Name is required"},
                {status: 400}
            );
        }

        // Vérifier si la catégorie existe
        const existingCategory = await db.category.findUnique({
            where: {id},
        });

        if (!existingCategory) {
            return NextResponse.json(
                {error: "Category not found"},
                {status: 404}
            );
        }

        // Mise à jour de la catégorie
        const updatedCategory = await db.category.update({
            where: {id},
            data: {name},
        });

        return NextResponse.json(updatedCategory, {status: 200});
    } catch (error) {
        console.error("Failed to update category", error);
        return NextResponse.json(
            {error: "Failed to update category"},
            {status: 500}
        );
    }
}

// 5. Supprimer une catégorie par ID
export async function DELETE(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const {id} = params;

        // Vérifier si la catégorie existe
        const existingCategory = await db.category.findUnique({
            where: {id},
        });

        if (!existingCategory) {
            return NextResponse.json(
                {error: "Category not found"},
                {status: 404}
            );
        }

        // Supprimer la catégorie
        await db.category.delete({
            where: {id},
        });

        return NextResponse.json(
            {message: "Category deleted successfully"},
            {status: 200}
        );
    } catch (error) {
        console.error("Failed to delete category", error);
        return NextResponse.json(
            {error: "Failed to delete category"},
            {status: 500}
        );
    }
}
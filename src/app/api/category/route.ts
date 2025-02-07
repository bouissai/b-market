import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

        // Vérifier si la catégorie existe
        const existingCategory = await db.category.findUnique({
            where: {name},
        });

        if (existingCategory !== undefined) {
            console.error("❌ La catégorie existe déjà en base !");
            return NextResponse.json({message: "Catégorie existe déjà "}, {status: 409});
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
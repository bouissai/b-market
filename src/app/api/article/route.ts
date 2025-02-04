import {NextRequest, NextResponse} from "next/server";
import {db} from "@/app/lib/db";

// 1. Récupérer tous les articles
export async function GET() {
    try {
        const articles = await db.article.findMany();
        return NextResponse.json(articles, {status: 200});
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json(
            {error: "Failed to fetch articles"},
            {status: 500},
        );
    }
}

// 2. Ajouter un article
export async function POST(req: NextRequest) {
    try {
        // Récupération du JSON
        const body = await req.json();
        const {name, image, description, price, unit, categoryName} = body;

        // Vérification si le corps de la requête est vide
        if (!req.body) {
            return NextResponse.json(
                {error: "Request body is empty or null"},
                {status: 400}
            );
        }

        // Validation des champs obligatoires
        if (!name || !price || !categoryName || !unit) {
            return NextResponse.json(
                {error: "Name, price, unit, and categoryName are required"},
                {status: 400}
            );
        }

        // Vérifier que le champ "price" est du type attendu (nombre)
        if (typeof price !== "number" || price <= 0) {
            return NextResponse.json(
                {error: "Price must be a positive number"},
                {status: 400}
            );
        }

        // Vérifier si un article avec le même nom existe déjà
        const existingArticle = await db.article.findFirst({
            where: {name},
        });

        if (existingArticle) {
            return NextResponse.json(
                {error: `Article with name '${name}' already exists`},
                {status: 409} // 409 Conflict
            );
        }

        // Vérifier si la catégorie existe
        const category = await db.category.findUnique({
            where: {name: categoryName},
        });

        if (!category) {
            return NextResponse.json(
                {error: `Category '${categoryName}' does not exist`},
                {status: 400}
            );
        }

        // Création de l'article
        const newArticle = await db.article.create({
            data: {
                name: name,
                image: image || "", // Fournir une valeur par défaut pour éviter l'erreur
                price: price,
                unit: unit,
                description: description || "", // Fournir une valeur par défaut
                category: {
                    connect: {name: categoryName}, // Associer à une catégorie existante
                },
            },
        });
        return NextResponse.json(newArticle, {status: 201});
    } catch (error) {
        console.error("Failed to create article", error);

        // Vérification de l'erreur pour un diagnostic plus précis
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {error: "Invalid JSON format"},
                {status: 400}
            );
        }

        return NextResponse.json(
            {error: "Failed to create article"},
            {status: 500}
        );
    }
}
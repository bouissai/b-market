import {NextRequest, NextResponse} from "next/server";
import {db} from "@/app/lib/db";
import {Prisma} from "@prisma/client";

interface ArticleUpdateProps {
    params: { id: string }
}

// Récupérer un article par ID
export async function GET(_req: NextRequest, {params}: ArticleUpdateProps) {
    try {
        const {id} = params;

        // Vérification si l'ID est valide
        if (!id) {
            return NextResponse.json({error: "L'ID de l'article est requis"}, {status: 400});
        }

        // Recherche de l'article
        const article = await db.article.findUnique({
            where: {id},
        });

        if (!article) {
            return NextResponse.json({error: "Article not found"}, {status: 404});
        }

        return NextResponse.json(article, {status: 200});
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return NextResponse.json({error: "Failed to fetch article"}, {status: 500});
    }
}

// 2. Mettre à jour un article par ID
// 2. Mettre à jour un article par ID
export async function PATCH(req: NextRequest, {params}: ArticleUpdateProps) {
    try {
        const {id} = params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({error: "L'ID de l'article est requis"}, {status: 400});
        }

        // Vérifier si l'article existe
        const existingArticle = await db.article.findUnique({
            where: {id},
        });

        if (!existingArticle) {
            return NextResponse.json({error: "Article not found"}, {status: 404});
        }

        // Validation des champs autorisés
        const {name, image, description, price, unit, categoryName} = body;

        if (price !== undefined && (typeof price !== "number" || price <= 0)) {
            return NextResponse.json({error: "Le prix doit être un nombre positif"}, {status: 400});
        }

        // Vérifier si une catégorie valide est fournie
        let category;
        if (categoryName) {
            category = await db.category.findUnique({
                where: {name: categoryName},
            });

            if (!category) {
                return NextResponse.json({error: `La catégorie '${categoryName}' n'existe pas`}, {status: 400});
            }
        }

        // Vérifier si un autre article avec le même nom existe déjà
        if (name && name !== existingArticle.name) {
            const articleWithSameName = await db.article.findFirst({
                where: {
                    name,
                    id: {not: id}, // Vérifie que l'article trouvé n'est pas celui qu'on met à jour
                },
            });

            if (articleWithSameName) {
                return NextResponse.json(
                    {error: `Le nom '${name}' existe déjà sur un autre article`},
                    {status: 409} // 409 Conflict
                );
            }
        }

        // Mettre à jour l'article
        const updatedArticle = await db.article.update({
            where: {id},
            data: {
                name: name ?? existingArticle.name,
                image: image ?? existingArticle.image,
                description: description ?? existingArticle.description,
                price: price ?? existingArticle.price,
                unit: unit ?? existingArticle.unit,
                category: category ? {connect: {name: categoryName}} : undefined,
            },
        });

        return NextResponse.json(updatedArticle, {status: 200});
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'article:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({error: "Database error"}, {status: 500});
        }

        return NextResponse.json({error: "Erreur serveur lors de la mise à jour."}, {status: 500});
    }
}
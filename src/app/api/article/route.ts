import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Récupérer tous les articles
export async function GET(req : Request) {
  try {
    // Récupération des paramètres de requête
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // vérifier si la catégorie en paramètre existe
    let whereClause: Record<string, unknown> = {};
    if(category) {
      const categoryExists = await prisma.category.findFirst({
        where: { name: { equals: category, 
          mode : "insensitive" } }, // Comparaison insensible à la casse
      });

      if (!categoryExists) {
        return NextResponse.json(
          { message: `La catégorie '${category}' n'existe pas` },
          { status: 400 },
        );
      }

      whereClause = { categoryName: categoryExists.name }; 
    }
    
    // Récupération des articles
    const articles = await prisma.article.findMany({
      where: whereClause, 
      skip,
      take: limit,});
    const total = await prisma.article.count({ where: whereClause });

    return NextResponse.json({articles, total}, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
    return NextResponse.json(
      { message: 'Échec de la récupération des articles' },
      { status: 500 },
    );
  }
}

// 2. Ajouter un article
export async function POST(req: NextRequest) {
  try {
    // Récupération du JSON
    const body = await req.json();
    const { name, image, description, price, unit, categoryName } = body;

    // Vérification si le corps de la requête est vide
    if (!body) {
      return NextResponse.json(
        { message: 'Le corps de la requête est vide ou invalide' },
        { status: 400 },
      );
    }

    // Validation des champs obligatoires
    if (!name || !price || !categoryName || !unit) {
      console.error(!name, !price, !categoryName, !unit);
      return NextResponse.json(
        { message: "Le nom, le prix, l'unité et la catégorie sont requis" },
        { status: 400 },
      );
    }

    // Vérifier que le champ "price" est du type attendu (nombre)
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { message: 'Le prix doit être un nombre positif' },
        { status: 400 },
      );
    }

    // Vérifier si un article avec le même nom existe déjà
    const existingArticle = await prisma.article.findFirst({
      where: { name },
    });

    if (existingArticle) {
      return NextResponse.json(
        { message: `Un article portant le nom '${name}' existe déjà` },
        { status: 409 }, // 409 Conflict
      );
    }

    // Vérifier si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      return NextResponse.json(
        { message: `La catégorie '${categoryName}' n'existe pas` },
        { status: 400 },
      );
    }

    // Création de l'article
    const newArticle = await prisma.article.create({
      data: {
        name: name,
        image: image || '', // Fournir une valeur par défaut pour éviter l'erreur
        price: price,
        unit: unit,
        description: description || '', // Fournir une valeur par défaut
        category: {
          connect: { name: categoryName }, // Associer à une catégorie existante
        },
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Échec de la création de l'article :", error);

    // Vérification de l'erreur pour un diagnostic plus précis
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Format JSON invalide' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Échec de la création de l'article" },
      { status: 500 },
    );
  }
}

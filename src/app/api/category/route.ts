import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 1. Récupérer tous les categories
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyFeatured = searchParams.get('featured') === 'true';
    const categories = await prisma.category.findMany({
      where: onlyFeatured ? { featured: true } : undefined,
      orderBy: { name: 'asc' }, // Optionnel : trier par nom
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}

// 2. Ajouter une categorie
export async function POST(req: NextRequest) {
  try {
    const { name, description, image, featured } = await req.json();

    // Validation des champs obligatoires
    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
    }

    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      console.error('❌ La catégorie existe déjà en base !');
      return NextResponse.json(
        { message: 'Catégorie existe déjà' },
        { status: 409 },
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        description: description || '',
        image: image || '',
        featured: featured || false,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('❌ Failed to create category', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 },
    );
  }
}

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    // 1️⃣ Vérification de l'ID
    if (!id) {
      console.error('❌ ID manquant !');
      return NextResponse.json(
        { message: "L'ID de la categorie est requis" },
        { status: 400 },
      );
    }

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: { articles: true },
    });

    if (existingCategory == undefined) {
      return NextResponse.json(
        { message: 'Catégorie non trouvée' },
        { status: 404 },
      );
    }

    // Vérifier si des articles sont liés
    if (existingCategory.articles.length > 0) {
      return NextResponse.json(
        {
          message:
            'Impossible de supprimer cette catégorie : des articles y sont encore liés.',
        },
        { status: 409 }, // Conflit
      );
    }

    // Supprimer la catégorie
    await prisma.category.delete({ where: { id } });
    return NextResponse.json(
      { message: 'Catégorie supprimée avec succès' },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Erreur Prisma lors de la suppression :', error);
    return NextResponse.json(
      { message: 'Erreur interne lors de la suppression' },
      { status: 500 },
    );
  }
}

// 4. Mettre à jour une catégorie par ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const { name, image, featured, description } = body;
    // Validation : vérifier si le champ "name" est fourni
    if (!name && !image && !description && typeof featured !== 'boolean') {
      return NextResponse.json(
        { message: 'Aucune donnée fournie pour la mise à jour.' },
        { status: 400 },
      );
    }

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Catégorie introuvable.' },
        { status: 404 },
      );
    }

    // Vérifier les doublons uniquement si le nom est modifié
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: { name, NOT: { id } },
      });

      if (duplicateCategory) {
        return NextResponse.json(
          { message: 'Une catégorie avec ce nom existe déjà.' },
          { status: 409 },
        );
      }
    }

    // Mise à jour de la catégorie
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(image !== undefined && { image }),
        ...(description !== undefined && { description }),
        ...(typeof featured === 'boolean' && { featured }),
      },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie', error);
    return NextResponse.json(
      { message: 'Erreur serveur lors de la mise à jour.' },
      { status: 500 },
    );
  }
}

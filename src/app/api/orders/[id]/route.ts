import { prisma } from '@/lib/prisma';
import { getOrderById } from '@/services/orderService'; // Assurez-vous d'importer correctement votre service
import { NextRequest, NextResponse } from 'next/server';

// 🔴 DELETE → Supprimer une commande avec ses `OrderItems`
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: "L'ID de la commande est invalide" },
        { status: 400 },
      );
    }

    const OrderItemsDeleted = prisma.orderItem.deleteMany({
      where: {
        orderId: numericId, // Utilisation du nombre
      },
    });

    const orderDeleted = prisma.order.delete({
      where: { id: numericId }, // Utilisation du nombre
    });

    await prisma.$transaction([OrderItemsDeleted, orderDeleted]);

    return NextResponse.json(
      { message: 'Commande supprimée avec succès' },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      '❌ [DELETE] Erreur lors de la suppression de la commande :',
      error,
    );
    return NextResponse.json(
      { message: 'Erreur serveur lors de la suppression' },
      { status: 500 },
    );
  }
}

// 🔵 GET → Récupérer une commande avec ses `OrderItems`
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: "L'ID de la commande est invalide" },
        { status: 400 },
      );
    }

    const order = await getOrderById(numericId);
    if (!order) {
      return NextResponse.json(
        { message: 'Commande introuvable' },
        { status: 404 },
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(
      '❌ [GET] Erreur lors de la récupération de la commande :',
      error,
    );
    return NextResponse.json(
      { message: 'Erreur serveur lors de la récupération' },
      { status: 500 },
    );
  }
}

import { db } from "@/app/lib/db";
import { getOrderById } from "@/services/orderService";
import { NextRequest, NextResponse } from "next/server";


// 🔴 DELETE → Supprimer une commande avec ses `OrderItems`
// TODO : utiliser le service
export async function DELETE(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const {id} = await params;

        if (!id) {
            return NextResponse.json({message: "L'ID de la commande est requis"}, {status: 400});
        }

        const OrderItemsDeleted =  db.orderItem.deleteMany({
            where: {
                orderId: id,
            },
        });

        // Suppression de la commande (cascade supprime aussi les OrderItems)
        const orderDeleted = db.order.delete({
            where: {id : id},
        });

        const transaction = await db.$transaction([OrderItemsDeleted, orderDeleted]);


        return NextResponse.json({message: "Commande supprimée avec succès"}, {status: 200});
    } catch (error) {
        console.error("Erreur lors de la suppression de la commande :", error);
        return NextResponse.json({message: "Erreur serveur lors de la suppression"}, {status: 500});
    }
}

// 🔵 GET → Récupérer une commande avec ses `OrderItems`
export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const {id} = await params;

        if (!id) {
            return NextResponse.json({message: "L'ID de la commande est requis"}, {status: 400});
        }

        // Récupérer la commande avec ses OrderItems
        const order = await getOrderById(id);
        if (!order) {
            return NextResponse.json({message: "Commande introuvable"}, {status: 404});
        }

        return NextResponse.json(order, {status: 200});
    } catch (error) {
        console.error("Erreur lors de la récupération de la commande :", error);
        return NextResponse.json({message: "Erreur serveur lors de la récupération"}, {status: 500});
    }
}

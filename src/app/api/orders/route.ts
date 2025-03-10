import { createOrder, getAllOrders } from "@/services/orderService";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const orders = await getAllOrders();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, status, note, orderItems } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "L'ID utilisateur est requis" }, { status: 400 });
        }

        if (!status) {
            return NextResponse.json({ message: "Le statut de la commande est requis" }, { status: 400 });
        }        
        
        if (note === undefined) {
            return NextResponse.json({ message: "La note de la commande est requise" }, { status: 400 });
        }
        
        if (!Array.isArray(orderItems)) {
            return NextResponse.json({ message: "Les éléments de la commande doivent être un tableau" }, { status: 400 });
        }

        if (orderItems.length === 0) {
            return NextResponse.json({ message: "La commande doit contenir au moins un élément" }, { status: 400 });
        }

        // ✅ Création de la commande avec les `orderItems`
        const newOrder = await createOrder(userId, status, note, orderItems);

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error: any) {
        console.error("❌ [POST] Erreur lors de la création de la commande :", error.message || error);
        return NextResponse.json({ message: "Erreur serveur", error: error.message || error }, { status: 500 });
    }
}
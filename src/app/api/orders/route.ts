import {
	createOrder,
	getAllOrders,
	getOrdersByUserId,
} from '@/services/orderService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');

		if (userId) {
			const orders = await getOrdersByUserId(userId);
			return NextResponse.json(orders, { status: 200 });
		} else {
			const orders = await getAllOrders();
			return NextResponse.json(orders, { status: 200 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to fetch orders' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const {
			userId,
			status,
			note,
			orderItems,
			firstname, // Notez le changement de casse
			lastname, // Notez le changement de casse
			phone,
			email,
		} = await request.json();

		if (!userId) {
			return NextResponse.json(
				{ message: "L'ID utilisateur est requis" },
				{ status: 400 },
			);
		}

		// // Validation des champs obligatoires
		// if (!firstname || !lastname || !email || !phone) {
		// 	return NextResponse.json(
		// 		{ message: 'Les informations de contact sont requises' },
		// 		{ status: 400 },
		// 	);
		// }

		// ✅ Création de la commande avec les bons noms de champs
		const newOrder = await createOrder(
			userId,
			status,
			note,
			orderItems,
			firstname,
			lastname,
			email,
			phone,
		);

		return NextResponse.json(newOrder, { status: 201 });
	} catch (error: any) {
		console.error(
			'❌ [POST] Erreur lors de la création de la commande :',
			error.message || error,
		);
		return NextResponse.json(
			{ message: 'Erreur serveur', error: error.message || error },
			{ status: 500 },
		);
	}
}

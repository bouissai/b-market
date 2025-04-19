import { NextResponse } from 'next/server';
import { updateCart } from '@/services/cartService';

export async function POST(nextRequest: Request) {
	try {
		const { userId, articleId, quantity } = await nextRequest.json();
		if (!userId || !articleId || quantity <= 0) {
			return NextResponse.json(
				{ message: 'Input invalides' },
				{ status: 400 },
			);
		}
		const response = await updateCart(userId, articleId, quantity);
		if (!response) {
			return NextResponse.json(
				{ message: "Erreur lors de la modification d'un panier" },
				{ status: 500 },
			);
		}

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la modification d'un panier", error);
		return NextResponse.json(
			{ error: "Erreur lors de la modification d'un panier" },
			{ status: 500 },
		);
	}
}

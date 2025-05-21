import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { replaceCartByUserId } from '@/services/cartService';

export async function PATCH(request: Request) {
	try {
		const { userId, cartItems } = await request.json();
		const session = await auth();

		if (!session || session.user.id !== userId) {
			return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
		}

		if (!userId || userId.trim() === '' || !Array.isArray(cartItems)) {
			return NextResponse.json(
				{
					error: 'Identifiant utilisateur ou articles du panier manquants',
				},
				{ status: 400 },
			);
		}

		const updatedCart = await replaceCartByUserId(userId, cartItems);

		if (!updatedCart) {
			return NextResponse.json(
				{ error: 'Panier introuvable' },
				{ status: 404 },
			);
		}

		return NextResponse.json(updatedCart, { status: 200 });
	} catch (error) {
		console.error('[PATCH /api/carts/replace] Error:', error);
		return NextResponse.json(
			{ error: 'Erreur interne du serveur' },
			{ status: 500 },
		);
	}
}

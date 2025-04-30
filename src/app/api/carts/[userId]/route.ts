import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCartByUserId } from '@/services/cartService';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const session = await auth();
		const userId = (await params).userId;

		if (!session || session.user.id !== userId) {
			return NextResponse.json(
				{ error: 'Accès non autorisé' },
				{ status: 401 },
			);
		}

		const cart = await getCartByUserId(userId);

		if (!cart) {
			return NextResponse.json(
				{ message: 'Aucun panier trouvé pour cet utilisateur' },
				{ status: 404 },
			);
		}
		return NextResponse.json(cart, { status: 200 });
	} catch (error) {
		console.error(
			'❌ [GET] Erreur lors de la récupération du panier :',
			error,
		);
		return NextResponse.json(
			{
				message: 'Erreur serveur lors de la récupération du panier',
			},
			{ status: 500 },
		);
	}
}

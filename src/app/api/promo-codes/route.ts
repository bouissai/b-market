import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { PromoCodeGetDTO } from '@/types/promo-code';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const session = await auth();

		if (!session || !session.user.isAdmin) {
			return NextResponse.json(
				{ message: 'Accès non autorisé' },
				{ status: 403 },
			);
		}

		const promoCodes = await prisma.promoCode.findMany({
			select: {
				id: true,
				code: true,
				discount: true,
			},
		});

		const data: PromoCodeGetDTO[] = promoCodes.map(promo => ({
			id: promo.id,
			code: promo.code,
			discount: promo.discount,
		}));

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('[GET_PROMO_CODES_ERROR]', error);
		return NextResponse.json(
			{ message: 'Erreur lors de la récupération des codes promos' },
			{ status: 500 },
		);
	}
}

// app/api/promo-codes/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PromoCodeError, validatePromoCode } from '@/services/promoCodeService';

export async function POST(request: NextRequest) {
	try {
		const { code } = await request.json();

		if (!code) {
			return NextResponse.json(
				{ message: 'Code promo requis' },
				{ status: 400 },
			);
		}

		const promoCode = await validatePromoCode(code);

		return NextResponse.json(promoCode, { status: 200 });
	} catch (error) {
		if (error instanceof PromoCodeError) {
			return NextResponse.json({ message: error.message }, { status: 400 });
		}

		console.error('Erreur de validation du code promo:', error);
		return NextResponse.json(
			{ message: 'Erreur serveur lors de la validation du code' },
			{ status: 500 },
		);
	}
}

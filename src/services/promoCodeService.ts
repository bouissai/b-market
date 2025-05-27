import { prisma } from '@/lib/prisma';
import { PromoCodeGetDTO } from '@/types/promo-code';

export class PromoCodeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PromoCodeError';
	}
}

export async function validatePromoCode(
	code: string,
): Promise<PromoCodeGetDTO> {
	try {
		const promoCode = await prisma.promoCode.findUnique({
			where: { code },
		});

		if (!promoCode) {
			throw new PromoCodeError('Code promo invalide');
		}

		if (!promoCode.active) {
			throw new PromoCodeError("Ce code promo n'est plus actif");
		}

		if (promoCode.endDate && promoCode.endDate < new Date()) {
			throw new PromoCodeError('Ce code promo a expiré');
		}

		// if (promoCode.maxUses && promoCode.useCount >= promoCode.maxUses) {
		// 	throw new PromoCodeError(
		// 		"Ce code promo a atteint son nombre maximum d'utilisations",
		// 	);
		// }

		return {
			id: promoCode.id,
			code: promoCode.code,
			discount: promoCode.discount,
		};
	} catch (error) {
		if (error instanceof PromoCodeError) {
			throw error;
		}
		throw new Error('Erreur lors de la validation du code promo');
	}
}

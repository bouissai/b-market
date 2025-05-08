import { create } from 'zustand';

type CheckoutStep = 'cart' | 'information' | 'payment' | 'confirmation';

enum PromoCode {
	'PROMO10' = 10,
	'PROMO20' = 20,
	'PROMO30' = 30,
}

interface CheckoutStore {
	currentStep: CheckoutStep;
	deliveryMethod: string;
	deliveryFee: number;
	promoCode: string | null;
	promoDiscount: number;
	total: number;
	setCurrentStep: (step: CheckoutStep) => void;
	setDeliveryMethod: (method: string) => void;
	setPromoCode: (code: string | null) => void;
	promoApplied: boolean | null;
}

export const useCheckoutStore = create<CheckoutStore>()(set => ({
	currentStep: 'cart',
	deliveryMethod: 'standard',
	deliveryFee: 4.9,
	promoCode: null,
	promoDiscount: 0,
	total: 0,
	promoApplied: null,

	setCurrentStep: (step: CheckoutStep) => set({ currentStep: step }),
	setDeliveryMethod: method => {
		set({
			deliveryMethod: method,
			deliveryFee:
				method === 'express' ? 9.9 : method === 'standard' ? 4.9 : 0,
		});
	},
	setPromoCode: (code: string | null) => {
		if (PromoCode[code as keyof typeof PromoCode]) {
			set({
				promoDiscount: PromoCode[code as keyof typeof PromoCode],
				promoCode: code,
				promoApplied: true,
			});
		} else {
			set({ promoDiscount: 0, promoCode: code, promoApplied: false });
		}
	},
}));

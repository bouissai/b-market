import { create } from 'zustand';

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

enum PromoCode {
	'PROMO10' = 10,
	'PROMO20' = 20,
	'PROMO30' = 30,
}

interface CheckoutStore {
	currentStep: CheckoutStep;
	steps: CheckoutStep[];
	deliveryMethod: string;
	deliveryFee: number;
	promoCode: string | null;
	promoDiscount: number;
	isStepValid: boolean;
	total: number;
	setCurrentStep: (step: CheckoutStep) => void;
	setDeliveryMethod: (method: string) => void;
	setIsStepValid: (isValid: boolean) => void;
	nextStep: () => void;
	previousStep: () => void;
	setPromoCode: (code: string | null) => void;
	promoApplied: boolean | null;
}

export const useCheckoutStore = create<CheckoutStore>()(set => ({
	currentStep: 'cart',
	steps: ['cart', 'delivery', 'payment', 'confirmation'],
	deliveryMethod: 'standard',
	deliveryFee: 4.9,
	promoCode: null,
	promoDiscount: 0,
	isStepValid: false,
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
	setIsStepValid: (isValid: boolean) => set({ isStepValid: isValid }),
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

	nextStep: () =>
		set(state => {
			const currentIndex = state.steps.indexOf(state.currentStep);
			if (currentIndex < state.steps.length - 1) {
				return { currentStep: state.steps[currentIndex + 1] };
			}
			return state;
		}),
	previousStep: () =>
		set(state => {
			const currentIndex = state.steps.indexOf(state.currentStep);
			if (currentIndex > 0) {
				return { currentStep: state.steps[currentIndex - 1] };
			}
			return state;
		}),
}));

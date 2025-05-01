import { create } from 'zustand';

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

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

	setCurrentStep: (step: CheckoutStep) => set({ currentStep: step }),
	setDeliveryMethod: method => {
		set({
			deliveryMethod: method,
			deliveryFee:
				method === 'express' ? 9.9 : method === 'standard' ? 4.9 : 0,
		});
	},
	setIsStepValid: (isValid: boolean) => set({ isStepValid: isValid }),

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

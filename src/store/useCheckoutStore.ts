import { create } from 'zustand';
import { useCartStore } from '@/store/useCartStore';
import { usePromoCodeStore } from '@/store/usePromoCodeStore';

interface CheckoutStore {
	currentStep: string;
	lastOrderId: number | null;
	total: number;

	setLastOrderId: (id: number | null) => void;
	setCurrentStep: (step: string) => void;
	resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>(set => ({
	currentStep: 'cart',
	lastOrderId: null,
	total: 0,

	setLastOrderId: id => set({ lastOrderId: id }),
	setCurrentStep: step => set({ currentStep: step }),
	resetCheckout: () =>
		set({
			currentStep: 'cart',
			lastOrderId: null,
			total: 0,
		}),
}));

// Hook personnalisé pour le calcul total du panier
export const useCheckoutTotal = () => {
	const cartTotal = useCartStore(state => state.totalPrice);
	const promoDiscount = usePromoCodeStore(state => state.discount);

	return promoDiscount < 1 && promoDiscount > 0
		? cartTotal * promoDiscount
		: cartTotal - promoDiscount;
};

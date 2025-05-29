import { create } from 'zustand';
import { useCartStore } from '@/store/useCartStore';
import { usePromoCodeStore } from '@/store/usePromoCodeStore';

interface CheckoutStore {
	currentStep: string;
	lastOrderId: number | null;

	setLastOrderId: (id: number | null) => void;
	setCurrentStep: (step: string) => void;
	resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>(set => ({
	currentStep: 'cart',
	lastOrderId: null,

	setLastOrderId: id => set({ lastOrderId: id }),
	setCurrentStep: step => set({ currentStep: step }),
	resetCheckout: () =>
		set({
			currentStep: 'cart',
			lastOrderId: null,
		}),
}));

// store/useCheckoutStore.ts
export const useCheckoutTotal = () => {
	const cartStore = useCartStore();
	const promoStore = usePromoCodeStore();

	const cartTotal = cartStore.totalPrice;
	const discountAmount = promoStore.calculateDiscount(cartTotal);

	console.log('final total :', cartTotal - discountAmount);

	return cartTotal - discountAmount;
};

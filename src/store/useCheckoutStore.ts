import { create } from 'zustand';

enum PromoCode {
    'PROMO10' = 10,
    'PROMO20' = 20,
    'PROMO30' = 30,
}

interface CheckoutStore {
    currentStep: string;

    promoCode: string | null;
    promoDiscount: number;
    total: number;
    savedOrder: any | null;

    setSavedOrder: (order: any) => void;
    setCurrentStep: (step: string) => void;

    setPromoCode: (code: string | null) => void;
    promoApplied: boolean | null;
}

export const useCheckoutStore = create<CheckoutStore>()(set => ({
    currentStep: 'cart',

    promoCode: null,
    promoDiscount: 0,
    total: 0,
    promoApplied: null,
    savedOrder: null,

    setSavedOrder: (order: any) => set({ savedOrder: order }),
    setCurrentStep: (step: string) => set({ currentStep: step }),

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
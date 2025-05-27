// store/usePromoCodeStore.ts
import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';

interface PromoCodeState {
	currentCode: string | null;
	currentCodeId: string | null;
	discount: number;
	isValid: boolean | null;
	isLoading: boolean;
	error: string | null;

	validateCode: (code: string) => Promise<void>;
	clearPromoCode: () => void;
}

export const usePromoCodeStore = create<PromoCodeState>(set => ({
	currentCode: null,
	currentCodeId: null,
	discount: 0,
	isValid: null,
	isLoading: false,
	error: null,

	validateCode: async (code: string) => {
		set({ isLoading: true, error: null });

		try {
			const response = await fetch('/api/promo-codes/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}

			set({
				currentCode: data.code,
				currentCodeId: data.id,
				discount: data.discount,
				isValid: true,
				error: null,
			});

			toast({
				title: 'Code promo appliqué',
				description: `Réduction de ${data.discount}€ appliquée`,
			});
		} catch (error) {
			set({
				currentCode: code,
				currentCodeId: null,
				discount: 0,
				isValid: false,
				error: error instanceof Error ? error.message : 'Erreur inconnue',
			});

			toast({
				title: 'Erreur',
				description:
					error instanceof Error ? error.message : 'Erreur inconnue',
				variant: 'destructive',
			});
		} finally {
			set({ isLoading: false });
		}
	},

	clearPromoCode: () =>
		set({
			currentCode: null,
			discount: 0,
			isValid: null,
			error: null,
		}),
}));

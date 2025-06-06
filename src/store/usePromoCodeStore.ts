// store/usePromoCodeStore.ts
import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { PromoCodeGetDTO } from '@/types/promo-code';

interface PromoCodeState {
	allPromoCodes: PromoCodeGetDTO[];
	currentCode: string | null;
	currentCodeId: string | null;
	discount: number;
	isValid: boolean | null;
	isLoading: boolean;
	error: string | null;

	fetchAllPromoCodes: () => Promise<void>;
	validateCode: (code: string) => Promise<void>;
	clearPromoCode: () => void;
	calculateDiscount: (cartTotal: number) => number;
}

export const usePromoCodeStore = create<PromoCodeState>((set, get) => ({
	allPromoCodes: [],
	currentCode: null,
	currentCodeId: null,
	discount: 0,
	isValid: null,
	isLoading: false,
	error: null,

	fetchAllPromoCodes: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await fetch('/api/promo-codes');
			const data: PromoCodeGetDTO[] = await response.json();

			if (!response.ok) {
				throw new Error('Erreur lors du chargement des codes promos');
			}

			set({ allPromoCodes: data });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Erreur inconnue';

			set({ error: message });
			toast({
				title: 'Erreur',
				description: message,
				variant: 'destructive',
			});
		} finally {
			set({ isLoading: false });
		}
	},
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

	calculateDiscount: (cartTotal: number) => {
		const { isValid, discount } = get();
		if (!isValid) return 0;

		return discount < 1 && discount > 0 ? cartTotal * discount : discount;
	},
}));

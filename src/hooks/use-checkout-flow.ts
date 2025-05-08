import { useCheckoutStore } from '@/store/useCheckoutStore';
import { CHECKOUT_STEPS } from '@/constants';

export function useCheckoutFlow() {
	const store = useCheckoutStore();

	const index = CHECKOUT_STEPS.findIndex(s => s.key === store.currentStep);
	const stepMeta = CHECKOUT_STEPS[index];

	function next() {
		if (index < CHECKOUT_STEPS.length - 1) {
			store.setCurrentStep(CHECKOUT_STEPS[index + 1].key);
		}
	}

	function previous() {
		if (index > 0) {
			store.setCurrentStep(CHECKOUT_STEPS[index - 1].key);
		}
	}

	return {
		...store,
		currentIndex: index,
		stepMeta,
		next,
		previous,
	};
}

import RenderCartSummary from '@/components/site/checkout/renders/steps/render-cart-summary';
import RenderDeliveryForm from '@/components/site/checkout/renders/steps/render-delivery-form';
import RenderPaymentForm from '@/components/site/checkout/renders/steps/render-paiement-form';
import RenderConfirmation from '@/components/site/checkout/renders/steps/render-confirmation';

export const CHECKOUT_STEPS = [
	{
		key: 'cart',
		title: 'Panier',
		component: RenderCartSummary,
	},
	{
		key: 'delivery',
		title: 'Livraison',
		component: RenderDeliveryForm,
	},
	{
		key: 'payment',
		title: 'Paiement',
		component: RenderPaymentForm,
	},
	{
		key: 'confirmation',
		title: 'Confirmation',
		component: RenderConfirmation,
	},
] as const;

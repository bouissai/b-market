'use client';
import { Loading } from '@/components/loading';
import { useAuthStore } from '@/store/useAuthStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Checkout from '@/components/site/checkout/checkout';
import { useCheckoutStore } from '@/store/useCheckoutStore';

export default function CheckoutPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const setRedirectPath = useAuthStore(state => state.setRedirectPath);
	const { resetCheckout } = useCheckoutStore();

	useEffect(() => {
		// Réinitialiser le checkout quand le composant est démonté
		return () => {
			resetCheckout();
		};
	}, [resetCheckout]);

	useEffect(() => {
		if (status === 'unauthenticated') {
			setRedirectPath('/checkout');
			router.replace('/auth');
		}
	}, [status, router, setRedirectPath]);

	if (status === 'loading') {
		return <Loading />;
	}

	if (!session) {
		return null;
	}

	return (
		<div className="container py-24">
			<Checkout />
		</div>
	);
}

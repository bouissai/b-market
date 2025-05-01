import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function RenderConfirmation() {
	const router = useRouter();
	return (
		<div>
			<h2>Confirmation</h2>
			<p>Your order has been confirmed!</p>
			<Button variant={'default'} onClick={() => router.push('/')}>
				Retour à la boutique
			</Button>
		</div>
	);
}

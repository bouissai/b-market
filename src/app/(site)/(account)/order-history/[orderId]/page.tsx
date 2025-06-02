import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { OrderDetail } from '@/components/site/compte/order-detail';

export default async function OrderDetailPage({
	params,
}: {
	params: Promise<{ orderId: string }>;
}) {
	const session = await auth();

	if (!session) {
		redirect('/login');
	}
	const { orderId } = await params;
	const orderIdNumber = Number(orderId);

	if (!Number.isInteger(orderIdNumber)) {
		console.error('orderIdNumber is not a valid integer');
		notFound();
	}

	try {
		const response = await fetch(
			`http://localhost:3000/api/orders/${orderIdNumber}`,
		);

		if (!response.ok) {
			notFound();
		}

		const orderDetails = await response.json();

		if (!orderDetails || orderDetails.userId !== session.user.id) {
			console.log('la erreur');
			notFound();
		}

		return <OrderDetail order={orderDetails} />;
	} catch (error) {
		// Vous pouvez enregistrer l'erreur ici si nécessaire
		console.error('Erreur lors de la récupération de la commande :', error);
		notFound();
	}
}

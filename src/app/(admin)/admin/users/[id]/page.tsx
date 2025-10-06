'use client';

import { useUserStore } from '@/store/useUserStore';
import { orderDTO } from '@/types/order';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserDetailsPage() {
	const { id } = useParams();
	const { fetchOrdersByUserID, userOrders } = useUserStore();

	useEffect(() => {
		if (id) {
			fetchOrdersByUserID(id as string);
		}
	}, [id, fetchOrdersByUserID]);

	return (
		<div className="p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Commandes de l&apos;utilisateur #{id}</CardTitle>
				</CardHeader>
				<CardContent>
					{userOrders && userOrders.length > 0 ? (
						<ul className="list-disc list-inside space-y-1">
							{userOrders.map((order: orderDTO) => (
								<li key={order.id}>Commande #{order.id}</li>
							))}
						</ul>
					) : (
						<p>Aucune commande trouvée.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

// app/account/order-history/[orderId]/OrderDetailClient.tsx

'use client';

import { StatusBadge } from '@/components/site/compte/status-badge';
import { AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { OrderDetailsDTO } from '@/types/order';

type OrderDetailProps = {
	order: OrderDetailsDTO;
};

export function OrderDetail({ order }: OrderDetailProps) {
	return (
		<div>
			<h1>Détails de la commande {order.id}</h1>
			<Card className="w-full overflow-hidden">
				<CardContent className="p-0">
					<div className="p-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
							<div>
								<div className="flex items-center gap-2">
									<h3 className="font-semibold">
										Commande {order.id}
									</h3>
									<StatusBadge status={order.status} />
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
									<Calendar className="h-3 w-3" />
									<span>
										{new Date(order.date).toLocaleDateString('fr-FR')}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<p className="font-bold">{order.total.toFixed(2)} €</p>
							</div>
						</div>
						<div className="text-sm">
							{order.items.map((item, index) => (
								<div key={index} className="flex justify-between py-1">
									<span>
										{item.quantity} × {item.name}
									</span>
									<span>
										{(item.price * item.quantity).toFixed(2)} €
									</span>
								</div>
							))}
						</div>
					</div>

					{order.note && (
						<div className="bg-muted p-4 border-t">
							<div className="flex items-start gap-2">
								<AlertCircle className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<h4 className="font-medium text-sm">
										Note du commerçant
									</h4>
									<p className="text-sm text-muted-foreground mt-1">
										{order.note}
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

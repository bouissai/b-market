// components/OrderCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, Calendar } from 'lucide-react';
import { OrderDetailsDTO } from '@/types/order';
import { StatusBadge } from '@/components/site/compte/status-badge';

const formatDate = (dateString: Date) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

type OrderCardProps = {
	order: OrderDetailsDTO;
};

export function OrderCard({ order }: OrderCardProps) {
	return (
        <Card key={order.id} className="w-full overflow-hidden break-words">
			<CardContent className="p-0">
				<div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 min-w-0">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold truncate">Commande {order.id}</h3>
								<StatusBadge status={order.status} />
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
								<Calendar className="h-3 w-3" />
								<span>{formatDate(order.date)}</span>
							</div>
						</div>
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                            <p className="font-bold whitespace-nowrap">{order.total.toFixed(2)} €</p>
                            <Button asChild variant="outline" size="sm" className="shrink-0">
								<Link href={`/order-history/${order.id}`}>Détails</Link>
							</Button>
						</div>
					</div>
                    <div className="text-sm min-w-0">
						{order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex justify-between items-start gap-2 py-1">
                                <span className="truncate min-w-0">
									{item.quantity} × {item.name}
								</span>
                                <span className="whitespace-nowrap">{(item.price * item.quantity).toFixed(2)} €</span>
							</div>
						))}
						{order.items.length > 2 && (
							<div className="text-muted-foreground text-xs mt-1">
								+ {order.items.length - 2} autres produits
							</div>
						)}
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
	);
}

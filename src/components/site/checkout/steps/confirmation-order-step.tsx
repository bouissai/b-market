'use client';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { Loading } from '@/components/loading';

const formatPrice = (price: number) => price.toFixed(2) + '€';
const formatDate = (date: Date) => new Date(date).toLocaleString('fr-FR');

export default function ConfirmationOrderStep() {
	const router = useRouter();
	const { lastOrderId } = useCheckoutStore();
	const { orderDetails, fetchOrderDetails, isLoading } = useOrderStore();

	useEffect(() => {
		if (!lastOrderId) {
			router.push('/checkout');
			return;
		}
		fetchOrderDetails(lastOrderId);
	}, [lastOrderId, fetchOrderDetails, router]);

	if (isLoading || !orderDetails) return <Loading />;

	// Utiliser orderDetails au lieu de savedOrder
	return (
		// ... le reste du composant utilisant orderDetails
		<div className="space-y-6 max-w-3xl mx-auto">
			<div className="flex items-center space-x-2 text-success">
				<CheckCircle2 className="h-8 w-8" />
				<div>
					<h2 className="text-2xl font-bold">Commande confirmée !</h2>
					<p className="text-muted-foreground">
						Un email de confirmation a été envoyé à{' '}
						{orderDetails.customerEmail}
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Récapitulatif de votre commande</CardTitle>
					<CardDescription>
						Commande #{orderDetails.id} - {formatDate(orderDetails.date)}
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Infos de contact */}
					<div className="rounded-lg bg-neutral-800 p-4">
						<h3 className="font-semibold mb-2">
							Informations de contact
						</h3>
						<p>{orderDetails.customerName}</p>
						<p>{orderDetails.customerEmail}</p>
						<p>{orderDetails.customerPhone}</p>
					</div>

					<Separator />

					{/* Articles */}
					<div>
						<h3 className="font-semibold mb-2">Articles commandés</h3>
						<div className="space-y-2">
							{orderDetails.items.map(item => (
								<div
									key={item.articleId}
									className="flex justify-between">
									<span>
										{item.quantity}x {item.name}
									</span>
									<span>
										{formatPrice(item.price * item.quantity)}
									</span>
								</div>
							))}
							<div className="flex justify-between">
								<span>Total des articles</span>
								<span>
									{formatPrice(
										orderDetails.items.reduce(
											(sum, item) =>
												sum + item.price! * item.quantity,
											0,
										),
									)}
								</span>
							</div>
						</div>
					</div>

					<Separator />

					{/* Total */}
					<div className="space-y-2">
						{orderDetails.promoDiscount && (
							<div className="flex justify-between text-success">
								<span>Réduction</span>
								<span>-{orderDetails.promoDiscount.toFixed(2)}€</span>
							</div>
						)}
						<div className="flex justify-between text-lg font-bold">
							<span>Total</span>
							<span>{formatPrice(orderDetails.total)}</span>
						</div>
					</div>

					{/* Instructions */}
					<div className="rounded-lg bg-secondary/20 p-4 space-y-4">
						<div className="flex items-center space-x-2">
							<Clock className="h-5 w-5" />
							<div>
								<p className="font-semibold">Disponible dans</p>
								<p className="text-muted-foreground">1 heure environ</p>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<MapPin className="h-5 w-5" />
							<div>
								<p className="font-semibold">Point de retrait</p>
								<p className="text-muted-foreground">
									123 rue du Restaurant, 75000 Paris
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
				<Button
					variant="default"
					className="flex-1"
					onClick={() => router.push('/')}>
					Retour à l'accueil
				</Button>
			</div>
		</div>
	);
}

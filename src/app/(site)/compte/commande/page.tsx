'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	ArrowLeft,
	Package,
	Calendar,
	Clock,
	MapPin,
	CreditCard,
	CheckCircle2,
	Truck,
	AlertCircle,
	ClipboardList,
	Phone,
	Mail,
} from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/loading';

// Types
interface OrderItem {
	name: string;
	quantity: number;
	price: number;
}

interface Order {
	id: string;
	orderNumber: string;
	date: string;
	total: number;
	status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
	items: OrderItem[];
	notes?: string;
	paymentMethod: string;
	deliveryMethod: 'pickup' | 'delivery';
	address?: {
		street: string;
		postalCode: string;
		city: string;
	};
	pickupTime?: {
		date: string;
		timeSlot: string;
	};
	statusHistory: {
		status: string;
		date: string;
		note?: string;
	}[];
}

// Sample orders data
const sampleOrders: Order[] = [
	{
		id: '1',
		orderNumber: 'CMD-4872',
		date: '2023-11-15',
		total: 87.5,
		status: 'ready',
		items: [
			{ name: 'Entrecôte', quantity: 2, price: 28.9 },
			{ name: 'Filet Mignon', quantity: 1, price: 22.9 },
			{ name: 'Poulet Fermier', quantity: 1, price: 12.9 },
		],
		notes: 'Votre commande est prête à être retirée. Nous avons sélectionné une entrecôte particulièrement persillée comme vous le préférez.',
		paymentMethod: 'Carte bancaire',
		deliveryMethod: 'pickup',
		pickupTime: {
			date: '2023-11-16',
			timeSlot: '14h00 - 17h00',
		},
		statusHistory: [
			{
				status: 'Commande reçue',
				date: '2023-11-15 10:23',
				note: 'Votre commande a été reçue et est en attente de traitement.',
			},
			{
				status: 'En préparation',
				date: '2023-11-15 14:45',
				note: 'Votre commande est en cours de préparation par notre boucher.',
			},
			{
				status: 'Prête à retirer',
				date: '2023-11-16 09:30',
				note: 'Votre commande est prête à être retirée en boutique.',
			},
		],
	},
	{
		id: '2',
		orderNumber: 'CMD-4756',
		date: '2023-11-02',
		total: 64.3,
		status: 'completed',
		items: [
			{ name: 'Côte de Bœuf', quantity: 1, price: 32.5 },
			{ name: 'Côtes de Porc', quantity: 2, price: 16.9 },
		],
		paymentMethod: 'PayPal',
		deliveryMethod: 'delivery',
		address: {
			street: '123 Rue de Paris',
			postalCode: '75001',
			city: 'Paris',
		},
		statusHistory: [
			{
				status: 'Commande reçue',
				date: '2023-11-02 09:15',
				note: 'Votre commande a été reçue et est en attente de traitement.',
			},
			{
				status: 'En préparation',
				date: '2023-11-02 11:30',
				note: 'Votre commande est en cours de préparation par notre boucher.',
			},
			{
				status: 'En livraison',
				date: '2023-11-03 10:00',
				note: 'Votre commande est en cours de livraison.',
			},
			{
				status: 'Livrée',
				date: '2023-11-03 14:20',
				note: 'Votre commande a été livrée avec succès.',
			},
		],
	},
	{
		id: '3',
		orderNumber: 'CMD-4921',
		date: '2023-11-20',
		total: 105.7,
		status: 'processing',
		items: [
			{ name: 'Filet de Bœuf', quantity: 2, price: 39.9 },
			{ name: "Gigot d'Agneau", quantity: 1, price: 29.9 },
		],
		notes: 'Votre commande est en cours de préparation. Notre boucher prépare votre filet de bœuf selon vos préférences.',
		paymentMethod: 'Carte bancaire',
		deliveryMethod: 'pickup',
		pickupTime: {
			date: '2023-11-21',
			timeSlot: '17h00 - 19h00',
		},
		statusHistory: [
			{
				status: 'Commande reçue',
				date: '2023-11-20 16:05',
				note: 'Votre commande a été reçue et est en attente de traitement.',
			},
			{
				status: 'En préparation',
				date: '2023-11-20 17:30',
				note: 'Votre commande est en cours de préparation par notre boucher.',
			},
		],
	},
	{
		id: '4',
		orderNumber: 'CMD-4699',
		date: '2023-10-18',
		total: 49.8,
		status: 'completed',
		items: [{ name: "Bavette d'Aloyau", quantity: 2, price: 24.9 }],
		paymentMethod: 'En boutique',
		deliveryMethod: 'pickup',
		pickupTime: {
			date: '2023-10-19',
			timeSlot: '9h00 - 12h00',
		},
		statusHistory: [
			{
				status: 'Commande reçue',
				date: '2023-10-18 11:20',
				note: 'Votre commande a été reçue et est en attente de traitement.',
			},
			{
				status: 'En préparation',
				date: '2023-10-18 14:15',
				note: 'Votre commande est en cours de préparation par notre boucher.',
			},
			{
				status: 'Prête à retirer',
				date: '2023-10-19 08:30',
				note: 'Votre commande est prête à être retirée en boutique.',
			},
			{
				status: 'Terminée',
				date: '2023-10-19 10:45',
				note: 'Votre commande a été retirée avec succès.',
			},
		],
	},
	{
		id: '5',
		orderNumber: 'CMD-4985',
		date: '2023-11-25',
		total: 78.6,
		status: 'pending',
		items: [
			{ name: 'Entrecôte', quantity: 1, price: 28.9 },
			{ name: 'Filet Mignon', quantity: 1, price: 22.9 },
			{ name: 'Côtes de Porc', quantity: 1, price: 16.9 },
			{ name: 'Poulet Fermier', quantity: 1, price: 12.9 },
		],
		paymentMethod: 'Carte bancaire',
		deliveryMethod: 'delivery',
		address: {
			street: '45 Avenue Victor Hugo',
			postalCode: '75016',
			city: 'Paris',
		},
		statusHistory: [
			{
				status: 'Commande reçue',
				date: '2023-11-25 18:30',
				note: 'Votre commande a été reçue et est en attente de traitement.',
			},
		],
	},
];

// Helper function to format date
const formatDate = (dateString: string) => {
	if (dateString.includes(' ')) {
		// If it includes time
		const [date, time] = dateString.split(' ');
		const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		return `${formattedDate} à ${time}`;
	}

	// Just date
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Status badge component
const StatusBadge = ({ status }: { status: Order['status'] }) => {
	const statusConfig = {
		pending: { label: 'En attente', variant: 'outline' as const },
		processing: { label: 'En préparation', variant: 'pending' as const },
		ready: { label: 'Prêt à retirer', variant: 'default' as const },
		completed: { label: 'Terminée', variant: 'success' as const },
		cancelled: { label: 'Annulée', variant: 'destructive' as const },
	};

	const config = statusConfig[status] || {
		label: status,
		variant: 'outline' as const,
	};

	return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function OrderDetailPage() {
	const { data: session, status: sessionStatus } = useSession();
	const router = useRouter();
	const params = useParams();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate fetching order data
		const fetchOrder = () => {
			setLoading(true);
			const orderId = '1';
			const foundOrder = sampleOrders.find(o => o.id === orderId);

			if (foundOrder) {
				setOrder(foundOrder);
			} else {
				router.push('/mon-compte');
			}

			setLoading(false);
		};

		if (params?.id) {
			fetchOrder();
		}
	}, [params?.id, router]);

	// If loading
	if (loading || sessionStatus === 'loading') {
		return <Loading />;
	}

	// If not authenticated
	if (sessionStatus === 'unauthenticated') {
		router.push('/commander');
		return null;
	}

	// If order not found
	if (!order) {
		return (
			<div className="flex min-h-screen flex-col">
				<main className="flex-1 container py-12">
					<div className="flex items-center justify-center h-[60vh]">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium">
								Commande introuvable
							</h3>
							<p className="text-muted-foreground mt-1">
								La commande que vous recherchez n'existe pas ou a été
								supprimée
							</p>
							<Button asChild className="mt-4">
								<Link href="/mon-compte">Retour à mes commandes</Link>
							</Button>
						</div>
					</div>
				</main>
			</div>
		);
	}

	// Get status icon
	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case 'commande reçue':
				return <ClipboardList className="h-5 w-5" />;
			case 'en préparation':
				return <Package className="h-5 w-5" />;
			case 'prête à retirer':
				return <CheckCircle2 className="h-5 w-5" />;
			case 'en livraison':
				return <Truck className="h-5 w-5" />;
			case 'livrée':
			case 'terminée':
				return <CheckCircle2 className="h-5 w-5" />;
			default:
				return <Clock className="h-5 w-5" />;
		}
	};

	// If authenticated and order found
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1 container py-8">
				<div className="mb-6">
					<Button asChild variant="ghost" size="sm" className="mb-4">
						<Link href="/mon-compte">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Retour à mes commandes
						</Link>
					</Button>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Commande {order.orderNumber}
							</h1>
							<div className="flex items-center gap-2 text-muted-foreground mt-1">
								<Calendar className="h-4 w-4" />
								<span>{formatDate(order.date)}</span>
								<StatusBadge status={order.status} />
							</div>
						</div>
						{order.status === 'pending' && (
							<Button
								variant="outline"
								className="text-destructive hover:text-destructive">
								Annuler la commande
							</Button>
						)}
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-6">
						{/* Order details */}
						<Card>
							<CardHeader>
								<CardTitle>Détails de la commande</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{order.items.map((item, index) => (
										<div
											key={index}
											className="flex justify-between items-center py-2 border-b last:border-0">
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
													<Package className="h-6 w-6 text-muted-foreground" />
												</div>
												<div>
													<p className="font-medium">
														{item.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{item.price.toFixed(2)} €/kg
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-medium">
													{(item.price * item.quantity).toFixed(2)}{' '}
													€
												</p>
												<p className="text-sm text-muted-foreground">
													Quantité: {item.quantity}
												</p>
											</div>
										</div>
									))}

									<Separator />

									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Sous-total</span>
											<span>{order.total.toFixed(2)} €</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Frais de livraison</span>
											<span>
												{order.deliveryMethod === 'delivery'
													? '5,00 €'
													: 'Gratuit'}
											</span>
										</div>
										<Separator className="my-2" />
										<div className="flex justify-between font-bold">
											<span>Total</span>
											<span>
												{(
													order.total +
													(order.deliveryMethod === 'delivery'
														? 5
														: 0)
												).toFixed(2)}{' '}
												€
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order status timeline */}
						<Card>
							<CardHeader>
								<CardTitle>Suivi de commande</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{order.statusHistory.map((status, index) => (
										<div key={index} className="flex">
											<div className="mr-4 flex flex-col items-center">
												<div
													className={`rounded-full p-2 ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
													{getStatusIcon(status.status)}
												</div>
												{index < order.statusHistory.length - 1 && (
													<div className="h-full w-px bg-border mt-2"></div>
												)}
											</div>
											<div className="pb-6">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold">
														{status.status}
													</h3>
													<span className="text-xs text-muted-foreground">
														{formatDate(status.date)}
													</span>
												</div>
												{status.note && (
													<p className="text-sm text-muted-foreground mt-1">
														{status.note}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Merchant notes */}
						{order.notes && (
							<Card>
								<CardHeader>
									<CardTitle>Notes du commerçant</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-start gap-4">
										<AlertCircle className="h-5 w-5 text-primary mt-0.5" />
										<p className="text-muted-foreground">
											{order.notes}
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					<div className="space-y-6">
						{/* Order summary */}
						<Card>
							<CardHeader>
								<CardTitle>Récapitulatif</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h3 className="font-semibold text-sm mb-2">
										Méthode de paiement
									</h3>
									<div className="flex items-center gap-2 text-muted-foreground">
										<CreditCard className="h-4 w-4" />
										<span>{order.paymentMethod}</span>
									</div>
								</div>

								<Separator />

								<div>
									<h3 className="font-semibold text-sm mb-2">
										{order.deliveryMethod === 'pickup'
											? 'Retrait en boutique'
											: 'Livraison'}
									</h3>
									<div className="flex items-start gap-2 text-muted-foreground">
										{order.deliveryMethod === 'pickup' ? (
											<>
												<Clock className="h-4 w-4 mt-0.5" />
												<div>
													<p>
														{formatDate(
															order.pickupTime?.date || '',
														)}
													</p>
													<p>{order.pickupTime?.timeSlot}</p>
													<p className="mt-1">
														B-Market, 123 Rue de la Boucherie,
														75001 Paris
													</p>
												</div>
											</>
										) : (
											<>
												<MapPin className="h-4 w-4 mt-0.5" />
												<div>
													<p>{order.address?.street}</p>
													<p>
														{order.address?.postalCode}{' '}
														{order.address?.city}
													</p>
												</div>
											</>
										)}
									</div>
								</div>

								<Separator />

								<div>
									<h3 className="font-semibold text-sm mb-2">
										Besoin d'aide ?
									</h3>
									<div className="space-y-2 text-muted-foreground">
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4" />
											<span>01 23 45 67 89</span>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4" />
											<span>contact@b-market.fr</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Actions */}
						<div className="space-y-4">
							<Button className="w-full" asChild>
								<Link href="/commander">Commander à nouveau</Link>
							</Button>
							{order.status === 'completed' && (
								<Button variant="outline" className="w-full">
									Laisser un avis
								</Button>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

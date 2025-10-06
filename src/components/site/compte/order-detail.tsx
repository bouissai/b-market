'use client';

import { ArrowLeft, Ban, Check, Clock } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { OrderDetailsDTO, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOrderStore } from '@/store/useOrderStore';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

type OrderDetailProps = {
	order: OrderDetailsDTO;
};

export function OrderDetail({ order }: OrderDetailProps) {
	const { updateOrderDetails } = useOrderStore();
	const subtotal = order.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const canCancel = ['PENDING'].includes(order.status);

	function getStatusColor(status: keyof typeof OrderStatus) {
		switch (status) {
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'PREPARING':
				return 'bg-orange-100 text-orange-800';
			case 'READY':
				return 'bg-purple-100 text-purple-800';
			case 'COMPLETED':
				return 'bg-green-100 text-green-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getStatusIcon(status: keyof typeof OrderStatus) {
		switch (status) {
			case 'PENDING':
				return <Clock className="h-4 w-4" />;
			case 'PREPARING':
				return <Clock className="h-4 w-4" />;
			case 'READY':
				return <Check className="h-4 w-4" />;
			case 'COMPLETED':
				return <Check className="h-4 w-4" />;
			case 'CANCELLED':
				return <Ban className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'EUR',
		}).format(price);
	}

	function formatDate(date: string | Date | undefined | null) {
		if (!date) return 'Date inconnue';

		const parsedDate = typeof date === 'string' ? new Date(date) : date;

		if (isNaN(parsedDate.getTime())) {
			return 'Date invalide';
		}

		return new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(parsedDate);
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			{/* En-tête */}
			<div className="flex flex-col gap-2 mb-6">
				<Button variant="ghost" size="sm" className="w-fit" asChild>
					<Link href="/order-history">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour à mes commandes
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">Détail de votre commande</h1>
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-muted-foreground">
						Commande #{order.id}
					</span>
					<span className="text-muted-foreground">•</span>
					<span className="text-muted-foreground">
						Passée le {formatDate(order.date)}
					</span>
				</div>
			</div>

			{/* Statut de la commande */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Statut de votre commande</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-2">
							<Badge
								className={`${getStatusColor(order.status)} px-3 py-1`}>
								<span className="flex items-center gap-1">
									{getStatusIcon(order.status)}
									{OrderStatus[order.status].status}
								</span>
							</Badge>
						</div>

						{/* Barre de progression */}
						<div className="relative pt-8">
							<div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded">
								<div
									className={`absolute top-0 left-0 h-1 bg-green-500 rounded`}
									style={{
										width:
											order.status === 'PENDING'
												? '10%'
												: order.status === 'PREPARING'
													? '35%'
													: order.status === 'READY'
														? '65%'
														: order.status === 'COMPLETED'
															? '100%'
															: '0%',
									}}></div>
							</div>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>Commande passée</span>
								<span>Préparation</span>
								<span>Disponible pour retrait</span>
								<span>Terminée</span>
							</div>
						</div>

						{/* Informations de suivi */}
						{/*{order.status === 'SHIPPED' && order.trackingNumber && (*/}
						{/*	<div className="mt-4 p-4 bg-blue-50 rounded-md">*/}
						{/*		<div className="flex items-center gap-2 mb-2">*/}
						{/*			<Truck className="h-5 w-5 text-blue-600" />*/}
						{/*			<span className="font-medium">*/}
						{/*				Votre commande est en route !*/}
						{/*			</span>*/}
						{/*		</div>*/}
						{/*		<p className="text-sm mb-2">*/}
						{/*			Livraison prévue le{' '}*/}
						{/*			<span className="font-medium">*/}
						{/*				{formatDate(order.estimatedDelivery as Date)}*/}
						{/*			</span>*/}
						{/*		</p>*/}
						{/*		<div className="flex items-center gap-2">*/}
						{/*			<span className="text-sm">Numéro de suivi:</span>*/}
						{/*			<span className="font-medium">*/}
						{/*				{order.trackingNumber}*/}
						{/*			</span>*/}
						{/*		</div>*/}
						{/*		<Button*/}
						{/*			variant="link"*/}
						{/*			className="p-0 h-auto text-blue-600">*/}
						{/*			Suivre mon colis*/}
						{/*		</Button>*/}
						{/*	</div>*/}
						{/*)}*/}
					</div>
				</CardContent>
			</Card>

			{/* Articles commandés */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Articles commandés</CardTitle>
					<CardDescription>
						{order.items.length} article
						{order.items.length > 1 ? 's' : ''}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{order.items.map(item => (
							<div
								key={item.id}
								className="flex gap-4 py-3 border-b last:border-0">
								<div className="flex-shrink-0">
									{item && (
										<Image
											src={item.image || '/placeholder.svg'}
											alt={item.name}
											height={80}
											width={80}
											className="w-20 h-20 object-cover rounded-md border"
										/>
									)}
								</div>
								<div className="flex-grow">
									<h3 className="font-medium">{item.name}</h3>
									{item.articleId && (
										<p className="text-sm text-muted-foreground">
											Réf: {item.articleId}
										</p>
									)}
									<p className="text-sm mt-1">
										Quantité: {item.quantity}
									</p>
								</div>
								<div className="flex-shrink-0 text-right">
									<p className="font-medium">
										{formatPrice(item.price * item.quantity)}
									</p>
									{item.quantity > 1 && (
										<p className="text-sm text-muted-foreground">
											{formatPrice(item.price)} x {item.quantity}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Adresse de livraison */}
			{/*{order.shippingAddress && (*/}
			{/*	<Card className="mb-6">*/}
			{/*		<CardHeader>*/}
			{/*			<CardTitle>Adresse de livraison</CardTitle>*/}
			{/*		</CardHeader>*/}
			{/*		<CardContent>*/}
			{/*			<p className="font-medium">{order.customerName}</p>*/}
			{/*			<p>{order.shippingAddress.street}</p>*/}
			{/*			<p>*/}
			{/*				{order.shippingAddress.postalCode}{' '}*/}
			{/*				{order.shippingAddress.city}*/}
			{/*			</p>*/}
			{/*			<p>{order.shippingAddress.country}</p>*/}
			{/*		</CardContent>*/}
			{/*	</Card>*/}
			{/*)}*/}

			{/* Résumé de la commande */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Récapitulatif</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span>Total des articles</span>
							<span>{formatPrice(subtotal)}</span>
						</div>

						{order.promoDiscount && (
							<div className="flex justify-between text-green-600">
								<span>
									Réduction de{' '}
									{order.promoDiscount < 1 && order.promoDiscount > 0
										? order.promoDiscount * 100 + '%'
										: order.promoDiscount + '€'}
								</span>
								<span>
									-
									{order.promoDiscount < 1 && order.promoDiscount > 0
										? (
												(order.total / (1 - order.promoDiscount)) *
												order.promoDiscount
											).toFixed(2)
										: order.promoDiscount}
								</span>
							</div>
						)}

						<Separator className="my-2" />

						<div className="flex justify-between font-bold">
							<span>Total</span>
							<span>{formatPrice(order.total)}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex flex-wrap gap-3 mt-6">
				{canCancel && (
					<Button
						onClick={e => {
							e.preventDefault();
							updateOrderDetails(order.id, { status: 'CANCELLED' }).then(
								() => {
									toast({
										title: 'Commande annulée',
										description: 'Votre commande a bien été annulée',
									});
									window.location.reload();
								},
							);
						}}
						variant="outline"
						className="text-red-600 hover:bg-red-50 hover:text-red-700">
						Annuler la commande
					</Button>
				)}
			</div>
		</div>
	);
}

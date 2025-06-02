'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Package, Search } from 'lucide-react';
import Link from 'next/link';
import { OrderCard } from '@/components/site/compte/order-card';
import { OrderDetailsDTO } from '@/types/order';
import { useOrderStore } from '@/store/useOrderStore';
import { useSession } from 'next-auth/react';

export function Commandes() {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: session } = useSession();

	const { ordersDetails, fetchOrdersDetailsByUserId } = useOrderStore();

	useEffect(() => {
		if (!session?.user?.id) return;

		fetchOrdersDetailsByUserId(session.user.id);
	}, [session?.user?.id]);

	const filteredOrders = ordersDetails.filter(
		order =>
			order.id.toString().includes(searchTerm.toLowerCase()) ||
			order.items.some(item =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase()),
			),
	);

	const renderOrderCard = (order: OrderDetailsDTO) => (
		<OrderCard key={order.id} order={order} />
	);

	const renderTabContent = (statusFilter?: OrderDetailsDTO['status']) => {
		const orders = statusFilter
			? filteredOrders.filter(order => order.status === statusFilter)
			: filteredOrders;

		if (orders.length === 0) {
			return (
				<div className="w-full flex justify-center">
					<div className="text-center py-12 max-w-2xl w-full">
						<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium">
							Aucune commande trouvée
						</h3>
						<p className="text-muted-foreground mt-1">
							{searchTerm
								? 'Aucune commande ne correspond à votre recherche'
								: "Vous n'avez pas encore passé de commande"}
						</p>
						<Button asChild className="mt-4">
							<Link href="/products">Commander maintenant</Link>
						</Button>
					</div>
				</div>
			);
		}

		return (
			<div className="w-full flex flex-col items-center space-y-4">
				{orders.map(renderOrderCard)}
			</div>
		);
	};

	return (
		<>
			<section>
				<div>
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold mb-4  ">
							Mes commandes
						</h1>
						<p className="text-muted-foreground mb-6">
							Consultez l'historique et le statut de vos commandes
						</p>
					</div>
				</div>
			</section>

			<div className="mb-6 relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Rechercher une commande..."
					className="pl-10"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</div>

			<Tabs
				defaultValue="pending"
				className="w-full max-w-2xl mx-auto min-w-[650px]">
				<TabsList className="mb-6">
					<TabsTrigger value="all">Toutes</TabsTrigger>
					<TabsTrigger value="pending">En attente</TabsTrigger>
					<TabsTrigger value="preparing">En préparation</TabsTrigger>
					<TabsTrigger value="ready">Prêtes</TabsTrigger>
					<TabsTrigger value="completed">Complétées</TabsTrigger>
					<TabsTrigger value="cancelled">Annulées</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<div className="w-full max-w-2xl mx-auto min-w-[650px]">
						{renderTabContent()}
					</div>
				</TabsContent>
				<TabsContent value="pending">
					<div className="w-full max-w-2xl mx-auto min-w-[650px]">
						{renderTabContent('PENDING')}
					</div>
				</TabsContent>
				<TabsContent value="preparing">
					<div className="w-full max-w-2xl mx-auto min-w-[650px]">
						{renderTabContent('PREPARING')}
					</div>
				</TabsContent>
				<TabsContent value="ready">
					<div className="w-full max-w-2xl mx-auto min-w-[650px]">
						{renderTabContent('READY')}
					</div>
				</TabsContent>
				<TabsContent value="completed">
					<div className="w-full max-w-2xl mx-auto min-w-[650px]">
						{renderTabContent('COMPLETED')}
					</div>
				</TabsContent>
				<TabsContent value="cancelled">
					<div className="w-full max-w-2xl mx-auto min-w-[650px]">
						{renderTabContent('CANCELLED')}
					</div>
				</TabsContent>
			</Tabs>
		</>
	);
}

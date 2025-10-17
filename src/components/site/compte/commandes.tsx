'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Package, Search } from 'lucide-react';
import Link from 'next/link';
import { OrderCard } from '@/components/site/compte/order-card';
import { OrderDetailsDTO } from '@/types/order';
import { useOrderStore } from '@/store/useOrderStore';
import { useSession } from 'next-auth/react';

type StatusFilter = 'all' | OrderDetailsDTO['status'];

const statusOptions = [
	{ value: 'all', label: 'Toutes' },
	{ value: 'PENDING', label: 'En attente' },
	{ value: 'PREPARING', label: 'En préparation' },
	{ value: 'READY', label: 'Prêtes' },
	{ value: 'COMPLETED', label: 'Complétées' },
	{ value: 'CANCELLED', label: 'Annulées' },
] as const;

export function Commandes() {
	const [searchTerm, setSearchTerm] = useState('');
	const [mobileFilter, setMobileFilter] = useState<StatusFilter>('PENDING');
	const { data: session } = useSession();

	const { ordersDetails, fetchOrdersDetailsByUserId } = useOrderStore();

	useEffect(() => {
		if (!session?.user?.id) return;

		fetchOrdersDetailsByUserId(session.user.id);
	}, [session?.user?.id, fetchOrdersDetailsByUserId]);

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

	const renderMobileContent = () => {
		const statusFilter = mobileFilter === 'all' ? undefined : mobileFilter;
		return renderTabContent(statusFilter as OrderDetailsDTO['status']);
	};

	return (
		<>
			<section>
				<div>
					<div className="w-full max-w-2xl mx-auto">
						<h1 className="text-3xl md:text-4xl font-bold mb-4  ">
							Mes commandes
						</h1>
						<p className="text-muted-foreground mb-6">
							Consultez l&apos;historique et le statut de vos commandes
						</p>
					</div>
				</div>
			</section>

			<div className="mb-6 relative w-full max-w-2xl mx-auto">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Rechercher une commande..."
					className="pl-10"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Mobile filter */}
			<div className="md:hidden w-full max-w-2xl mx-auto">
				<Select value={mobileFilter} onValueChange={value => setMobileFilter(value as StatusFilter)}>
					<SelectTrigger className="mb-6">
						<SelectValue placeholder="Filtrer par statut" />
					</SelectTrigger>
					<SelectContent>
						{statusOptions.map(option => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{renderMobileContent()}
			</div>

			{/* Desktop tabs */}
			<Tabs defaultValue="PENDING" className="hidden md:block w-full max-w-2xl mx-auto">
				<TabsList className="mb-6 grid w-full grid-cols-6">
					<TabsTrigger value="all">Toutes</TabsTrigger>
					<TabsTrigger value="PENDING">En attente</TabsTrigger>
					<TabsTrigger value="PREPARING">En prép.</TabsTrigger>
					<TabsTrigger value="READY">Prêtes</TabsTrigger>
					<TabsTrigger value="COMPLETED">Complétées</TabsTrigger>
					<TabsTrigger value="CANCELLED">Annulées</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<div className="w-full max-w-2xl mx-auto">{renderTabContent()}</div>
				</TabsContent>
				<TabsContent value="PENDING">
					<div className="w-full max-w-2xl mx-auto">{renderTabContent('PENDING')}</div>
				</TabsContent>
				<TabsContent value="PREPARING">
					<div className="w-full max-w-2xl mx-auto">{renderTabContent('PREPARING')}</div>
				</TabsContent>
				<TabsContent value="READY">
					<div className="w-full max-w-2xl mx-auto">{renderTabContent('READY')}</div>
				</TabsContent>
				<TabsContent value="COMPLETED">
					<div className="w-full max-w-2xl mx-auto">{renderTabContent('COMPLETED')}</div>
				</TabsContent>
				<TabsContent value="CANCELLED">
					<div className="w-full max-w-2xl mx-auto">{renderTabContent('CANCELLED')}</div>
				</TabsContent>
			</Tabs>
		</>
	);
}

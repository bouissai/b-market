'use client';

import OrderForm from '@/components/admin/orderAdmin/OrderForm';
import { OrderTable } from '@/components/admin/orderAdmin/orderTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useOrderStore } from '@/store/useOrderStore';
import { OrderFormValues, OrderSaveDTO } from '@/types/order';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrdersManagementContent() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { orders, saveOrder, fetchOrders } = useOrderStore(); // 🔥 Ajout de fetchOrders
	const searchParams = useSearchParams();

	// 🔥 Charger les commandes au montage du composant
	useEffect(() => {
		fetchOrders();
		const status = searchParams.get('status');
		setIsDialogOpen(status === 'new');
	}, [fetchOrders, searchParams]);

	const handleOnSubmit = async (values: OrderFormValues) => {
		const newOrder: OrderSaveDTO = {
			userId: values.userId,
			total: values.total,
			note: values.note,
			status: 'PENDING',
			firstname: values.firstname,
			lastname: values.lastname,
			email: values.email,
			phone: values.phone,
			promoCodeId: null,
			orderItems: values.items.map(item => ({
				articleId: item.articleId,
				price: item.price,
				quantity: item.quantity,
			})),
		};

		await saveOrder(newOrder);
		fetchOrders(); // 🔥 Recharger la liste après l'ajout
		setIsDialogOpen(false);
	};

	return (
		<div className="p-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Gestion des commandes</CardTitle>
					<div className="flex justify-between items-center">
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogDescription />
							<DialogTrigger asChild>
								<Button>Nouvelle commande</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[625px]">
								<DialogHeader>
									<DialogTitle>Nouvelle commande</DialogTitle>
								</DialogHeader>
								<OrderForm
									onSubmit={values => handleOnSubmit(values)}
									onCancel={() => setIsDialogOpen(false)}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<OrderTable
						data={orders}
						onEdit={() => {}}
						onDelete={() => {}}></OrderTable>
				</CardContent>
			</Card>
		</div>
	);
}

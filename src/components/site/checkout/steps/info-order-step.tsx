'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';

const deliveryFormSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
	lastName: z
		.string()
		.min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
	email: z
		.string()
		.email({ message: 'Veuillez entrer une adresse email valide' })
		.nonempty('Veuillez entrer une adresse email'),
	phone: z
		.string()
		.min(10, { message: 'Veuillez entrer un numéro de téléphone valide' }),
});

type RenderDeliveryFormProps = {
	nextStep: () => void;
	previousStep: () => void;
};

export default function InfoOrderStep({
	nextStep,
	previousStep,
}: RenderDeliveryFormProps) {
	const { promoDiscount } = useCheckoutStore();
	const { saveOrder } = useOrderStore();
	const { cartItems } = useCartStore();

	const { data: session } = useSession();
	const [otherPerson, setOtherPerson] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const otherInfoForm = useForm<z.infer<typeof deliveryFormSchema>>({
		resolver: zodResolver(deliveryFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
		},
	});

	const handleContinue = () => {
		if (otherPerson) {
			otherInfoForm.handleSubmit(() => {
				setShowConfirmDialog(true);
			})();
		} else {
			setShowConfirmDialog(true);
		}
	};

	const confirmOrder = async () => {
		try {
			// Calculer le total directement
			const total =
				cartItems.reduce(
					(sum, item) => sum + item.article.price! * item.quantity,
					0,
				) - promoDiscount;

			const orderData = {
				userId: session!.user.id,
				firstname: otherPerson
					? otherInfoForm.getValues().firstName
					: session?.user?.firstname!,
				lastname: otherPerson
					? otherInfoForm.getValues().lastName
					: session?.user?.lastname!,
				email: otherPerson
					? otherInfoForm.getValues().email
					: session?.user?.email!,
				phone: otherPerson
					? otherInfoForm.getValues().phone
					: session?.user?.phone!,
				status: 'PENDING' as const,
				note: '',
				total: total,
				orderItems: cartItems.map(item => ({
					articleId: item.article.id!,
					price: item.article.price!,
					quantity: item.quantity,
				})),
			};

			const savedOrder = await saveOrder(orderData);
			useCheckoutStore.getState().setLastOrderId(savedOrder.id);

			// Vider le panier
			await useCartStore.getState().clearCart();

			setShowConfirmDialog(false);
			nextStep();
		} catch (error) {
			console.error('Erreur lors de la confirmation:', error);
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl">Informations personnelles</h2>
			<div className="border rounded-lg p-4 bg-neutral-800">
				<div className="font-semibold mb-2">
					Nom : {session?.user?.firstname} {session?.user?.lastname}
				</div>
				<div>Email : {session?.user?.email}</div>
				<div>Téléphone : {session?.user?.phone}</div>
			</div>

			<div className="flex items-center gap-2 mt-4">
				<input
					id="otherPerson"
					type="checkbox"
					checked={otherPerson}
					onChange={e => setOtherPerson(e.target.checked)}
				/>
				<label htmlFor="otherPerson" className="cursor-pointer">
					Ce n'est pas moi qui viens récupérer la commande
				</label>
			</div>

			{otherPerson && (
				<Form {...otherInfoForm}>
					<form
						className="mt-4 space-y-4"
						onSubmit={otherInfoForm.handleSubmit(() => nextStep())}>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormField
								control={otherInfoForm.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prénom</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={otherInfoForm.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={otherInfoForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={otherInfoForm.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Téléphone</FormLabel>
										<FormControl>
											<Input type="tel" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
			)}

			<div className="flex justify-between">
				<Button onClick={previousStep} variant={'outline'}>
					Retour au récapitulatif du panier
				</Button>
				<Button
					onClick={handleContinue}
					variant={'default'}
					disabled={otherPerson && !otherInfoForm.formState.isValid}>
					Confirmer la commande
				</Button>
			</div>

			<Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Confirmation de commande</DialogTitle>
						<DialogDescription>
							Veuillez lire attentivement avant de confirmer
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<p>
							Bonjour{' '}
							<span className="font-semibold">
								{otherPerson
									? `${otherInfoForm.getValues().firstName} ${otherInfoForm.getValues().lastName}`
									: `${session?.user?.firstname || 'Prénom'} ${session?.user?.lastname || 'Nom'}`}
							</span>
							,
						</p>
						<p>
							Vous êtes sur le point de confirmer une commande en click
							and collect avec les coordonnées suivantes :
						</p>
						<div className="bg-neutral-800 p-3 rounded-md">
							<p>
								Email :{' '}
								{otherPerson
									? otherInfoForm.getValues().email
									: session?.user?.email || 'email@example.com'}
							</p>
							<p>
								Téléphone :{' '}
								{otherPerson
									? otherInfoForm.getValues().phone
									: session?.user?.phone || '0600000000'}
							</p>
						</div>
						<p className="text-amber-500 font-medium">
							En confirmant cette commande, vous vous engagez à venir la
							récupérer.
						</p>
						<p className="text-red-500 font-semibold">
							Si vous ne venez pas récupérer votre commande, cela fera
							travailler notre personnel pour rien et vous serez banni de
							nos services.
						</p>
					</div>
					<DialogFooter className="flex justify-between sm:justify-between">
						<Button
							variant="outline"
							onClick={() => setShowConfirmDialog(false)}>
							Annuler
						</Button>
						<Button
							onClick={confirmOrder}
							className="bg-red-700 hover:bg-red-800">
							Je confirme ma commande
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

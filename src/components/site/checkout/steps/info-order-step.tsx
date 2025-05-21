'use client';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type RenderDeliveryFormProps = {
	nextStep: () => void;
	previousStep: () => void;
};

const deliveryFormSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
	lastName: z
		.string()
		.min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
	email: z
		.string()
		.email({ message: 'Veuillez entrer une adresse email valide' }),
	phone: z
		.string()
		.min(10, { message: 'Veuillez entrer un numéro de téléphone valide' }),
});

export default function InfoOrderStep({
	nextStep,
	previousStep,
}: RenderDeliveryFormProps) {
	const { data: session } = useSession();
	const [orderInfo, setOrderInfo] = useState([]);

	const personnalInfoForm = useForm<z.infer<typeof deliveryFormSchema>>({
		resolver: zodResolver(deliveryFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
		},
	});

	// Gestionnaire de soumission
	const handlePersonalFormSubmit = (
		data: z.infer<typeof deliveryFormSchema>,
	) => {};
	return (
		<div className="space-y-6">
			<h2 className="text-2xl">Informations personnelles</h2>
			<Tabs defaultValue="accountInfo">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value={'accountInfo'}>
						Informations du compte
					</TabsTrigger>
					<TabsTrigger value={'newInfos'}>
						Nouvelles informations
					</TabsTrigger>
				</TabsList>
				<TabsContent value={'accountInfo'}>
					<Card>
						<CardHeader>
							<CardTitle>{session?.user?.name}</CardTitle>
						</CardHeader>
						<CardContent>
							{session?.user?.email}
							{session?.user?.phone}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value={'newInfos'}>
					<Form {...personnalInfoForm}>
						<form
							onSubmit={personnalInfoForm.handleSubmit(
								handlePersonalFormSubmit,
							)}>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<FormField
									control={personnalInfoForm.control}
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
									control={personnalInfoForm.control}
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
									control={personnalInfoForm.control}
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
									control={personnalInfoForm.control}
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
				</TabsContent>
			</Tabs>
			<div className="rounded-lg border "></div>

			<div className="flex justify-between">
				<Button onClick={previousStep} variant={'outline'}>
					Retour au récapitulatif du panier
				</Button>
				<Button onClick={nextStep} variant={'default'}>
					Continuer vers le paiement
					<ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

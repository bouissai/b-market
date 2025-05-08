'use client';
import { Button } from '@/components/ui/button';
import {
	CalendarIcon,
	ChevronRight,
	Clock,
	Gift,
	Store,
	Truck,
} from 'lucide-react';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import { fr } from 'date-fns/locale';

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
	address: z
		.string()
		.min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
	city: z
		.string()
		.min(2, { message: 'La ville doit contenir au moins 2 caractères' }),
	postalCode: z
		.string()
		.regex(/^\d{5}$/, { message: 'Le code postal doit contenir 5 chiffres' }),
	country: z.string().min(1, { message: 'Veuillez sélectionner un pays' }),
	saveAddress: z.boolean().optional(),
});

export default function InfoOrderStep({
	nextStep,
	previousStep,
}: RenderDeliveryFormProps) {
	// 1. Hooks personnalisés (useCheckoutStore)

	// 2. Hook useForm
	const deliveryForm = useForm<z.infer<typeof deliveryFormSchema>>({
		resolver: zodResolver(deliveryFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			address: '',
			city: '',
			postalCode: '',
			country: 'France',
			saveAddress: false,
		},
	});

	// 3. Tous les useState ensemble
	const [giftOption, setGiftOption] = useState(false);
	const [giftMessage, setGiftMessage] = useState('');
	const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(
		undefined,
	);
	const [deliveryMethod, setDeliveryMethod] = useState('standard');

	// Gestionnaire de soumission
	const handleDeliveryFormSubmit = (
		data: z.infer<typeof deliveryFormSchema>,
	) => {
		if (deliveryMethod && (deliveryMethod === 'pickup' || deliveryDate)) {
			nextStep();
		}
	};
	return (
		<div className="space-y-6">
			<h2 className="text-2xl">Informations de livraison</h2>
			<Form {...deliveryForm}>
				<form
					onSubmit={deliveryForm.handleSubmit(handleDeliveryFormSubmit)}>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<FormField
							control={deliveryForm.control}
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
							control={deliveryForm.control}
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
							control={deliveryForm.control}
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
							control={deliveryForm.control}
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
						<FormField
							control={deliveryForm.control}
							name="address"
							render={({ field }) => (
								<FormItem className="md:col-span-2">
									<FormLabel>Adresse</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={deliveryForm.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ville</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={deliveryForm.control}
							name="postalCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Code postal</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={deliveryForm.control}
							name="country"
							render={({ field }) => (
								<FormItem className="md:col-span-2">
									<FormLabel>Pays</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Sélectionnez un pays" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="France">France</SelectItem>
											<SelectItem value="Belgique">
												Belgique
											</SelectItem>
											<SelectItem value="Suisse">Suisse</SelectItem>
											<SelectItem value="Luxembourg">
												Luxembourg
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={deliveryForm.control}
							name="saveAddress"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											Sauvegarder cette adresse pour mes prochaines
											commandes
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Mode de livraison</CardTitle>
							<CardDescription>
								Choisissez comment vous souhaitez recevoir votre
								commande
							</CardDescription>
						</CardHeader>
						<CardContent>
							<RadioGroup
								value={deliveryMethod}
								onValueChange={setDeliveryMethod}>
								<div className="space-y-3">
									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="standard" id="standard" />
										<Label
											htmlFor="standard"
											className="flex flex-1 cursor-pointer items-center justify-between">
											<div className="flex items-center space-x-3">
												<Truck className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="font-medium">
														Livraison standard
													</p>
													<p className="text-sm text-muted-foreground">
														Livraison sous 2-3 jours ouvrés
													</p>
												</div>
											</div>
											<span className="font-medium">4,90€</span>
										</Label>
									</div>
									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="express" id="express" />
										<Label
											htmlFor="express"
											className="flex flex-1 cursor-pointer items-center justify-between">
											<div className="flex items-center space-x-3">
												<Clock className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="font-medium">
														Livraison express
													</p>
													<p className="text-sm text-muted-foreground">
														Livraison le lendemain avant 13h
													</p>
												</div>
											</div>
											<span className="font-medium">9,90€</span>
										</Label>
									</div>
									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="pickup" id="pickup" />
										<Label
											htmlFor="pickup"
											className="flex flex-1 cursor-pointer items-center justify-between">
											<div className="flex items-center space-x-3">
												<Store className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="font-medium">
														Retrait en boutique
													</p>
													<p className="text-sm text-muted-foreground">
														Prêt dans 1 heure
													</p>
												</div>
											</div>
											<span className="font-medium">Gratuit</span>
										</Label>
									</div>
								</div>
							</RadioGroup>
						</CardContent>
					</Card>

					{deliveryMethod !== 'pickup' && (
						<Card>
							<CardHeader>
								<CardTitle>Date de livraison</CardTitle>
								<CardDescription>
									Choisissez quand vous souhaitez être livré
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col space-y-4">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={`w-full justify-start text-left font-normal ${
													!deliveryDate && 'text-muted-foreground'
												}`}>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{deliveryDate ? (
													format(
														deliveryDate,
														'EEEE d MMMM yyyy',
														{
															locale: fr,
														},
													)
												) : (
													<span>Choisir une date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={deliveryDate}
												onSelect={setDeliveryDate}
												initialFocus
												disabled={date => {
													// Désactiver les dates passées et le dimanche
													return (
														date < new Date() ||
														date.getDay() === 0
													);
												}}
											/>
										</PopoverContent>
									</Popover>
								</div>
							</CardContent>
						</Card>
					)}

					<Card>
						<CardHeader>
							<CardTitle>Option cadeau</CardTitle>
							<CardDescription>
								Offrez un emballage cadeau pour votre commande
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center space-x-3 rounded-lg border p-4">
								<Checkbox
									id="gift"
									checked={giftOption}
									onCheckedChange={checked => setGiftOption(!!checked)}
								/>
								<Label
									htmlFor="gift"
									className="flex flex-1 cursor-pointer items-center justify-between">
									<div className="flex items-center space-x-3">
										<Gift className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium">Emballage cadeau</p>
											<p className="text-sm text-muted-foreground">
												Avec carte personnalisée
											</p>
										</div>
									</div>
									<span className="font-medium">3,50€</span>
								</Label>
							</div>
							{giftOption && (
								<div className="mt-4">
									<Label htmlFor="giftMessage">
										Message personnalisé
									</Label>
									<Textarea
										id="giftMessage"
										placeholder="Écrivez votre message ici..."
										value={giftMessage}
										onChange={e => setGiftMessage(e.target.value)}
										className="mt-2"
									/>
								</div>
							)}
						</CardContent>
					</Card>
					<div className="flex justify-between">
						<Button onClick={previousStep} variant={'outline'}>
							Retour au récapitulatif du panier
						</Button>
						<Button onClick={nextStep} variant={'default'}>
							Continuer vers le paiement
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

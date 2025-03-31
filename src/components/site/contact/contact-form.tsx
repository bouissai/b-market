'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContactStore } from '@/store/useContactStore';

// Schéma de validation avec Zod
const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
	email: z.string().email({ message: 'Email invalide' }),
	phone: z.string().min(8, { message: 'Numéro de téléphone invalide' }),
	subject: z
		.string()
		.min(2, { message: 'Le sujet doit contenir au moins 2 caractères' }),
	message: z.string().min(10, {
		message: 'Votre message doit contenir au moins 10 caractères',
	}),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const { sendContact } = useContactStore();

	// Initialisation du formulaire avec react-hook-form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			subject: '',
			message: '',
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);

		try {
			const { success, message } = await sendContact(data);

			if (!success) {
				throw new Error(
					message || "Erreur lors de l'envoi du formulaire",
				);
			} else {
				// Affichage du toast de succès
				toast({
					title: 'Message envoyé!',
					description: message,
					variant: 'default',
				});
			}

			// Réinitialisation du formulaire
			form.reset();
		} catch (error) {
			console.error('Erreur:', error);
			toast({
				title: 'Erreur',
				description:
					error instanceof Error
						? error.message
						: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 bg-background p-6 rounded-lg shadow-sm border"
			>
				<h3 className="text-xl font-semibold mb-4">Nous contactez</h3>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel>Nom complet</FormLabel>
								<FormControl>
									<Input placeholder="Votre nom" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="votre@email.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel>Téléphone</FormLabel>
								<FormControl>
									<PhoneInput
										placeholder="01 23 45 67 89"
										international={false}
										defaultCountry="FR"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

				</div>

				<FormField
					control={form.control}
					name="subject"
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel>Sujet:</FormLabel>
							<FormControl>
								<Input
									placeholder="Décrivez l'objet de votre demande..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel>Votre message</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Décrivez vos besoins spécifiques, quantités, préférences..."
									className="min-h-[120px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
				</Button>

				<p className="text-xs text-muted-foreground text-center">
					Nous vous répondrons dans un délai de 48 heures ouvrables.
				</p>
			</form>
		</Form>
	);
}

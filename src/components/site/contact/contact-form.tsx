'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

import AnimatedButton from '@/components/ui/AnimatedButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { animations } from '@/lib/helpers/animation';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Schéma de validation avec Zod
const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
	email: z.string().email({ message: 'Email invalide' }),
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

	// Initialisation du formulaire avec react-hook-form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "Erreur lors de l'envoi du formulaire",
				);
			}

			// Affichage du toast de succès
			toast({
				title: 'Message envoyé!',
				description:
					'Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.',
				variant: 'default',
			});

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

	const formFields = [
		{ id: 'name', label: 'Nom', type: 'text' },
		{ id: 'email', label: 'Email', type: 'email' },
		{ id: 'subject', label: 'Sujet', type: 'text' },
	];

	return (
		<Card className="p-8">
			<motion.div variants={animations.formItem}>
				<h2 className="text-2xl font-bold mb-2">Envoyez-nous un message</h2>
				<p className="text-muted-foreground">
					Pour toute question ou autre qui n'ont pas pu être repondu dans
					la FAQ posez les nous ici.
				</p>
			</motion.div>

			<motion.div
				variants={animations.withDuration(animations.fadeIn, 1)}
				className="rounded-xl text-left mt-4">
				<Form {...form}>
					<motion.form
						variants={animations.formContainer}
						onSubmit={form.handleSubmit(onSubmit)}
						className="h-full">
						{formFields.map(field => (
							<FormField
								key={field.id}
								control={form.control}
								name={field.id as keyof FormValues}
								render={({ field: fieldProps }) => (
									<motion.div
										variants={animations.formItem}
										className="mb-6">
										<FormItem className="space-y-2">
											<FormLabel
												htmlFor={field.id}
												className="block mb-2">
												{field.label}
											</FormLabel>
											<FormControl>
												<Input
													id={field.id}
													type={field.type}
													className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
													{...fieldProps}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</motion.div>
								)}
							/>
						))}

						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<motion.div
									variants={animations.formItem}
									className="mb-6">
									<FormItem className="space-y-2">
										<FormLabel
											htmlFor="message"
											className="block mb-2">
											Message
										</FormLabel>
										<FormControl>
											<Textarea
												id="message"
												rows={5}
												className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</motion.div>
							)}
						/>

						<motion.div
							variants={animations.formItem}
							whileHover={animations.hover.scale}
							whileTap={animations.hover.tap}>
							<AnimatedButton
								type="submit"
								Icon={Send}
								className="w-full py-6 text-lg"
								disabled={isSubmitting}>
								{isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
							</AnimatedButton>
						</motion.div>
					</motion.form>
				</Form>
			</motion.div>
		</Card>
	);
}

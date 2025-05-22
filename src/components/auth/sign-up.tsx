'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { signUpSchema } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';

const SignUp = () => {
	const { toast } = useToast();
	const { signUp, error, isSubmitting, setError, successMessage } =
		useAuthStore();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			confirmEmail: '',
			password: '',
			confirmPassword: '',
			firstname: '',
			lastname: '',
			phone: '',
		},
	});

	const handleSubmitSignup = async (data: z.infer<typeof signUpSchema>) => {
		setError(null);

		try {
			const success = await signUp(data);

			if (success) {
				form.reset();
				// Ne pas rediriger immédiatement, l'utilisateur doit vérifier son email
			}
		} catch (error: any) {
			console.error('Registration Failed:', error);
		}
		// Vérifiez l'erreur après que tout soit terminé
		const currentError = useAuthStore.getState().error;
		if (currentError) {
			toast({
				variant: 'destructive',
				title: 'Inscription échouée',
				description: currentError,
			});
		}
	};

	return (
		<Card className="border shadow-sm">
			<CardHeader className="pb-4">
				<CardTitle className="text-xl">Inscription</CardTitle>
				<CardDescription>
					Créez un compte pour accéder à votre panier et vos commandes.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{successMessage && (
					<Alert className="mb-6 bg-green-50 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600" />
						<AlertDescription className="text-green-800">
							{successMessage}
						</AlertDescription>
					</Alert>
				)}

				{error && (
					<Alert className="mb-6 bg-red-50 border-red-200">
						<AlertCircle className="h-4 w-4 text-red-600" />
						<AlertDescription className="text-red-800">
							{error}
						</AlertDescription>
					</Alert>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmitSignup)}
						className="space-y-4">
						{/* Champs optionnels */}
						<div className="flex flex-row gap-4">
							<FormField
								control={form.control}
								name="firstname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prénom</FormLabel>
										<FormControl>
											<Input placeholder="Votre prénom" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom</FormLabel>
										<FormControl>
											<Input placeholder="Votre nom" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Téléphone (optionnel)</FormLabel>
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
						{/* Champs obligatoires */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Adresse email</FormLabel>
									<FormControl>
										<Input placeholder="hafid@gmail.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirmer l'adresse email</FormLabel>
									<FormControl>
										<Input placeholder="hafid@gmail.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mot de passe</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Minimum 8 caratères..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirmer le mot de passe</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Minimum 8 caratères..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full mt-2"
							disabled={isSubmitting || !!successMessage}>
							{isSubmitting ? 'Création en cours...' : "S'inscrire"}
						</Button>
					</form>
				</Form>
			</CardContent>
			{successMessage && (
				<CardFooter className="bg-gray-50 text-sm text-gray-600 p-4">
					<p>
						Un email de confirmation a été envoyé à l'adresse indiquée.
						Veuillez vérifier votre boîte de réception et cliquer sur le
						lien pour activer votre compte.
					</p>
				</CardFooter>
			)}
		</Card>
	);
};

export default SignUp;

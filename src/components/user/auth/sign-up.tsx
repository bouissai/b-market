'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
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
import { z } from 'zod';

const SignUp = ({ onSuccess }: { onSuccess: () => void }) => {
	const { toast } = useToast();
	const { signUp, error, isSubmitting, setError } = useAuthStore();


	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			confirmEmail: '',
			password: '',
			confirmPassword: '',
		},
	});
	const handleSubmitSignup = async (data: z.infer<typeof signUpSchema>) => {
		setError(null);

		console.log('data : ------------', data);

		try {
			const success = await signUp(data);

			if (success) {
				toast({
					title: 'Compte créé avec succès ! 🎉',
					description: 'Vous pouvez maintenant vous connecter.',
				});
				form.reset();
				onSuccess?.();
			} else if (error) {
				toast({
					variant: 'destructive',
					title: 'Inscription échouée',
					description: error,
				});
			}
		} catch (error: any) {
			console.error('Registration Failed:', error);
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Inscription</CardTitle>
				<CardDescription>
					Créez un compte pour accéder à votre panier et vos commandes.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(data => {
							handleSubmitSignup(data);
						})}
						className="space-y-8 box-border px-1">
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
						/>{' '}
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
						/>{' '}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mot de passe</FormLabel>
									<FormControl>
										<Input
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
											placeholder="Minimum 8 caratères..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? 'Création en cours...' : "S'inscrire"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SignUp;

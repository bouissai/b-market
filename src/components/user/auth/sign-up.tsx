'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, signUpSchema } from '@/types/user';

const SignUp = () => {
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			confirmEmail: '',
			password: '',
			confirmPassword: '',
		},
	});
	const handleSubmitSignup = async (data: z.infer<typeof signInSchema>) => {
		console.log('data : ------------', data);

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			// Process response here
			console.log('Registration Successful', response);
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
						<Button type="submit" className="w-full">
							S'inscrire
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SignUp;

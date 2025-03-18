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

const signInSchema = z
	.object({
		email: z.string().email({
			message: "L'adresse email est pas valide.",
		}),
		confirmEmail: z.string().email({}),
		password: z.string().min(8, {
			message: 'Le mot de passe doit faire 8 caractères minimum.',
		}),
		confirmPassword: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.email !== data.confirmEmail) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Les adresses email ne correspondent pas.',
				path: ['confirmEmail'],
			});
		}
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Les mots de passe ne correspondent pas.',
				path: ['confirmPassword'],
			});
		}
	});

const SignUp = () => {
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			confirmEmail: '',
			password: '',
			confirmPassword: '',
		},
	});
	const handleSubmit = (data: z.infer<typeof signInSchema>) => {
		console.log('sign-up');
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
						onSubmit={form.handleSubmit(handleSubmit)}
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

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

const signInSchema = z.object({
	email: z.string().email({
		message: "L'adresse email est pas valide.",
	}),
	password: z.string().min(8, {
		message: 'Le mot de passe doit faire 8 caractères minimum.',
	}),
});

const SignIn = () => {
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const handleSubmit = (data: z.infer<typeof signInSchema>) => {
		console.log('sign-in');
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Connexion</CardTitle>
				<CardDescription>
					Connectez vous à votre compte pour accéder à votre panier et vos
					commandes.
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mot de passe</FormLabel>
									<FormControl>
										<Input placeholder="shadcn" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Se connecter
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SignIn;

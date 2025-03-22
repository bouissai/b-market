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
import { signInSchema } from '@/types/user';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // Add this import
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
    const router = useRouter();
    const [authError, setAuthError] = useState(''); // Add state for error message
    const { toast } = useToast();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    
    
    const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
        try {
            setAuthError(''); // Clear previous errors
            
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                // Set user-friendly error message
                setAuthError('Adresse email ou mot de passe incorrect');
                let errorMessage = 'Erreur inconnue.';
                if (result.error === 'USER_NOT_FOUND') {
                    errorMessage = "Aucun compte trouvé avec cet email.";
                } else if (result.error === 'INVALID_PASSWORD') {
                    errorMessage = "Mot de passe incorrect.";
                }
                toast({
                    variant: 'destructive',
                    title: 'Connexion échouée',
                    description: errorMessage,
                });
                return;
            }

            if (result?.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            setAuthError('Une erreur est survenue lors de la connexion');
            console.error('Sign in error:', error);
        }
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
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Display authentication error */}
                        {authError && (
                            <div className="text-destructive text-sm font-medium">
                                {authError}
                            </div>
                        )}
                        
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
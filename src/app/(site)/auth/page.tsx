'use client';
//
// import React from 'react';
// import {
// 	Card,
// 	CardContent,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from '@/components/ui/card';
//
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
//
// const SignIn = () => {
// 	const formSchema = z.object({
// 		email: z.string().email(),
// 		password: z.string().min(8, {
// 			message: 'Password must be at least 8 characters.',
// 		}),
// 	});
//
// 	const form = useForm<z.infer<typeof formSchema>>({
// 		resolver: zodResolver(formSchema),
// 	});
//
// 	const handleOnSubmit = (data: z.infer<typeof formSchema>) => {
// 		console.log(data);
// 	};
//
// 	return (
// 		<div className="flex justify-center items-center h-[calc(100vh-249px-80px)]">
// 			<Card className="w-96">
// 				<CardHeader>
// 					<CardTitle>Connexion</CardTitle>
// 				</CardHeader>
// 				<CardContent>
// 					<Form {...form}>
// 						<form
// 							onSubmit={form.handleSubmit(handleOnSubmit)}
// 							className="space-y-8 box-border px-1">
// 							<FormField
// 								control={form.control}
// 								name="email"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Username</FormLabel>
// 										<FormControl>
// 											<Input placeholder="shadcn" {...field} />
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>{' '}
// 							<FormField
// 								control={form.control}
// 								name="password"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Username</FormLabel>
// 										<FormControl>
// 											<Input placeholder="shadcn" {...field} />
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>
// 							<Button type="submit">Submit</Button>
// 						</form>
// 					</Form>
// 				</CardContent>
// 				<CardFooter>Pas de compte</CardFooter>
// 			</Card>
// 		</div>
// 	);
// };
//
// export default SignIn;

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignIn from '@/components/user/auth/sign-in';
import SignUp from '@/components/user/auth/sign-up';

const Auth = () => {
	return (
		<div className="flex justify-center items-center h-[calc(100vh-249px-80px)]">
			<Tabs defaultValue="sign-in" className=" w-[400px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="sign-in">Connexion</TabsTrigger>
					<TabsTrigger value="sign-up">Inscription</TabsTrigger>
				</TabsList>
				<TabsContent value="sign-in">
					<SignIn />
				</TabsContent>
				<TabsContent value="sign-up">
					<SignUp />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Auth;

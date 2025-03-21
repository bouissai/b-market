'use client';

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

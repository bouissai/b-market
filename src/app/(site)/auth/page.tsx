'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignIn from '@/components/auth/sign-in';
import SignUp from '@/components/auth/sign-up';
import { useAuthStore } from '@/store/useAuthStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Auth = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [tab, setTab] = useState('sign-in');
	const { setError } = useAuthStore();

	useEffect(() => {
		if (session) {
			router.replace('/');
		}
	}, [session, router]);

	return (
		<div className="flex justify-center items-center py-24 min-h-[50vh]">
			<Tabs
				value={tab}
				onValueChange={newTab => {
					setError(null);
					setTab(newTab);
				}}
				defaultValue="sign-in"
				className="w-full max-w-[400px] mx-auto">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="sign-in">Connexion</TabsTrigger>
					<TabsTrigger value="sign-up">Inscription</TabsTrigger>
				</TabsList>
				<TabsContent value="sign-in">
					<SignIn />
				</TabsContent>
				<TabsContent value="sign-up">
					<SignUp onSuccess={() => setTab('sign-in')} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Auth;

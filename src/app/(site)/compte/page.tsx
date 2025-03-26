'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import InfosPersonnelles from '@/components/user/compte/InfosPersonnelles';
import Commandes from '@/components/user/compte/commandes';
import { Loading } from '@/components/loading';

export default function MonComptePage() {
	const { status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();

	const activeTab =
		searchParams.get('tab') === 'infos' ? 'infos' : 'commandes';

	if (status === 'loading') {
		return <Loading />;
	}

	if (status === 'unauthenticated') {
		router.push('/commander');
		return null;
	}

	return (
		<div className="flex min-h-screen p-4 flex-col items-center justify-start">
			<main className="flex-1 py-8">
				{activeTab === 'commandes' ? <Commandes /> : <InfosPersonnelles />}
			</main>
		</div>
	);
}

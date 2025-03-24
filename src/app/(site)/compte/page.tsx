'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import InfosPersonnelles from '@/components/user/compte/InfosPersonnelles';
import Commandes from '@/components/user/compte/commandes';

export default function MonComptePage() {
	const { status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();

	const activeTab =
		searchParams.get('tab') === 'infos' ? 'infos' : 'commandes';

	if (status === 'loading') {
		return (
			<div className="flex min-h-screen flex-col">
				<main className="flex-1 container py-12">
					<div className="flex items-center justify-center h-[60vh]">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
							<p className="mt-4 text-muted-foreground">Chargement...</p>
						</div>
					</div>
				</main>
			</div>
		);
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

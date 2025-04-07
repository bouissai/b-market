'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PersonnalInformations from '@/components/site/compte/personnal-informations';
import Commandes from '@/components/site/compte/commandes';
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
			<main className="flex-1 py-8   pt-24">
				{activeTab === 'commandes' ? (
					<Commandes />
				) : (
					<PersonnalInformations />
				)}
			</main>
		</div>
	);
}

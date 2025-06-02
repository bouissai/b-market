'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';
import { Suspense } from 'react';
import { Commandes } from '@/components/site/compte/commandes';

export default function OrderHistoryPage() {
	const { status } = useSession();
	const router = useRouter();

	if (status === 'loading') {
		return <Loading />;
	}

	if (status === 'unauthenticated') {
		router.push('/commander');
		return null;
	}

	return (
		<div className="flex min-h-screen p-4 flex-col items-center justify-start">
			<div className="flex-1 py-8 ">
				<Suspense fallback={<Loading />}>
					<Commandes />
				</Suspense>
			</div>
		</div>
	);
}

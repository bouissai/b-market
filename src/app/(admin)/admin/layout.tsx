'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminNavBar } from '@/components/admin/adminNavBar/adminNavBar';
import { ThemeProvider } from '@/components/theme-provider';
import { Loading } from '@/components/loading';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		setMounted(true);

		if (status === 'loading') return;
		if (!session) {
			router.push('/auth/signin');
		} else if (!session.user?.isAdmin) {
			router.push('/');
		}
	}, [session, status, router]);

	if (!mounted || status === 'loading') {
		return <Loading />;
	}

	if (!session?.user?.isAdmin) {
		return null;
	}

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange>
			<AdminNavBar>{children}</AdminNavBar>
		</ThemeProvider>
	);
}

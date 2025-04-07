'use client';

import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr">
			<body>
				<Toaster />
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}

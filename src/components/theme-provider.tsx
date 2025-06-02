'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
	children,
	forcedTheme,
}: {
	children: React.ReactNode;
	forcedTheme?: 'light' | 'dark';
}) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			forcedTheme={forcedTheme}>
			{children}
		</NextThemesProvider>
	);
}

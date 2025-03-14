'use client';

import { useEffect, useState } from 'react';
import { AdminNavBar } from '@/components/admin/adminNavBar/adminNavBar';
import { ThemeProvider } from '@/components/theme-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Empêche le rendu SSR jusqu'à ce que le client soit monté
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si non monté, éviter d'afficher du contenu problématique
  if (!mounted) return <div />;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AdminNavBar>{children}</AdminNavBar>
    </ThemeProvider>
  );
}

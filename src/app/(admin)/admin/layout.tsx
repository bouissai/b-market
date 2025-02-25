import "@/app/globals.css";
import { AdminNavBar } from "@/components/admin/adminNavBar/adminNavBar";
import { ThemeProvider } from "@/components/theme-provider";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AdminNavBar>{children}</AdminNavBar>
                </ThemeProvider>
            </body>
        </html>
    );
}

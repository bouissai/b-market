import "@/app/globals.css";
import { UserNavBar } from "@/components/user/userNavBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head />
            <body>
                <UserNavBar>
                    {children}
                </UserNavBar>

            </body>
        </html>
    );
}

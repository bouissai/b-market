import { FooterUser } from "@/components/user/footerUser";
import { HeaderUser } from "@/components/user/headerUser";
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
                <UserNavBar/>

            </body>
        </html>
    );
}

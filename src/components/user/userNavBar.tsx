import { Toaster } from "../ui/toaster";
import { FooterUser } from "./footer/footerUser";
import { HeaderUser } from "./header/headerUser";

export function UserNavBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <HeaderUser />
            <main>{children}</main>
            <Toaster />
            <FooterUser />
        </div>
    );
}
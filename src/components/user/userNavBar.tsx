import { FooterUser } from "./footerUser";
import { HeaderUser } from "./header/headerUser";

export function UserNavBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <HeaderUser />
            <main>
                {children}
            </main>
            <FooterUser />
        </div>
    );
}
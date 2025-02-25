import { AppSidebar } from "@/components/admin/adminNavBar/nav/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export function AdminNavBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header>
                    <SidebarTrigger />
                    <ModeToggle />
                </header>
                <main>{children}</main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
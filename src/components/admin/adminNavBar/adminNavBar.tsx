import { AppSidebar } from "@/components/admin/adminNavBar/nav/app-sidebar";
import { AdminBreadcrumb } from "@/components/breadcrumbs";
import { ModeToggle } from "@/components/mode-toogle";
import { Separator } from "@/components/ui/separator";
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
                <header className="flex px-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <SidebarTrigger className="-ml-1" />
                        <ModeToggle />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <AdminBreadcrumb />
                </header>
                <main>{children}</main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
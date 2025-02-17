import "./globals.css";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/nav/app-sidebar";
import {ThemeProvider} from "@/components/theme-provider";
import {ModeToggle} from "@/components/mode-toogle";
import {Toaster} from "@/components/ui/toaster";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head/>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <header>
                        <SidebarTrigger/>
                        <ModeToggle/>
                    </header>
                    <main>{children}</main>
                    <Toaster/>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

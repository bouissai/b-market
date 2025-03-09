'use client';
import { AdminBreadcrumb } from '@/components/breadcrumbs';
import { ModeToggle } from '@/components/mode-toogle';
import { AppSidebar } from '@/components/nav/app-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* 🏆 Titre SEO optimisé */}
        <title>Boucherie Halal Grenoble - Viandes Fraîches & Qualité | BMarket</title>
        
        {/* 📌 Meta description pour le SEO */}
        <meta
          name="description"
          content="Découvrez BMarket, votre boucherie halal à Grenoble. Viandes fraîches, certifiées et de qualité. Commandez en ligne et récupérez en magasin !"
        />

        {/* 🔑 Mots-clés SEO */}
        <meta
          name="keywords"
          content="boucherie halal Grenoble, viande halal Grenoble, boucherie Fontaine, boucherie Saint martin d heres, boucherie Meylan, halal Grenoble, viande de qualité"
        />

        {/* 📍 SEO Local pour Google */}
        <meta name="geo.region" content="FR-38" />
        <meta name="geo.placename" content="Grenoble" />
        <meta name="geo.position" content="45.187560;5.735781" />
        <meta name="ICBM" content="45.187560, 5.735781" />

        {/* 📢 Open Graph (SEO pour Facebook) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Boucherie Halal Grenoble - Viandes Fraîches & Qualité | BMarket" />
        <meta
          property="og:description"
          content="Votre boucherie halal de référence à Grenoble. Viandes fraîches, certifiées, et click-and-collect disponible !"
        />
        <meta property="og:url" content="https://www.bmarket-grenoble.fr" />
        <meta property="og:image" content="https://www.bmarket-grenoble.fr/images/viande-halal.jpg" />
        <meta property="og:site_name" content="BMarket - Boucherie Halal Grenoble" />

        {/* 🐦 Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Boucherie Halal Grenoble - Viandes Fraîches & Qualité | BMarket" />
        <meta name="twitter:description" content="Trouvez la meilleure viande halal à Grenoble chez BMarket. Qualité supérieure et service rapide !" />
        <meta name="twitter:image" content="https://www.bmarket-grenoble.fr/images/viande-halal.jpg" />
        <meta name="twitter:site" content="@BMarketGrenoble" />

        {/* 🔍 Schema.org JSON-LD (SEO Avancé) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ButcherShop",
            "name": "BMarket - Boucherie Halal Grenoble",
            "image": "https://www.bmarket-grenoble.fr/images/viande-halal.jpg",
            "description": "Boucherie halal à Grenoble proposant des viandes fraîches et certifiées. Commandez en ligne et récupérez en magasin.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "39 Av. du Vercors",
              "addressLocality": "Fontaine",
              "postalCode": "38600",
              "addressCountry": "FR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "45.187560",
              "longitude": "5.735781"
            },
            "url": "https://www.bmarket-grenoble.fr",
            "telephone": "+33 4 76 00 00 00",
            "openingHours": "Mo-Sa 09:00-19:00"
          })}
        </script>
      </head>
      
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <ModeToggle />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <AdminBreadcrumb />
                </div>
              </header>
              <main>{children}</main>
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

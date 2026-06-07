import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/shared/auth/auth-provider";
import { NotificationProvider } from "@/src/shared/ui/Notifications";
import { UnreadProvider } from "@/src/entities/chat";
import { MeProvider } from "@/src/entities/user";
import { JsonLd } from "@/src/shared/ui/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const SITE_NAME = "LOS Daily";
const SITE_DESCRIPTION =
  "Доска объявлений Республики Абхазия. Купить, продать, обменять — быстро и без посредников.";
const SITE_ORIGIN = new URL(process.env.NEXT_PUBLIC_API_BASE_URL!).origin;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${SITE_NAME} — Доска объявлений Республики Абхазия`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Доска объявлений Республики Абхазия`,
    description: SITE_DESCRIPTION,
    locale: "ru_RU",
    images: [
      {
        url: "/los.jpg",
        alt: "Land of Soul Abkhazia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Доска объявлений Республики Абхазия`,
    description: SITE_DESCRIPTION,
    images: ["/los.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/los.jpg", type: "image/jpeg" },
    ],
    apple: { url: "/los.jpg", type: "image/jpeg" },
    shortcut: "/favicon.ico",
  },
};

export async function generateViewport(): Promise<Viewport> {
  const cookieStore = await cookies();
  const isDesktop = cookieStore.get("view-mode")?.value === "desktop";
  return isDesktop
    ? {
        width: 1440,
        initialScale: 0.3,
        maximumScale: 5,
        userScalable: true,
      }
    : {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
      };
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_ORIGIN,
  description: SITE_DESCRIPTION,
  inLanguage: "ru",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_ORIGIN}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/los.jpg`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={inter.variable}
      style={{ height: "100%" }}
    >
      <body>
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <NotificationProvider>
          <AuthProvider>
            <MeProvider>
              <UnreadProvider>{children}</UnreadProvider>
            </MeProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

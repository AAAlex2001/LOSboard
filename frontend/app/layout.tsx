import type { Metadata } from "next";
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

const SITE_NAME = "LOSboard";
const SITE_DESCRIPTION =
  "Доска объявлений Республики Абхазия. Купить, продать, обменять — быстро и без посредников.";

function getSiteUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (api) {
    try {
      return new URL(api).origin;
    } catch {
      return "http://localhost:3000";
    }
  }
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
};

const siteUrl = getSiteUrl();

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: siteUrl,
  description: SITE_DESCRIPTION,
  inLanguage: "ru",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: siteUrl,
  logo: `${siteUrl}/los.jpg`,
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

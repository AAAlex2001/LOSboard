import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/shared/auth/auth-provider";
import { NotificationProvider } from "@/src/shared/ui/Notifications";
import { UnreadProvider } from "@/src/entities/chat";
import { MeProvider } from "@/src/entities/user";
import { ViewportModeToggle } from "@/src/shared/ui/ViewportModeToggle";
import Script from "next/script";

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
      // fallthrough
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      style={{ height: "100%" }}
    >
      <body>
        <Script
          id="viewport-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var storageKey = "losboard.viewport-mode";
  var mobileViewport = "width=device-width, initial-scale=1, viewport-fit=cover";
  var desktopViewport = "width=1440, initial-scale=1, viewport-fit=cover";
  var savedMode = null;
  try {
    savedMode = window.localStorage.getItem(storageKey);
  } catch (error) {}
  var mode = savedMode === "mobile" || savedMode === "desktop"
    ? savedMode
    : (window.screen.width < 850 ? "desktop" : "mobile");
  var meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", mode === "desktop" ? desktopViewport : mobileViewport);
  document.documentElement.dataset.viewportMode = mode;
})();
            `.trim(),
          }}
        />
        <NotificationProvider>
          <AuthProvider>
            <MeProvider>
              <UnreadProvider>
                {children}
                <ViewportModeToggle />
              </UnreadProvider>
            </MeProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

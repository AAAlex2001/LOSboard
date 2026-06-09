import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Запрошенная страница не найдена на LOS Daily.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#F9F9FB",
      }}
    >
      <Header />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          textAlign: "center",
          gap: 20,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 32,
            color: "#1E1E1E",
          }}
        >
          Страница не найдена
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 16,
            color: "#6c757d",
            maxWidth: 480,
          }}
        >
          Возможно, объявление было снято или адрес введён неправильно. Вернитесь
          на главную и найдите то, что искали.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 28px",
            background: "#1129BD",
            color: "#FFFFFF",
            borderRadius: 10,
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          На главную
        </Link>
      </div>
      <Footer />
    </main>
  );
}

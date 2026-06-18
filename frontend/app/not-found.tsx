import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Button } from "@/src/shared/ui/Button";

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
        <Link href="/">
          <Button text="На главную" color="blue" variant="filled" />
        </Link>
      </div>
      <Footer />
    </main>
  );
}

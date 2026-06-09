"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#F9F9FB",
          margin: 0,
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          textAlign: "center",
          gap: 20,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 32,
            color: "#1E1E1E",
          }}
        >
          Что-то пошло не так
        </h1>
        <p
          style={{
            margin: 0,
            fontWeight: 400,
            fontSize: 16,
            color: "#6c757d",
            maxWidth: 480,
          }}
        >
          Произошла ошибка на сервере. Попробуйте обновить страницу или вернитесь
          на главную.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "12px 28px",
              background: "#1129BD",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Попробовать ещё раз
          </button>
          <Link
            href="/"
            style={{
              padding: "12px 28px",
              background: "#FFFFFF",
              color: "#1129BD",
              border: "1px solid #1129BD",
              borderRadius: 10,
              fontWeight: 500,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            На главную
          </Link>
        </div>
      </body>
    </html>
  );
}

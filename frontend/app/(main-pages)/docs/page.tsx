"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { DocsList } from "@/src/widgets/docs/docs-list";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import style from "./page.module.scss";

export default function DocsPage() {
  const router = useRouter();

  return (
    <main className={style.page}>
      <Header />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.crumbsSlot}>
            <Breadcrumbs
              items={[
                { label: "Главная", href: "/" },
                { label: "Документы сайта" },
              ]}
            />
          </div>

          <div className={style.headingRow}>
            <button
              type="button"
              className={style.backBtn}
              onClick={() => router.back()}
              aria-label="Назад"
            >
              <ArrowLeftIcon />
            </button>
            <h1 className={style.title}>Документы сайта «LOS»</h1>
          </div>

          <DocsList />
        </div>
      </div>
      <Footer />
    </main>
  );
}

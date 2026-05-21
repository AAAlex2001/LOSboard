"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { DocContent } from "@/src/widgets/docs/doc-content";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import { DOCS } from "./data";
import style from "./page.module.scss";

export default function DocPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const doc = DOCS[params?.slug ?? ""];

  if (!doc) {
    notFound();
  }

  return (
    <main className={style.page}>
      <Header />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.crumbsSlot}>
            <Breadcrumbs
              items={[
                { label: "Главная", href: "/" },
                { label: "Документы сайта", href: "/docs" },
                { label: doc.breadcrumbLabel },
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
            <h1 className={style.title}>{doc.title}</h1>
          </div>

          <DocContent sections={doc.sections} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

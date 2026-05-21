"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { ContactsInfo } from "@/src/widgets/contacts/contacts-info";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import style from "./page.module.scss";

export default function ContactsPage() {
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
                { label: "Связаться с нами" },
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
            <h1 className={style.title}>Связаться с нами</h1>
          </div>

          <ContactsInfo />
        </div>
      </div>
      <Footer />
    </main>
  );
}

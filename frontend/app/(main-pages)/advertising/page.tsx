"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { PlansAccordion } from "@/src/widgets/advertising/plans-accordion";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import {
  ADVERTISING_INTRO,
  ADVERTISING_PAGE_TITLE,
  ADVERTISING_SECTIONS,
  ADVERTISING_TOP_BANNER,
} from "./data";
import style from "./page.module.scss";

export default function AdvertisingPage() {
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
                { label: "Размещение рекламы" },
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
            <h1 className={style.title}>{ADVERTISING_PAGE_TITLE}</h1>
          </div>

          <PlansAccordion
            sections={ADVERTISING_SECTIONS}
            intro={ADVERTISING_INTRO}
            topBanner={ADVERTISING_TOP_BANNER}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}

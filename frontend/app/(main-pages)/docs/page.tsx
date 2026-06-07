export const dynamic = "force-dynamic";

import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { BackButton } from "@/src/shared/ui/BackButton";
import { DocsList } from "@/src/widgets/docs/docs-list";
import { listContentPages } from "@/src/entities/content";
import style from "./page.module.scss";

export default async function DocsPage() {
  const items = (await listContentPages().catch(() => [])).filter(
    (item) => !item.slug.startsWith("pricing") && item.slug !== "contacts",
  );

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
            <BackButton className={style.backBtn} fallbackHref="/" />
            <h1 className={style.title}>Документы сайта «LOS»</h1>
          </div>

          <DocsList items={items} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

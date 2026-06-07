export const dynamic = "force-dynamic";

import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
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
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          { label: "Документы сайта" },
        ]}
      />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.headingRow}>
            <h1 className={style.title}>Документы сайта «LOS»</h1>
          </div>

          <DocsList items={items} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { CmsContent } from "@/src/widgets/docs/cms-content";
import { getContentPage } from "@/src/entities/content";
import style from "./page.module.scss";

export default async function ContactsPage() {
  const page = await getContentPage("contacts").catch(() => null);
  if (!page) {
    notFound();
  }

  return (
    <main className={style.page}>
      <Header />
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          { label: "Документы сайта", href: "/docs" },
          { label: page.title },
        ]}
      />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.headingRow}>
            <h1 className={style.title}>{page.title}</h1>
          </div>

          <CmsContent body={page.body} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { BackButton } from "@/src/shared/ui/BackButton";
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
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.crumbsSlot}>
            <Breadcrumbs
              items={[
                { label: "Главная", href: "/" },
                { label: page.title },
              ]}
            />
          </div>

          <div className={style.headingRow}>
            <BackButton className={style.backBtn} fallbackHref="/" />
            <h1 className={style.title}>{page.title}</h1>
          </div>

          <CmsContent body={page.body} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

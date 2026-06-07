import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { DocsList } from "@/src/widgets/docs/docs-list";
import type { ContentPageListItem } from "@/src/entities/content";
import style from "./style.module.scss";

interface DocsPageViewProps {
  items: ContentPageListItem[];
}

export const DocsPageView = ({ items }: DocsPageViewProps) => {
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
};

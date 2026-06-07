import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { CmsContent } from "@/src/widgets/docs/cms-content";
import style from "./style.module.scss";

interface DocDetailPageViewProps {
  title: string;
  body: string;
}

export const DocDetailPageView = ({ title, body }: DocDetailPageViewProps) => {
  return (
    <main className={style.page}>
      <Header />
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          { label: "Документы сайта", href: "/docs" },
          { label: title },
        ]}
      />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.headingRow}>
            <h1 className={style.title}>{title}</h1>
          </div>

          <CmsContent body={body} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

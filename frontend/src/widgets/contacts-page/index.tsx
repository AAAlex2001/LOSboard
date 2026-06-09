import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { CmsContent } from "@/src/widgets/docs/cms-content";
import style from "./style.module.scss";

interface ContactsPageViewProps {
  title: string;
  intro: string;
  dataBlock: string;
  hoursBlock: string;
}

export const ContactsPageView = ({
  title,
  intro,
  dataBlock,
  hoursBlock,
}: ContactsPageViewProps) => {
  return (
    <main className={style.page}>
      <Header />
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          { label: title },
        ]}
      />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.headingRow}>
            <h1 className={style.title}>{title}</h1>
          </div>

          {intro && <CmsContent body={intro} />}
          {dataBlock && <CmsContent body={dataBlock} />}
          {hoursBlock && <CmsContent body={hoursBlock} />}
        </div>
      </div>
      <Footer />
    </main>
  );
};

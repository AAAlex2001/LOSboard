import Link from "next/link";
import ChevronRightIcon from "@/src/shared/ui/Icons/ChevronRightIcon";
import type { ContentPageListItem } from "@/src/entities/content";
import style from "./style.module.scss";

interface DocsListProps {
  items: ContentPageListItem[];
}

export const DocsList = ({ items }: DocsListProps) => {
  if (items.length === 0) {
    return <p className={style.empty}>Пока нет опубликованных страниц</p>;
  }

  return (
    <div className={style.list}>
      {items.map((doc) => (
        <Link
          key={doc.slug}
          href={`/docs/${doc.slug}`}
          className={style.item}
        >
          <span className={style.label}>{doc.title}</span>
          <span className={style.arrow} aria-hidden="true">
            <ChevronRightIcon />
          </span>
        </Link>
      ))}
    </div>
  );
};

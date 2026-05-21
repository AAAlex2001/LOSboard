import Link from "next/link";
import ChevronRightIcon from "@/src/shared/ui/Icons/ChevronRightIcon";
import style from "./style.module.scss";

interface DocItem {
  href: string;
  label: string;
}

const DOCS: DocItem[] = [
  { href: "/docs/placement-rules", label: "Правила размещения объявлений" },
  { href: "/docs/privacy", label: "Политика конфиденциальности" },
  { href: "/docs/agreement", label: "Пользовательское соглашение" },
  { href: "/docs/prohibited", label: "Запрещённые товары и услуги" },
];

export const DocsList = () => {
  return (
    <div className={style.list}>
      {DOCS.map((doc) => (
        <Link key={doc.href} href={doc.href} className={style.item}>
          <span className={style.label}>{doc.label}</span>
          <span className={style.arrow} aria-hidden="true">
            <ChevronRightIcon />
          </span>
        </Link>
      ))}
    </div>
  );
};

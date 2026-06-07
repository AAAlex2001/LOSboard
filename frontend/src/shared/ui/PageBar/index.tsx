import { Breadcrumbs, type BreadcrumbItem } from "@/src/shared/ui/Breadcrumbs";
import style from "./style.module.scss";

interface CrumbsBarProps {
  items: BreadcrumbItem[];
}

export const CrumbsBar = ({ items }: CrumbsBarProps) => (
  <div className={style.crumbsBar}>
    <Breadcrumbs items={items} />
  </div>
);

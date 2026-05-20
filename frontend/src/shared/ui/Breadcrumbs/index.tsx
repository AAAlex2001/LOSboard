"use client";

import { Fragment } from "react";
import Link from "next/link";
import ChevronRightIcon from "@/src/shared/ui/Icons/ChevronRightIcon";
import style from "./style.module.scss";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  return (
    <nav
      className={`${style.breadcrumbs} ${className || ""}`.trim()}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={`${style.item} ${style.link}`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${style.item} ${isLast ? style.active : style.text}`}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <span className={style.separator} aria-hidden="true">
                <ChevronRightIcon />
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};

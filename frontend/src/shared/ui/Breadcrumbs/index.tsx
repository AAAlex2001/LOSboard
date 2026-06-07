"use client";

import { Fragment } from "react";
import Link from "next/link";
import ChevronRightIcon from "@/src/shared/ui/Icons/ChevronRightIcon";
import style from "./style.module.scss";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
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
        const isInteractive = !isLast && (item.href || item.onClick);

        let node;
        if (isInteractive && item.href) {
          node = (
            <Link
              href={item.href as string}
              className={`${style.item} ${style.link}`}
              onClick={item.onClick}
            >
              {item.label}
            </Link>
          );
        } else if (isInteractive && item.onClick) {
          node = (
            <button
              type="button"
              className={`${style.item} ${style.link} ${style.button}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          );
        } else {
          node = (
            <span
              className={`${style.item} ${isLast ? style.active : style.text}`}
            >
              {item.label}
            </span>
          );
        }

        return (
          <Fragment key={`${item.label}-${index}`}>
            {node}

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

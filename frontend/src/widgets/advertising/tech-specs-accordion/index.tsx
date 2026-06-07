"use client";

import style from "./style.module.scss";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface TechSpecsAccordionProps {
  heading: string;
  items: AccordionItem[];
}

export const TechSpecsAccordion = ({
  heading,
  items,
}: TechSpecsAccordionProps) => {
  return (
    <section className={style.section}>
      <h2 className={style.heading}>{heading}</h2>
      <div className={style.list}>
        {items.map((item, i) => (
          <details key={i} className={style.item}>
            <summary className={style.summary}>
              <span className={style.title}>{item.title}</span>
              <span className={style.arrow} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </summary>
            <div className={style.body}>{item.content}</div>
          </details>
        ))}
      </div>
    </section>
  );
};

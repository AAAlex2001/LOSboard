"use client";

import {
  AdPlanBanner,
  AdPricingCard,
  type AdPlanBlock,
  type AdPlanSection,
} from "@/src/entities/advertising-plan";
import style from "./style.module.scss";

interface PlansListProps {
  sections: AdPlanSection[];
  intro?: string;
  topBanner?: string;
}

export const PlansAccordion = ({
  sections,
  intro,
  topBanner,
}: PlansListProps) => {
  return (
    <div className={style.wrap}>
      {topBanner && <AdPlanBanner banner={{ text: topBanner }} />}
      {intro && <h2 className={style.intro}>{intro}</h2>}

      <div className={style.sections}>
        {sections.map((section) => (
          <section key={section.id} className={style.section}>
            <h3 className={style.sectionTitle}>
              <RichInline text={section.title} />
            </h3>
            <div className={style.sectionBody}>
              {section.blocks.map((block, idx) => (
                <BlockView key={idx} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const URL_REGEX = /(https?:\/\/[^\s)]+)/g;

const RichInline = ({ text }: { text: string }) => {
  const parts = text.split(URL_REGEX);
  return (
    <>
      {parts.map((part, idx) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noreferrer"
            className={style.link}
          >
            {part}
          </a>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
};

const BlockView = ({ block }: { block: AdPlanBlock }) => {
  if (block.kind === "banner") {
    return <AdPlanBanner banner={block.banner} />;
  }
  if (block.kind === "text") {
    return (
      <p className={style.text}>
        <RichInline text={block.text.text} />
      </p>
    );
  }
  if (block.kind === "ordered") {
    return (
      <ol className={style.ordered}>
        {block.items.map((item, idx) => (
          <li key={idx} className={style.orderedItem}>
            <RichInline text={item} />
          </li>
        ))}
      </ol>
    );
  }
  return (
    <div className={style.group}>
      {block.group.heading && (
        <h4 className={style.groupHeading}>{block.group.heading}</h4>
      )}
      <div className={style.cards} data-count={block.group.cards.length}>
        {block.group.cards.map((card, idx) => (
          <AdPricingCard key={idx} card={card} />
        ))}
      </div>
    </div>
  );
};

import style from "./style.module.scss";

export interface PricingCard {
  label: string;
  value: string;
  highlighted?: boolean;
}

interface PricingSectionProps {
  title: string;
  intro?: React.ReactNode;
  cards: PricingCard[];
  outroText?: React.ReactNode;
  children?: React.ReactNode;
}

export const PricingSection = ({
  title,
  intro,
  cards,
  outroText,
  children,
}: PricingSectionProps) => {
  return (
    <section className={style.section}>
      <h2 className={style.heading}>{title}</h2>
      {intro && <div className={style.intro}>{intro}</div>}
      {children}
      {cards.length > 0 && (
        <div className={style.grid}>
          {cards.map((card, i) => (
            <div
              key={i}
              className={`${style.card} ${card.highlighted ? style.cardHighlighted : ""}`}
            >
              <span className={style.cardLabel}>{card.label}</span>
              <span className={style.cardValue}>{card.value}</span>
            </div>
          ))}
        </div>
      )}
      {outroText && <div className={style.outro}>{outroText}</div>}
    </section>
  );
};

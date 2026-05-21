import type { AdPricingCard as AdPricingCardData } from "../../model/types";
import style from "./style.module.scss";

interface AdPricingCardProps {
  card: AdPricingCardData;
}

export const AdPricingCard = ({ card }: AdPricingCardProps) => {
  return (
    <div className={`${style.card} ${card.variant === "highlight" ? style.cardHighlight : ""}`}>
      <div className={style.titleRow}>
        <span className={style.title}>{card.title}</span>
      </div>
      <div className={style.bodyRow}>
        <span className={style.body}>{card.body}</span>
      </div>
    </div>
  );
};

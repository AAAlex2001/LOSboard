export interface AdPricingCard {
  title: string;
  body: string;
  variant: "default" | "highlight";
}

export interface AdPlanGroup {
  heading?: string;
  cards: AdPricingCard[];
}

export interface AdPlanRichText {
  text: string;
}

export interface AdPlanBanner {
  text: string;
}

export type AdPlanBlock =
  | { kind: "group"; group: AdPlanGroup }
  | { kind: "banner"; banner: AdPlanBanner }
  | { kind: "text"; text: AdPlanRichText }
  | { kind: "ordered"; items: string[] };

export interface AdPlanSection {
  id: string;
  title: string;
  blocks: AdPlanBlock[];
}

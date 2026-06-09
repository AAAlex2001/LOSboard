import type { ComponentType, ReactElement } from "react";
import TransportIcon from "./TransportIcon";
import RealtyIcon from "./RealtyIcon";
import JobsIcon from "./JobsIcon";
import PersonalIcon from "./PersonalIcon";
import HobbyIcon from "./HobbyIcon";
import AnimalsIcon from "./AnimalsIcon";
import BusinessIcon from "./BusinessIcon";
import ServicesIcon from "./ServicesIcon";
import ElectronicsIcon from "./ElectronicsIcon";
import HomeIcon from "./HomeIcon";
import PartsIcon from "./PartsIcon";
import BeautyIcon from "./BeautyIcon";
import UrgentIcon from "./UrgentIcon";

export type CategoryIconComponent = ComponentType<{ className?: string }>;

const CATEGORY_ICONS: Record<string, CategoryIconComponent> = {
  transport: TransportIcon,
  realty: RealtyIcon,
  jobs: JobsIcon,
  personal: PersonalIcon,
  hobby: HobbyIcon,
  animals: AnimalsIcon,
  business: BusinessIcon,
  services: ServicesIcon,
  electronics: ElectronicsIcon,
  home: HomeIcon,
  parts: PartsIcon,
  beauty: BeautyIcon,
  urgent: UrgentIcon,
};

export const getCategoryIcon = (slug: string): CategoryIconComponent | null =>
  CATEGORY_ICONS[slug] ?? null;

/** Готовый элемент иконки по slug: статически объявленные компоненты, чтобы тип не создавался в теле рендера потребителя. */
export const renderCategoryIcon = (
  slug: string,
  className?: string,
): ReactElement | null => {
  switch (slug) {
    case "transport":
      return <TransportIcon className={className} />;
    case "realty":
      return <RealtyIcon className={className} />;
    case "jobs":
      return <JobsIcon className={className} />;
    case "personal":
      return <PersonalIcon className={className} />;
    case "hobby":
      return <HobbyIcon className={className} />;
    case "animals":
      return <AnimalsIcon className={className} />;
    case "business":
      return <BusinessIcon className={className} />;
    case "services":
      return <ServicesIcon className={className} />;
    case "electronics":
      return <ElectronicsIcon className={className} />;
    case "home":
      return <HomeIcon className={className} />;
    case "parts":
      return <PartsIcon className={className} />;
    case "beauty":
      return <BeautyIcon className={className} />;
    case "urgent":
      return <UrgentIcon className={className} />;
    default:
      return null;
  }
};

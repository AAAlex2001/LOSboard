import type { ComponentType } from "react";
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

import {
  AirVentIcon,
  LaptopIcon,
  PlugZapIcon,
  RefrigeratorIcon,
  SmartphoneIcon,
  TvIcon,
  WashingMachineIcon,
  type LucideIcon,
} from "lucide-react";
import type { Cs_Category } from "@/lib/cs_constants";

// One icon per category, reused across pages
export const CS_CATEGORY_ICONS: Record<Cs_Category, LucideIcon> = {
  Smartphone: SmartphoneIcon,
  "Laptop & PC": LaptopIcon,
  AC: AirVentIcon,
  Refrigerator: RefrigeratorIcon,
  TV: TvIcon,
  "Washing Machine": WashingMachineIcon,
  Electrical: PlugZapIcon,
};

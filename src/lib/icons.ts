import {
  Car,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  Home,
  Plane,
  ShoppingBag,
  ShoppingBasket,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Category, CategoryIconKey } from "@/types";

export const categoryIcons: Record<CategoryIconKey, LucideIcon> = {
  home: Home,
  basket: ShoppingBasket,
  utensils: UtensilsCrossed,
  car: Car,
  zap: Zap,
  heart: HeartPulse,
  bag: ShoppingBag,
  film: Clapperboard,
  plane: Plane,
  graduation: GraduationCap,
};

/** CSS color string for a category (uses the active theme's token). */
export const categoryColor = (category: Pick<Category, "colorKey">): string =>
  `rgb(var(--${category.colorKey}))`;

import type { Category } from "@/types";
import { categoryColor, categoryIcons } from "@/lib/icons";

export function CategoryBadge({ category }: { category: Category }) {
  const Icon = categoryIcons[category.icon];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-2.5 py-1 text-xs font-medium text-ink">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColor(category) }} aria-hidden="true" />
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {category.name}
    </span>
  );
}

export function CategoryIconTile({ category, size = "md" }: { category: Category; size?: "md" | "lg" }) {
  const Icon = categoryIcons[category.icon];
  const dim = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center rounded-md`}
      style={{ backgroundColor: `rgb(var(--${category.colorKey}) / 0.18)`, color: "rgb(var(--ink))" }}
      aria-hidden="true"
    >
      <Icon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
    </span>
  );
}

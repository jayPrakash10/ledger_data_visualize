import { Star } from "lucide-react";
import type { Category } from "@/types";
import { cn } from "@/lib/cn";
import { categoryColor } from "@/lib/icons";

interface CategoryFilterProps {
  categories: Category[];
  selectedIds: string[];
  pinnedIds?: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const chip =
  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors duration-150";

/** Multi-select category chips. Pinned categories are listed first. */
export function CategoryFilter({ categories, selectedIds, pinnedIds = [], onToggle, onClear }: CategoryFilterProps) {
  const ordered = [...categories].sort(
    (a, b) => Number(pinnedIds.includes(b.id)) - Number(pinnedIds.includes(a.id)),
  );
  const allActive = selectedIds.length === 0;

  return (
    <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <button
        type="button"
        onClick={onClear}
        aria-pressed={allActive}
        className={cn(chip, allActive ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface hover:bg-subtle")}
      >
        All categories
      </button>
      {ordered.map((c) => {
        const active = selectedIds.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onToggle(c.id)}
            aria-pressed={active}
            className={cn(chip, active ? "border-primary bg-primary-soft text-ink" : "border-line bg-surface hover:bg-subtle")}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColor(c) }} aria-hidden="true" />
            {c.name}
            {pinnedIds.includes(c.id) && <Star className="h-3.5 w-3.5 fill-current" aria-label="Pinned" />}
          </button>
        );
      })}
    </div>
  );
}

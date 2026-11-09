import { useId, type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

const control =
  "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted transition-colors duration-150 hover:border-muted/60";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  hideLabel?: boolean;
}

export function Select({ label, options, onValueChange, hideLabel, className, ...rest }: SelectProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className={cn("mb-1 block text-xs font-medium text-muted", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        <select id={id} className={cn(control, "appearance-none pr-9")} onChange={(e) => onValueChange(e.target.value)} {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
    </div>
  );
}

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  onValueChange: (value: string) => void;
  trailing?: ReactNode;
}

export function SearchInput({ label, onValueChange, className, ...rest }: SearchInputProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input id={id} type="search" className={cn(control, "pl-9")} onChange={(e) => onValueChange(e.target.value)} {...rest} />
      </div>
    </div>
  );
}

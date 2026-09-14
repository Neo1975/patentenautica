import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  selected: string[];
  onToggle: (id: string) => void;
  availableCounts: Record<string, number>;
};

export default function CategoryPicker({ categories, selected, onToggle, availableCounts }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {categories.map((cat) => {
        const isSelected = selected.includes(cat.id);
        const count = availableCounts[cat.id] ?? 0;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onToggle(cat.id)}
            aria-pressed={isSelected}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
              isSelected
                ? "border-sky-600 bg-sky-50 text-sky-900 ring-1 ring-sky-600 dark:bg-sky-950 dark:text-sky-200"
                : "border-slate-200 hover:border-sky-400 hover:bg-sky-50 dark:border-slate-700 dark:hover:border-sky-600 dark:hover:bg-slate-800"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  isSelected ? "border-sky-600 bg-sky-600 text-white" : "border-slate-400"
                }`}
              >
                {isSelected && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                    <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </span>
              <span className="font-medium">{cat.shortLabel}</span>
            </span>
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {count} domande
            </span>
          </button>
        );
      })}
    </div>
  );
}

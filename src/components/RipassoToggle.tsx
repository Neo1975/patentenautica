"use client";

import { ripassoKey, useRipasso, type RipassoKind } from "@/lib/ripasso";

type Props = {
  id: string | number;
  kind?: RipassoKind;
  className?: string;
};

/** Segnalibro: aggiunge o toglie la domanda dal basket "da ripassare". */
export default function RipassoToggle({ id, kind = "q", className = "" }: Props) {
  const { has, toggle } = useRipasso();
  const key = ripassoKey(kind, id);
  const marked = has(key);

  return (
    <button
      type="button"
      onClick={() => toggle(key)}
      aria-pressed={marked}
      title={marked ? "Togli dal ripasso" : "Segna da ripassare"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
        marked
          ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-200"
          : "border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-amber-300"
      } ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill={marked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M6 3h12v18l-6-4-6 4z" strokeLinejoin="round" />
      </svg>
      {marked ? "Da ripassare" : "Segna"}
    </button>
  );
}

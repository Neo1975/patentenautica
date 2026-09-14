"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizConfig } from "@/lib/types";
import { buildCustomQuiz, countAvailable } from "@/lib/questions";
import { getCategories } from "@/lib/categories";
import CategoryPicker from "@/components/CategoryPicker";
import QuizRunner from "@/components/QuizRunner";

export default function AllenamentoPage() {
  const router = useRouter();
  const categories = getCategories();
  const [selected, setSelected] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [config, setConfig] = useState<QuizConfig | null>(null);

  const availableCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of categories) map[c.id] = countAvailable([c.id]);
    return map;
  }, [categories]);

  const availableForSelection = countAvailable(selected);
  const maxCount = Math.max(availableForSelection, 1);

  const toggleCategory = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const selectAll = () => setSelected(categories.map((c) => c.id));
  const clearAll = () => setSelected([]);

  const canStart = selected.length > 0 && count > 0 && availableForSelection > 0;

  if (config) {
    return <QuizRunner config={config} onExit={() => setConfig(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Allenamento per argomento
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Scegli uno o più argomenti e quante domande vuoi affrontare. Nessun limite di tempo né
          soglia di errore: è solo allenamento.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-slate-50">Argomenti</h2>
          <div className="flex gap-3 text-xs font-medium text-sky-600">
            <button type="button" onClick={selectAll} className="hover:underline">
              Seleziona tutti
            </button>
            <button type="button" onClick={clearAll} className="hover:underline">
              Deseleziona tutti
            </button>
          </div>
        </div>
        <CategoryPicker
          categories={categories}
          selected={selected}
          onToggle={toggleCategory}
          availableCounts={availableCounts}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <label htmlFor="count" className="mb-2 block font-semibold text-slate-900 dark:text-slate-50">
          Numero di domande
        </label>
        <div className="flex items-center gap-4">
          <input
            id="count"
            type="range"
            min={1}
            max={maxCount}
            value={Math.min(count, maxCount)}
            onChange={(e) => setCount(Number(e.target.value))}
            disabled={selected.length === 0}
            className="w-full accent-sky-600"
          />
          <input
            type="number"
            min={1}
            max={maxCount}
            value={Math.min(count, maxCount)}
            onChange={(e) => setCount(Math.max(1, Math.min(maxCount, Number(e.target.value) || 1)))}
            disabled={selected.length === 0}
            className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {selected.length === 0
            ? "Seleziona almeno un argomento per continuare."
            : `${availableForSelection} domande disponibili per gli argomenti selezionati.`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setConfig(buildCustomQuiz(selected, Math.min(count, maxCount)))}
          disabled={!canStart}
          className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Inizia l&apos;allenamento
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Annulla
        </button>
      </div>
    </div>
  );
}

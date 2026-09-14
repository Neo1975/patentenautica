"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizConfig } from "@/lib/types";
import { buildOfficialExam } from "@/lib/questions";
import { getBaseCategories, getSpecializationCategories } from "@/lib/categories";
import QuizRunner from "@/components/QuizRunner";

export default function EsamePage() {
  const router = useRouter();
  const [includeVela, setIncludeVela] = useState(false);
  const [config, setConfig] = useState<QuizConfig | null>(null);

  const baseCategories = getBaseCategories();
  const specializations = getSpecializationCategories();

  if (config) {
    return <QuizRunner config={config} onExit={() => setConfig(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Simulazione esame ufficiale
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          20 domande sul test base: 30 minuti a disposizione, massimo 2 errori per superare la
          prova.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">
          Composizione del test base
        </h2>
        <ul className="grid gap-1.5 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">
          {baseCategories.map((c) => (
            <li key={c.id} className="flex justify-between gap-2 border-b border-dashed border-slate-200 py-1 dark:border-slate-700">
              <span>{c.shortLabel}</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                {c.officialCount} {c.officialCount === 1 ? "domanda" : "domande"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {specializations.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={includeVela}
              onChange={(e) => setIncludeVela(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                Includi il modulo vela (specializzazione)
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {specializations[0].officialCount} domande aggiuntive, 15 minuti a disposizione,
                massimo 1 errore.
              </p>
            </span>
          </label>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setConfig(buildOfficialExam(includeVela))}
          className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Inizia la simulazione
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

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { QuizConfig } from "@/lib/types";
import { allQuestions, buildReviewQuiz } from "@/lib/questions";
import { getCategory } from "@/lib/categories";
import { useRipasso } from "@/lib/ripasso";
import RipassoToggle from "@/components/RipassoToggle";
import QuizRunner from "@/components/QuizRunner";

const questionsById = new Map(allQuestions.map((q) => [q.id, q]));

export default function RipassoPage() {
  const { idsOf, clear } = useRipasso();
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const ids = idsOf("q");
  const marked = useMemo(
    () => ids.map((id) => questionsById.get(id)).filter((q) => q !== undefined),
    [ids]
  );

  if (config) {
    return <QuizRunner config={config} onExit={() => setConfig(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Da ripassare</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Le domande che hai segnato durante i quiz. Restano qui finché non le togli tu, anche se le
          indovini.
        </p>
      </div>

      {marked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Non hai ancora segnato domande. Durante un quiz tocca «Segna» sulle domande che vuoi
          rivedere, oppure a fine test usa «Aggiungi gli errori al ripasso».{" "}
          <Link href="/allenamento" className="font-medium text-sky-600 hover:underline">
            Inizia un allenamento
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setConfig(buildReviewQuiz(ids))}
              className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Ripassa {marked.length} {marked.length === 1 ? "domanda" : "domande"}
            </button>
            {confirmClear ? (
              <span className="flex items-center gap-3 text-sm">
                <span className="text-rose-600 dark:text-rose-400">Svuotare tutto l&apos;elenco?</span>
                <button
                  type="button"
                  onClick={() => {
                    clear("q");
                    setConfirmClear(false);
                  }}
                  className="font-semibold text-rose-600 hover:underline"
                >
                  Svuota
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-slate-500 hover:underline"
                >
                  Annulla
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline dark:text-slate-400"
              >
                Svuota elenco
              </button>
            )}
          </div>

          <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {marked.map((q) => (
              <li key={q.id} className="flex items-start justify-between gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-sky-700 dark:text-sky-300">
                    {getCategory(q.categoryId)?.shortLabel}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">{q.text}</p>
                </div>
                <RipassoToggle id={q.id} className="shrink-0" />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

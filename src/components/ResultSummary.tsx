"use client";

import type { AnswerMap, QuizConfig, QuizResult } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import QuestionCard from "@/components/QuestionCard";
import { ripassoKey, useRipasso } from "@/lib/ripasso";

type Props = {
  config: QuizConfig;
  answersBySection: Record<string, AnswerMap>;
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
};

export default function ResultSummary({ config, answersBySection, result, onRestart, onHome }: Props) {
  const totalCorrect = result.sections.reduce((a, s) => a + s.correct, 0);
  const totalQuestions = result.sections.reduce((a, s) => a + s.total, 0);
  const { has, addMany } = useRipasso();

  const missedKeys = config.sections.flatMap((section) => {
    const answers = answersBySection[section.key] ?? {};
    return section.questions
      .filter((q) => !q.answers.find((a) => a.id === answers[q.id])?.correct)
      .map((q) => ripassoKey("q", q.id));
  });
  const allMissedMarked = missedKeys.every((k) => has(k));

  return (
    <div className="flex flex-col gap-6">
      {result.passed !== null && (
        <div
          className={`rounded-2xl border p-5 text-center ${
            result.passed
              ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              : "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200"
          }`}
        >
          <p className="text-2xl font-bold">{result.passed ? "Test superato" : "Test non superato"}</p>
          <p className="mt-1 text-sm opacity-80">
            {totalCorrect} risposte corrette su {totalQuestions}
          </p>
        </div>
      )}
      {result.passed === null && (
        <div className="rounded-2xl border border-sky-300 bg-sky-50 p-5 text-center text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
          <p className="text-2xl font-bold">Allenamento completato</p>
          <p className="mt-1 text-sm opacity-80">
            {totalCorrect} risposte corrette su {totalQuestions}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {result.sections.map((s) => (
          <div
            key={s.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">{s.label}</h3>
              {s.passed !== null && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    s.passed
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
                  }`}
                >
                  {s.passed ? "Superato" : "Non superato"}
                </span>
              )}
            </div>
            <dl className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Corrette</dt>
                <dd className="text-lg font-bold text-emerald-600">{s.correct}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Errate</dt>
                <dd className="text-lg font-bold text-rose-600">{s.wrong}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Non date</dt>
                <dd className="text-lg font-bold text-slate-500">{s.unanswered}</dd>
              </div>
            </dl>
            {s.maxErrors !== null && (
              <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Errori massimi ammessi: {s.maxErrors} su {s.total}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Nuovo tentativo
        </button>
        <button
          type="button"
          onClick={onHome}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Torna alla home
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Revisione domande sbagliate o senza risposta
          </h3>
          {missedKeys.length > 0 && (
            <button
              type="button"
              onClick={() => addMany(missedKeys)}
              disabled={allMissedMarked}
              className="rounded-xl border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-default disabled:opacity-60 dark:border-amber-600 dark:text-amber-200 dark:hover:bg-amber-950"
            >
              {allMissedMarked ? "Errori già nel ripasso" : "Aggiungi gli errori al ripasso"}
            </button>
          )}
        </div>
        {config.sections.flatMap((section) => {
          const answers = answersBySection[section.key] ?? {};
          const toReview = section.questions.filter((q) => {
            const chosen = answers[q.id];
            const chosenAnswer = q.answers.find((a) => a.id === chosen);
            return !chosenAnswer?.correct;
          });
          if (toReview.length === 0) return [];
          return toReview.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              total={toReview.length}
              selectedAnswerId={answers[q.id] ?? null}
              onSelect={() => {}}
              categoryLabel={getCategory(q.categoryId)?.shortLabel}
              showCorrectness
              disabled
            />
          ));
        })}
        {result.sections.every((s) => s.wrong === 0 && s.unanswered === 0) && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nessun errore: tutte le domande hanno ricevuto risposta corretta. Complimenti!
          </p>
        )}
      </div>
    </div>
  );
}

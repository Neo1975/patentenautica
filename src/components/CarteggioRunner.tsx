"use client";

import { useEffect, useRef, useState } from "react";
import type {
  CarteggioAnswerMap,
  CarteggioCandidateValue,
  CarteggioExercise,
  CarteggioResult,
  CarteggioTipoPatente,
} from "@/lib/types";
import { CARTEGGIO_MAX_ERRORS, CARTEGGIO_TIME_LIMIT_SEC, TIPO_PATENTE_LABELS } from "@/lib/carteggio";
import { buildInitialCarteggioAnswers, computeCarteggioResult } from "@/lib/carteggio-check";
import CarteggioExerciseCard from "@/components/CarteggioExerciseCard";
import CarteggioResultSummary from "@/components/CarteggioResultSummary";
import QuestionNav from "@/components/QuestionNav";
import Timer from "@/components/Timer";

type Props = {
  tipoPatente: CarteggioTipoPatente;
  carta: string | null;
  exercises: CarteggioExercise[];
  onExit: () => void;
};

function buildInitialAnswers(exercises: CarteggioExercise[]): Record<string, CarteggioAnswerMap> {
  const init: Record<string, CarteggioAnswerMap> = {};
  for (const ex of exercises) {
    init[ex.id] = buildInitialCarteggioAnswers(ex.quesiti);
  }
  return init;
}

export default function CarteggioRunner({ tipoPatente, carta, exercises, onExit }: Props) {
  const [exIdx, setExIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CarteggioAnswerMap>>(() =>
    buildInitialAnswers(exercises)
  );
  const [seconds, setSeconds] = useState(CARTEGGIO_TIME_LIMIT_SEC);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [result, setResult] = useState<CarteggioResult | null>(null);

  const answersRef = useRef(answers);
  const completedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setResult(
      computeCarteggioResult(tipoPatente, carta, exercises, answersRef.current, CARTEGGIO_MAX_ERRORS)
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          queueMicrotask(finish);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (result) {
    return (
      <CarteggioResultSummary exercises={exercises} answers={answers} result={result} onHome={onExit} />
    );
  }

  const exercise = exercises[exIdx];
  if (!exercise) return null;

  const answeredFlags = exercises.map((ex) =>
    Object.values(answers[ex.id] ?? {}).every((v) => isAnswered(v))
  );
  const unansweredCount = answeredFlags.filter((a) => !a).length;

  const updateAnswer = (n: number, value: CarteggioCandidateValue) => {
    setAnswers((prev) => ({
      ...prev,
      [exercise.id]: { ...prev[exercise.id], [String(n)]: value },
    }));
  };

  const handleFinishClick = () => {
    if (unansweredCount > 0 && !confirmFinish) {
      setConfirmFinish(true);
      return;
    }
    finish();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Test di carteggio — {TIPO_PATENTE_LABELS[tipoPatente].label}
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {carta ? `Carta ${carta}` : "Quiz su elementi di carteggio nautico"}
          </h2>
        </div>
        <Timer seconds={seconds} mode="countdown" />
      </div>

      <QuestionNav
        total={exercises.length}
        currentIndex={exIdx}
        answeredFlags={answeredFlags}
        onJump={setExIdx}
      />

      <CarteggioExerciseCard
        exercise={exercise}
        index={exIdx}
        total={exercises.length}
        answers={answers[exercise.id]}
        onChange={updateAnswer}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setExIdx((i) => Math.max(0, i - 1))}
            disabled={exIdx === 0}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            ← Precedente
          </button>
          <button
            type="button"
            onClick={() => setExIdx((i) => Math.min(exercises.length - 1, i + 1))}
            disabled={exIdx === exercises.length - 1}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Successivo →
          </button>
        </div>

        <div className="flex flex-col items-end gap-1">
          {confirmFinish && unansweredCount > 0 && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {unansweredCount} esercizi con quesiti incompleti: verranno conteggiati come errore.
              Confermi?
            </p>
          )}
          <button
            type="button"
            onClick={handleFinishClick}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${
              confirmFinish ? "bg-rose-600 hover:bg-rose-700" : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {confirmFinish ? "Conferma invio" : "Termina prova"}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="self-start text-xs font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:text-slate-500 dark:hover:text-slate-300"
      >
        Annulla e torna alla home
      </button>
    </div>
  );
}

function isAnswered(v: CarteggioCandidateValue | undefined): boolean {
  if (!v) return false;
  switch (v.type) {
    case "range":
    case "single":
      return v.value !== null;
    case "time_range":
      return v.value.trim() !== "";
    case "coordinate":
      return (
        v.lat.deg.trim() !== "" &&
        v.lat.min.trim() !== "" &&
        v.lat.hemi.trim() !== "" &&
        v.long.deg.trim() !== "" &&
        v.long.min.trim() !== "" &&
        v.long.hemi.trim() !== ""
      );
    default:
      return v.value.trim() !== "";
  }
}

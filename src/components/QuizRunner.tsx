"use client";

import { useEffect, useRef, useState } from "react";
import type { AnswerMap, QuizConfig, QuizResult, QuizSection } from "@/lib/types";
import { computeQuizResult } from "@/lib/scoring";
import { getCategory } from "@/lib/categories";
import QuestionCard from "@/components/QuestionCard";
import QuestionNav from "@/components/QuestionNav";
import Timer from "@/components/Timer";
import ResultSummary from "@/components/ResultSummary";

type Props = {
  config: QuizConfig;
  onExit: () => void;
};

function buildInitialAnswers(config: QuizConfig): Record<string, AnswerMap> {
  const init: Record<string, AnswerMap> = {};
  for (const section of config.sections) {
    const map: AnswerMap = {};
    for (const q of section.questions) map[q.id] = null;
    init[section.key] = map;
  }
  return init;
}

export default function QuizRunner({ config, onExit }: Props) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answersBySection, setAnswersBySection] = useState<Record<string, AnswerMap>>(() =>
    buildInitialAnswers(config)
  );
  const [result, setResult] = useState<QuizResult | null>(null);

  const section = config.sections[sectionIdx];
  const isLastSection = sectionIdx === config.sections.length - 1;

  const handleSectionComplete = (sectionAnswers: AnswerMap) => {
    const updated = { ...answersBySection, [section.key]: sectionAnswers };
    setAnswersBySection(updated);
    if (isLastSection) {
      setResult(computeQuizResult(config, updated));
    } else {
      setSectionIdx((i) => i + 1);
    }
  };

  if (result) {
    return (
      <ResultSummary
        config={config}
        answersBySection={answersBySection}
        result={result}
        onRestart={onExit}
        onHome={onExit}
      />
    );
  }

  if (!section) return null;

  return (
    <SectionRunner
      key={section.key}
      title={config.title}
      section={section}
      initialAnswers={answersBySection[section.key]}
      isLastSection={isLastSection}
      onComplete={handleSectionComplete}
      onExit={onExit}
    />
  );
}

type SectionRunnerProps = {
  title: string;
  section: QuizSection;
  initialAnswers: AnswerMap;
  isLastSection: boolean;
  onComplete: (answers: AnswerMap) => void;
  onExit: () => void;
};

function SectionRunner({
  title,
  section,
  initialAnswers,
  isLastSection,
  onComplete,
  onExit,
}: SectionRunnerProps) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers);
  const [seconds, setSeconds] = useState<number>(section.timeLimitSec ?? 0);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const isCountdown = section.timeLimitSec != null;
  const answersRef = useRef(answers);
  const completedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Il timer parte al montaggio della sezione (il componente viene rimontato a
  // ogni cambio di sezione grazie alla prop "key" nel componente padre).
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (isCountdown && prev <= 1) {
          clearInterval(interval);
          if (!completedRef.current) {
            completedRef.current = true;
            queueMicrotask(() => onComplete(answersRef.current));
          }
          return 0;
        }
        return isCountdown ? prev - 1 : prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const question = section.questions[qIdx];
  const answeredFlags = section.questions.map((q) => Boolean(answers[q.id]));
  const unansweredCount = answeredFlags.filter((a) => !a).length;

  const selectAnswer = (answerId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answerId }));
  };

  const handleFinishClick = () => {
    if (unansweredCount > 0 && !confirmFinish) {
      setConfirmFinish(true);
      return;
    }
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete(answers);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            {title}
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{section.label}</h2>
        </div>
        <Timer seconds={seconds} mode={isCountdown ? "countdown" : "stopwatch"} />
      </div>

      <QuestionNav
        total={section.questions.length}
        currentIndex={qIdx}
        answeredFlags={answeredFlags}
        onJump={setQIdx}
      />

      <QuestionCard
        question={question}
        index={qIdx}
        total={section.questions.length}
        selectedAnswerId={answers[question.id]}
        onSelect={selectAnswer}
        categoryLabel={getCategory(question.categoryId)?.shortLabel}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setQIdx((i) => Math.max(0, i - 1))}
            disabled={qIdx === 0}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            ← Precedente
          </button>
          <button
            type="button"
            onClick={() => setQIdx((i) => Math.min(section.questions.length - 1, i + 1))}
            disabled={qIdx === section.questions.length - 1}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Successiva →
          </button>
        </div>

        <div className="flex flex-col items-end gap-1">
          {confirmFinish && unansweredCount > 0 && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {unansweredCount} domande senza risposta: verranno conteggiate come errore. Confermi?
            </p>
          )}
          <button
            type="button"
            onClick={handleFinishClick}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${
              confirmFinish ? "bg-rose-600 hover:bg-rose-700" : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {confirmFinish ? "Conferma invio" : isLastSection ? "Termina test" : "Termina sezione"}
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

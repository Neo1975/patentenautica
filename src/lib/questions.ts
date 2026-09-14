import questionsData from "@/data/questions.json";
import type { Question, QuizConfig, QuizSection } from "@/lib/types";
import { getBaseCategories, getCategory } from "@/lib/categories";

export const allQuestions: Question[] = questionsData as Question[];

/** Fisher-Yates shuffle, non modifica l'array originale. */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Restituisce le domande di una categoria, con le risposte in ordine casuale. */
export function getQuestionsByCategory(categoryId: string): Question[] {
  return allQuestions
    .filter((q) => q.categoryId === categoryId)
    .map((q) => ({ ...q, answers: shuffle(q.answers) }));
}

/** Numero di domande disponibili per un insieme di categorie. */
export function countAvailable(categoryIds: string[]): number {
  return allQuestions.filter((q) => categoryIds.includes(q.categoryId)).length;
}

const BASE_TIME_LIMIT_SEC = 30 * 60; // 30 minuti
const BASE_MAX_ERRORS = 2;
const VELA_TIME_LIMIT_SEC = 15 * 60; // 15 minuti
const VELA_MAX_ERRORS = 1;

/**
 * Costruisce la simulazione dell'esame ufficiale: sezione base (20 domande secondo
 * la composizione ministeriale) ed eventuale sezione vela (5 domande), ciascuna con
 * il proprio tempo a disposizione e numero massimo di errori consentiti.
 */
export function buildOfficialExam(includeVela: boolean): QuizConfig {
  const sections: QuizSection[] = [];

  const baseQuestions: Question[] = [];
  for (const cat of getBaseCategories()) {
    const pool = shuffle(getQuestionsByCategory(cat.id));
    baseQuestions.push(...pool.slice(0, cat.officialCount));
  }

  sections.push({
    key: "base",
    label: "Test base",
    questions: shuffle(baseQuestions),
    timeLimitSec: BASE_TIME_LIMIT_SEC,
    maxErrors: BASE_MAX_ERRORS,
  });

  if (includeVela) {
    const velaCat = getCategory("vela");
    const velaPool = shuffle(getQuestionsByCategory("vela"));
    const count = velaCat?.officialCount ?? 5;
    sections.push({
      key: "vela",
      label: "Modulo vela",
      questions: velaPool.slice(0, count),
      timeLimitSec: VELA_TIME_LIMIT_SEC,
      maxErrors: VELA_MAX_ERRORS,
    });
  }

  return {
    mode: "esame",
    title: includeVela
      ? "Simulazione esame ufficiale (base + vela)"
      : "Simulazione esame ufficiale",
    sections,
  };
}

/**
 * Costruisce un quiz di allenamento libero: lo studente sceglie una o più categorie
 * e il numero di domande. Nessun limite di tempo o di errori obbligatorio.
 */
export function buildCustomQuiz(categoryIds: string[], count: number): QuizConfig {
  const pool = shuffle(
    allQuestions
      .filter((q) => categoryIds.includes(q.categoryId))
      .map((q) => ({ ...q, answers: shuffle(q.answers) }))
  );
  const selected = pool.slice(0, Math.min(count, pool.length));

  return {
    mode: "allenamento",
    title: "Allenamento per argomento",
    sections: [
      {
        key: "custom",
        label: "Allenamento",
        questions: selected,
        timeLimitSec: null,
        maxErrors: null,
      },
    ],
  };
}

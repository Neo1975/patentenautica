export type Category = {
  id: string;
  label: string;
  shortLabel: string;
  officialCount: number;
  specialization?: boolean;
};

export type Answer = {
  id: string;
  text: string;
  correct: boolean;
};

export type Question = {
  id: string;
  categoryId: string;
  text: string;
  answers: Answer[];
};

/** One timed block of an exam simulation (es. "base" oppure "vela"). */
export type QuizSection = {
  key: string;
  label: string;
  questions: Question[];
  timeLimitSec: number | null;
  maxErrors: number | null;
};

export type QuizMode = "esame" | "allenamento";

export type QuizConfig = {
  mode: QuizMode;
  title: string;
  sections: QuizSection[];
};

/** Risposta data dallo studente per una domanda: id della risposta scelta, oppure null se saltata. */
export type AnswerMap = Record<string, string | null>;

export type SectionResult = {
  key: string;
  label: string;
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  maxErrors: number | null;
  passed: boolean | null;
};

export type QuizResult = {
  mode: QuizMode;
  title: string;
  sections: SectionResult[];
  passed: boolean | null;
  finishedAt: string;
};

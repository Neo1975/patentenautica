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

export type QuestionMeta = {
  progressivo: string;
  capitolo: string;
  tema: string;
  voce: string;
};

export type Question = {
  id: string;
  categoryId: string;
  text: string;
  answers: Answer[];
  /** Percorso dell'immagine di riferimento (figura), se la domanda ne richiede una. */
  image?: string | null;
  /** Metadati originali del quiz ministeriale, utili per tracciabilità. */
  meta?: QuestionMeta;
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

/* -------------------------------------------------------------------------- */
/* Carteggio nautico                                                          */
/* -------------------------------------------------------------------------- */

/** Un intervallo di valori numerici accettabili (es. distanza, velocità, rilevamento). */
export type CarteggioRangeAnswer = {
  type: "range";
  min: number;
  max: number;
  unit: string;
  label: string | null;
  raw: string;
};

/** Un intervallo orario accettabile, espresso come stringhe "HH:MM". */
export type CarteggioTimeRangeAnswer = {
  type: "time_range";
  min: string;
  max: string;
  raw: string;
};

/** Un singolo valore esatto atteso (es. quantità di carburante). */
export type CarteggioSingleAnswer = {
  type: "single";
  value: number;
  unit: string;
  label: string | null;
  raw: string;
};

/** Una componente di coordinata (latitudine o longitudine): grado fisso + intervallo di minuti. */
export type CarteggioCoordinateComponent = {
  deg: number;
  minMin: number;
  minMax: number;
  hemi: string;
};

export type CarteggioCoordinateAnswer = {
  type: "coordinate";
  lat: CarteggioCoordinateComponent;
  long: CarteggioCoordinateComponent;
  raw: string;
};

/** Risposta attesa che non è stato possibile strutturare automaticamente (nessuna nel dataset attuale). */
export type CarteggioRawAnswer = {
  type: "raw" | "empty";
  raw: string;
};

export type CarteggioExpectedAnswer =
  | CarteggioRangeAnswer
  | CarteggioTimeRangeAnswer
  | CarteggioSingleAnswer
  | CarteggioCoordinateAnswer
  | CarteggioRawAnswer;

/** Un quesito all'interno di un esercizio di carteggio (un esercizio può averne da 1 a 5). */
export type CarteggioQuesito = {
  n: number;
  label: string;
  expected: CarteggioExpectedAnswer;
};

export type CarteggioExercise = {
  id: string;
  progressivo: string;
  carta: string;
  settore: string | null;
  argomento: string | null;
  scenario: string;
  quesiti: CarteggioQuesito[];
};

/** Valore inserito dal candidato per un singolo quesito, con la stessa forma "a tag" della risposta attesa. */
export type CarteggioCandidateValue =
  | { type: "range"; value: number | null }
  | { type: "single"; value: number | null }
  | { type: "time_range"; value: string }
  | {
      type: "coordinate";
      lat: { deg: string; min: string; hemi: string };
      long: { deg: string; min: string; hemi: string };
    }
  | { type: "raw"; value: string };

/** Risposte del candidato per un esercizio: chiave = numero del quesito (come stringa). */
export type CarteggioAnswerMap = Record<string, CarteggioCandidateValue | undefined>;

export type CarteggioQuesitoResult = {
  n: number;
  label: string;
  correct: boolean;
};

export type CarteggioExerciseResult = {
  exerciseId: string;
  progressivo: string;
  quesiti: CarteggioQuesitoResult[];
  correct: boolean;
};

export type CarteggioResult = {
  carta: string;
  total: number;
  wrongExercises: number;
  maxErrors: number;
  passed: boolean;
  exercises: CarteggioExerciseResult[];
  finishedAt: string;
};

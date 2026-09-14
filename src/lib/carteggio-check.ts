import type {
  CarteggioAnswerMap,
  CarteggioCandidateValue,
  CarteggioCoordinateComponent,
  CarteggioExercise,
  CarteggioExerciseResult,
  CarteggioExpectedAnswer,
  CarteggioQuesito,
  CarteggioQuesitoResult,
  CarteggioResult,
  CarteggioTipoPatente,
} from "@/lib/types";

const EPS = 1e-6;

/** Restituisce un valore iniziale "vuoto" coerente con il tipo di risposta attesa. */
export function emptyCandidate(type: CarteggioExpectedAnswer["type"]): CarteggioCandidateValue {
  switch (type) {
    case "range":
      return { type: "range", value: null };
    case "single":
      return { type: "single", value: null };
    case "time_range":
      return { type: "time_range", value: "" };
    case "coordinate":
      return {
        type: "coordinate",
        lat: { deg: "", min: "", hemi: "" },
        long: { deg: "", min: "", hemi: "" },
      };
    default:
      return { type: "raw", value: "" };
  }
}

export function buildInitialCarteggioAnswers(quesiti: CarteggioQuesito[]): CarteggioAnswerMap {
  const map: CarteggioAnswerMap = {};
  for (const q of quesiti) {
    map[String(q.n)] = emptyCandidate(q.expected.type);
  }
  return map;
}

/**
 * Determina il passo di arrotondamento da applicare a un valore numerico prima
 * del confronto con l'intervallo atteso, secondo l'unità di misura: 1 grado
 * intero per i rilevamenti/direzioni, 0.1 per miglia, nodi e litri.
 */
function stepForUnit(unit: string): number {
  const u = (unit || "").trim().toLowerCase();
  if (u.includes("°") || u.includes("grad")) return 1;
  return 0.1;
}

function roundToStep(value: number, step: number): number {
  if (step >= 1) return Math.round(value);
  const factor = 1 / step;
  return Math.round(value * factor) / factor;
}

function toNumber(raw: string): number | null {
  if (raw == null) return null;
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function parseHM(raw: string): number | null {
  const m = /^\s*(\d{1,2})\s*[:.hH]\s*(\d{1,2})\s*m?\s*$/.exec(raw ?? "");
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  if (Number.isNaN(h) || Number.isNaN(mm) || mm > 59) return null;
  return h * 60 + mm;
}

function checkCoordinateComponent(
  candidate: { deg: string; min: string; hemi: string },
  expected: CarteggioCoordinateComponent
): boolean {
  const deg = toNumber(candidate.deg);
  const min = toNumber(candidate.min);
  if (deg === null || min === null) return false;
  if (Math.round(deg) !== expected.deg) return false;
  if ((candidate.hemi ?? "").trim().toUpperCase() !== expected.hemi.toUpperCase()) return false;
  const rounded = roundToStep(min, 0.1);
  return rounded >= expected.minMin - EPS && rounded <= expected.minMax + EPS;
}

/**
 * Verifica il valore inserito dal candidato per un singolo quesito rispetto
 * alla risposta ufficiale attesa, applicando l'arrotondamento previsto per
 * ciascun tipo di dato.
 */
export function checkQuesito(
  candidate: CarteggioCandidateValue | undefined,
  expected: CarteggioExpectedAnswer
): boolean {
  if (!candidate) return false;

  switch (expected.type) {
    case "range": {
      if (candidate.type !== "range" || candidate.value === null) return false;
      const rounded = roundToStep(candidate.value, stepForUnit(expected.unit));
      if (expected.min <= expected.max) {
        return rounded >= expected.min - EPS && rounded <= expected.max + EPS;
      }
      // Intervallo "circolare" (es. rilevamenti/direzioni che attraversano il
      // Nord, come "359° ÷ 005°"): valido se il valore ricade in una delle due
      // metà dell'intervallo che si ricongiungono a 360°/000°.
      return rounded >= expected.min - EPS || rounded <= expected.max + EPS;
    }
    case "single": {
      if (candidate.type !== "single" || candidate.value === null) return false;
      const rounded = roundToStep(candidate.value, stepForUnit(expected.unit));
      return Math.abs(rounded - expected.value) <= EPS;
    }
    case "time_range": {
      if (candidate.type !== "time_range") return false;
      const value = parseHM(candidate.value);
      const min = parseHM(expected.min);
      const max = parseHM(expected.max);
      if (value === null || min === null || max === null) return false;
      return value >= min && value <= max;
    }
    case "coordinate": {
      if (candidate.type !== "coordinate") return false;
      return (
        checkCoordinateComponent(candidate.lat, expected.lat) &&
        checkCoordinateComponent(candidate.long, expected.long)
      );
    }
    default:
      // Nessuna risposta ufficiale del dataset è di tipo "raw"/"empty": non
      // valutabile automaticamente, quindi sempre considerata errata.
      return false;
  }
}

export function checkExercise(
  exercise: CarteggioExercise,
  answers: CarteggioAnswerMap
): CarteggioExerciseResult {
  const quesiti: CarteggioQuesitoResult[] = exercise.quesiti.map((q) => ({
    n: q.n,
    label: q.label,
    correct: checkQuesito(answers[String(q.n)], q.expected),
  }));
  return {
    exerciseId: exercise.id,
    progressivo: exercise.progressivo,
    quesiti,
    correct: quesiti.every((q) => q.correct),
  };
}

export function computeCarteggioResult(
  tipoPatente: CarteggioTipoPatente,
  carta: string | null,
  exercises: CarteggioExercise[],
  answersByExercise: Record<string, CarteggioAnswerMap>,
  maxErrors: number
): CarteggioResult {
  const exerciseResults = exercises.map((ex) => checkExercise(ex, answersByExercise[ex.id] ?? {}));
  const wrongExercises = exerciseResults.filter((r) => !r.correct).length;
  return {
    tipoPatente,
    carta,
    total: exercises.length,
    wrongExercises,
    maxErrors,
    passed: wrongExercises <= maxErrors,
    exercises: exerciseResults,
    finishedAt: new Date().toISOString(),
  };
}

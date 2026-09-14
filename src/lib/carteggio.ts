import carteggioData from "@/data/carteggio.json";
import deviationTablesData from "@/data/deviation-tables.json";
import type { CarteggioExercise, CarteggioTipoPatente } from "@/lib/types";
import { shuffle } from "@/lib/questions";

export const allExercises: CarteggioExercise[] = carteggioData as CarteggioExercise[];

export type DeviationEntry = { pm: string; deviazione: string; pb: string };
export const deviationTables: Record<string, DeviationEntry[]> = deviationTablesData as Record<
  string,
  DeviationEntry[]
>;

export const CARTEGGIO_TIME_LIMIT_SEC = 20 * 60; // 20 minuti
export const CARTEGGIO_MAX_ERRORS = 1;
export const CARTEGGIO_EXERCISE_COUNT = 5;

/**
 * Le due prove di carteggio previste dal quiz ministeriale, una per ciascuna
 * categoria di patente:
 *  - "entro12": patente entro le 12 miglia dalla costa. Prova semplificata
 *    ("Quiz su elementi di carteggio nautico"): calcoli di rotta, tempo,
 *    carburante e coordinate, senza una carta nautica specifica.
 *  - "senzaLimiti": patente senza alcun limite dalla costa. Prova di
 *    carteggio vera e propria, su una carta nautica specifica (5D o 42D).
 */
export const TIPO_PATENTE_LABELS: Record<CarteggioTipoPatente, { label: string; description: string }> = {
  entro12: {
    label: "Entro le 12 miglia dalla costa",
    description:
      "Quiz su elementi di carteggio nautico: calcoli di rotta, tempo, carburante e coordinate, senza carta nautica.",
  },
  senzaLimiti: {
    label: "Senza alcun limite dalla costa",
    description: "Prova di carteggio su una carta nautica specifica (5D o 42D).",
  },
};

/** Elenco delle carte nautiche disponibili per la prova "senza limiti", con il numero di esercizi per ciascuna. */
export function getCarteOptions(): { carta: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const ex of allExercises) {
    if (ex.tipoPatente !== "senzaLimiti" || !ex.carta) continue;
    counts.set(ex.carta, (counts.get(ex.carta) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([carta, count]) => ({ carta, count }))
    .sort((a, b) => a.carta.localeCompare(b.carta));
}

/**
 * Costruisce una prova di carteggio: 5 esercizi estratti a caso tra quelli
 * disponibili per la categoria di patente scelta (ed eventualmente la carta
 * nautica, per "senza limiti"), 20 minuti a disposizione, massimo 1 errore
 * ammesso (un esercizio è considerato errato se anche un solo quesito al suo
 * interno non è corretto).
 */
export function buildCarteggioExam(
  tipoPatente: CarteggioTipoPatente,
  carta: string | null
): {
  tipoPatente: CarteggioTipoPatente;
  carta: string | null;
  exercises: CarteggioExercise[];
  timeLimitSec: number;
  maxErrors: number;
} {
  const filtered = allExercises.filter((ex) => {
    if (ex.tipoPatente !== tipoPatente) return false;
    if (tipoPatente === "senzaLimiti" && carta) return ex.carta === carta;
    return true;
  });
  const pool = shuffle(filtered);
  const exercises = pool.slice(0, Math.min(CARTEGGIO_EXERCISE_COUNT, pool.length));
  return {
    tipoPatente,
    carta: tipoPatente === "senzaLimiti" ? carta : null,
    exercises,
    timeLimitSec: CARTEGGIO_TIME_LIMIT_SEC,
    maxErrors: CARTEGGIO_MAX_ERRORS,
  };
}

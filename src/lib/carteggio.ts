import carteggioData from "@/data/carteggio.json";
import deviationTablesData from "@/data/deviation-tables.json";
import type { CarteggioExercise } from "@/lib/types";
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

/** Elenco delle carte nautiche disponibili nel dataset, con il numero di esercizi per ciascuna. */
export function getCarteOptions(): { carta: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const ex of allExercises) {
    counts.set(ex.carta, (counts.get(ex.carta) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([carta, count]) => ({ carta, count }))
    .sort((a, b) => a.carta.localeCompare(b.carta));
}

/**
 * Costruisce una prova di carteggio: 5 esercizi estratti a caso tra quelli
 * disponibili per la carta nautica scelta, 20 minuti a disposizione, massimo
 * 1 errore ammesso (un esercizio è considerato errato se anche un solo
 * quesito al suo interno non è corretto).
 */
export function buildCarteggioExam(carta: string): {
  carta: string;
  exercises: CarteggioExercise[];
  timeLimitSec: number;
  maxErrors: number;
} {
  const pool = shuffle(allExercises.filter((ex) => ex.carta === carta));
  const exercises = pool.slice(0, Math.min(CARTEGGIO_EXERCISE_COUNT, pool.length));
  return {
    carta,
    exercises,
    timeLimitSec: CARTEGGIO_TIME_LIMIT_SEC,
    maxErrors: CARTEGGIO_MAX_ERRORS,
  };
}

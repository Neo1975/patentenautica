import type { CarteggioAnswerMap, CarteggioExercise, CarteggioResult } from "@/lib/types";
import CarteggioExerciseCard from "@/components/CarteggioExerciseCard";

type Props = {
  exercises: CarteggioExercise[];
  answers: Record<string, CarteggioAnswerMap>;
  result: CarteggioResult;
  onHome: () => void;
};

export default function CarteggioResultSummary({ exercises, answers, result, onHome }: Props) {
  const correctExercises = result.total - result.wrongExercises;

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`rounded-2xl border p-5 text-center ${
          result.passed
            ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
            : "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200"
        }`}
      >
        <p className="text-2xl font-bold">{result.passed ? "Prova superata" : "Prova non superata"}</p>
        <p className="mt-1 text-sm opacity-80">
          {correctExercises} esercizi corretti su {result.total} (massimo {result.maxErrors} errori
          ammessi)
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onHome}
          className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Torna alla home
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Revisione degli esercizi
        </h3>
        {exercises.map((ex, i) => {
          const exResult = result.exercises.find((r) => r.exerciseId === ex.id);
          return (
            <CarteggioExerciseCard
              key={ex.id}
              exercise={ex}
              index={i}
              total={exercises.length}
              answers={answers[ex.id]}
              onChange={() => {}}
              disabled
              results={exResult?.quesiti}
            />
          );
        })}
      </div>
    </div>
  );
}

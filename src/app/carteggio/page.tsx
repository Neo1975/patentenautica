"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CarteggioExercise } from "@/lib/types";
import { buildCarteggioExam, getCarteOptions } from "@/lib/carteggio";
import CarteggioRunner from "@/components/CarteggioRunner";

export default function CarteggioPage() {
  const router = useRouter();
  const carte = getCarteOptions();
  const [carta, setCarta] = useState(carte[0]?.carta ?? "");
  const [exam, setExam] = useState<{ carta: string; exercises: CarteggioExercise[] } | null>(null);

  if (exam) {
    return (
      <CarteggioRunner carta={exam.carta} exercises={exam.exercises} onExit={() => setExam(null)} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Test di carteggio</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          5 esercizi da svolgere in 20 minuti: inserisci i valori richiesti (distanze, orari,
          coordinate, ecc.), che verranno confrontati con la soluzione ufficiale applicando un
          margine di arrotondamento. Massimo 1 esercizio errato per superare la prova.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">Scegli la carta nautica</h2>
        <div className="flex flex-wrap gap-2">
          {carte.map((c) => (
            <button
              key={c.carta}
              type="button"
              onClick={() => setCarta(c.carta)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                carta === c.carta
                  ? "border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              Carta {c.carta}
              <span className="ml-1.5 font-normal text-slate-400">({c.count} esercizi)</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <p>
          <strong>Nota:</strong> il test non include la carta nautica né gli strumenti di carteggio;
          presenta il testo dell&apos;esercizio così come indicato dal Ministero e chiede di inserire
          i valori numerici del risultato (es. distanza in miglia, ora di arrivo, coordinate), che
          vengono verificati automaticamente.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setExam(buildCarteggioExam(carta))}
          disabled={!carta}
          className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Inizia la prova
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Annulla
        </button>
      </div>
    </div>
  );
}

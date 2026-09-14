"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CarteggioExercise, CarteggioTipoPatente } from "@/lib/types";
import { TIPO_PATENTE_LABELS, buildCarteggioExam, getCarteOptions } from "@/lib/carteggio";
import CarteggioRunner from "@/components/CarteggioRunner";

const TIPO_PATENTE_OPTIONS: CarteggioTipoPatente[] = ["entro12", "senzaLimiti"];

export default function CarteggioPage() {
  const router = useRouter();
  const carte = getCarteOptions();
  const [tipoPatente, setTipoPatente] = useState<CarteggioTipoPatente | null>(null);
  const [carta, setCarta] = useState<string>(carte[0]?.carta ?? "");
  const [exam, setExam] = useState<{
    tipoPatente: CarteggioTipoPatente;
    carta: string | null;
    exercises: CarteggioExercise[];
  } | null>(null);

  if (exam) {
    return (
      <CarteggioRunner
        tipoPatente={exam.tipoPatente}
        carta={exam.carta}
        exercises={exam.exercises}
        onExit={() => setExam(null)}
      />
    );
  }

  const needsCarta = tipoPatente === "senzaLimiti";
  const canStart = tipoPatente === "entro12" || (tipoPatente === "senzaLimiti" && Boolean(carta));

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
        <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-50">
          1. Per quale categoria di patente ti stai preparando?
        </h2>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Le due categorie prevedono una prova di carteggio diversa.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {TIPO_PATENTE_OPTIONS.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => {
                setTipoPatente(tp);
                if (tp === "entro12") setCarta("");
              }}
              className={`flex-1 rounded-xl border p-4 text-left transition ${
                tipoPatente === tp
                  ? "border-sky-600 bg-sky-50 dark:bg-sky-950"
                  : "border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              <p className="font-semibold text-slate-900 dark:text-slate-50">
                {TIPO_PATENTE_LABELS[tp].label}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {TIPO_PATENTE_LABELS[tp].description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {needsCarta && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">
            2. Scegli la carta nautica
          </h2>
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
      )}

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
          onClick={() => tipoPatente && setExam(buildCarteggioExam(tipoPatente, carta || null))}
          disabled={!canStart}
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

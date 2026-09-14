import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Preparati alla patente nautica
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Scegli come vuoi esercitarti: una simulazione fedele dell&apos;esame ufficiale, oppure un
          allenamento libero su uno o più argomenti a tua scelta.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Link
          href="/esame"
          className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="text-3xl" aria-hidden>
            📝
          </span>
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 dark:text-slate-50">
            Simulazione esame ufficiale
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            20 domande sulle materie del test base (30 minuti, massimo 2 errori), con la
            possibilità di aggiungere il modulo vela (5 domande, 15 minuti, massimo 1 errore).
          </p>
        </Link>

        <Link
          href="/allenamento"
          className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="text-3xl" aria-hidden>
            🎯
          </span>
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 dark:text-slate-50">
            Allenamento per argomento
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Scegli tu quanti quesiti affrontare e su quali argomenti concentrarti, senza limiti di
            tempo né soglie di errore.
          </p>
        </Link>

        <Link
          href="/carteggio"
          className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="text-3xl" aria-hidden>
            🧭
          </span>
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 dark:text-slate-50">
            Test di carteggio
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            5 esercizi in 20 minuti, con la prova giusta per la tua categoria di patente (entro le 12
            miglia o senza limiti). Inserisci i valori richiesti, verificati automaticamente. Massimo 1
            errore.
          </p>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <p>
          Il quiz contiene l&apos;intero elenco ufficiale delle domande pubblicato dal Ministero
          delle Infrastrutture e dei Trasporti (Allegato A, DD 131 del 31 maggio 2022), comprese le
          immagini di riferimento richiamate da alcune domande.
        </p>
      </div>
    </div>
  );
}

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

      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <p>
          <strong>Nota:</strong> le domande incluse in questa versione sono un set di esempio
          rappresentativo delle materie d&apos;esame, non ancora il testo integrale ufficiale del
          Ministero. Il test di carteggio non è ancora disponibile.
        </p>
      </div>
    </div>
  );
}

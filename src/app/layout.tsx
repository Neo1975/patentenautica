import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patente Nautica – Simulatore Quiz",
  description:
    "Preparati all'esame della patente nautica: simulazione ufficiale del quiz base e allenamento libero per argomento.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-50">
              <span aria-hidden>⚓</span>
              <span>Patente Nautica</span>
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link href="/esame" className="hover:text-sky-600">
                Esame ufficiale
              </Link>
              <Link href="/allenamento" className="hover:text-sky-600">
                Allenamento
              </Link>
              <Link href="/ripasso" className="hover:text-sky-600">
                Da ripassare
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
          Domande di esempio a scopo di studio — non è il testo ufficiale del Ministero.
        </footer>
      </body>
    </html>
  );
}

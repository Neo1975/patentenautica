"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Basket "da ripassare": chiavi delle domande segnate dallo studente.
 * Salvato in localStorage (l'app è tutta client-side). Le domande restano nel
 * basket finché lo studente non le toglie a mano, anche se le indovina.
 * Le chiavi hanno un prefisso per tipo: "q:<id>" teoria, "c:<id>" carteggio.
 */

const STORAGE_KEY = "patente-nautica:ripasso:v1";
const EMPTY: readonly string[] = [];

export type RipassoKind = "q" | "c";
export const ripassoKey = (kind: RipassoKind, id: string | number) => `${kind}:${id}`;

let cache: readonly string[] | null = null;
const listeners = new Set<() => void>();

function read(): readonly string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: readonly string[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage pieno o disabilitato: il basket resta valido per la sessione */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Sincronizza tra schede diverse del browser
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useRipasso() {
  const keys = useSyncExternalStore(subscribe, read, () => EMPTY);

  const has = useCallback((key: string) => keys.includes(key), [keys]);

  const toggle = useCallback((key: string) => {
    const cur = read();
    write(cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]);
  }, []);

  const addMany = useCallback((toAdd: string[]) => {
    const cur = read();
    write([...cur, ...toAdd.filter((k) => !cur.includes(k))]);
  }, []);

  const clear = useCallback((kind?: RipassoKind) => {
    write(kind ? read().filter((k) => !k.startsWith(`${kind}:`)) : []);
  }, []);

  /** Id "nudi" (senza prefisso) di un certo tipo, nell'ordine in cui sono stati segnati. */
  const idsOf = useCallback(
    (kind: RipassoKind) =>
      keys.filter((k) => k.startsWith(`${kind}:`)).map((k) => k.slice(kind.length + 1)),
    [keys]
  );

  return { keys, has, toggle, addMany, clear, idsOf };
}

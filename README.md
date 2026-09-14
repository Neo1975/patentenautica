# Patente Nautica – Simulatore Quiz

App web per esercitarsi ai quiz della patente nautica, pronta per il deploy su [Vercel](https://vercel.com).

## Cosa fa (v0.1)

- **Simulazione esame ufficiale**: 20 domande composte secondo la ripartizione ministeriale per materia
  (scafo, motori, sicurezza, manovra, ColReg, meteorologia, navigazione, normativa), 30 minuti a disposizione,
  massimo 2 errori per superare la prova. È possibile aggiungere il **modulo vela** (5 domande, 15 minuti,
  massimo 1 errore) se lo studente ha scelto quella specializzazione.
- **Allenamento per argomento**: lo studente sceglie liberamente uno o più argomenti e quante domande
  affrontare, senza limiti di tempo né soglie di errore.
- Revisione finale con le domande sbagliate o senza risposta, risposta corretta evidenziata.

**Non ancora incluso** (prossimi passi): test di carteggio, elenco completo e ufficiale delle domande
ministeriali (attualmente c'è un set di esempio), eventuale backend/salvataggio storico tentativi.

## Struttura del progetto

```
src/
  app/
    page.tsx              Home
    esame/page.tsx         Setup + avvio simulazione esame ufficiale
    allenamento/page.tsx   Setup + avvio allenamento per argomento
    layout.tsx             Layout comune (header/footer)
  components/
    QuizRunner.tsx          Motore di esecuzione del quiz (timer, navigazione, invio)
    QuestionCard.tsx        Card di visualizzazione di una domanda
    QuestionNav.tsx         Griglia di navigazione rapida tra le domande
    CategoryPicker.tsx      Selezione argomenti (modalità allenamento)
    ResultSummary.tsx       Riepilogo esito + revisione errori
    Timer.tsx               Countdown / cronometro
  lib/
    types.ts                Tipi condivisi (Question, QuizConfig, ...)
    categories.ts            Helper sulle categorie/materie
    questions.ts             Generazione del quiz ufficiale e di allenamento
    scoring.ts                Calcolo del risultato (corrette/errate/non date, superato/non superato)
  data/
    categories.json          Elenco materie con numero di domande ufficiali per materia
    questions.json            Banca dati domande (attualmente un set di esempio, 90 domande)
```

## Il file delle domande (`src/data/questions.json`)

Ogni domanda ha questo formato:

```json
{
  "id": "SIC-003",
  "categoryId": "sicurezza",
  "text": "Testo della domanda...",
  "answers": [
    { "id": "a", "text": "Risposta 1", "correct": false },
    { "id": "b", "text": "Risposta 2", "correct": true },
    { "id": "c", "text": "Risposta 3", "correct": false }
  ]
}
```

`categoryId` deve corrispondere a un `id` presente in `src/data/categories.json`. Per sostituire il set di
esempio con l'elenco ufficiale completo (dall'Allegato A del DD 131/2022), basta generare un file con lo
stesso formato e sostituire `questions.json` — nessuna modifica al codice è necessaria, a patto di
mantenere gli stessi `categoryId`.

Il test di carteggio (pagine 287 in poi del PDF ministeriale) richiede un tipo di esercizio diverso
(tracciare rotte su una carta nautica), non ancora modellato in questa versione.

## Sviluppo locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000.

## Build di produzione

```bash
npm run build
npm run start
```

## Deploy su Vercel

1. Crea un repository Git (GitHub/GitLab/Bitbucket) con questo progetto e fai il push.
2. Su [vercel.com](https://vercel.com), scegli "Add New… → Project" e importa il repository.
3. Vercel riconosce automaticamente Next.js: nessuna configurazione aggiuntiva è necessaria
   (build command `next build`, output gestito automaticamente).
4. Ogni push sul branch principale genera un nuovo deploy.

In alternativa, con la [Vercel CLI](https://vercel.com/docs/cli) installata:

```bash
npm i -g vercel
vercel
```

## Stack tecnico

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4
- Nessun database: le domande sono statiche (bundle JSON), tutta la logica del quiz gira nel browser.

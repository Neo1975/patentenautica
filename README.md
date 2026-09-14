# Patente Nautica – Simulatore Quiz

App web per esercitarsi ai quiz della patente nautica, pronta per il deploy su [Vercel](https://vercel.com).
Contiene il testo integrale ufficiale pubblicato dal Ministero delle Infrastrutture e dei Trasporti
(Allegato A al DD 131 del 31 maggio 2022): 1722 domande di teoria e 185 esercizi di carteggio.

## Cosa fa

- **Simulazione esame ufficiale**: 20 domande composte secondo la ripartizione ministeriale per materia
  (scafo, motori, sicurezza, manovra, ColReg, meteorologia, navigazione, normativa), 30 minuti a disposizione,
  massimo 2 errori per superare la prova. È possibile aggiungere il **modulo vela** (5 domande, 15 minuti,
  massimo 1 errore) se lo studente ha scelto quella specializzazione.
- **Allenamento per argomento**: lo studente sceglie liberamente uno o più argomenti e quante domande
  affrontare, senza limiti di tempo né soglie di errore.
- **Test di carteggio**: il Ministero prevede due prove di carteggio distinte, una per ciascuna categoria di
  patente, e l'app le tiene separate fin dalla schermata di scelta:
  - **Entro le 12 miglia dalla costa**: "Quiz su elementi di carteggio nautico" (pag. 287-297 dell'Allegato
    A), calcoli di rotta/tempo/carburante/coordinate senza una carta nautica specifica.
  - **Senza alcun limite dalla costa**: prova di carteggio vera e propria su una carta nautica specifica
    (5D o 42D, pag. 298+ dell'Allegato A).

  In entrambi i casi: 5 esercizi estratti a caso, 20 minuti a disposizione, massimo 1 esercizio errato. Il
  candidato legge il testo dell'esercizio così come pubblicato dal Ministero e inserisce i valori richiesti
  (distanza, ora di arrivo, carburante da imbarcare, coordinate di partenza/arrivo, rilevamenti, ecc.); i
  valori vengono confrontati con l'intervallo di soluzione ufficiale applicando un arrotondamento (0,1 per
  miglia/nodi/litri/minuti di coordinate, 1° intero per i rilevamenti in gradi). Un esercizio è considerato
  errato se anche un solo quesito al suo interno è sbagliato o incompleto.
- Domande corredate delle immagini di riferimento ministeriali, quando richieste (120 domande su 1722).
- Revisione finale con le domande/esercizi sbagliati o senza risposta, soluzione corretta evidenziata.

**Non ancora incluso** (possibili prossimi passi): un vero e proprio editor/visualizzatore di carta
nautica interattivo (il test di carteggio verifica solo i valori numerici del risultato, non il tracciato),
persistenza/storico dei tentativi, autenticazione utenti.

## Struttura del progetto

```
src/
  app/
    page.tsx                Home
    esame/page.tsx           Setup + avvio simulazione esame ufficiale
    allenamento/page.tsx     Setup + avvio allenamento per argomento
    carteggio/page.tsx       Setup (scelta categoria patente + carta) + avvio test di carteggio
    layout.tsx                Layout comune (header/footer)
  components/
    QuizRunner.tsx            Motore di esecuzione del quiz base/vela (timer, navigazione, invio)
    QuestionCard.tsx          Card di visualizzazione di una domanda (con immagine opzionale)
    QuestionNav.tsx            Griglia di navigazione rapida tra domande/esercizi
    CategoryPicker.tsx        Selezione argomenti (modalità allenamento)
    ResultSummary.tsx         Riepilogo esito + revisione errori (base/vela/allenamento)
    Timer.tsx                  Countdown / cronometro
    CarteggioExerciseCard.tsx  Card di un esercizio di carteggio (scenario + campi di input)
    CarteggioRunner.tsx        Motore di esecuzione del test di carteggio
    CarteggioResultSummary.tsx Riepilogo esito + revisione del test di carteggio
  lib/
    types.ts                  Tipi condivisi (Question, QuizConfig, tipi Carteggio, ...)
    categories.ts               Helper sulle categorie/materie
    questions.ts                 Generazione del quiz ufficiale e di allenamento
    scoring.ts                   Calcolo del risultato del quiz base/vela
    carteggio.ts                 Estrazione degli esercizi di carteggio per categoria patente/carta nautica
    carteggio-check.ts           Validazione delle risposte di carteggio (con arrotondamento)
  data/
    categories.json             Elenco materie con numero di domande ufficiali per materia
    questions.json               Banca dati completa delle domande (1722, testo integrale ministeriale)
    carteggio.json                Banca dati completa degli esercizi di carteggio (185)
    deviation-tables.json         Tabelle di deviazione bussola delle carte 5D/42D (riferimento)
public/
  figures/                       Le 103 immagini di riferimento richiamate dalle domande
scripts/
  verify-carteggio-check.ts     Script di verifica esaustiva della logica di correzione del carteggio
```

## Il file delle domande (`src/data/questions.json`)

Ogni domanda ha questo formato:

```json
{
  "id": "sicurezza-0003",
  "categoryId": "sicurezza",
  "text": "Testo della domanda...",
  "answers": [
    { "id": "a", "text": "Risposta 1", "correct": false },
    { "id": "b", "text": "Risposta 2", "correct": true },
    { "id": "c", "text": "Risposta 3", "correct": false }
  ],
  "image": "/figures/figura-12.png",
  "meta": { "progressivo": "1.5.2 - 3", "capitolo": "BASE", "tema": "SICUREZZA DELLA NAVIGAZIONE", "voce": "..." }
}
```

`categoryId` deve corrispondere a un `id` presente in `src/data/categories.json`. `image` è `null` quando la
domanda non richiede un'immagine. `meta` conserva i riferimenti originali del quiz ministeriale (numero
progressivo, capitolo, tema, voce) a scopo di tracciabilità e non è usato dall'interfaccia.

## Il file degli esercizi di carteggio (`src/data/carteggio.json`)

Ogni esercizio ha questo formato (esempio semplificato):

```json
{
  "id": "cart-4_1_1-1",
  "progressivo": "4.1.1 - 1",
  "tipoPatente": "entro12",
  "carta": null,
  "settore": "SETTORE NORD OVEST ORIZZONTALE",
  "argomento": null,
  "scenario": "Partenza alle ore 09:00 da Capo di S. Andrea ... determinare:",
  "quesiti": [
    { "n": 1, "label": "distanza", "expected": { "type": "range", "min": 5.2, "max": 5.8, "unit": "M", "raw": "5.2 ÷ 5.8 M" } },
    { "n": 2, "label": "ora di arrivo", "expected": { "type": "time_range", "min": "09:57", "max": "10:03", "raw": "09:57÷10:03" } },
    { "n": 4, "label": "coordinate punto di partenza", "expected": { "type": "coordinate", "lat": { "deg": 42, "minMin": 48.2, "minMax": 48.8, "hemi": "N" }, "long": { "deg": 10, "minMin": 8.1, "minMax": 8.7, "hemi": "E" } } }
  ]
}
```

`tipoPatente` vale `"entro12"` (50 esercizi, `carta` sempre `null`) oppure `"senzaLimiti"` (135 esercizi,
`carta` sempre `"5D"` o `"42D"`) e determina quale prova viene proposta in base alla categoria di patente
scelta nella schermata di setup — le due prove non vengono mai mescolate.

I tipi di risposta attesa sono quattro: `range` (intervallo numerico con unità), `single` (valore esatto),
`time_range` (intervallo orario) e `coordinate` (latitudine/longitudine, ciascuna con grado fisso e
intervallo di minuti). La logica di verifica e arrotondamento è in `src/lib/carteggio-check.ts`; lo script
`scripts/verify-carteggio-check.ts` verifica che, per tutti i 385 quesiti del dataset, un valore a metà
dell'intervallo ufficiale venga sempre accettato e un valore chiaramente fuori intervallo venga sempre
respinto (`npx tsx scripts/verify-carteggio-check.ts`).

## Provenienza dei dati

Domande, esercizi di carteggio, immagini e tabelle di deviazione sono stati estratti automaticamente dal PDF
ufficiale "Allegato A – Quiz patenti nautiche" (DD 131 del 31 maggio 2022) del Ministero delle Infrastrutture
e dei Trasporti. Alcune righe con anomalie di estrazione (testo sovrapposto, casella V/F mancante nel PDF
sorgente) sono state corrette manualmente confrontandole con il testo originale; i dettagli sono nella
cronologia del progetto.

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
- Nessun database: domande, esercizi ed immagini sono statici (bundle JSON + asset), tutta la logica del
  quiz e della correzione del carteggio gira nel browser.

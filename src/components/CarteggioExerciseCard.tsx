import type {
  CarteggioAnswerMap,
  CarteggioCandidateValue,
  CarteggioExercise,
  CarteggioExpectedAnswer,
  CarteggioQuesitoResult,
} from "@/lib/types";

type Props = {
  exercise: CarteggioExercise;
  index: number;
  total: number;
  answers: CarteggioAnswerMap;
  onChange: (n: number, value: CarteggioCandidateValue) => void;
  disabled?: boolean;
  results?: CarteggioQuesitoResult[];
};

const fieldClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900";

export default function CarteggioExerciseCard({
  exercise,
  index,
  total,
  answers,
  onChange,
  disabled = false,
  results,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>
          Esercizio {index + 1} di {total}
        </span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Carta {exercise.carta}
        </span>
      </div>

      {exercise.settore && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {exercise.settore}
        </p>
      )}

      <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-slate-900 dark:text-slate-50">
        {exercise.scenario}
      </p>

      <div className="flex flex-col gap-4">
        {exercise.quesiti.map((q) => {
          const candidate = answers[String(q.n)];
          const result = results?.find((r) => r.n === q.n);
          const caption =
            q.expected.type === "range" || q.expected.type === "single"
              ? q.expected.label || q.label
              : q.label;

          return (
            <div
              key={q.n}
              className={`rounded-xl border p-3 ${
                result
                  ? result.correct
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950"
                    : "border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {capitalize(caption)}
              </p>

              {(q.expected.type === "range" || q.expected.type === "single") && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    disabled={disabled}
                    value={
                      candidate?.type === "range" || candidate?.type === "single"
                        ? candidate.value ?? ""
                        : ""
                    }
                    onChange={(e) =>
                      onChange(q.n, {
                        type: q.expected.type,
                        value: e.target.value === "" ? null : Number(e.target.value),
                      } as CarteggioCandidateValue)
                    }
                    className={`${fieldClasses} max-w-[10rem]`}
                    placeholder="valore"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {q.expected.unit}
                  </span>
                </div>
              )}

              {q.expected.type === "time_range" && (
                <input
                  type="text"
                  disabled={disabled}
                  value={candidate?.type === "time_range" ? candidate.value : ""}
                  onChange={(e) => onChange(q.n, { type: "time_range", value: e.target.value })}
                  placeholder="HH:MM"
                  className={`${fieldClasses} max-w-[10rem]`}
                />
              )}

              {q.expected.type === "coordinate" && candidate?.type === "coordinate" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <CoordinateInput
                    label="Latitudine"
                    value={candidate.lat}
                    hemiOptions={["N", "S"]}
                    disabled={disabled}
                    onChange={(lat) => onChange(q.n, { ...candidate, lat })}
                  />
                  <CoordinateInput
                    label="Longitudine"
                    value={candidate.long}
                    hemiOptions={["E", "W"]}
                    disabled={disabled}
                    onChange={(long) => onChange(q.n, { ...candidate, long })}
                  />
                </div>
              )}

              {result && !result.correct && (
                <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">
                  Risposta ufficiale: {formatExpected(q.expected)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoordinateInput({
  label,
  value,
  hemiOptions,
  disabled,
  onChange,
}: {
  label: string;
  value: { deg: string; min: string; hemi: string };
  hemiOptions: [string, string];
  disabled?: boolean;
  onChange: (v: { deg: string; min: string; hemi: string }) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          inputMode="numeric"
          disabled={disabled}
          value={value.deg}
          onChange={(e) => onChange({ ...value, deg: e.target.value })}
          placeholder="gradi"
          className={`${fieldClasses} w-20`}
        />
        <span className="text-sm text-slate-400">°</span>
        <input
          type="number"
          inputMode="decimal"
          step="any"
          disabled={disabled}
          value={value.min}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          placeholder="minuti"
          className={`${fieldClasses} w-24`}
        />
        <span className="text-sm text-slate-400">&apos;</span>
        <select
          disabled={disabled}
          value={value.hemi}
          onChange={(e) => onChange({ ...value, hemi: e.target.value })}
          className={`${fieldClasses} w-16`}
        >
          <option value=""></option>
          <option value={hemiOptions[0]}>{hemiOptions[0]}</option>
          <option value={hemiOptions[1]}>{hemiOptions[1]}</option>
        </select>
      </div>
    </div>
  );
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatExpected(expected: CarteggioExpectedAnswer): string {
  switch (expected.type) {
    case "range":
      return `${expected.min} ÷ ${expected.max} ${expected.unit}`.trim();
    case "single":
      return `${expected.value} ${expected.unit}`.trim();
    case "time_range":
      return `${expected.min} ÷ ${expected.max}`;
    case "coordinate":
      return `Lat. ${expected.lat.deg}°(${expected.lat.minMin}÷${expected.lat.minMax}) ${expected.lat.hemi} - Long. ${expected.long.deg}°(${expected.long.minMin}÷${expected.long.minMax}) ${expected.long.hemi}`;
    default:
      return expected.raw;
  }
}

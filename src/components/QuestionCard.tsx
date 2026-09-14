import type { Question } from "@/lib/types";

type Props = {
  question: Question;
  index: number;
  total: number;
  selectedAnswerId: string | null;
  onSelect: (answerId: string) => void;
  categoryLabel?: string;
  showCorrectness?: boolean;
  disabled?: boolean;
};

export default function QuestionCard({
  question,
  index,
  total,
  selectedAnswerId,
  onSelect,
  categoryLabel,
  showCorrectness = false,
  disabled = false,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>
          Domanda {index + 1} di {total}
        </span>
        {categoryLabel && (
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {categoryLabel}
          </span>
        )}
      </div>

      <p className="mb-4 text-base font-semibold leading-relaxed text-slate-900 dark:text-slate-50">
        {question.text}
      </p>

      {question.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.image}
          alt="Immagine di riferimento per la domanda"
          className="mb-4 max-h-72 w-auto rounded-xl border border-slate-200 bg-white object-contain dark:border-slate-700"
        />
      )}

      <div className="flex flex-col gap-2">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswerId === answer.id;
          let stateClasses =
            "border-slate-200 hover:border-sky-400 hover:bg-sky-50 dark:border-slate-700 dark:hover:border-sky-600 dark:hover:bg-slate-800";

          if (showCorrectness) {
            if (answer.correct) {
              stateClasses =
                "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200";
            } else if (isSelected && !answer.correct) {
              stateClasses =
                "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200";
            } else {
              stateClasses = "border-slate-200 opacity-70 dark:border-slate-800";
            }
          } else if (isSelected) {
            stateClasses =
              "border-sky-600 bg-sky-50 text-sky-900 ring-1 ring-sky-600 dark:bg-sky-950 dark:text-sky-200";
          }

          return (
            <button
              key={answer.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(answer.id)}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition disabled:cursor-not-allowed ${stateClasses}`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold uppercase">
                {answer.id}
              </span>
              <span>{answer.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

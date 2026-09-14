type Props = {
  total: number;
  currentIndex: number;
  answeredFlags: boolean[];
  onJump: (index: number) => void;
};

export default function QuestionNav({ total, currentIndex, answeredFlags, onJump }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === currentIndex;
        const isAnswered = answeredFlags[i];
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-current={isCurrent}
            aria-label={`Vai alla domanda ${i + 1}${isAnswered ? " (risposta data)" : " (senza risposta)"}`}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
              isCurrent
                ? "bg-sky-600 text-white"
                : isAnswered
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

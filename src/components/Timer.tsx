function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

type Props = {
  seconds: number;
  mode: "countdown" | "stopwatch";
  warningThresholdSec?: number;
};

export default function Timer({ seconds, mode, warningThresholdSec = 60 }: Props) {
  const isWarning = mode === "countdown" && seconds <= warningThresholdSec;

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums ${
        isWarning
          ? "border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300"
          : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      }`}
      aria-live="polite"
    >
      <span aria-hidden>{mode === "countdown" ? "⏱" : "⏳"}</span>
      {formatTime(seconds)}
      {mode === "countdown" && <span className="hidden text-xs font-normal sm:inline">rimanenti</span>}
    </div>
  );
}

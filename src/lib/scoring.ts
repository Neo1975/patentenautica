import type { AnswerMap, QuizConfig, QuizResult, QuizSection, SectionResult } from "@/lib/types";

/**
 * Calcola l'esito di una singola sezione. Le domande senza risposta vengono
 * conteggiate come errore ai fini del superamento (come nell'esame reale, dove
 * una domanda non risposta nel tempo a disposizione è comunque un errore).
 */
export function computeSectionResult(section: QuizSection, answers: AnswerMap): SectionResult {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  for (const q of section.questions) {
    const chosenId = answers[q.id];
    if (!chosenId) {
      unanswered++;
      continue;
    }
    const chosen = q.answers.find((a) => a.id === chosenId);
    if (chosen?.correct) correct++;
    else wrong++;
  }

  const effectiveErrors = wrong + unanswered;
  const passed = section.maxErrors === null ? null : effectiveErrors <= section.maxErrors;

  return {
    key: section.key,
    label: section.label,
    total: section.questions.length,
    correct,
    wrong,
    unanswered,
    maxErrors: section.maxErrors,
    passed,
  };
}

export function computeQuizResult(
  config: QuizConfig,
  answersBySection: Record<string, AnswerMap>
): QuizResult {
  const sections = config.sections.map((s) =>
    computeSectionResult(s, answersBySection[s.key] ?? {})
  );

  const relevant = sections.filter((s) => s.passed !== null);
  const passed = relevant.length === 0 ? null : relevant.every((s) => s.passed);

  return {
    mode: config.mode,
    title: config.title,
    sections,
    passed,
    finishedAt: new Date().toISOString(),
  };
}

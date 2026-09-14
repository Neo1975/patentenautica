// Exhaustive self-check: for every exercise/quesito in the dataset, build a
// "midpoint correct" candidate answer and verify checkQuesito accepts it, and
// a clearly out-of-range candidate and verify checkQuesito rejects it.
// Run with: npx tsx scripts/verify-carteggio-check.ts
import carteggioData from "../src/data/carteggio.json";
import type { CarteggioCandidateValue, CarteggioExercise, CarteggioExpectedAnswer } from "../src/lib/types";
import { checkQuesito } from "../src/lib/carteggio-check";

const exercises = carteggioData as CarteggioExercise[];

function midpointCandidate(expected: CarteggioExpectedAnswer): CarteggioCandidateValue {
  switch (expected.type) {
    case "range": {
      if (expected.min <= expected.max) {
        return { type: "range", value: (expected.min + expected.max) / 2 };
      }
      // Circular range (e.g. "359° ÷ 005°"): midpoint wraps through 360°/000°.
      const span = (expected.max - expected.min + 360) % 360;
      const mid = (expected.min + span / 2) % 360;
      return { type: "range", value: mid };
    }
    case "single":
      return { type: "single", value: expected.value };
    case "time_range": {
      const toMin = (s: string) => {
        const [h, m] = s.split(":").map(Number);
        return h * 60 + m;
      };
      const mid = Math.round((toMin(expected.min) + toMin(expected.max)) / 2);
      const hh = Math.floor(mid / 60);
      const mm = mid % 60;
      return { type: "time_range", value: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}` };
    }
    case "coordinate":
      return {
        type: "coordinate",
        lat: {
          deg: String(expected.lat.deg),
          min: String(((expected.lat.minMin + expected.lat.minMax) / 2).toFixed(1)),
          hemi: expected.lat.hemi,
        },
        long: {
          deg: String(expected.long.deg),
          min: String(((expected.long.minMin + expected.long.minMax) / 2).toFixed(1)),
          hemi: expected.long.hemi,
        },
      };
    default:
      return { type: "raw", value: "" };
  }
}

function wrongCandidate(expected: CarteggioExpectedAnswer): CarteggioCandidateValue {
  switch (expected.type) {
    case "range":
      // For a normal range, anything far past the max is wrong. For a
      // "circular" wrap-around range (min > max, e.g. "359° ÷ 005°"), the
      // excluded arc is the midpoint between max and min.
      return {
        type: "range",
        value: expected.min <= expected.max ? expected.max + 1000 : (expected.max + expected.min) / 2,
      };
    case "single":
      return { type: "single", value: expected.value + 1000 };
    case "time_range":
      return { type: "time_range", value: "23:59" };
    case "coordinate":
      return {
        type: "coordinate",
        lat: { deg: "0", min: "0.0", hemi: expected.lat.hemi },
        long: { deg: "0", min: "0.0", hemi: expected.long.hemi },
      };
    default:
      return { type: "raw", value: "nope" };
  }
}

let total = 0;
let correctPass = 0;
const correctFail: { progressivo: string; n: number; expected: CarteggioExpectedAnswer }[] = [];
const wrongIncorrectlyAccepted: { progressivo: string; n: number }[] = [];

for (const ex of exercises) {
  for (const q of ex.quesiti) {
    total++;
    const mid = midpointCandidate(q.expected);
    if (checkQuesito(mid, q.expected)) correctPass++;
    else correctFail.push({ progressivo: ex.progressivo, n: q.n, expected: q.expected });

    // time_range with min==max (0-width window) may collide with "wrong" 23:59 only if window covers it; skip false-positive edge risk by using far-off wrong candidates already.
    const wrong = wrongCandidate(q.expected);
    if (checkQuesito(wrong, q.expected)) wrongIncorrectlyAccepted.push({ progressivo: ex.progressivo, n: q.n });
  }
}

console.log(`Total quesiti checked: ${total}`);
console.log(`Midpoint (should be correct) accepted: ${correctPass}/${total}`);
console.log(`Midpoint incorrectly rejected: ${correctFail.length}`);
for (const f of correctFail.slice(0, 20)) {
  console.log("  REJECTED:", f.progressivo, "quesito", f.n, JSON.stringify(f.expected));
}
console.log(`Out-of-range candidates incorrectly accepted: ${wrongIncorrectlyAccepted.length}`);
for (const f of wrongIncorrectlyAccepted.slice(0, 20)) {
  console.log("  FALSE POSITIVE:", f.progressivo, "quesito", f.n);
}

if (correctFail.length > 0 || wrongIncorrectlyAccepted.length > 0) {
  process.exitCode = 1;
} else {
  console.log("ALL CHECKS PASSED");
}

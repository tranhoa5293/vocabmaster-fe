
import { UserVocabulary, SRSScore } from '../types';

export function updateSRS(current: UserVocabulary, score: number): UserVocabulary {
  let { repetition, interval, easeFactor, totalCorrect, totalWrong } = current;

  if (score < 3) {
    repetition = 0;
    interval = 1;
    totalWrong += 1;
  } else {
    repetition += 1;
    totalCorrect += 1;
    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // SM-2 Formula for ease factor adjustment
    easeFactor = easeFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    ...current,
    repetition,
    interval,
    easeFactor,
    totalCorrect,
    totalWrong,
    lastResult: score >= 3 ? 'correct' : 'wrong',
    nextReviewAt: nextReviewAt.toISOString()
  };
}

export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      const substitutionCost = s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase() ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + substitutionCost // substitution
      );
    }
  }
  return d[m][n];
}

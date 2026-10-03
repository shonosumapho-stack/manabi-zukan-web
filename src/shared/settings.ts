const FURIGANA_KEY = 'manabi-furigana';
const SPECIAL_KEY = 'manabi-special';
const BEST_KEY = 'manabi-quiz-best';

export function isFuriganaEnabled(): boolean {
  const v = localStorage.getItem(FURIGANA_KEY);
  if (v === null) return true;
  return v === '1';
}

export function setFuriganaEnabled(enabled: boolean): void {
  localStorage.setItem(FURIGANA_KEY, enabled ? '1' : '0');
}

export function isSpecialVersionEnabled(): boolean {
  return localStorage.getItem(SPECIAL_KEY) === '1';
}

export function setSpecialVersionEnabled(enabled: boolean): void {
  localStorage.setItem(SPECIAL_KEY, enabled ? '1' : '0');
}

export function getBestQuizScore(): number {
  const v = localStorage.getItem(BEST_KEY);
  if (!v) return 0;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

export function setBestQuizScore(score: number): void {
  const prev = getBestQuizScore();
  if (score > prev) {
    localStorage.setItem(BEST_KEY, String(score));
  }
}

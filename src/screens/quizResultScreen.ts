import { el } from '../shared/dom';
import { setRubyText } from '../shared/furigana';
import { isFuriganaEnabled, setBestQuizScore, getBestQuizScore } from '../shared/settings';
import { screenHeader } from '../shared/ui';

export function renderQuizResult(
  root: HTMLElement,
  score: number,
  total: number,
  sectionId: string | null,
): void {
  if (!sectionId) {
    setBestQuizScore(score);
  }

  const screen = el('div', 'screen result-screen');
  screen.appendChild(screenHeader('けっか', '#/'));

  const scoreEl = el('p', 'result-score', `せいかい ${score} / ${total}`);
  screen.appendChild(scoreEl);

  if (!sectionId) {
    const best = el('p', 'result-best');
    setRubyText(
      best,
      `これまでのさいこう記録{きろく}　${getBestQuizScore()} もん`,
      isFuriganaEnabled(),
    );
    screen.appendChild(best);
  }

  const again = el('button', 'btn-primary', 'もういちど');
  again.type = 'button';
  again.addEventListener('click', () => {
    window.location.hash = sectionId ? `#/quiz?section=${sectionId}` : '#/quiz';
  });
  const home = el('a', 'btn-secondary', 'ホームへ');
  home.href = '#/';
  screen.append(again, home);
  root.replaceChildren(screen);
}

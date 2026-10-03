import { el } from '../shared/dom';
import { setRubyText } from '../shared/furigana';
import { loadZukanData } from '../shared/repository';
import { sectionButtonColor } from '../shared/sectionColors';
import { getBestQuizScore, isFuriganaEnabled } from '../shared/settings';
import { footerNote, furiganaToggle, specialToggle } from '../shared/ui';

export async function renderHome(root: HTMLElement): Promise<void> {
  root.innerHTML = '<p class="loading">読み込み中…</p>';
  const data = await loadZukanData();
  const furigana = isFuriganaEnabled();

  const screen = el('div', 'screen home-screen');
  const title = el('h1', 'home-title');
  setRubyText(title, 'まなび図鑑{ずかん}', furigana);
  const sub = el('p', 'home-sub');
  setRubyText(
    sub,
    'どうぶつ・のりもの・からだ・食材{しょくざい}など いっぱいたんけんしよう',
    furigana,
  );

  const actions = el('div', 'home-actions');
  for (const section of data.sections) {
    const btn = el('a', 'home-btn section-btn');
    btn.href = `#/section/${section.id}`;
    btn.style.background = sectionButtonColor(section.buttonBg);
    setRubyText(btn, section.titleRuby, furigana);
    actions.appendChild(btn);
  }
  const quiz = el('a', 'home-btn section-btn');
  quiz.href = '#/quiz';
  quiz.style.background = sectionButtonColor('bg_btn_quiz');
  quiz.textContent = 'なんでもクイズ（10もん）';
  actions.appendChild(quiz);

  const best = el('p', 'home-best');
  const bestScore = getBestQuizScore();
  if (bestScore > 0) {
    best.textContent = `なんでもクイズ さいこう記録 ${bestScore} もん`;
  }

  const redraw = () => void renderHome(root);
  screen.append(
    title,
    sub,
    furiganaToggle(redraw),
    specialToggle(redraw),
    actions,
    best,
    footerNote(),
  );
  root.replaceChildren(screen);
}

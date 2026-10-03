import { el } from '../shared/dom';
import { setRubyText } from '../shared/furigana';
import {
  getSection,
  loadZukanData,
  makeQuiz,
  makeSectionQuiz,
} from '../shared/repository';
import type { QuizQuestion } from '../shared/types';
import { isFuriganaEnabled, isSpecialVersionEnabled } from '../shared/settings';
import { screenHeader } from '../shared/ui';

const SESSION_KEY = 'manabi-quiz-session';

export async function renderQuiz(root: HTMLElement, sectionId: string | null): Promise<void> {
  root.innerHTML = '<p class="loading">読み込み中…</p>';
  const data = await loadZukanData();
  const includeSpecial = isSpecialVersionEnabled();
  const section = sectionId ? getSection(data, sectionId) : undefined;
  if (sectionId && !section) {
    root.innerHTML = '<p class="error">図鑑が見つかりません</p>';
    return;
  }
  const questions: QuizQuestion[] = section
    ? makeSectionQuiz(section, 5, includeSpecial)
    : makeQuiz(data, 10, includeSpecial);

  if (!questions.length) {
    root.innerHTML = '<p class="error">クイズを作れませんでした</p>';
    return;
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ sectionId, questions, index: 0, correct: 0 }),
  );

  const screen = el('div', 'screen quiz-screen');
  const backHref = sectionId ? `#/section/${sectionId}` : '#/';
  screen.appendChild(screenHeader(sectionId ? '図鑑クイズ' : 'なんでもクイズ', backHref));

  let index = 0;
  let correctCount = 0;
  let answered = false;

  const progress = el('p', 'quiz-progress', '');
  const sectionEl = el('p', 'quiz-section');
  const questionEl = el('p', 'quiz-question');
  const hints = el('div', 'quiz-hints');
  const feedback = el('p', 'quiz-feedback');
  feedback.hidden = true;
  const choices = el('div', 'quiz-choices');
  const after = el('div', 'quiz-after');
  after.hidden = true;
  const detailBtn = el('button', 'btn-secondary', 'くわしく みる');
  detailBtn.type = 'button';
  const nextBtn = el('button', 'btn-primary', 'つぎへ');
  nextBtn.type = 'button';
  after.append(detailBtn, nextBtn);
  screen.append(progress, sectionEl, questionEl, hints, choices, feedback, after);
  root.replaceChildren(screen);

  const furigana = () => isFuriganaEnabled();

  const renderQuestion = () => {
    answered = false;
    const q = questions[index];
    progress.textContent = `もんだい ${index + 1} / ${questions.length}`;
    sectionEl.replaceChildren();
    questionEl.replaceChildren();
    setRubyText(sectionEl, q.sectionTitleRuby, furigana());
    setRubyText(questionEl, q.questionRuby, furigana());
    hints.replaceChildren();
    for (const hint of q.hints) {
      const block = el('div', 'quiz-hint');
      const label = el('span', 'quiz-hint-label');
      setRubyText(label, `${hint.labelRuby}：`, furigana());
      const value = el('span', '');
      setRubyText(value, hint.valueRuby, furigana());
      block.append(label, value);
      hints.appendChild(block);
    }
    feedback.hidden = true;
    after.hidden = true;
    choices.replaceChildren();

    for (const choice of q.choices) {
      const btn = el('button', 'quiz-choice');
      btn.type = 'button';
      btn.dataset.entryId = choice.id;
      setRubyText(btn, choice.nameRuby, furigana());
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const ok = choice.id === q.entry.id;
        if (ok) correctCount++;
        for (const child of choices.querySelectorAll('.quiz-choice')) {
          const b = child as HTMLButtonElement;
          b.disabled = true;
          const id = b.dataset.entryId;
          if (id === q.entry.id) b.classList.add('quiz-choice--correct');
          else if (id === choice.id && !ok) b.classList.add('quiz-choice--wrong');
        }
        feedback.textContent = ok ? 'せいかい！' : 'ざんねん…';
        feedback.hidden = false;
        after.hidden = false;
        nextBtn.textContent = index >= questions.length - 1 ? 'けっかをみる' : 'つぎへ';
        detailBtn.onclick = () => {
          window.location.hash = `#/entry/${q.entry.id}`;
        };
      });
      choices.appendChild(btn);
    }
  };

  nextBtn.addEventListener('click', () => {
    if (index >= questions.length - 1) {
      sessionStorage.removeItem(SESSION_KEY);
      const sectionParam = sectionId ? `&section=${sectionId}` : '';
      window.location.hash = `#/quiz/result?score=${correctCount}&total=${questions.length}${sectionParam}`;
    } else {
      index++;
      renderQuestion();
    }
  });

  renderQuestion();
}

import { el } from '../shared/dom';
import { setRubyText, stripRuby } from '../shared/furigana';
import { illustrationUrl } from '../shared/illustrations';
import { getSection, listEntries, loadZukanData } from '../shared/repository';
import { isFuriganaEnabled, isSpecialVersionEnabled } from '../shared/settings';
import { screenHeader } from '../shared/ui';

export async function renderGroupList(root: HTMLElement, sectionId: string): Promise<void> {
  root.innerHTML = '<p class="loading">読み込み中…</p>';
  const data = await loadZukanData();
  const section = getSection(data, sectionId);
  if (!section) {
    root.innerHTML = '<p class="error">図鑑が見つかりません</p>';
    return;
  }
  const furigana = isFuriganaEnabled();
  const includeSpecial = isSpecialVersionEnabled();

  const screen = el('div', 'screen');
  screen.appendChild(screenHeader(stripRuby(section.titleRuby), '#/'));
  const title = el('h1', 'screen-title screen-title--below');
  setRubyText(title, section.titleRuby, furigana);
  screen.appendChild(title);

  const sub = el('p', 'list-sub');
  setRubyText(sub, section.groupLabelRuby, furigana);
  screen.appendChild(sub);

  const list = el('div', 'list');
  for (const group of section.groups) {
    const entries = listEntries(section, group.id, includeSpecial);
    if (!entries.length) continue;
    const row = el('button', 'list-row');
    row.type = 'button';
    const thumb = document.createElement('img');
    thumb.className = 'list-thumb';
    thumb.src = illustrationUrl(entries[0].illustration);
    thumb.alt = '';
    thumb.loading = 'lazy';
    const body = el('div', 'list-row-body');
    const h2 = el('h2', 'list-row-title');
    setRubyText(h2, group.nameRuby, furigana);
    body.appendChild(h2);
    if (group.summaryRuby) {
      const sum = el('p', 'list-row-sub');
      setRubyText(sum, group.summaryRuby, furigana);
      body.appendChild(sum);
    }
    row.append(thumb, body);
    row.addEventListener('click', () => {
      window.location.hash = `#/section/${sectionId}/group/${group.id}`;
    });
    list.appendChild(row);
  }

  const allRow = el('button', 'list-row list-row--plain');
  allRow.type = 'button';
  allRow.textContent = 'ぜんぶ みる';
  allRow.addEventListener('click', () => {
    window.location.hash = `#/section/${sectionId}/entries`;
  });
  list.appendChild(allRow);

  const quizRow = el('button', 'list-row list-row--plain');
  quizRow.type = 'button';
  const quizTitle = el('span', 'list-row-title', 'この図鑑のクイズ（5もん）');
  const quizHint = el('p', 'list-row-sub', 'おぼえたか ためしてみよう');
  const quizBody = el('div', 'list-row-body');
  quizBody.append(quizTitle, quizHint);
  quizRow.appendChild(quizBody);
  quizRow.addEventListener('click', () => {
    window.location.hash = `#/quiz?section=${sectionId}`;
  });
  list.appendChild(quizRow);

  screen.appendChild(list);
  root.replaceChildren(screen);
}

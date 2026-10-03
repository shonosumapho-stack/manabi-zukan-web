import { el } from '../shared/dom';
import { setRubyText } from '../shared/furigana';
import { illustrationUrl } from '../shared/illustrations';
import { getEntry, getGroup, getSection, loadZukanData } from '../shared/repository';
import { isFuriganaEnabled } from '../shared/settings';
import { screenHeader } from '../shared/ui';

export async function renderEntryDetail(root: HTMLElement, entryId: string): Promise<void> {
  root.innerHTML = '<p class="loading">読み込み中…</p>';
  const data = await loadZukanData();
  const entry = getEntry(entryId);
  if (!entry) {
    root.innerHTML = '<p class="error">見つかりません</p><a href="#/">ホームへ</a>';
    return;
  }
  const section = getSection(data, entry.sectionId);
  const group = section ? getGroup(section, entry.groupId) : undefined;
  const furigana = isFuriganaEnabled();

  const screen = el('div', 'screen detail-screen');
  screen.appendChild(screenHeader('くわしく', `#/section/${entry.sectionId}/entries`));

  const hero = document.createElement('img');
  hero.className = 'detail-hero';
  hero.src = illustrationUrl(entry.illustration);
  hero.alt = '';

  const name = el('h1', 'detail-name');
  setRubyText(name, entry.nameRuby, furigana);
  const groupEl = el('p', 'detail-group');
  if (group) setRubyText(groupEl, group.nameRuby, furigana);
  const summary = el('p', 'detail-summary');
  setRubyText(summary, entry.summaryRuby, furigana);

  const facts = el('div', 'fact-list');
  for (const fact of entry.facts) {
    const block = el('div', 'fact-block');
    const label = el('div', 'fact-label');
    setRubyText(label, fact.labelRuby, furigana);
    const value = el('div', 'fact-value');
    setRubyText(value, fact.valueRuby, furigana);
    block.append(label, value);
    facts.appendChild(block);
  }

  const triviaLabel = el('h2', 'detail-trivia-label', 'まめちしき');
  const trivia = el('p', 'detail-trivia');
  setRubyText(trivia, entry.triviaRuby, furigana);

  screen.append(hero, name, groupEl, summary, facts, triviaLabel, trivia);
  root.replaceChildren(screen);
}

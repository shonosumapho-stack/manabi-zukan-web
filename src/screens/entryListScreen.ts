import { el } from '../shared/dom';
import { setRubyText, stripRuby } from '../shared/furigana';
import { illustrationUrl } from '../shared/illustrations';
import { getGroup, getSection, listEntries, loadZukanData } from '../shared/repository';
import { isFuriganaEnabled, isSpecialVersionEnabled } from '../shared/settings';
import { screenHeader } from '../shared/ui';

export async function renderEntryList(
  root: HTMLElement,
  sectionId: string,
  groupId: string | null,
): Promise<void> {
  root.innerHTML = '<p class="loading">読み込み中…</p>';
  const data = await loadZukanData();
  const section = getSection(data, sectionId);
  if (!section) {
    root.innerHTML = '<p class="error">図鑑が見つかりません</p>';
    return;
  }
  const group = groupId ? getGroup(section, groupId) : undefined;
  const furigana = isFuriganaEnabled();
  const includeSpecial = isSpecialVersionEnabled();
  const entries = listEntries(section, groupId, includeSpecial);

  const screen = el('div', 'screen');
  const headerTitle = group?.nameRuby ?? section.titleRuby;
  screen.appendChild(screenHeader(stripRuby(headerTitle), `#/section/${sectionId}`));
  const title = el('h1', 'screen-title screen-title--below');
  setRubyText(title, headerTitle, furigana);
  screen.appendChild(title);

  const sub = el('p', 'list-sub');
  setRubyText(sub, group?.summaryRuby ?? section.subtitleRuby, furigana);
  screen.appendChild(sub);

  const list = el('div', 'list');
  for (const entry of entries) {
    const row = el('button', 'list-row');
    row.type = 'button';
    const thumb = document.createElement('img');
    thumb.className = 'list-thumb';
    thumb.src = illustrationUrl(entry.illustration);
    thumb.alt = '';
    thumb.loading = 'lazy';
    const body = el('div', 'list-row-body');
    const h2 = el('h2', 'list-row-title');
    setRubyText(h2, entry.nameRuby, furigana);
    body.appendChild(h2);
    const fact = entry.facts[0];
    if (fact) {
      const sum = el('p', 'list-row-sub');
      setRubyText(sum, fact.valueRuby, furigana);
      body.appendChild(sum);
    }
    row.append(thumb, body);
    row.addEventListener('click', () => {
      window.location.hash = `#/entry/${entry.id}`;
    });
    list.appendChild(row);
  }

  screen.appendChild(list);
  root.replaceChildren(screen);
}

import { el } from './dom';
import {
  isFuriganaEnabled,
  isSpecialVersionEnabled,
  setFuriganaEnabled,
  setSpecialVersionEnabled,
} from './settings';

export function screenHeader(title: string, backHref: string): HTMLElement {
  const header = el('div', 'screen-header');
  const back = el('a', 'btn-ghost', '← もどる');
  back.href = backHref;
  const h1 = el('h1', 'screen-title', title);
  header.append(back, h1);
  return header;
}

export function furiganaToggle(onChange: () => void): HTMLElement {
  const wrap = el('label', 'furigana-toggle');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = isFuriganaEnabled();
  input.addEventListener('change', () => {
    setFuriganaEnabled(input.checked);
    onChange();
  });
  wrap.append(input, ' ふりがな');
  return wrap;
}

export function specialToggle(onChange: () => void): HTMLElement {
  const wrap = el('label', 'special-toggle');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = isSpecialVersionEnabled();
  input.addEventListener('change', () => {
    setSpecialVersionEnabled(input.checked);
    onChange();
  });
  const label = el('span', '', ' とくべつバージョン');
  wrap.append(input, label);
  const hint = el(
    'p',
    'special-hint',
    'ONにすると どうぶつ・むし・恐竜が いっぱいに ふえるよ',
  );
  const block = el('div', 'special-block');
  block.append(wrap, hint);
  return block;
}

export function footerNote(): HTMLElement {
  return el(
    'p',
    'footer-note',
    'きになったことは おうちのひとや 図書室の本でも しらべてみよう',
  );
}

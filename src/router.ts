import { renderEntryDetail } from './screens/entryDetailScreen';
import { renderEntryList } from './screens/entryListScreen';
import { renderGroupList } from './screens/groupListScreen';
import { renderHome } from './screens/homeScreen';
import { renderQuiz } from './screens/quizScreen';
import { renderQuizResult } from './screens/quizResultScreen';

function routePath(hash: string): string {
  const base = hash.replace(/^#/, '').split('?')[0];
  return base || '/';
}

function parseQuery(hash: string): URLSearchParams {
  const q = hash.indexOf('?');
  if (q < 0) return new URLSearchParams();
  return new URLSearchParams(hash.slice(q + 1));
}

export function startRouter(root: HTMLElement): void {
  const render = () => {
    const path = routePath(window.location.hash);
    const parts = path.split('/').filter(Boolean);
    const query = parseQuery(window.location.hash);

    if (path === '/' || path === '') {
      void renderHome(root);
      return;
    }
    if (parts[0] === 'section' && parts[1] && parts[2] === 'group' && parts[3]) {
      void renderEntryList(root, parts[1], parts[3]);
      return;
    }
    if (parts[0] === 'section' && parts[1] && parts[2] === 'entries') {
      void renderEntryList(root, parts[1], null);
      return;
    }
    if (parts[0] === 'section' && parts[1] && parts.length === 2) {
      void renderGroupList(root, parts[1]);
      return;
    }
    if (parts[0] === 'entry' && parts[1]) {
      void renderEntryDetail(root, parts[1]);
      return;
    }
    if (path === '/quiz') {
      const sectionId = query.get('section');
      void renderQuiz(root, sectionId);
      return;
    }
    if (parts[0] === 'quiz' && parts[1] === 'result') {
      const score = parseInt(query.get('score') ?? '0', 10);
      const total = parseInt(query.get('total') ?? '5', 10);
      const sectionId = query.get('section');
      renderQuizResult(root, score, total, sectionId);
      return;
    }

    root.innerHTML = '<p class="error">ページが見つかりません</p><a href="#/">ホームへ</a>';
  };

  window.addEventListener('hashchange', render);
  if (!window.location.hash) {
    window.location.hash = '#/';
  }
  render();
}

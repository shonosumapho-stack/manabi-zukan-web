import type { Entry, Fact, Group, QuizQuestion, Section, ZukanData } from './types';

let cache: ZukanData | null = null;
const entryById = new Map<string, Entry>();
const sectionById = new Map<string, Section>();

function parseFacts(arr: unknown): Fact[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    const o = item as Record<string, string>;
    return { labelRuby: o.labelRuby ?? '', valueRuby: o.valueRuby ?? '' };
  });
}

function parseSections(raw: ZukanData): Section[] {
  return raw.sections.map((s) => {
    const sectionId = s.id;
    const entries: Entry[] = (s.entries as unknown as Record<string, unknown>[]).map((o) => ({
      id: String(o.id),
      sectionId,
      groupId: String(o.groupId),
      nameRuby: String(o.nameRuby),
      illustration: String(o.illustration),
      summaryRuby: String(o.summaryRuby ?? ''),
      facts: parseFacts(o.facts),
      triviaRuby: String(o.triviaRuby ?? ''),
      quizHints: parseFacts(o.quizHints),
      special: Boolean(o.special),
    }));
    return {
      id: sectionId,
      titleRuby: s.titleRuby,
      subtitleRuby: s.subtitleRuby,
      buttonBg: s.buttonBg,
      groupLabelRuby: s.groupLabelRuby,
      quizQuestionRuby: s.quizQuestionRuby,
      groups: s.groups,
      entries,
    };
  });
}

export async function loadZukanData(): Promise<ZukanData> {
  if (cache) return cache;
  const res = await fetch('/assets/zukan.json');
  if (!res.ok) throw new Error('Failed to load zukan.json');
  const raw = (await res.json()) as ZukanData;
  const sections = parseSections(raw);
  cache = { sections };
  entryById.clear();
  sectionById.clear();
  for (const section of sections) {
    sectionById.set(section.id, section);
    for (const entry of section.entries) {
      entryById.set(entry.id, entry);
    }
  }
  return cache;
}

export function allSections(data: ZukanData): Section[] {
  return data.sections;
}

export function getSection(data: ZukanData, id: string): Section | undefined {
  return sectionById.get(id) ?? data.sections.find((s) => s.id === id);
}

export function getEntry(id: string): Entry | undefined {
  return entryById.get(id);
}

export function getGroup(section: Section, groupId: string): Group | undefined {
  return section.groups.find((g) => g.id === groupId);
}

export function listEntries(
  section: Section,
  groupId: string | null,
  includeSpecial: boolean,
): Entry[] {
  let list = section.entries.filter((e) => includeSpecial || !e.special);
  if (groupId) list = list.filter((e) => e.groupId === groupId);
  return list;
}

function quizHintsFor(entry: Entry): Fact[] {
  return entry.quizHints.length > 0 ? entry.quizHints : entry.facts.slice(0, 3);
}

function buildQuestions(picked: Entry[], includeSpecial: boolean): QuizQuestion[] {
  return picked.map((correct) => {
    const section = sectionById.get(correct.sectionId);
    const siblings =
      section?.entries.filter((e) => e.id !== correct.id && (includeSpecial || !e.special)) ?? [];
    const wrong = shuffle(siblings).slice(0, 3);
    return {
      entry: correct,
      sectionTitleRuby: section?.titleRuby ?? '',
      questionRuby: section?.quizQuestionRuby ?? '',
      hints: quizHintsFor(correct),
      choices: shuffle([...wrong, correct]),
    };
  });
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function makeQuiz(data: ZukanData, count: number, includeSpecial: boolean): QuizQuestion[] {
  const picked: Entry[] = [];
  const pools = new Map<string, Entry[]>();
  for (const section of data.sections) {
    pools.set(
      section.id,
      shuffle(section.entries.filter((e) => includeSpecial || !e.special)),
    );
  }
  let round = 0;
  while (picked.length < count && round < 100) {
    let added = false;
    for (const section of data.sections) {
      if (picked.length >= count) break;
      const pool = pools.get(section.id);
      if (!pool?.length) continue;
      picked.push(pool.shift()!);
      added = true;
    }
    if (!added) break;
    round++;
  }
  return buildQuestions(shuffle(picked), includeSpecial);
}

export function makeSectionQuiz(
  section: Section,
  count: number,
  includeSpecial: boolean,
): QuizQuestion[] {
  const entries = shuffle(listEntries(section, null, includeSpecial));
  return buildQuestions(entries.slice(0, Math.min(count, entries.length)), includeSpecial);
}

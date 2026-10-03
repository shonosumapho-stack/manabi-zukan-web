export interface Fact {
  labelRuby: string;
  valueRuby: string;
}

export interface Group {
  id: string;
  nameRuby: string;
  summaryRuby: string;
}

export interface Entry {
  id: string;
  sectionId: string;
  groupId: string;
  nameRuby: string;
  illustration: string;
  summaryRuby: string;
  facts: Fact[];
  triviaRuby: string;
  quizHints: Fact[];
  special: boolean;
}

export interface Section {
  id: string;
  titleRuby: string;
  subtitleRuby: string;
  buttonBg: string;
  groupLabelRuby: string;
  quizQuestionRuby: string;
  groups: Group[];
  entries: Entry[];
}

export interface ZukanData {
  sections: Section[];
}

export interface QuizQuestion {
  entry: Entry;
  sectionTitleRuby: string;
  questionRuby: string;
  hints: Fact[];
  choices: Entry[];
}

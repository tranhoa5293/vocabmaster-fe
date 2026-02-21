
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  isFavorite?: boolean;
  activeLearners?: number;
}

export interface Lesson {
  id: string;
  collectionId: string;
  name: string;
  isFavorite?: boolean;
  activeLearners?: number;
  totalWord?: number;
}

export interface Vocabulary {
  id: string;
  lessonId: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example?: string;
}

export interface UserVocabulary {
  userId: string;
  vocabId: string;
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReviewAt: string;
  lastResult: 'correct' | 'wrong' | null;
  totalCorrect: number;
  totalWrong: number;
}

export type LearningMode = 'flashcard' | 'match' | 'multiple-choice' | 'input' | 'speed-learn' | 'dashboard' | 'browse' | 'articles';

export interface SessionStep {
  mode: LearningMode;
  title: string;
}

export enum SRSScore {
  WRONG = 0,
  HARD = 3,
  GOOD = 5
}

export type Language = 'vi' | 'en';

export interface ActiveLearner {
  name: string;
  action: string;
  time: string;
  icon: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  rank?: number;
}

export interface LeaderboardData {
  topUsers: LeaderboardEntry[];
  userScore: number;
  userRank?: number;
}

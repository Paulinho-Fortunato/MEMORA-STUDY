// Tipos principais do aplicativo

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: number;
  updatedAt: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'new';
  nextReview: number;
  interval: number;
  easeFactor: number;
  createdAt: number;
  updatedAt: number;
}

export interface StudySession {
  id: string;
  subjectId?: string;
  topicId?: string;
  startTime: number;
  endTime: number;
  duration: number;
  concentration: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: number;
}

export interface Review {
  id: string;
  flashcardId: string;
  topicId?: string;
  scheduledDate: number;
  completedDate?: number;
  status: 'pending' | 'completed' | 'overdue';
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: number;
}

export interface FeynmanNote {
  id: string;
  topicId: string;
  concept: string;
  explanation: string;
  difficulties: string[];
  simplifiedExplanation?: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface Connection {
  id: string;
  topicId: string;
  type: 'analogy' | 'connection' | 'curiosity' | 'humor' | 'personal';
  content: string;
  createdAt: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  sessionDuration: number;
  breakDuration: number;
  reviewIntervals: number[];
  notificationsEnabled: boolean;
  studyHours: { start: number; end: number };
  weekStart: 'sunday' | 'monday';
  name: string;
  onboardingCompleted: boolean;
}

export interface Statistics {
  totalStudyTime: number;
  sessionsCompleted: number;
  topicsLearned: number;
  reviewsCompleted: number;
  streak: number;
  lastStudyDate: number | null;
  weeklyData: { date: string; minutes: number }[];
}

export interface AppData {
  subjects: Subject[];
  topics: Topic[];
  flashcards: Flashcard[];
  sessions: StudySession[];
  reviews: Review[];
  feynmanNotes: FeynmanNote[];
  connections: Connection[];
  settings: UserSettings;
  statistics: Statistics;
}

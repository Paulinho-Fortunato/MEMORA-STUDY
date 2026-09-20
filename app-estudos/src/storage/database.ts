// Storage local usando IndexedDB com idb

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { AppData, Subject, Topic, Flashcard, StudySession, Review, FeynmanNote, Connection, UserSettings, Statistics } from '../types';

interface StudyDB extends DBSchema {
  subjects: {
    key: string;
    value: Subject;
  };
  topics: {
    key: string;
    value: Topic;
    indexes: { subjectId: string };
  };
  flashcards: {
    key: string;
    value: Flashcard;
    indexes: { topicId: string; nextReview: number };
  };
  sessions: {
    key: string;
    value: StudySession;
    indexes: { startTime: number; subjectId: string };
  };
  reviews: {
    key: string;
    value: Review;
    indexes: { scheduledDate: number; status: string; flashcardId: string };
  };
  feynmanNotes: {
    key: string;
    value: FeynmanNote;
    indexes: { topicId: string };
  };
  connections: {
    key: string;
    value: Connection;
    indexes: { topicId: string };
  };
  settings: {
    key: string;
    value: UserSettings & { key: string };
  };
  statistics: {
    key: string;
    value: Statistics & { key: string };
  };
}

const DB_NAME = 'study-app-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<StudyDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<StudyDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<StudyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('subjects')) {
        db.createObjectStore('subjects', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('topics')) {
        const topicStore = db.createObjectStore('topics', { keyPath: 'id' });
        topicStore.createIndex('subjectId', 'subjectId');
      }
      if (!db.objectStoreNames.contains('flashcards')) {
        const flashcardStore = db.createObjectStore('flashcards', { keyPath: 'id' });
        flashcardStore.createIndex('topicId', 'topicId');
        flashcardStore.createIndex('nextReview', 'nextReview');
      }
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
        sessionStore.createIndex('startTime', 'startTime');
        sessionStore.createIndex('subjectId', 'subjectId');
      }
      if (!db.objectStoreNames.contains('reviews')) {
        const reviewStore = db.createObjectStore('reviews', { keyPath: 'id' });
        reviewStore.createIndex('scheduledDate', 'scheduledDate');
        reviewStore.createIndex('status', 'status');
        reviewStore.createIndex('flashcardId', 'flashcardId');
      }
      if (!db.objectStoreNames.contains('feynmanNotes')) {
        const noteStore = db.createObjectStore('feynmanNotes', { keyPath: 'id' });
        noteStore.createIndex('topicId', 'topicId');
      }
      if (!db.objectStoreNames.contains('connections')) {
        const connectionStore = db.createObjectStore('connections', { keyPath: 'id' });
        connectionStore.createIndex('topicId', 'topicId');
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('statistics')) {
        db.createObjectStore('statistics', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
}

type StoreName = 'subjects' | 'topics' | 'flashcards' | 'sessions' | 'reviews' | 'feynmanNotes' | 'connections' | 'settings' | 'statistics';

export async function getAll<T extends StoreName>(storeName: T): Promise<StudyDB[T]['value'][]> {
  const db = await getDB();
  return db.getAll(storeName) as unknown as StudyDB[T]['value'][];
}

export async function getById<T extends StoreName>(storeName: T, id: string): Promise<StudyDB[T]['value'] | undefined> {
  const db = await getDB();
  return db.get(storeName, id) as unknown as StudyDB[T]['value'] | undefined;
}

export async function put<T extends StoreName>(storeName: T, item: StudyDB[T]['value']): Promise<void> {
  const db = await getDB();
  await db.put(storeName, item as any);
}

export async function deleteItem<T extends StoreName>(storeName: T, id: string): Promise<void> {
  const db = await getDB();
  await db.delete(storeName, id);
}

export async function getSettings(): Promise<UserSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'user');
  
  if (!settings) {
    const defaultSettings: UserSettings = {
      theme: 'auto',
      accentColor: '#007AFF',
      fontSize: 'medium',
      sessionDuration: 25,
      breakDuration: 5,
      reviewIntervals: [1, 7, 15, 30],
      notificationsEnabled: true,
      studyHours: { start: 8, end: 22 },
      weekStart: 'monday',
      name: '',
      onboardingCompleted: false,
    };
    await db.put('settings', { key: 'user', ...defaultSettings } as any);
    return defaultSettings;
  }
  
  const { key, ...rest } = settings;
  return rest;
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const db = await getDB();
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await db.put('settings', { key: 'user', ...updated } as any);
  return updated;
}

export async function getStatistics(): Promise<Statistics> {
  const db = await getDB();
  const stats = await db.get('statistics', 'user');
  
  if (!stats) {
    const defaultStats: Statistics = {
      totalStudyTime: 0,
      sessionsCompleted: 0,
      topicsLearned: 0,
      reviewsCompleted: 0,
      streak: 0,
      lastStudyDate: null,
      weeklyData: [],
    };
    await db.put('statistics', { key: 'user', ...defaultStats } as any);
    return defaultStats;
  }
  
  const { key, ...rest } = stats;
  return rest;
}

export async function updateStatistics(stats: Partial<Statistics>): Promise<Statistics> {
  const db = await getDB();
  const current = await getStatistics();
  const updated = { ...current, ...stats };
  await db.put('statistics', { key: 'user', ...updated } as any);
  return updated;
}

export async function exportAllData(): Promise<AppData> {
  const db = await getDB();
  
  const [subjects, topics, flashcards, sessions, reviews, feynmanNotes, connections, settings, statistics] = await Promise.all([
    db.getAll('subjects'),
    db.getAll('topics'),
    db.getAll('flashcards'),
    db.getAll('sessions'),
    db.getAll('reviews'),
    db.getAll('feynmanNotes'),
    db.getAll('connections'),
    getSettings(),
    getStatistics(),
  ]);
  
  return {
    subjects,
    topics,
    flashcards,
    sessions,
    reviews,
    feynmanNotes,
    connections,
    settings,
    statistics,
  };
}

export async function importAllData(data: AppData): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['subjects', 'topics', 'flashcards', 'sessions', 'reviews', 'feynmanNotes', 'connections', 'settings', 'statistics'], 'readwrite');
  
  await tx.objectStore('subjects').clear();
  await tx.objectStore('topics').clear();
  await tx.objectStore('flashcards').clear();
  await tx.objectStore('sessions').clear();
  await tx.objectStore('reviews').clear();
  await tx.objectStore('feynmanNotes').clear();
  await tx.objectStore('connections').clear();
  
  for (const subject of data.subjects) {
    await tx.objectStore('subjects').put(subject);
  }
  for (const topic of data.topics) {
    await tx.objectStore('topics').put(topic);
  }
  for (const flashcard of data.flashcards) {
    await tx.objectStore('flashcards').put(flashcard);
  }
  for (const session of data.sessions) {
    await tx.objectStore('sessions').put(session);
  }
  for (const review of data.reviews) {
    await tx.objectStore('reviews').put(review);
  }
  for (const note of data.feynmanNotes) {
    await tx.objectStore('feynmanNotes').put(note);
  }
  for (const connection of data.connections) {
    await tx.objectStore('connections').put(connection);
  }
  
  await tx.objectStore('settings').put({ key: 'user', ...data.settings } as any);
  await tx.objectStore('statistics').put({ key: 'user', ...data.statistics } as any);
  
  await tx.done;
}

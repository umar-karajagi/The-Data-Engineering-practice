import { BookReference } from '../types';

const STORAGE_CUSTOM_BOOKS_KEY = 'dataforge_custom_books_shelf_v1';
const STORAGE_READING_PROGRESS_KEY = 'dataforge_reading_progress_v1';
const STORAGE_BOOKMARKS_KEY = 'dataforge_book_bookmarks_v1';

/**
 * Retrieve all user-uploaded custom books from localStorage
 */
export function getCustomBooks(): BookReference[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_BOOKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BookReference[];
  } catch (e) {
    console.error('Failed to load custom books from storage', e);
    return [];
  }
}

/**
 * Persist a newly parsed or updated custom book
 */
export function saveCustomBook(book: BookReference): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomBooks();
    const filtered = existing.filter(b => b.id !== book.id);
    const updated = [book, ...filtered];
    localStorage.setItem(STORAGE_CUSTOM_BOOKS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom book to storage', e);
  }
}

/**
 * Delete a user-uploaded book from local storage
 */
export function deleteCustomBook(bookId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomBooks();
    const updated = existing.filter(b => b.id !== bookId);
    localStorage.setItem(STORAGE_CUSTOM_BOOKS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete custom book', e);
  }
}

/**
 * Reading progress per book
 */
export interface ReadingProgressRecord {
  lastChapterId: string;
  scrollPercent: number;
  completedChapterIds: string[];
  updatedAt: string;
}

export function getReadingProgress(bookId: string): ReadingProgressRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_READING_PROGRESS_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw);
    return all[bookId] || null;
  } catch (e) {
    return null;
  }
}

export function saveReadingProgress(
  bookId: string,
  chapterId: string,
  scrollPercent: number,
  markChapterCompleted?: boolean
): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_READING_PROGRESS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const existing = all[bookId] || { completedChapterIds: [] };
    
    const completedChapters = new Set<string>(existing.completedChapterIds || []);
    if (markChapterCompleted) {
      completedChapters.add(chapterId);
    }

    all[bookId] = {
      lastChapterId: chapterId,
      scrollPercent: Math.round(scrollPercent),
      completedChapterIds: Array.from(completedChapters),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_READING_PROGRESS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save reading progress', e);
  }
}

/**
 * Bookmarks management
 */
export function getBookmarkedChapters(bookId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw);
    return all[bookId] || [];
  } catch (e) {
    return [];
  }
}

export function toggleChapterBookmark(bookId: string, chapterId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const existing: string[] = all[bookId] || [];
    
    let updated: string[];
    if (existing.includes(chapterId)) {
      updated = existing.filter(id => id !== chapterId);
    } else {
      updated = [...existing, chapterId];
    }
    
    all[bookId] = updated;
    localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(all));
    return updated;
  } catch (e) {
    console.error('Failed to toggle bookmark', e);
    return [];
  }
}

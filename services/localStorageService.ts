
import { PulseSearchHistoryItem, LeadershipSearchHistoryItem, SavedEmail } from '../types';

const MASTER_HISTORY_KEY = 'rocket_master_history';
const PULSE_HISTORY_KEY = 'rocket_pulse_history';
const LEADERSHIP_HISTORY_KEY = 'rocket_leadership_history';
const EMAIL_HISTORY_KEY = 'rocket_email_history';
const MAX_HISTORY_ITEMS = 5;
const MAX_EMAIL_HISTORY = 50;

// Generic helper to get history
const getHistory = <T>(key: string): T[] => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error parsing history for ${key}`, error);
    return [];
  }
};

// Generic helper to save history (LIFO with max limit)
const addToHistory = <T>(key: string, newItem: T, comparisonFn: (a: T, b: T) => boolean, limit = MAX_HISTORY_ITEMS) => {
  try {
    let current = getHistory<T>(key);
    // Remove duplicates
    current = current.filter(item => !comparisonFn(item, newItem));
    // Add new item to top
    current.unshift(newItem);
    // Trim to max length
    if (current.length > limit) {
      current = current.slice(0, limit);
    }
    localStorage.setItem(key, JSON.stringify(current));
    return current;
  } catch (error) {
    console.error(`Error saving history for ${key}`, error);
    return [];
  }
};

// --- Master Search ---
export const getMasterSearchHistory = (): string[] => {
  return getHistory<string>(MASTER_HISTORY_KEY);
};

export const addMasterSearchHistory = (query: string): string[] => {
  return addToHistory<string>(
    MASTER_HISTORY_KEY, 
    query, 
    (a, b) => a.toLowerCase() === b.toLowerCase()
  );
};

// --- Pulse Scanner ---
export const getPulseSearchHistory = (): PulseSearchHistoryItem[] => {
  return getHistory<PulseSearchHistoryItem>(PULSE_HISTORY_KEY);
};

export const addPulseSearchHistory = (item: PulseSearchHistoryItem): PulseSearchHistoryItem[] => {
  return addToHistory<PulseSearchHistoryItem>(
    PULSE_HISTORY_KEY,
    item,
    (a, b) => 
      a.clientQuery.toLowerCase() === b.clientQuery.toLowerCase() &&
      a.countryQuery.toLowerCase() === b.countryQuery.toLowerCase() &&
      a.mediaQuery === b.mediaQuery
  );
};

// --- Leadership Scanner ---
export const getLeadershipSearchHistory = (): LeadershipSearchHistoryItem[] => {
  return getHistory<LeadershipSearchHistoryItem>(LEADERSHIP_HISTORY_KEY);
};

export const addLeadershipSearchHistory = (item: LeadershipSearchHistoryItem): LeadershipSearchHistoryItem[] => {
  return addToHistory<LeadershipSearchHistoryItem>(
    LEADERSHIP_HISTORY_KEY,
    item,
    (a, b) =>
      a.role === b.role &&
      a.company.toLowerCase() === b.company.toLowerCase() &&
      a.country.toLowerCase() === b.country.toLowerCase()
  );
};

// --- Email History ---
export const getEmailHistory = (): SavedEmail[] => {
  return getHistory<SavedEmail>(EMAIL_HISTORY_KEY);
};

export const saveEmailToHistory = (email: SavedEmail): SavedEmail[] => {
  return addToHistory<SavedEmail>(
    EMAIL_HISTORY_KEY,
    email,
    (a, b) => a.id === b.id,
    MAX_EMAIL_HISTORY
  );
};

export const deleteEmailFromHistory = (id: string): SavedEmail[] => {
  const history = getHistory<SavedEmail>(EMAIL_HISTORY_KEY);
  const updated = history.filter(e => e.id !== id);
  localStorage.setItem(EMAIL_HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAllHistory = () => {
    localStorage.removeItem(MASTER_HISTORY_KEY);
    localStorage.removeItem(PULSE_HISTORY_KEY);
    localStorage.removeItem(LEADERSHIP_HISTORY_KEY);
};

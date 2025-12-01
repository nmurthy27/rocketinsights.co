
import { PulseSearchHistoryItem, LeadershipSearchHistoryItem } from '../types';

const MASTER_HISTORY_KEY = 'rocket_master_history';
const PULSE_HISTORY_KEY = 'rocket_pulse_history';
const LEADERSHIP_HISTORY_KEY = 'rocket_leadership_history';
const MAX_HISTORY_ITEMS = 5;

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
const addToHistory = <T>(key: string, newItem: T, comparisonFn: (a: T, b: T) => boolean) => {
  try {
    let current = getHistory<T>(key);
    // Remove duplicates
    current = current.filter(item => !comparisonFn(item, newItem));
    // Add new item to top
    current.unshift(newItem);
    // Trim to max length
    if (current.length > MAX_HISTORY_ITEMS) {
      current = current.slice(0, MAX_HISTORY_ITEMS);
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

export const clearAllHistory = () => {
    localStorage.removeItem(MASTER_HISTORY_KEY);
    localStorage.removeItem(PULSE_HISTORY_KEY);
    localStorage.removeItem(LEADERSHIP_HISTORY_KEY);
};

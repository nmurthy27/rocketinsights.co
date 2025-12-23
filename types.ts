
export interface Source {
  name: string;
  url: string;
  category: 'News' | 'Insights' | 'Specialized' | 'Global';
  description: string;
}

export interface AgencyWin {
  id: string;
  agency: string;
  client: string;
  country: string;
  targetAudience?: string; // New: Age Group / Demographic focus
  source: string;
  date: string;
}

export interface NewsItem {
  id: string;
  category: string;
  headline: string;
  summary: string;
  targetAudience?: string; // New: Audience focus
  source: string;
  imageQuery?: string;
}

export interface LeaderProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  country: string;
  linkedinUrl: string;
  isAddedToCrm?: boolean;
}

export interface UserProfile {
  email: string;
  role: 'super_admin' | 'admin' | 'read_only';
  regions?: string[];
  topics?: string[];
  isSubscribed?: boolean;
  consentDate?: string;
  lastActive?: string;
}

export interface MasterSearchResult {
  query: string;
  summary: string;
  news: NewsItem[];
  leaders: LeaderProfile[];
  wins: AgencyWin[];
}

export enum ScanStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

// History Interfaces
export interface PulseSearchHistoryItem {
  clientQuery: string;
  countryQuery: string;
  mediaQuery: string;
  timestamp: number;
}

export interface LeadershipSearchHistoryItem {
  role: string;
  company: string;
  country: string;
  timestamp: number;
}

export interface SavedEmail {
  id: string;
  date: string;
  subject: string;
  html: string;
  templateId: string;
}

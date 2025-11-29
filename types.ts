
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
  source: string;
  date: string;
}

export interface NewsItem {
  id: string;
  category: string;
  headline: string;
  summary: string;
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
  regions: string[];
  topics: string[];
  isSubscribed: boolean;
  consentDate?: string;
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

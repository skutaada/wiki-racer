export interface WikipediaArticle {
  title: string;
  pageid: number;
  extract?: string;
  content?: string;
  links?: string[];
  url?: string;
}

export interface GameState {
  status: 'setup' | 'playing' | 'completed' | 'failed';
  startArticle: WikipediaArticle | null;
  endArticle: WikipediaArticle | null;
  currentArticle: WikipediaArticle | null;
  path: WikipediaArticle[];
  startTime: number | null;
  endTime: number | null;
  clickCount: number;
}

export interface GameStats {
  duration: number;
  clickCount: number;
  pathLength: number;
  articlesVisited: string[];
}

export interface WikipediaSearchResult {
  title: string;
  pageid: number;
  extract: string;
}

export interface WikipediaPageContent {
  title: string;
  pageid: number;
  content: string;
  links: string[];
}

export interface DailyRace {
  date: string; // YYYY-MM-DD format
  startArticle: WikipediaArticle;
  endArticle: WikipediaArticle;
  userCompletions: Record<string, {
    completed: boolean;
    bestTime?: number;
    bestClicks?: number;
  }>;
}

export interface User {
  id: string;
  username: string;
  createdAt: number;
}
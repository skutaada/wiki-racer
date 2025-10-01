import { useState, useEffect, useCallback } from 'react';
import type { GameStats } from '../types/game';

export interface LeaderboardEntry {
  id: string;
  startArticle: string;
  endArticle: string;
  stats: GameStats;
  timestamp: number;
}

const LEADERBOARD_KEY = 'wiki-racer-leaderboard';
const MAX_ENTRIES = 50;

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = useCallback(() => {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LeaderboardEntry[];
        setEntries(parsed.sort((a, b) => a.stats.duration - b.stats.duration));
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      setEntries([]);
    }
  }, []);

  const addEntry = useCallback((
    startArticle: string,
    endArticle: string,
    stats: GameStats
  ) => {
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      startArticle,
      endArticle,
      stats,
      timestamp: Date.now(),
    };

    setEntries(prev => {
      const updated = [...prev, newEntry]
        .sort((a, b) => a.stats.duration - b.stats.duration)
        .slice(0, MAX_ENTRIES);

      try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save leaderboard:', error);
      }

      return updated;
    });
  }, []);

  const clearLeaderboard = useCallback(() => {
    setEntries([]);
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch (error) {
      console.error('Failed to clear leaderboard:', error);
    }
  }, []);

  const getBestTime = useCallback((startArticle: string, endArticle: string) => {
    const matchingEntries = entries.filter(
      entry => entry.startArticle === startArticle && entry.endArticle === endArticle
    );

    if (matchingEntries.length === 0) return null;

    return Math.min(...matchingEntries.map(entry => entry.stats.duration));
  }, [entries]);

  const getTopEntries = useCallback((limit = 10) => {
    return entries.slice(0, limit);
  }, [entries]);

  return {
    entries,
    addEntry,
    clearLeaderboard,
    getBestTime,
    getTopEntries,
  };
};
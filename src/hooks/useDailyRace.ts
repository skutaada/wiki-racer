import { useState, useEffect, useCallback } from 'react';
import type { DailyRace } from '../types/game';
import { WikipediaAPI } from '../utils/wikipedia';

const DAILY_RACE_STORAGE_KEY = 'wiki-racer-daily-race';

const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
};

const getStoredDailyRace = (): DailyRace | null => {
  try {
    const stored = localStorage.getItem(DAILY_RACE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storeDailyRace = (dailyRace: DailyRace): void => {
  try {
    localStorage.setItem(DAILY_RACE_STORAGE_KEY, JSON.stringify(dailyRace));
  } catch (error) {
    console.error('Failed to store daily race:', error);
  }
};

export const useDailyRace = () => {
  const [dailyRace, setDailyRace] = useState<DailyRace | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateDailyRace = useCallback(async (): Promise<DailyRace | null> => {
    setIsLoading(true);
    try {
      // Get two random articles
      const [startArticle, endArticle] = await Promise.all([
        WikipediaAPI.getRandomArticle(),
        WikipediaAPI.getRandomArticle()
      ]);

      if (!startArticle || !endArticle) {
        console.error('Failed to generate random articles for daily race');
        return null;
      }

      // Get full summaries for both articles
      const [startSummary, endSummary] = await Promise.all([
        WikipediaAPI.getPageSummary(startArticle.title),
        WikipediaAPI.getPageSummary(endArticle.title)
      ]);

      const today = getTodayString();
      const newDailyRace: DailyRace = {
        date: today,
        startArticle: startSummary || startArticle,
        endArticle: endSummary || endArticle,
        userCompletions: {},
      };

      setDailyRace(newDailyRace);
      storeDailyRace(newDailyRace);
      return newDailyRace;
    } catch (error) {
      console.error('Error generating daily race:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markDailyRaceCompleted = useCallback((userId: string, duration: number, clickCount: number) => {
    if (!dailyRace) return;

    const updatedRace: DailyRace = {
      ...dailyRace,
      userCompletions: {
        ...dailyRace.userCompletions,
        [userId]: {
          completed: true,
          bestTime: duration,
          bestClicks: clickCount,
        },
      },
    };

    setDailyRace(updatedRace);
    storeDailyRace(updatedRace);
  }, [dailyRace]);

  const getUserCompletion = useCallback((userId: string) => {
    if (!dailyRace) return null;
    return dailyRace.userCompletions[userId] || null;
  }, [dailyRace]);

  const refreshDailyRace = useCallback(async () => {
    const today = getTodayString();
    const stored = getStoredDailyRace();

    // If we have a stored race for today, use it
    if (stored && stored.date === today) {
      // Migrate old format to new userCompletions format
      const migratedStored = {
        ...stored,
        userCompletions: stored.userCompletions || {},
      };
      setDailyRace(migratedStored);
      return migratedStored;
    }

    // Otherwise, generate a new one
    return await generateDailyRace();
  }, [generateDailyRace]);

  // Initialize daily race on mount
  useEffect(() => {
    refreshDailyRace();
  }, [refreshDailyRace]);

  return {
    dailyRace,
    isLoading,
    generateDailyRace,
    markDailyRaceCompleted,
    refreshDailyRace,
    getUserCompletion,
  };
};
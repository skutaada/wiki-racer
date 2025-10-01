import { useState, useCallback } from 'react';
import { WikipediaAPI } from '../utils/wikipedia';
import type { WikipediaSearchResult, WikipediaArticle } from '../types/game';

export const useWikipedia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchArticles = useCallback(async (query: string, limit = 10): Promise<WikipediaSearchResult[]> => {
    if (!query.trim()) return [];

    setIsLoading(true);
    setError(null);

    try {
      const results = await WikipediaAPI.searchArticles(query, limit);
      return results;
    } catch (err) {
      setError('Failed to search articles');
      console.error('Search error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRandomArticle = useCallback(async (): Promise<WikipediaArticle | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const article = await WikipediaAPI.getRandomArticle();
      if (article) {
        // Get additional summary info
        const summary = await WikipediaAPI.getPageSummary(article.title);
        return summary || article;
      }
      return null;
    } catch (err) {
      setError('Failed to get random article');
      console.error('Random article error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPageSummary = useCallback(async (title: string): Promise<WikipediaArticle | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const summary = await WikipediaAPI.getPageSummary(title);
      return summary;
    } catch (err) {
      setError('Failed to get page summary');
      console.error('Page summary error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    searchArticles,
    getRandomArticle,
    getPageSummary,
    clearError,
  };
};
import { useState, useCallback } from 'react';
import type { GameState, WikipediaArticle } from '../types/game';
import { WikipediaAPI } from '../utils/wikipedia';

const initialGameState: GameState = {
  status: 'setup',
  startArticle: null,
  endArticle: null,
  currentArticle: null,
  path: [],
  startTime: null,
  endTime: null,
  clickCount: 0,
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const startGame = useCallback(async (startArticle: WikipediaArticle, endArticle: WikipediaArticle) => {
    // Get full content for the start article
    const startContent = await WikipediaAPI.getPageSummary(startArticle.title);
    const startArticleWithContent = startContent || startArticle;

    setGameState({
      status: 'playing',
      startArticle: startArticleWithContent,
      endArticle,
      currentArticle: startArticleWithContent,
      path: [startArticleWithContent],
      startTime: Date.now(),
      endTime: null,
      clickCount: 0,
    });
  }, []);

  const navigateToArticle = useCallback(async (title: string, onGameComplete?: (stats: any) => void) => {
    if (gameState.status !== 'playing') return;

    // Get article summary
    const article = await WikipediaAPI.getPageSummary(title);
    if (!article) return;

    const newClickCount = gameState.clickCount + 1;
    const newPath = [...gameState.path, article];

    // Check if we've reached the target
    const hasReachedTarget = article.title === gameState.endArticle?.title;
    const endTime = hasReachedTarget ? Date.now() : null;

    setGameState(prev => ({
      ...prev,
      currentArticle: article,
      path: newPath,
      clickCount: newClickCount,
      status: hasReachedTarget ? 'completed' : 'playing',
      endTime,
    }));

    // If game completed, call the callback with stats
    if (hasReachedTarget && endTime && gameState.startTime && onGameComplete) {
      const stats = {
        duration: endTime - gameState.startTime,
        clickCount: newClickCount,
        pathLength: newPath.length,
        articlesVisited: newPath.map(a => a.title),
      };
      onGameComplete(stats);
    }
  }, [gameState.status, gameState.clickCount, gameState.path, gameState.endArticle?.title, gameState.startTime]);

  const giveUp = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: 'failed',
      endTime: Date.now(),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const getGameStats = useCallback(() => {
    if (!gameState.startTime) return null;

    const duration = (gameState.endTime || Date.now()) - gameState.startTime;
    return {
      duration,
      clickCount: gameState.clickCount,
      pathLength: gameState.path.length,
      articlesVisited: gameState.path.map(article => article.title),
    };
  }, [gameState.startTime, gameState.endTime, gameState.clickCount, gameState.path]);

  return {
    gameState,
    startGame,
    navigateToArticle,
    giveUp,
    resetGame,
    getGameStats,
  };
};
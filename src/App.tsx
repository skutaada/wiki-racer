import { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { GamePlayer } from './components/GamePlayer';
import { Leaderboard } from './components/Leaderboard';
import { useGame } from './hooks/useGame';
import { useLeaderboard } from './hooks/useLeaderboard';
import type { WikipediaArticle } from './types/game';

function App() {
  const { gameState, startGame, navigateToArticle, giveUp, resetGame } = useGame();
  const { addEntry, clearLeaderboard, getTopEntries } = useLeaderboard();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleStartGame = (startArticle: WikipediaArticle, endArticle: WikipediaArticle) => {
    startGame(startArticle, endArticle);
  };

  const handleLinkClick = (title: string) => {
    navigateToArticle(title, (stats) => {
      // Save to leaderboard when game completes
      if (gameState.startArticle && gameState.endArticle) {
        addEntry(gameState.startArticle.title, gameState.endArticle.title, stats);
      }
    });
  };

  const handleGiveUp = () => {
    giveUp();
  };

  const handlePlayAgain = () => {
    resetGame();
    setShowLeaderboard(false);
  };

  const handleToggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {gameState.status === 'setup' ? (
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={handleToggleLeaderboard}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
              </button>
            </div>

            {showLeaderboard ? (
              <Leaderboard
                entries={getTopEntries(20)}
                onClear={clearLeaderboard}
                title="Best Times"
              />
            ) : (
              <GameSetup onStartGame={handleStartGame} />
            )}
          </div>
        </div>
      ) : (
        <GamePlayer
          gameState={gameState}
          onLinkClick={handleLinkClick}
          onGiveUp={handleGiveUp}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;

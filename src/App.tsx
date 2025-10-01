import { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { GamePlayer } from './components/GamePlayer';
import { Leaderboard } from './components/Leaderboard';
import { DailyRace } from './components/DailyRace';
import { LoginButton } from './components/LoginButton';
import { LoginModal } from './components/LoginModal';
import { useGame } from './hooks/useGame';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useDailyRace } from './hooks/useDailyRace';
import { useUser } from './hooks/useUser';
import type { WikipediaArticle } from './types/game';

function App() {
  const { gameState, startGame, navigateToArticle, giveUp, resetGame } = useGame();
  const { addEntry, clearLeaderboard, getTopEntries } = useLeaderboard();
  const { dailyRace, isLoading: dailyRaceLoading, markDailyRaceCompleted, refreshDailyRace } = useDailyRace();
  const { currentUser, isLoading: userLoading, registerUser, logoutUser } = useUser();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyRace, setShowDailyRace] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStartGame = (startArticle: WikipediaArticle, endArticle: WikipediaArticle) => {
    startGame(startArticle, endArticle);
  };

  const handleLinkClick = (title: string) => {
    navigateToArticle(title, (stats) => {
      // Save to leaderboard when game completes
      if (gameState.startArticle && gameState.endArticle) {
        addEntry(gameState.startArticle.title, gameState.endArticle.title, stats, currentUser || undefined);

        // Check if this was a daily race completion
        if (dailyRace &&
            gameState.startArticle.title === dailyRace.startArticle.title &&
            gameState.endArticle.title === dailyRace.endArticle.title &&
            currentUser) {
          markDailyRaceCompleted(currentUser.id, stats.duration, stats.clickCount);
        }
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

  const handleStartDailyRace = (startArticle: WikipediaArticle, endArticle: WikipediaArticle) => {
    startGame(startArticle, endArticle);
  };

  const handleToggleDailyRace = () => {
    setShowDailyRace(!showDailyRace);
  };

  const handleToggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {gameState.status === 'setup' ? (
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-end mb-6 space-x-4">
              <LoginButton
                currentUser={currentUser}
                onToggleModal={handleToggleLoginModal}
              />
              <button
                onClick={handleToggleDailyRace}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                {showDailyRace ? 'Custom Race' : 'Daily Race'}
              </button>
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
            ) : showDailyRace ? (
              <DailyRace
                dailyRace={dailyRace}
                isLoading={dailyRaceLoading}
                currentUser={currentUser}
                onStartDailyRace={handleStartDailyRace}
                onRefresh={refreshDailyRace}
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleToggleLoginModal}
        currentUser={currentUser}
        onRegister={registerUser}
        onLogout={logoutUser}
        isLoading={userLoading}
      />
    </div>
  );
}

export default App;

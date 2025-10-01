import React from 'react';
import type { GameState } from '../types/game';
import { WikiViewer } from './WikiViewer';
import { Timer } from './Timer';
import { Stats } from './Stats';

interface GamePlayerProps {
  gameState: GameState;
  onLinkClick: (title: string) => void;
  onGiveUp: () => void;
  onPlayAgain: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  gameState,
  onLinkClick,
  onGiveUp,
  onPlayAgain
}) => {
  const { status, startArticle, endArticle, currentArticle, startTime, endTime, clickCount, path } = gameState;

  if (status === 'completed') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            🎉 Congratulations! 🎉
          </h1>
          <p className="text-lg text-green-700 mb-6">
            You successfully navigated from "{startArticle?.title}" to "{endArticle?.title}"!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(((endTime || 0) - (startTime || 0)) / 1000)}s
              </div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">{clickCount}</div>
              <div className="text-sm text-gray-600">Clicks</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">{path.length}</div>
              <div className="text-sm text-gray-600">Articles Visited</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Path:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {path.map((article, index) => (
                <div key={article.pageid} className="flex items-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {article.title}
                  </span>
                  {index < path.length - 1 && (
                    <span className="mx-2 text-gray-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onPlayAgain}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-red-800 mb-4">
            Game Over
          </h1>
          <p className="text-lg text-red-700 mb-6">
            You gave up on the race from "{startArticle?.title}" to "{endArticle?.title}".
          </p>

          <button
            onClick={onPlayAgain}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with game info and controls */}
      <div className="bg-gray-100 border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="font-semibold text-gray-700">From:</span>
              <span className="ml-2 text-green-600 font-medium">{startArticle?.title}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">To:</span>
              <span className="ml-2 text-red-600 font-medium">{endArticle?.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Timer startTime={startTime} />
            <Stats clickCount={clickCount} pathLength={path.length} />
            <button
              onClick={onGiveUp}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
            >
              Give Up
            </button>
          </div>
        </div>
      </div>

      {/* Current article indicator */}
      <div className="bg-blue-50 border-b border-blue-200 p-3">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-blue-700">
            <span className="font-semibold">Currently reading:</span>
            <span className="ml-2 font-medium">{currentArticle?.title}</span>
            {currentArticle?.title === endArticle?.title && (
              <span className="ml-2 text-green-600 font-bold">🎯 TARGET REACHED!</span>
            )}
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full">
          {currentArticle && (
            <WikiViewer
              articleTitle={currentArticle.title}
              onLinkClick={onLinkClick}
              className="h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
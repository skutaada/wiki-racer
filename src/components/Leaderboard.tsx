import React from 'react';
import type { LeaderboardEntry } from '../hooks/useLeaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClear?: () => void;
  title?: string;
  limit?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  onClear,
  title = 'Leaderboard',
  limit = 10
}) => {
  const displayEntries = entries.slice(0, limit);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (displayEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 text-center py-8">No races completed yet!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {onClear && (
          <button
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-1">#</th>
              <th className="text-left py-2 px-2">Route</th>
              <th className="text-left py-2 px-2">Time</th>
              <th className="text-left py-2 px-2">Clicks</th>
              <th className="text-left py-2 px-2">Articles</th>
              <th className="text-left py-2 px-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {displayEntries.map((entry, index) => (
              <tr
                key={entry.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  index < 3 ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="py-2 px-1 font-semibold">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && (index + 1)}
                </td>
                <td className="py-2 px-2">
                  <div className="max-w-xs">
                    <div className="text-xs text-green-600 truncate">
                      {entry.startArticle}
                    </div>
                    <div className="text-xs text-gray-400">↓</div>
                    <div className="text-xs text-red-600 truncate">
                      {entry.endArticle}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-2 font-mono font-semibold text-blue-600">
                  {formatTime(entry.stats.duration)}
                </td>
                <td className="py-2 px-2 font-mono text-orange-600">
                  {entry.stats.clickCount}
                </td>
                <td className="py-2 px-2 font-mono text-purple-600">
                  {entry.stats.pathLength}
                </td>
                <td className="py-2 px-2 text-gray-500">
                  {formatDate(entry.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length > limit && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          Showing top {limit} of {entries.length} races
        </p>
      )}
    </div>
  );
};
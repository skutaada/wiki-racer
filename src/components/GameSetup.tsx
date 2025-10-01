import React, { useState } from 'react';
import type { WikipediaArticle, WikipediaSearchResult } from '../types/game';
import { WikipediaAPI } from '../utils/wikipedia';

interface GameSetupProps {
  onStartGame: (startArticle: WikipediaArticle, endArticle: WikipediaArticle) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [startArticle, setStartArticle] = useState<WikipediaArticle | null>(null);
  const [endArticle, setEndArticle] = useState<WikipediaArticle | null>(null);
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'start' | 'end'>('start');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    const results = await WikipediaAPI.searchArticles(searchQuery);
    setSearchResults(results);
    setIsLoading(false);
  };

  const handleSelectArticle = (result: WikipediaSearchResult) => {
    const article: WikipediaArticle = {
      title: result.title,
      pageid: result.pageid,
      extract: result.extract,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`
    };

    if (searchType === 'start') {
      setStartArticle(article);
    } else {
      setEndArticle(article);
    }

    setSearchResults([]);
    setSearchQuery('');
  };

  const handleRandomStart = async () => {
    setIsLoading(true);
    const article = await WikipediaAPI.getRandomArticle();
    if (article) {
      const summary = await WikipediaAPI.getPageSummary(article.title);
      setStartArticle(summary || article);
    }
    setIsLoading(false);
  };

  const handleRandomEnd = async () => {
    setIsLoading(true);
    const article = await WikipediaAPI.getRandomArticle();
    if (article) {
      const summary = await WikipediaAPI.getPageSummary(article.title);
      setEndArticle(summary || article);
    }
    setIsLoading(false);
  };

  const canStartGame = startArticle && endArticle && startArticle.pageid !== endArticle.pageid;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Wikipedia Racer
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Start Article Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Start Article</h2>

          {startArticle ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800">{startArticle.title}</h3>
              {startArticle.extract && (
                <p className="text-sm text-green-600 mt-2 line-clamp-3">
                  {startArticle.extract}
                </p>
              )}
              <button
                onClick={() => setStartArticle(null)}
                className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
              >
                Change article
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleRandomStart}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Random Article'}
              </button>

              <div className="text-center text-gray-500">or</div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchType('start')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for start article..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchQuery.trim()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* End Article Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">End Article</h2>

          {endArticle ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">{endArticle.title}</h3>
              {endArticle.extract && (
                <p className="text-sm text-red-600 mt-2 line-clamp-3">
                  {endArticle.extract}
                </p>
              )}
              <button
                onClick={() => setEndArticle(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Change article
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleRandomEnd}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Random Article'}
              </button>

              <div className="text-center text-gray-500">or</div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchType('end')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for end article..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchQuery.trim()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-3">
            Select {searchType} article:
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.pageid}
                onClick={() => handleSelectArticle(result)}
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300"
              >
                <div className="font-semibold text-gray-800">{result.title}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {result.extract}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start Game Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => canStartGame && onStartGame(startArticle!, endArticle!)}
          disabled={!canStartGame}
          className="px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Race!
        </button>

        {canStartGame && (
          <p className="mt-2 text-sm text-gray-600">
            Navigate from "{startArticle!.title}" to "{endArticle!.title}" using only Wikipedia links!
          </p>
        )}
      </div>
    </div>
  );
};
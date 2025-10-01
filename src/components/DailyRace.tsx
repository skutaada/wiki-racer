import React, { useState } from 'react';
import type { DailyRace, WikipediaArticle, User } from '../types/game';
import { WikiViewer } from './WikiViewer';

interface DailyRaceComponentProps {
  dailyRace: DailyRace | null;
  isLoading: boolean;
  currentUser: User | null;
  onStartDailyRace: (startArticle: WikipediaArticle, endArticle: WikipediaArticle) => void;
  onRefresh: () => void;
}

export const DailyRaceComponent: React.FC<DailyRaceComponentProps> = ({
  dailyRace,
  isLoading,
  currentUser,
  onStartDailyRace,
  onRefresh,
}) => {
  const [previewArticle, setPreviewArticle] = useState<WikipediaArticle | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewArticle = (article: WikipediaArticle) => {
    setPreviewArticle(article);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewArticle(null);
  };
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating today's challenge...</p>
        </div>
      </div>
    );
  }

  if (!dailyRace) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Unable to load daily race</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-lg border-2 border-yellow-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🏆 Daily Challenge
        </h1>
        <p className="text-gray-600">
          {new Date(dailyRace.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Start Article */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-700 flex items-center">
            <span className="mr-2">🏁</span> Start
          </h2>
           <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
             <h3 className="font-semibold text-green-800 text-lg">{dailyRace.startArticle.title}</h3>
             {dailyRace.startArticle.extract && (
               <p className="text-sm text-green-600 mt-2 line-clamp-3">
                 {dailyRace.startArticle.extract}
               </p>
             )}
             <div className="mt-2">
               <button
                 onClick={() => handlePreviewArticle(dailyRace.startArticle)}
                 className="text-sm text-blue-600 hover:text-blue-800 underline"
               >
                 Preview article
               </button>
             </div>
           </div>
        </div>

        {/* End Article */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-700 flex items-center">
            <span className="mr-2">🎯</span> Target
          </h2>
           <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
             <h3 className="font-semibold text-red-800 text-lg">{dailyRace.endArticle.title}</h3>
             {dailyRace.endArticle.extract && (
               <p className="text-sm text-red-600 mt-2 line-clamp-3">
                 {dailyRace.endArticle.extract}
               </p>
             )}
             <div className="mt-2">
               <button
                 onClick={() => handlePreviewArticle(dailyRace.endArticle)}
                 className="text-sm text-blue-600 hover:text-blue-800 underline"
               >
                 Preview article
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Completion Status */}
      {currentUser && dailyRace.userCompletions?.[currentUser.id]?.completed && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
          <div className="flex items-center text-green-800 font-semibold mb-2">
            <span className="mr-2">✅</span> Completed!
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Best Time:</span> {formatTime(dailyRace.userCompletions[currentUser.id].bestTime!)}
            </div>
            <div>
              <span className="font-medium">Clicks:</span> {dailyRace.userCompletions[currentUser.id].bestClicks}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <button
          onClick={() => onStartDailyRace(dailyRace.startArticle, dailyRace.endArticle)}
          className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 shadow-lg transform hover:scale-105 transition-all"
        >
          {currentUser && dailyRace.userCompletions?.[currentUser.id]?.completed ? 'Try Again' : 'Start Daily Race!'}
        </button>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            Refresh Challenge
          </button>
        </div>

        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Race from "{dailyRace.startArticle.title}" to "{dailyRace.endArticle.title}" using only Wikipedia links!
          {currentUser && dailyRace.userCompletions?.[currentUser.id]?.completed && " Can you beat your best time?"}
        </p>
      </div>

      {/* Preview Modal */}
      {showPreview && previewArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Article Preview</h2>
              <button
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <WikiViewer
                articleTitle={previewArticle.title}
                onLinkClick={() => {}} // Disable link clicking in preview
                className="max-h-[70vh] overflow-y-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DailyRaceComponent as DailyRace };
import React from 'react';
import type { User } from '../types/game';

interface LoginButtonProps {
  currentUser: User | null;
  onToggleModal: () => void;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  currentUser,
  onToggleModal,
}) => {
  if (currentUser) {
    return (
      <button
        onClick={onToggleModal}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        title="Account & Logout"
      >
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
          {currentUser.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm">{currentUser.username}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onToggleModal}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Login
    </button>
  );
};
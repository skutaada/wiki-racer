import React, { useState } from 'react';
import type { User } from '../types/game';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onRegister: (username: string) => User | null;
  onLogout: () => void;
  isLoading: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRegister,
  onLogout,
  isLoading,
}) => {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsRegistering(true);
    const user = onRegister(username);
    setIsRegistering(false);

    if (user) {
      setUsername('');
      onClose();
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : currentUser ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Welcome, {currentUser.username}!</p>
                <p className="text-sm text-gray-600">
                  Member since {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              👤 Register or Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isRegistering || !username.trim()}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? 'Registering...' : 'Register/Login'}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Enter any username to register or login. Your progress will be saved locally.
            </p>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
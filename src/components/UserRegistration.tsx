import React, { useState } from 'react';
import type { User } from '../types/game';

interface UserRegistrationProps {
  currentUser: User | null;
  onRegister: (username: string) => User | null;
  onLogout: () => void;
  isLoading: boolean;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({
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
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-blue-800">Welcome, {currentUser.username}!</p>
              <p className="text-sm text-blue-600">
                Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
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
    </div>
  );
};
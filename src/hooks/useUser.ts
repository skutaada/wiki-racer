import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types/game';

const USER_STORAGE_KEY = 'wiki-racer-current-user';
const USERS_STORAGE_KEY = 'wiki-racer-users';

export const useUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUser = useCallback((username: string): User | null => {
    if (!username.trim()) return null;

    // Check if username already exists
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (existingUser) {
        // Log in existing user
        setCurrentUser(existingUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(existingUser));
        return existingUser;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: username.trim(),
        createdAt: Date.now(),
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setCurrentUser(newUser);

      return newUser;
    } catch (error) {
      console.error('Failed to register user:', error);
      return null;
    }
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to logout user:', error);
    }
  }, []);

  const getAllUsers = useCallback((): User[] => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error('Failed to load users:', error);
      return [];
    }
  }, []);

  return {
    currentUser,
    isLoading,
    registerUser,
    logoutUser,
    getAllUsers,
  };
};
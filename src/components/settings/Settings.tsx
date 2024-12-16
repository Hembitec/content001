import React from 'react';
import { X, Moon, Sun, User, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={clsx(
        "w-full max-w-md rounded-2xl shadow-xl",
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-800"
      )}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "text-gray-500 dark:text-gray-400"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Profile
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span>{user?.displayName || 'Not set'}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Appearance
            </h3>
            <button
              onClick={toggleDarkMode}
              className={clsx(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                "bg-gray-50 dark:bg-gray-800/50",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-blue-500" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={clsx(
                "w-11 h-6 rounded-full transition-colors relative",
                darkMode ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
              )}>
                <div className={clsx(
                  "absolute w-5 h-5 rounded-full bg-white transition-transform",
                  "top-0.5 left-0.5",
                  darkMode && "translate-x-5"
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={signOut}
            className={clsx(
              "w-full py-2.5 px-4 rounded-xl font-medium transition-colors",
              "bg-red-600 hover:bg-red-700",
              "text-white"
            )}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

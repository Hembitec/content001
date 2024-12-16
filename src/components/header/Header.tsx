import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';
import { NavLinks } from './NavLinks';
import { Settings } from '../settings/Settings';

export function Header() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className={clsx(
        "sticky top-0 z-50 w-full border-b",
        darkMode 
          ? "bg-gray-900 border-gray-800 text-white" 
          : "bg-white border-gray-200 text-gray-900"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className={clsx(
                "text-[1.7rem] font-bold tracking-tight",
                darkMode
                  ? "text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
              )}>
                ContentIQ
              </span>
              {user && <NavLinks />}
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => setShowSettings(true)}
                className={clsx(
                  "p-2 rounded-full transition-colors",
                  darkMode 
                    ? "text-white hover:bg-gray-800" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
                aria-label="Open settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
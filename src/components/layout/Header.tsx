import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Settings } from '../settings/Settings';
import clsx from 'clsx';

export function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const { darkMode } = useTheme();

  return (
    <>
      <header className={clsx(
        'w-full border-b transition-colors duration-200 backdrop-blur-sm',
        darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className={clsx(
            'text-2xl font-bold',
            darkMode
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          )}>
            ContentIQ
          </h1>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className={clsx(
              'p-2 rounded-full transition-colors',
              darkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100/50'
            )}
            title="Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </motion.button>
        </div>
      </header>
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}

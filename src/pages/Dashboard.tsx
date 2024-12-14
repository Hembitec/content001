import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon } from 'lucide-react';
import { Settings } from '../components/settings/Settings';
import clsx from 'clsx';

export function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const { darkMode } = useTheme();
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const tools = [
    {
      id: 'content-analyzer',
      title: 'Content Analyzer',
      description: 'Evaluates text for grammar, readability, SEO, and style. Users can input content via text, file, or URL and receive detailed, actionable insights.',
      icon: '📄',
      link: '/analyzer',
      color: 'bg-purple-100'
    },
    {
      id: 'nlp-generator',
      title: 'NLP Generator',
      description: 'Creates tailored content like blog posts and articles. Users input keywords, select tone and length, and receive optimized, editable content.',
      icon: '🧠',
      link: '/tools/nlp-generator',
      color: 'bg-blue-100'
    },
    {
      id: 'social-media-converter',
      title: 'Social Media Content Converter',
      description: 'Transforms text into platform-specific posts for Twitter, LinkedIn, and Facebook. Offers tone customization, hashtag suggestions, and easy export options.',
      icon: '🔄',
      link: '/tools/social-converter',
      color: 'bg-green-100'
    }
  ];

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-200',
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Header */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className={clsx(
            'text-3xl font-bold mb-3',
            darkMode ? 'text-gray-100' : 'text-gray-900'
          )}>
            Dashboard
          </h2>
          <p className={clsx(
            'text-lg',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Welcome back, {user?.displayName || 'User'}
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool) => (
            <motion.div key={tool.id} variants={item}>
              <Link
                to={tool.link}
                className={clsx(
                  'block p-6 rounded-2xl transition-all duration-200',
                  'border backdrop-blur-sm',
                  darkMode
                    ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-700/50'
                    : 'bg-white/80 border-gray-200/80 hover:bg-white/90 hover:border-gray-300/90 shadow-lg'
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={clsx(
                    'p-3 rounded-xl',
                    darkMode ? 'bg-opacity-20' : '',
                    tool.color
                  )}>
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <h3 className={clsx(
                    'text-xl font-semibold',
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  )}>{tool.title}</h3>
                </div>
                <p className={clsx(
                  'text-base leading-relaxed',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {tool.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

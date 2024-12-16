import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, FileText, Brain, Share2 } from 'lucide-react';
import { Settings } from '../components/settings/Settings';
import { theme } from '../styles/theme';
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
      icon: <FileText className="w-6 h-6" />,
      link: '/analyzer',
      color: theme.colors.brand.accent
    },
    {
      id: 'nlp-generator',
      title: 'NLP Generator',
      description: 'Creates tailored content like blog posts and articles. Users input keywords, select tone and length, and receive optimized, editable content.',
      icon: <Brain className="w-6 h-6" />,
      link: '/tools/nlp-generator',
      color: theme.colors.brand.accent
    },
    {
      id: 'social-media-converter',
      title: 'Social Media Content Converter',
      description: 'Transforms text into platform-specific posts for Twitter, LinkedIn, and Facebook. Offers tone customization, hashtag suggestions, and easy export options.',
      icon: <Share2 className="w-6 h-6" />,
      link: '/tools/social-converter',
      color: theme.colors.brand.accent
    }
  ];

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className={clsx("text-3xl font-bold mb-3", theme.colors.text.primary)}>
            Dashboard
          </h2>
          <p className={clsx("text-lg", theme.colors.text.secondary)}>
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
                  theme.components.card,
                  "block p-6 hover:shadow-lg transition-all duration-200"
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={clsx(
                    "p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30",
                    "text-blue-600 dark:text-blue-400"
                  )}>
                    {tool.icon}
                  </div>
                  <h3 className={clsx("text-xl font-semibold", theme.colors.text.primary)}>
                    {tool.title}
                  </h3>
                </div>
                <p className={clsx("text-base leading-relaxed", theme.colors.text.secondary)}>
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

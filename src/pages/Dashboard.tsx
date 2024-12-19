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
  const { darkMode } = useTheme();
  const { user } = useAuth();

  return (
    <div className={clsx(
      'min-h-screen w-full transition-colors duration-200',
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className={clsx(
            "text-4xl font-bold tracking-tight mb-4",
            darkMode
              ? "text-white"
              : "bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
          )}>
            Welcome back
            <span className={clsx(
              "ml-2 text-2xl font-medium",
              darkMode
                ? "text-blue-400"
                : "text-blue-500"
            )}>
              {user?.displayName || 'User'}
            </span>
          </h1>
          <p className={clsx(
            "text-lg",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Transform your content strategy with our AI-powered tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Content Analyzer */}
          <Link
            to="/analyzer"
            className={clsx(
              "group p-6 rounded-2xl transition-all duration-300",
              "border",
              darkMode 
                ? "bg-gray-800/50 border-gray-700 hover:border-blue-500/50" 
                : "bg-white border-gray-200 hover:border-blue-500/30",
              "hover:shadow-lg hover:shadow-blue-500/10"
            )}
          >
            <div className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
              "transition-colors duration-300",
              darkMode
                ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
                : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"
            )}>
              <FileText className="w-6 h-6" />
            </div>
            <h3 className={clsx(
              "text-xl font-semibold mb-3",
              darkMode ? "text-white" : "text-gray-900"
            )}>
              Content Analyzer
            </h3>
            <p className={clsx(
              "text-sm leading-relaxed",
              darkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Evaluates text for grammar, readability, SEO, and style. Get detailed, actionable insights instantly.
            </p>
          </Link>

          {/* NLP Generator */}
          <Link
            to="/tools/nlp-generator"
            className={clsx(
              "group p-6 rounded-2xl transition-all duration-300",
              "border",
              darkMode 
                ? "bg-gray-800/50 border-gray-700 hover:border-blue-500/50" 
                : "bg-white border-gray-200 hover:border-blue-500/30",
              "hover:shadow-lg hover:shadow-blue-500/10"
            )}
          >
            <div className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
              "transition-colors duration-300",
              darkMode
                ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
                : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"
            )}>
              <Brain className="w-6 h-6" />
            </div>
            <h3 className={clsx(
              "text-xl font-semibold mb-3",
              darkMode ? "text-white" : "text-gray-900"
            )}>
              NLP Generator
            </h3>
            <p className={clsx(
              "text-sm leading-relaxed",
              darkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Create tailored content with customizable tone and length. Perfect for blog posts and articles.
            </p>
          </Link>

          {/* Social Media Converter */}
          <Link
            to="/tools/social-converter"
            className={clsx(
              "group p-6 rounded-2xl transition-all duration-300",
              "border",
              darkMode 
                ? "bg-gray-800/50 border-gray-700 hover:border-blue-500/50" 
                : "bg-white border-gray-200 hover:border-blue-500/30",
              "hover:shadow-lg hover:shadow-blue-500/10"
            )}
          >
            <div className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
              "transition-colors duration-300",
              darkMode
                ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
                : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"
            )}>
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className={clsx(
              "text-xl font-semibold mb-3",
              darkMode ? "text-white" : "text-gray-900"
            )}>
              Social Media Converter
            </h3>
            <p className={clsx(
              "text-sm leading-relaxed",
              darkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Transform content for social platforms with tone customization and hashtag suggestions.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Brain, 
  Share2, 
  ChevronRight,
  Sparkles,
  MessageSquare,
  Image,
  Scissors,
  Type,
  Languages,
  Hash,
  Repeat,
  Search,
  Key
} from 'lucide-react';
import clsx from 'clsx';

interface Tool {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
  isNew?: boolean;
  comingSoon?: boolean;
}

interface ToolCategory {
  title: string;
  description: string;
  tools: Tool[];
}

export function Dashboard() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState<string>("Content Creation");

  const toolCategories: ToolCategory[] = [
    {
      title: "Content Creation",
      description: "Create and optimize your content",
      tools: [
        {
          title: 'Content Analyzer',
          description: 'Get instant insights and improvements for your content',
          icon: FileText,
          to: '/analyzer'
        },
        {
          title: 'NLP Generator',
          description: 'Create high-quality content with AI assistance',
          icon: Brain,
          to: '/tools/nlp-generator'
        },
        {
          title: 'Content Summarizer',
          description: 'Create concise summaries of long-form content',
          icon: Scissors,
          to: '/tools/summarizer',
          isNew: true
        },
        {
          title: 'Content Rephraser',
          description: 'Rewrite content in different tones and styles',
          icon: Repeat,
          to: '/tools/rephraser',
          isNew: true
        },
        {
          title: 'Keyword Extractor',
          description: 'Extract key terms and topics from your content',
          icon: Key,
          to: '/tools/keyword-extractor',
          isNew: true
        },
        {
          title: 'Headline Generator',
          description: 'Create engaging headlines and titles for your content',
          icon: Type,
          to: '/tools/headline-generator',
          isNew: true
        },
        {
          title: 'Social Media Converter',
          description: 'Transform content for different social platforms',
          icon: Share2,
          to: '/tools/social-converter'
        },
        {
          title: 'Hashtag Generator',
          description: 'Generate relevant hashtags for your content',
          icon: Hash,
          to: '/tools/hashtag-generator',
          isNew: true
        }
      ]
    },
    {
      title: "Coming Soon",
      description: "Exciting new tools in development",
      tools: [
        {
          title: 'AI Chat Assistant',
          description: 'Chat with AI to brainstorm and refine your content ideas',
          icon: MessageSquare,
          to: '#',
          comingSoon: true
        },
        {
          title: 'Image Generator',
          description: 'Create custom images for your content using AI',
          icon: Image,
          to: '#',
          comingSoon: true
        },
        {
          title: 'Content Translator',
          description: 'Translate your content into multiple languages',
          icon: Languages,
          to: '#',
          comingSoon: true
        }
      ]
    }
  ];

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

        {/* Tool Categories */}
        <div className="space-y-8">
          {toolCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className={clsx(
                'rounded-2xl border transition-all duration-300',
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white border-gray-200'
              )}
            >
              {/* Category Header */}
              <div 
                className={clsx(
                  'p-6 cursor-pointer select-none',
                  'flex items-center justify-between'
                )}
                onClick={() => setExpandedCategory(
                  expandedCategory === category.title ? null : category.title
                )}
              >
                <div>
                  <h2 className={clsx(
                    'text-xl font-semibold mb-1',
                    darkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {category.title}
                  </h2>
                  <p className={clsx(
                    'text-sm',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {category.description}
                  </p>
                </div>
                <ChevronRight 
                  className={clsx(
                    'w-5 h-5 transition-transform duration-300',
                    expandedCategory === category.title && 'rotate-90',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}
                />
              </div>

              {/* Tools Grid */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedCategory === category.title ? "auto" : 0,
                  opacity: expandedCategory === category.title ? 1 : 0
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tools.map((tool, toolIndex) => (
                    <Link
                      key={toolIndex}
                      to={tool.to}
                      className={clsx(
                        'group p-4 rounded-xl border transition-all duration-300',
                        tool.comingSoon ? (
                          darkMode 
                            ? 'bg-gray-800/30 border-gray-700 cursor-not-allowed' 
                            : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                        ) : (
                          darkMode 
                            ? 'bg-gray-800/30 border-gray-700 hover:border-blue-500/50' 
                            : 'bg-white border-gray-200 hover:border-blue-500/30'
                        ),
                        !tool.comingSoon && 'hover:shadow-lg hover:shadow-blue-500/10'
                      )}
                      onClick={e => tool.comingSoon && e.preventDefault()}
                    >
                      <div className="flex items-start gap-4">
                        <div className={clsx(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          'transition-colors duration-300',
                          tool.comingSoon ? (
                            darkMode
                              ? 'bg-gray-700/50 text-gray-500'
                              : 'bg-gray-100 text-gray-400'
                          ) : (
                            darkMode
                              ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20'
                              : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'
                          )
                        )}>
                          {React.createElement(tool.icon, { className: 'w-5 h-5' })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={clsx(
                              'font-medium',
                              tool.comingSoon
                                ? darkMode ? 'text-gray-400' : 'text-gray-500'
                                : darkMode ? 'text-white' : 'text-gray-900'
                            )}>
                              {tool.title}
                            </h3>
                            {tool.isNew && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500">
                                New
                              </span>
                            )}
                            {tool.comingSoon && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-500/10 text-gray-500">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className={clsx(
                            'text-sm mt-1',
                            tool.comingSoon
                              ? darkMode ? 'text-gray-500' : 'text-gray-400'
                              : darkMode ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

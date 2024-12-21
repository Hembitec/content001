import React, { useState, useEffect } from 'react';
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
  Heading,
  Languages,
  Hash,
  Repeat,
  Search as SearchIcon,
  Key,
  LineChart,
  BookOpen,
  MousePointerClick
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!searchQuery) {
      setSearchQuery("");
    }
  }, [searchQuery]);

  const matchTool = (tool: Tool, query: string) => {
    if (!query) return true;
    
    const searchTerms = query.toLowerCase().split(' ');
    const toolTitle = tool.title.toLowerCase();
    const toolDesc = tool.description.toLowerCase();
    
    return searchTerms.every(term => 
      toolTitle.includes(term) || 
      toolDesc.includes(term) ||
      toolTitle.split(' ').some(word => word.startsWith(term))
    );
  };

  const toolCategories: ToolCategory[] = [
    {
      title: "Content Generation",
      description: "Create and generate various types of content",
      tools: [
        {
          title: 'NLP Generator',
          description: 'Create high-quality content with AI assistance',
          icon: Brain,
          to: '/tools/nlp-generator'
        },
        {
          title: 'Blog Idea Generator',
          description: 'Generate engaging blog titles, descriptions, and keywords',
          icon: BookOpen,
          to: '/tools/blog-generator',
          isNew: true
        },
        {
          title: 'Headline Generator',
          description: 'Create engaging headlines and titles for your content',
          icon: Heading,
          to: '/tools/headline-generator',
          isNew: true
        },
        {
          title: 'Call-to-Action Generator',
          description: 'Create compelling CTAs for better conversion rates',
          icon: MousePointerClick,
          to: '/tools/cta-generator',
          isNew: true
        }
      ]
    },
    {
      title: "Content Optimization",
      description: "Analyze and improve your content quality",
      tools: [
        {
          title: 'Content Analyzer',
          description: 'Get instant insights and improvements for your content',
          icon: FileText,
          to: '/analyzer'
        },
        {
          title: 'SEO Optimizer',
          description: 'Analyze and optimize your content for search engines',
          icon: LineChart,
          to: '/tools/seo-optimizer',
          isNew: true
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
        }
      ]
    },
    {
      title: "Social Media & Distribution",
      description: "Optimize content for social platforms",
      tools: [
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
      title: "Research & Analysis",
      description: "Research and analyze content performance",
      tools: [
        {
          title: 'Keyword Extractor',
          description: 'Extract keywords and topics from your content',
          icon: Key,
          to: '/tools/keyword-extractor',
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

  const filteredCategories = toolCategories.map(category => ({
    ...category,
    tools: category.tools.filter(tool => matchTool(tool, searchQuery))
  })).filter(category => category.tools.length > 0);

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
            "text-lg mb-6",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Transform your content strategy with our AI-powered tools
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-xl">
            <SearchIcon className={clsx(
              "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
              darkMode ? "text-gray-400" : "text-gray-500"
            )} />
            <input
              type="text"
              placeholder="Search tools (try typing first few letters)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={clsx(
                "w-full pl-10 pr-4 py-2 rounded-xl",
                "border transition-colors duration-200",
                "focus:outline-none focus:ring-2",
                darkMode 
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                  : "bg-white border-gray-200 text-gray-900 focus:ring-blue-400"
              )}
            />
          </div>
        </div>

        {/* Tool Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className={clsx(
                'rounded-2xl border',
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white border-gray-200'
              )}
            >
              {/* Category Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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

              {/* Tools Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool, toolIndex) => (
                  <ToolCard
                    key={toolIndex}
                    tool={tool}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ToolCardProps {
  tool: Tool;
  darkMode: boolean;
}

function ToolCard({ tool, darkMode }: ToolCardProps) {
  return (
    <Link
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
      onClick={(e) => {
        if (tool.comingSoon) {
          e.preventDefault();
        }
      }}
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
  );
}

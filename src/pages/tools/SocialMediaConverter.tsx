import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Share2, Copy, Check, RefreshCw, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { generateVariations } from '../../services/socialMediaConverter/converter';

interface ConversionResult {
  content: string;
  hashtags: string[];
  type: string;
  variation: number;
}

export default function SocialMediaConverter() {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [selectedType, setSelectedType] = useState('professional');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" /> },
    { id: 'twitter', label: 'Twitter', icon: <Twitter className="w-5 h-5" /> },
    { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-5 h-5" /> }
  ];

  const contentTypes = [
    { id: 'professional', label: 'Professional Story' },
    { id: 'howto', label: 'How-to Guide' },
    { id: 'comparison', label: 'Comparison Post' },
    { id: 'stepbystep', label: 'Step-by-Step Guide' }
  ];


  const handleConvert = async () => {
    if (!content.trim()) return;
    
    setIsConverting(true);
    setError(null);
    try {
      const variations = await generateVariations(
        content,
        selectedPlatform as 'linkedin' | 'twitter' | 'facebook',
        selectedType as 'professional' | 'howto' | 'comparison' | 'stepbystep'
      );
      setResults(variations);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate variations');
      setResults([]);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = async (index: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-200',
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className={clsx(
            'inline-flex items-center gap-2 mb-8 text-sm',
            darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Tool Title */}
        <div className="mb-8">
          <h2 className={clsx(
            'text-3xl font-bold flex items-center gap-3 mb-3',
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
          )}>
            Social Media Converter
            <Share2 className="text-2xl" />
          </h2>
          <p className={clsx(
            'text-lg',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Transform your content into multiple variations for your chosen platform
          </p>
        </div>

        {/* Input Form */}
        <div className={clsx(
          'p-8 rounded-2xl backdrop-blur-sm',
          darkMode
            ? 'bg-gray-800/50 border border-gray-700/50'
            : 'bg-white/80 border border-gray-200 shadow-lg'
        )}>
          {/* Platform Selection */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Select Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2',
                    selectedPlatform === platform.id
                      ? darkMode
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                      : darkMode
                        ? 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  )}
                >
                  {platform.icon}
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="relative mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content to convert..."
              rows={6}
              className={clsx(
                'w-full px-4 py-3 rounded-xl border transition-all resize-y min-h-[150px]',
                darkMode
                  ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              )}
            />
          </div>

          {/* Content Type Selection */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Content Type
            </label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                    selectedType === type.id
                      ? darkMode
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                      : darkMode
                        ? 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConvert}
              disabled={isConverting || !content.trim()}
              className={clsx(
                'px-6 py-3 rounded-xl font-medium flex items-center gap-2',
                'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600',
                'text-white disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Generate 4 Variations
                </>
              )}
            </motion.button>
          </div>
        </div>


        {/* Add space between input and results */}
        <div className="mt-8"></div>

        {/* Results Section */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  'p-6 rounded-xl border',
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700/50'
                    : 'bg-white/80 border-gray-200'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'px-2 py-1 rounded-lg text-sm font-medium',
                      darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                    )}>
                      Variation {result.variation}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(index, result.content)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className={clsx(
                  'p-4 rounded-lg font-mono text-sm',
                  darkMode
                    ? 'bg-gray-900/50 text-gray-300'
                    : 'bg-gray-50 text-gray-700'
                )}>
                  <pre className="whitespace-pre-wrap">
                    {result.content}
                  </pre>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Array.isArray(result.hashtags) && result.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className={clsx(
                          'px-2 py-1 rounded-full text-xs',
                          darkMode
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

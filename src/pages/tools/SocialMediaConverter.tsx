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

const SocialMediaConverter: React.FC = () => {
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
      {/* Back Button Header */}
      <div className={clsx(
        'w-full border-b',
        darkMode ? 'border-gray-800' : 'border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/dashboard"
            className={clsx(
              'inline-flex items-center gap-2 text-sm transition-colors duration-200',
              darkMode 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 px-3 py-1 rounded-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-1 rounded-md'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Description */}
        <div className="text-center mb-8 px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Share2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-bold">Social Media Converter</h1>
          </div>
          <p className={clsx(
            "mt-2 text-base sm:text-lg",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Convert your content for different social media platforms with AI assistance
          </p>
        </div>

        <div className={clsx(
          'max-w-4xl mx-auto p-4 sm:p-8 rounded-2xl backdrop-blur-sm',
          darkMode
            ? 'bg-gray-800/50 border border-gray-700/50'
            : 'bg-white/80 border border-gray-200 shadow-lg'
        )}>
          {/* Platform Selection */}
          <div className="mb-6">
            <label className={clsx(
              'block text-base font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Select Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={clsx(
                    'flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                    selectedPlatform === platform.id
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {platform.icon}
                  <span className="text-sm sm:text-base">{platform.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content to convert..."
              className={clsx(
                'w-full p-3 sm:p-4 rounded-lg border bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200',
                darkMode
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              )}
              rows={8}
            />
          </div>

          {/* Content Type */}
          <div className="mb-8">
            <label className={clsx(
              'block text-base font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Content Type
            </label>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {contentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={clsx(
                    'px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base',
                    selectedType === type.id
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <button
              onClick={handleConvert}
              disabled={isConverting || !content.trim()}
              className={clsx(
                'w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-all duration-200',
                isConverting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              )}
            >
              {isConverting ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Converting...
                </div>
              ) : (
                'Convert'
              )}
            </button>
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
};

export { SocialMediaConverter };

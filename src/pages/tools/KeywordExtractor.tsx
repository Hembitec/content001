import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Key, Copy, Check, Tag } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { extractKeywords, KeywordExtractionResult } from '../../services/keywordExtractorService';

const KeywordExtractor: React.FC = () => {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [result, setResult] = useState<KeywordExtractionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const extractionResult = await extractKeywords(content);
      setResult(extractionResult);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to extract keywords');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      const copyText = `Keywords:\n${result.keywords.join('\n')}\n\nTopics:\n${result.topics.join('\n')}`;
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={clsx(
      'min-h-screen',
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Header */}
      <header className={clsx(
        'sticky top-0 z-50 border-b backdrop-blur-sm',
        darkMode ? 'bg-gray-900/90 border-gray-800 shadow-lg shadow-gray-900/20' : 'bg-white/90 border-gray-200 shadow-lg shadow-black/5'
      )}>
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link
            to="/dashboard"
            className={clsx(
              'flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-colors',
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Key className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">Keyword Extractor</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Extract key terms and topics from your content
            </p>
          </div>

          {/* Input Form */}
          <div className={clsx(
            'rounded-xl p-4 sm:p-6 space-y-6',
            darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          )}>
            {/* Content Input */}
            <div>
              <label className={clsx(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content here..."
                rows={6}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
                  darkMode
                    ? 'bg-gray-900 border-gray-700 text-gray-100'
                    : 'bg-white border-gray-200 text-gray-900'
                )}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              onClick={handleExtract}
              disabled={isLoading}
              className={clsx(
                'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600',
                'text-white'
              )}
            >
              {isLoading ? 'Extracting...' : 'Extract Keywords'}
            </button>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-progress"></div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-6 mt-6">
                {/* Keywords Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={clsx(
                      'text-xl font-semibold',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      Extracted Keywords
                    </h2>
                    <button
                      onClick={handleCopy}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        darkMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {copied ? (
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

                  <div className="space-y-4">
                    {/* Keywords */}
                    <div>
                      <h3 className={clsx(
                        'text-sm font-medium mb-3',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map((keyword, index) => (
                          <div
                            key={index}
                            className={clsx(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm',
                              darkMode
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-blue-100 text-blue-800'
                            )}
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>{keyword}</span>
                            <span className="text-xs opacity-75">
                              {(result.relevanceScores[keyword] * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Topics */}
                    <div>
                      <h3 className={clsx(
                        'text-sm font-medium mb-3',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.topics.map((topic, index) => (
                          <div
                            key={index}
                            className={clsx(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm',
                              darkMode
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-purple-100 text-purple-800'
                            )}
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KeywordExtractor;

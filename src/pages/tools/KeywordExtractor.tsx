import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Key, Copy, Check, Tag, FileText } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { extractKeywords, KeywordExtractionResult } from '../../services/keywordExtractorService';

export default function KeywordExtractor() {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordExtractionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const extractionResult = await extractKeywords(content);
      setResult(extractionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract keywords');
    } finally {
      setLoading(false);
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
      darkMode ? 'bg-[#0B0F17]' : 'bg-gray-50'
    )}>
      {/* Sticky Header */}
      <div className={clsx(
        'sticky top-0 z-10 border-b shadow-sm',
        darkMode ? 'bg-[#0B0F17] border-gray-800' : 'bg-gray-50 border-gray-200'
      )}>
        <div className="max-w-5xl mx-auto p-3">
          <Link
            to="/dashboard"
            className={clsx(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
              darkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1F2E]'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-3 pb-8">
        <div className="flex flex-col items-center mb-6 text-center pt-6">
          <div className="flex items-center gap-3 mb-2">
            <Key className={clsx(
              'w-6 h-6',
              darkMode ? 'text-blue-400' : 'text-blue-500'
            )} />
            <h1 className={clsx(
              'text-2xl font-bold',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Keyword Extractor
            </h1>
          </div>
          <p className={clsx(
            'text-sm',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Extract keywords and topics from your content
          </p>
        </div>

        <div className="space-y-4">
          {/* Input Section */}
          <div className={clsx(
            'p-4 rounded-xl border',
            darkMode 
              ? 'bg-[#1A1F2E] border-gray-800' 
              : 'bg-white border-gray-200'
          )}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              className={clsx(
                'w-full h-48 p-4 rounded-lg resize-y mb-4 border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-shadow',
                darkMode
                  ? 'bg-[#0B0F17] border-gray-800 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExtract}
                disabled={loading}
                className={clsx(
                  'px-6 py-2.5 rounded-lg font-medium transition-colors',
                  'flex items-center justify-center gap-2',
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
                  'bg-blue-500 text-white'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Extract Keywords'
                )}
              </button>

              {result && (
                <button
                  onClick={handleCopy}
                  className={clsx(
                    'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors',
                    darkMode
                      ? 'bg-[#0B0F17] hover:bg-gray-800 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
                      Copy Results
                    </>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className={clsx(
                'mt-4 p-4 rounded-lg text-sm',
                darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'
              )}>
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className={clsx(
                  'p-3 rounded-lg border flex items-center gap-2',
                  darkMode 
                    ? 'bg-[#1A1F2E] border-gray-800' 
                    : 'bg-white border-gray-200'
                )}>
                  <FileText className={clsx(
                    'w-4 h-4',
                    darkMode ? 'text-blue-400' : 'text-blue-500'
                  )} />
                  <span className={clsx(
                    'text-sm',
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>{result.contentType}</span>
                </div>
                <div className={clsx(
                  'p-3 rounded-lg border flex items-center gap-2',
                  darkMode 
                    ? 'bg-[#1A1F2E] border-gray-800' 
                    : 'bg-white border-gray-200'
                )}>
                  <Tag className={clsx(
                    'w-4 h-4',
                    darkMode ? 'text-purple-400' : 'text-purple-500'
                  )} />
                  <span className={clsx(
                    'text-sm',
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>{result.mainTheme}</span>
                </div>
              </div>

              {/* Content Summary */}
              <div className={clsx(
                'p-4 rounded-xl border',
                darkMode 
                  ? 'bg-[#1A1F2E] border-gray-800' 
                  : 'bg-white border-gray-200'
              )}>
                <h3 className={clsx(
                  'text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Content Summary
                </h3>
                <p className={clsx(
                  'text-sm',
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {result.contentSummary}
                </p>
              </div>

              {/* Keywords */}
              <div className={clsx(
                'p-4 rounded-xl border',
                darkMode 
                  ? 'bg-[#1A1F2E] border-gray-800' 
                  : 'bg-white border-gray-200'
              )}>
                <h3 className={clsx(
                  'text-lg font-semibold mb-4',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                        darkMode
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                      )}
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{keyword}</span>
                      <span className="opacity-75">
                        {(result.relevanceScores[keyword] * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className={clsx(
                'p-4 rounded-xl border',
                darkMode 
                  ? 'bg-[#1A1F2E] border-gray-800' 
                  : 'bg-white border-gray-200'
              )}>
                <h3 className={clsx(
                  'text-lg font-semibold mb-4',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.topics.map((topic, index) => (
                    <div
                      key={index}
                      className={clsx(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm',
                        darkMode
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-purple-100 text-purple-700'
                      )}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

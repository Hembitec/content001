import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scissors, Copy, Check, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { summarizeContent, SummaryOptions, SummaryResult } from '../../services/summarizerService';
import clsx from 'clsx';

const ContentSummarizer: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [options, setOptions] = useState<SummaryOptions>({
    length: 'concise',
    style: 'paragraph',
    focus: 'key_points',
    tone: 'formal'
  });
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSummarize = async () => {
    if (!content.trim()) {
      setError('Please enter some content to summarize');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await summarizeContent(content, options);
      setSummary(result);
    } catch (err: any) {
      console.error('Summarization error:', err);
      setError(err.message || 'Failed to summarize content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={clsx(
      'min-h-screen',
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                darkMode
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
              )}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={clsx(
              'text-2xl font-bold',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Content Summarizer
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className={clsx(
            'rounded-2xl p-6',
            darkMode ? 'bg-gray-800' : 'bg-white',
            'border',
            darkMode ? 'border-gray-700' : 'border-gray-200'
          )}>
            <h2 className={clsx(
              'text-xl font-semibold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Original Content
            </h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here..."
              className={clsx(
                'w-full h-64 p-4 rounded-lg',
                'border focus:ring-2 focus:ring-blue-500 outline-none',
                darkMode
                  ? 'bg-gray-900 border-gray-700 text-gray-100'
                  : 'bg-white border-gray-200 text-gray-900'
              )}
            />

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={clsx(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Length
                </label>
                <select
                  value={options.length}
                  onChange={(e) => setOptions(prev => ({ ...prev, length: e.target.value as 'concise' | 'detailed' }))}
                  className={clsx(
                    'w-full p-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div>
                <label className={clsx(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Style
                </label>
                <select
                  value={options.style}
                  onChange={(e) => setOptions(prev => ({ ...prev, style: e.target.value as 'bullet' | 'paragraph' }))}
                  className={clsx(
                    'w-full p-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="bullet">Bullet Points</option>
                </select>
              </div>

              <div>
                <label className={clsx(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Focus
                </label>
                <select
                  value={options.focus}
                  onChange={(e) => setOptions(prev => ({ ...prev, focus: e.target.value as SummaryOptions['focus'] }))}
                  className={clsx(
                    'w-full p-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="key_points">Key Points</option>
                  <option value="main_ideas">Main Ideas</option>
                  <option value="actionable_insights">Actionable Insights</option>
                </select>
              </div>

              <div>
                <label className={clsx(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Tone
                </label>
                <select
                  value={options.tone}
                  onChange={(e) => setOptions(prev => ({ ...prev, tone: e.target.value as 'formal' | 'casual' }))}
                  className={clsx(
                    'w-full p-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSummarize}
              disabled={loading || !content.trim()}
              className={clsx(
                'mt-6 w-full py-3 px-4 rounded-lg',
                'flex items-center justify-center gap-2',
                'font-medium transition-colors',
                loading
                  ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                  : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              )}
            >
              {loading ? (
                <>
                  <LoadingSpinner className="w-5 h-5" />
                  <span>Summarizing...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5" />
                  <span>Summarize Content</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className={clsx(
            'rounded-2xl p-6',
            darkMode ? 'bg-gray-800' : 'bg-white',
            'border',
            darkMode ? 'border-gray-700' : 'border-gray-200'
          )}>
            <h2 className={clsx(
              'text-xl font-semibold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Summary
            </h2>

            {error && <ErrorMessage message={error} className="mb-4" />}

            {summary && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className={clsx(
                    'p-4 rounded-lg text-center',
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  )}>
                    <div className={clsx(
                      'text-sm font-medium mb-1',
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      Original
                    </div>
                    <div className={clsx(
                      'text-lg font-semibold',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {summary.originalWordCount} words
                    </div>
                  </div>
                  <div className={clsx(
                    'p-4 rounded-lg text-center',
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  )}>
                    <div className={clsx(
                      'text-sm font-medium mb-1',
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      Summary
                    </div>
                    <div className={clsx(
                      'text-lg font-semibold',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {summary.summaryWordCount} words
                    </div>
                  </div>
                  <div className={clsx(
                    'p-4 rounded-lg text-center',
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  )}>
                    <div className={clsx(
                      'text-sm font-medium mb-1',
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      Reading Time
                    </div>
                    <div className={clsx(
                      'text-lg font-semibold',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {summary.readingTimeMinutes} min
                    </div>
                  </div>
                </div>

                {/* Summary Content */}
                <div className="relative">
                  <div className={clsx(
                    'p-4 rounded-lg',
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  )}>
                    <div className={clsx(
                      'prose max-w-none',
                      darkMode ? 'prose-invert' : 'prose-gray'
                    )}>
                      {summary.summary.split('\n').map((paragraph, index) => (
                        <p key={index} className={clsx(
                          'mb-4 last:mb-0',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(summary.summary)}
                    className={clsx(
                      'absolute top-2 right-2',
                      'p-2 rounded-lg transition-colors',
                      darkMode
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                    )}
                  >
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                {/* Key Points */}
                {summary.keyPoints.length > 0 && (
                  <div>
                    <h3 className={clsx(
                      'text-lg font-semibold mb-3',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      Key Points
                    </h3>
                    <ul className={clsx(
                      'list-disc pl-5 space-y-2',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {summary.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!summary && !error && !loading && (
              <div className={clsx(
                'text-center py-12',
                darkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Enter your content and click "Summarize" to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSummarizer;

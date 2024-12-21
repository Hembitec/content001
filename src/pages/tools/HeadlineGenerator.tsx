import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heading, Wand2, Copy, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { generateHeadlines } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import clsx from 'clsx';

export default function HeadlineGenerator() {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [style, setStyle] = useState<'professional' | 'creative' | 'news' | 'blog' | 'social'>('professional');
  const [tone, setTone] = useState<'formal' | 'casual' | 'persuasive' | 'informative'>('formal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<{
    tone: string;
    impact: string;
    suggestions: string[];
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content first');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const result = await generateHeadlines(content, apiKey, {
        style,
        tone,
        count: 5
      });

      setHeadlines(result.headlines);
      setAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate headlines');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
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
        darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'
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
              <Heading className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">Headline Generator</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Create engaging headlines and titles for your content
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
                Topic or Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content topic or main idea"
                rows={4}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
                  darkMode
                    ? 'bg-gray-900 border-gray-700 text-gray-100'
                    : 'bg-white border-gray-200 text-gray-900'
                )}
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={clsx(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as typeof style)}
                  className={clsx(
                    'w-full px-3 py-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="news">News</option>
                  <option value="blog">Blog</option>
                  <option value="social">Social Media</option>
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
                  value={tone}
                  onChange={(e) => setTone(e.target.value as typeof tone)}
                  className={clsx(
                    'w-full px-3 py-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="informative">Informative</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !content.trim()}
              className={clsx(
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                isLoading || !content.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              )}
            >
              {isLoading ? (
                <LoadingSpinner className="w-5 h-5" />
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Headlines
                </>
              )}
            </button>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}
          </div>

          {/* Results */}
          {headlines.length > 0 && (
            <div className={clsx(
              'rounded-xl p-4 sm:p-6 space-y-6',
              darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
            )}>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Generated Headlines
              </h2>
              
              <div className="space-y-4">
                {headlines.map((headline, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'p-4 rounded-lg flex items-center justify-between',
                      darkMode
                        ? 'bg-gray-900/50 hover:bg-gray-900'
                        : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <p className="flex-1 text-lg">{headline}</p>
                    <button
                      onClick={() => copyToClipboard(headline, index)}
                      className={clsx(
                        'p-2 rounded-lg transition-colors',
                        darkMode
                          ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                      )}
                      title={copiedIndex === index ? 'Copied!' : 'Copy to clipboard'}
                    >
                      {copiedIndex === index ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Analysis */}
              {analysis && (
                <div className="space-y-4 mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold">Quick Analysis</h3>
                  
                  <div className={clsx(
                    'space-y-6 p-4 rounded-lg',
                    darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                  )}>
                    <div>
                      <h4 className={clsx(
                        'text-sm font-medium mb-2',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Tone & Style
                      </h4>
                      <p className={clsx(
                        'text-base leading-relaxed',
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {analysis.tone}
                      </p>
                    </div>

                    <div>
                      <h4 className={clsx(
                        'text-sm font-medium mb-2',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Expected Impact
                      </h4>
                      <p className={clsx(
                        'text-base leading-relaxed',
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {analysis.impact}
                      </p>
                    </div>

                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                      <div>
                        <h4 className={clsx(
                          'text-sm font-medium mb-2',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          Pro Tips
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className={clsx(
                                'text-base leading-relaxed',
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              )}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

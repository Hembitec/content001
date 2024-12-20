import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Repeat, Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { rephraseContent, RephraseOptions } from '../../services/rephraserService';

const ContentRephraser: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [rephrasedContent, setRephrasedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [readabilityScore, setReadabilityScore] = useState('');
  const [toneAnalysis, setToneAnalysis] = useState('');
  const [keywordsMaintained, setKeywordsMaintained] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState<RephraseOptions>({
    style: 'professional',
    tone: 'formal',
    preserveKeywords: true,
  });

  const handleOptionChange = (
    field: keyof RephraseOptions,
    value: string | boolean
  ) => {
    setOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRephrase = async () => {
    if (!content.trim()) {
      setError('Please enter some content to rephrase');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await rephraseContent(content, options);
      setRephrasedContent(result.rephrased);
      setReadabilityScore(result.readabilityScore);
      setToneAnalysis(result.toneAnalysis);
      setKeywordsMaintained(result.keywordsMaintained);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to rephrase content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rephrasedContent);
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
              <Repeat className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">Content Rephraser</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Rewrite content in different tones and styles while maintaining the original meaning
            </p>
          </div>

          {/* Input Form */}
          <div className={clsx(
            'rounded-xl p-4 sm:p-6 space-y-6',
            darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          )}>
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
                  value={options.style}
                  onChange={(e) => handleOptionChange('style', e.target.value)}
                  className={clsx(
                    'w-full px-3 py-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="academic">Academic</option>
                  <option value="creative">Creative</option>
                  <option value="simple">Simple</option>
                  <option value="persuasive">Persuasive</option>
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
                  onChange={(e) => handleOptionChange('tone', e.target.value)}
                  className={clsx(
                    'w-full px-3 py-2 rounded-lg',
                    'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-200 text-gray-900'
                  )}
                >
                  <option value="formal">Formal</option>
                  <option value="informal">Informal</option>
                  <option value="empathetic">Empathetic</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </div>

            {/* Preserve Keywords Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="preserveKeywords"
                checked={options.preserveKeywords}
                onChange={(e) => handleOptionChange('preserveKeywords', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label 
                htmlFor="preserveKeywords"
                className={clsx(
                  'text-sm font-medium',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}
              >
                Preserve Keywords
              </label>
            </div>

            {/* Content Input */}
            <div>
              <label className={clsx(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Original Content
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
              onClick={handleRephrase}
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
              {isLoading ? 'Rephrasing...' : 'Rephrase Content'}
            </button>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-progress"></div>
              </div>
            )}

            {/* Results */}
            {rephrasedContent && (
              <div className="space-y-6 mt-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={clsx(
                      'text-xl font-semibold',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      Rephrased Content
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
                  <div className={clsx(
                    'prose max-w-none',
                    darkMode ? 'prose-invert' : '',
                    'p-6 rounded-lg',
                    'border',
                    darkMode
                      ? 'bg-gray-900 border-gray-700'
                      : 'bg-white border-gray-200'
                  )}>
                    {rephrasedContent.split('\n').map((paragraph, index) => (
                      <div key={index} className={clsx(
                        'mb-4 last:mb-0',
                        paragraph.startsWith('Conclusion') || paragraph.startsWith('Introduction') 
                          ? 'text-xl font-semibold mb-3' 
                          : paragraph.match(/^[A-Z][\w\s]+:/) 
                            ? 'text-lg font-semibold mb-2'
                            : 'text-base leading-relaxed'
                      )}>
                        {paragraph}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className={clsx(
                      'text-sm font-medium mb-2',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Readability Score
                    </h3>
                    <div className={clsx(
                      'px-4 py-3 rounded-lg text-sm',
                      'border',
                      darkMode
                        ? 'bg-gray-900 border-gray-700'
                        : 'bg-white border-gray-200'
                    )}>
                      {readabilityScore.replace(/^\*\*|\*\*$/g, '')}
                    </div>
                  </div>

                  <div>
                    <h3 className={clsx(
                      'text-sm font-medium mb-2',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Tone Analysis
                    </h3>
                    <div className={clsx(
                      'px-4 py-3 rounded-lg text-sm',
                      'border',
                      darkMode
                        ? 'bg-gray-900 border-gray-700'
                        : 'bg-white border-gray-200'
                    )}>
                      {toneAnalysis.replace(/^\*\*|\*\*$/g, '')}
                    </div>
                  </div>
                </div>

                {keywordsMaintained.length > 0 && (
                  <div>
                    <h3 className={clsx(
                      'text-sm font-medium mb-2',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Keywords Maintained
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {keywordsMaintained.map((keyword, index) => (
                        <span
                          key={index}
                          className={clsx(
                            'px-3 py-1.5 rounded-full text-sm',
                            darkMode
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-blue-100 text-blue-800'
                          )}
                        >
                          {keyword.replace(/^\*\*|\*\*$/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentRephraser;

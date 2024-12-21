import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { generateCTA } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ArrowLeft, MousePointerClick, Copy, Check, Sparkles } from 'lucide-react';

interface CTAVariation {
  text: string;
  context: string;
  audience: string;
}

interface CTAIdea {
  text: string;
  description: string;
  type: string;
  urgency: 'low' | 'medium' | 'high';
  suggestions: string[];
  variations: CTAVariation[];
  impact: string;
}

export default function CTAGenerator() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [purpose, setPurpose] = useState('');
  const [CTAs, setCTAs] = useState<CTAIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!purpose.trim()) {
      setError('Please enter your CTA purpose');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await generateCTA(purpose, import.meta.env.VITE_GEMINI_API_KEY, {
        count: 5,
        tone: 'persuasive'
      });
      
      // Transform headlines into CTA ideas
      const newCTAs = result.headlines.map((cta, index) => ({
        text: cta,
        description: result.analysis?.suggestions?.[index] || '',
        type: result.analysis?.type || 'General',
        urgency: (result.analysis?.urgency || 'medium') as 'low' | 'medium' | 'high',
        suggestions: result.analysis?.suggestions || [],
        variations: result.analysis?.variations || [],
        impact: result.analysis?.impact || ''
      }));
      
      setCTAs(newCTAs);
    } catch (err: any) {
      setError(err.message || 'Failed to generate CTAs');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (index: number) => {
    const cta = CTAs[index];
    navigator.clipboard.writeText(cta.text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
              <MousePointerClick className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">CTA Generator</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Create compelling calls-to-action that convert
            </p>
          </div>

          {/* Input Form */}
          <div className={clsx(
            'rounded-xl p-4 sm:p-6 space-y-6',
            darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          )}>
            <div>
              <label className={clsx(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                CTA Purpose
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What do you want your users to do? (e.g., Sign up for newsletter, Download ebook, Start free trial)"
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

            <button
              onClick={handleGenerate}
              disabled={loading || !purpose.trim()}
              className={clsx(
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                loading || !purpose.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="w-5 h-5" />
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <MousePointerClick className="w-5 h-5" />
                  Generate CTAs
                </>
              )}
            </button>

            {error && <ErrorMessage message={error} />}
          </div>

          {/* Results */}
          {CTAs.length > 0 && (
            <div className={clsx(
              'rounded-xl p-4 sm:p-6 space-y-6',
              darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
            )}>
              <h2 className="text-xl font-semibold">Generated CTAs</h2>
              
              <div className="space-y-4">
                {CTAs.map((cta, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'p-4 rounded-lg',
                      darkMode
                        ? 'bg-gray-900/50'
                        : 'bg-gray-50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-medium">{cta.text}</h3>
                        
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            'text-xs font-medium px-2 py-1 rounded-full',
                            cta.urgency === 'high' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                              : cta.urgency === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                          )}>
                            {cta.urgency.charAt(0).toUpperCase() + cta.urgency.slice(1)} Urgency
                          </span>
                          <span className={clsx(
                            'text-xs font-medium px-2 py-1 rounded-full',
                            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                          )}>
                            {cta.type}
                          </span>
                        </div>

                        {cta.impact && (
                          <p className={clsx(
                            'text-sm',
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {cta.impact}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => copyToClipboard(index)}
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

                    {cta.suggestions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className={clsx(
                          'text-sm font-medium',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          Implementation Tips
                        </h4>
                        <ul className={clsx(
                          'list-disc list-inside space-y-1 text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {cta.suggestions.map((tip, tipIndex) => (
                            <li key={tipIndex}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

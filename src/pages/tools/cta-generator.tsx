import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { generateHeadlines } from '../../services/geminiService';
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
      const result = await generateHeadlines(purpose, import.meta.env.VITE_GEMINI_API_KEY, {
        count: 5,
        style: 'cta',
        tone: 'persuasive'
      });
      
      // Transform headlines into CTA ideas with proper type checking
      const newCTAs = (result.headlines || []).map(cta => ({
        text: cta || '',
        description: result.analysis?.summary || 'No description available',
        type: result.analysis?.type || 'General',
        urgency: (result.analysis?.urgency || 'medium') as 'low' | 'medium' | 'high',
        suggestions: result.analysis?.suggestions || [],
        variations: result.analysis?.variations || [],
        impact: result.analysis?.impact || ''
      }));
      
      setCTAs(newCTAs);
    } catch (err) {
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="sticky top-0 z-10 bg-opacity-80 backdrop-blur-sm bg-white dark:bg-gray-900 pb-4">
        <div className="flex items-center mb-6">
          <Link
            to="/dashboard"
            className={clsx(
              'p-2 rounded-lg mr-4 hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors duration-200'
            )}
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">CTA Generator</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="purpose"
              className={clsx(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-200' : 'text-gray-700'
              )}
            >
              What's the purpose of your CTA?
            </label>
            <textarea
              id="purpose"
              rows={3}
              className={clsx(
                'w-full px-4 py-2 rounded-lg border',
                'focus:outline-none focus:ring-2',
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 focus:ring-blue-500'
              )}
              placeholder="e.g., Get users to sign up for our newsletter, Download our free ebook, etc."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={clsx(
              'w-full py-2 px-4 rounded-lg',
              'font-medium text-white',
              'transition-colors duration-200',
              'flex items-center justify-center',
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            )}
          >
            {loading ? (
              <LoadingSpinner className="w-5 h-5" />
            ) : (
              'Generate CTAs'
            )}
          </button>

          {error && <ErrorMessage message={error} />}
        </div>
      </div>

      {/* Results Section */}
      {CTAs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 mt-8"
        >
          {CTAs.map((cta, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                'p-6 rounded-lg border relative',
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              )}
            >
              <button
                onClick={() => copyToClipboard(index)}
                className={clsx(
                  'absolute top-4 right-4 p-2 rounded-lg',
                  'transition-colors duration-200',
                  darkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                )}
              >
                {copiedIndex === index ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>

              <div className="mb-4">
                <h2 className={clsx(
                  'text-xl font-semibold mb-2',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {cta.text}
                </h2>
                <div className={clsx(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  cta.urgency === 'high' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : cta.urgency === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                )}>
                  {cta.urgency.charAt(0).toUpperCase() + cta.urgency.slice(1)} Urgency
                </div>
              </div>

              <div className="mb-4">
                <h3 className={clsx(
                  'text-sm font-semibold mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Strategy & Impact
                </h3>
                <p className={clsx(
                  'mb-2',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {cta.description}
                </p>
                <p className={clsx(
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  <span className="font-medium">Expected Impact:</span> {cta.impact}
                </p>
              </div>

              {cta.suggestions.length > 0 && (
                <div className="mb-4">
                  <h3 className={clsx(
                    'text-sm font-semibold mb-2',
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    Implementation Tips
                  </h3>
                  <ul className={clsx(
                    'list-disc list-inside space-y-1',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {cta.suggestions.map((suggestion, sIndex) => (
                      <li key={sIndex}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cta.variations.length > 0 && (
                <div className="mt-4">
                  <h3 className={clsx(
                    'text-sm font-semibold mb-2',
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    A/B Testing Variations
                  </h3>
                  <div className="space-y-3">
                    {cta.variations.map((variation, vIndex) => (
                      <div
                        key={vIndex}
                        className={clsx(
                          'p-3 rounded-lg',
                          darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        )}
                      >
                        <p className={clsx(
                          'font-medium mb-1',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          {variation.text}
                        </p>
                        <p className={clsx(
                          'text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          <span className="font-medium">When to use:</span> {variation.context}
                        </p>
                        <p className={clsx(
                          'text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          <span className="font-medium">Target audience:</span> {variation.audience}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

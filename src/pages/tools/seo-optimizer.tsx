import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { analyzeContent } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ArrowLeft, LineChart, Loader2, AlertCircle } from 'lucide-react';

export default function SeoOptimizer() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await analyzeContent(content, import.meta.env.VITE_GEMINI_API_KEY);
      
      const processedResult = {
        seo: {
          score: result?.seo?.score || 0,
          ...result?.seo
        },
        keywords: {
          main: Array.isArray(result?.keywords?.main) ? result.keywords.main : [],
          lsi: Array.isArray(result?.keywords?.lsi) ? result.keywords.lsi : []
        },
        improvementSuggestions: {
          content: Array.isArray(result?.improvementSuggestions?.content) 
            ? result.improvementSuggestions.content 
            : [],
          style: Array.isArray(result?.improvementSuggestions?.style)
            ? result.improvementSuggestions.style
            : [],
          seo: Array.isArray(result?.improvementSuggestions?.seo)
            ? result.improvementSuggestions.seo
            : []
        }
      };
      
      setAnalysis(processedResult);
    } catch (err) {
      setError(err.message || 'Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-200',
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Sticky Header */}
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

      <main className="px-4 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-3">
              <LineChart className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">SEO Optimizer</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Analyze and optimize your content for better search engine rankings
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              className={clsx(
                'w-full h-64 p-4 rounded-lg border resize-y',
                'focus:outline-none focus:ring-2 transition-colors duration-200',
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 focus:ring-blue-400 text-gray-900 placeholder-gray-400'
              )}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={clsx(
                'mt-4 px-6 py-2.5 rounded-lg font-medium w-full sm:w-auto',
                'transition-all duration-200 flex items-center justify-center gap-2',
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              )}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Analyzing...
                </>
              ) : (
                <>
                  <LineChart className="w-4 h-4" />
                  Analyze Content
                </>
              )}
            </button>
          </motion.div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* Results Section */}
          {analysis && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* SEO Score */}
              <div className={clsx(
                'p-6 rounded-lg border',
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              )}>
                <h2 className="text-xl font-semibold mb-4">SEO Score</h2>
                <div className="flex items-center justify-center">
                  <div className={clsx(
                    'w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold',
                    analysis.seo.score >= 80 ? 'bg-green-100 text-green-700' :
                    analysis.seo.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {analysis.seo.score}%
                  </div>
                </div>
              </div>

              {/* Keywords Analysis */}
              <div className={clsx(
                'p-6 rounded-lg border',
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              )}>
                <h2 className="text-xl font-semibold mb-4">Keyword Analysis</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Main Keywords</h3>
                    <ul className="space-y-2">
                      {analysis.keywords.main.map((keyword, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{keyword.word}</span>
                          <span className={clsx(
                            'px-2 py-1 rounded text-sm',
                            keyword.relevance >= 0.8 ? 'bg-green-100 text-green-700' :
                            keyword.relevance >= 0.6 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          )}>
                            {Math.round(keyword.relevance * 100)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">LSI Keywords</h3>
                    <ul className="space-y-2">
                      {analysis.keywords.lsi.map((keyword, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{keyword.word}</span>
                          <span className={clsx(
                            'px-2 py-1 rounded text-sm',
                            keyword.relevance >= 0.8 ? 'bg-green-100 text-green-700' :
                            keyword.relevance >= 0.6 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          )}>
                            {Math.round(keyword.relevance * 100)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className={clsx(
                'p-6 rounded-lg border',
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              )}>
                <h2 className="text-xl font-semibold mb-4">Improvement Suggestions</h2>
                <div className="space-y-6">
                  {['content', 'style', 'seo'].map((category) => (
                    <div key={category}>
                      <h3 className="text-lg font-medium mb-3 capitalize">{category} Improvements</h3>
                      <ul className="space-y-3">
                        {analysis.improvementSuggestions[category].map((suggestion, index) => (
                          <li 
                            key={index}
                            className={clsx(
                              'p-4 rounded-lg',
                              suggestion.priority === 'high' 
                                ? darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'
                                : suggestion.priority === 'medium'
                                ? darkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                                : darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
                            )}
                          >
                            <div className="font-medium">{suggestion.type}</div>
                            <div className="text-sm mt-1">{suggestion.suggestion}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

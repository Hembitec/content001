import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { generateHeadlines } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ArrowLeft, BookOpen, Copy, Check, Sparkles } from 'lucide-react';

interface BlogIdea {
  title: string;
  description: string;
  keywords: string[];
  tone: string;
  targetAudience: string;
  painPoints: string[];
}

export default function BlogGenerator() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await generateHeadlines(topic, import.meta.env.VITE_GEMINI_API_KEY, {
        count: 5,
        style: 'blog',
        tone: 'balanced'
      });
      
      // Transform headlines into blog ideas with proper type checking
      const newIdeas = result.headlines.map((headline, index) => ({
        title: headline,
        description: result.analysis.summary || 'No description available',
        keywords: result.analysis.keywords || [],
        tone: result.analysis.tone || 'balanced',
        targetAudience: result.analysis.targetAudience || '',
        painPoints: result.analysis.painPoints || []
      }));
      
      setIdeas(newIdeas);
    } catch (err: any) {
      setError(err.message || 'Failed to generate blog ideas');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (index: number) => {
    const idea = ideas[index];
    const text = `
Title: ${idea.title}
Description: ${idea.description}

Target Audience & Pain Points:
- Audience: ${idea.targetAudience}
${idea.painPoints.map(point => `- Pain Point: ${point}`).join('\n')}

Keywords: ${idea.keywords.join(', ')}
    `.trim();
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
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
              <BookOpen className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">Blog Idea Generator</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Generate engaging blog ideas with titles, descriptions, and keywords using Gemini 1.5
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your topic or keyword..."
              className={clsx(
                'w-full p-4 rounded-lg border',
                'focus:outline-none focus:ring-2 transition-colors duration-200',
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 focus:ring-blue-400 text-gray-900 placeholder-gray-400'
              )}
            />
            <button
              onClick={handleGenerate}
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
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Ideas
                </>
              )}
            </button>
          </motion.div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* Results Section */}
          {ideas.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {ideas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={clsx(
                    'p-6 rounded-lg border',
                    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                  )}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-4 flex-1">
                      <h3 className="text-xl font-semibold">{idea.title}</h3>
                      
                      {/* Description */}
                      {idea.description && (
                        <p className={clsx(
                          'text-sm',
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        )}>{idea.description}</p>
                      )}
                      
                      <div className="space-y-4">
                        {/* Target Audience & Pain Points */}
                        {(idea.targetAudience || (idea.painPoints && idea.painPoints.length > 0)) && (
                          <div>
                            <h4 className={clsx(
                              'text-sm font-medium mb-2',
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>Target Audience & Pain Points</h4>
                            {idea.targetAudience && (
                              <p className={clsx(
                                'text-sm mb-2',
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              )}>
                                <span className="font-medium">Audience:</span> {idea.targetAudience}
                              </p>
                            )}
                            {idea.painPoints && idea.painPoints.length > 0 && (
                              <div className="mt-2">
                                <span className={clsx(
                                  'text-sm font-medium',
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                )}>Common Challenges:</span>
                                <ul className={clsx(
                                  'list-disc pl-4 space-y-1 text-sm mt-1',
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                )}>
                                  {idea.painPoints.map((point, pidx) => (
                                    <li key={pidx}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Keywords */}
                        {idea.keywords && idea.keywords.length > 0 && (
                          <div>
                            <h4 className={clsx(
                              'text-sm font-medium mb-2',
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            )}>Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {idea.keywords.map((keyword, kidx) => (
                                <span
                                  key={kidx}
                                  className={clsx(
                                    'px-2 py-1 rounded-md text-xs',
                                    darkMode 
                                      ? 'bg-gray-700 text-gray-300' 
                                      : 'bg-gray-100 text-gray-700'
                                  )}
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(index)}
                      className={clsx(
                        'p-2 rounded-lg transition-colors duration-200',
                        darkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                      )}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className={clsx(
                          'w-5 h-5',
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        )} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

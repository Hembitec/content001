import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeContent } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ArrowLeft, FileText, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';
import { Header } from '../../components/layout/Header';
import { Link } from 'react-router-dom';

const ContentAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const { darkMode } = useTheme();

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    // Count words
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 30) {
      setError('Please enter at least 30 words for accurate analysis');
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('API key is missing. Please check your environment variables.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      console.log('Starting content analysis...');
      const result = await analyzeContent(content, apiKey);
      
      if (!result) {
        throw new Error('Analysis failed. Please try again.');
      }

      setAnalysis(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze content. Please try again.');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferToGenerator = () => {
    if (!analysis) return;

    // Safely extract and format improvements
    const formatImprovements = (items: any[] | undefined) => {
      if (!Array.isArray(items)) return [];
      return items.map(item => typeof item === 'string' ? item : item.suggestion || '').filter(Boolean);
    };

    // Extract keywords from various possible structures
    const extractKeywords = (keywordData: any) => {
      if (typeof keywordData === 'string') return keywordData;
      if (typeof keywordData?.word === 'string') return keywordData.word;
      return null;
    };

    // Get all keywords from the analysis
    const getAllKeywords = () => {
      const keywordSources = [
        // Main keywords
        ...(Array.isArray(analysis.keywords?.main) ? analysis.keywords.main : []),
        ...(Array.isArray(analysis.mainKeywords) ? analysis.mainKeywords : []),
        // LSI keywords
        ...(Array.isArray(analysis.keywords?.lsi) ? analysis.keywords.lsi : []),
        ...(Array.isArray(analysis.lsiKeywords) ? analysis.lsiKeywords : []),
        // Related keywords
        ...(Array.isArray(analysis.keywords?.related) ? analysis.keywords.related : []),
        ...(Array.isArray(analysis.relatedKeywords) ? analysis.relatedKeywords : []),
        // Semantic keywords
        ...(Array.isArray(analysis.semanticKeywords) ? analysis.semanticKeywords : []),
        // SEO keywords
        ...(Array.isArray(analysis.seo?.mainKeywords) ? analysis.seo.mainKeywords : []),
        ...(Array.isArray(analysis.seo?.lsiKeywords) ? analysis.seo.lsiKeywords : [])
      ];

      return [...new Set(
        keywordSources
          .flat()
          .map(extractKeywords)
          .filter(Boolean)
      )];
    };

    // Get content questions from the correct path in the analysis
    const getContentQuestions = () => {
      const questions = analysis.keywords?.questions || 
                       analysis.contentQuestions || 
                       analysis.questions || 
                       analysis.improvementSuggestions?.content?.filter(item => 
                         item.type === 'question' || 
                         item.suggestion?.toLowerCase().includes('?')
                       )?.map(item => item.suggestion) || 
                       [];
      
      return Array.isArray(questions) ? questions : [];
    };

    // Get all keywords
    const allKeywords = getAllKeywords();

    // Format additional notes with error handling
    const additionalNotes = [
      '# Content Analysis Results\n',
      '## Keywords Found:',
      ...allKeywords.map(k => `- ${k}`),
      '\n## Improvements:',
      ...formatImprovements(analysis.improvementSuggestions?.content)
        .map(imp => `- ${imp}`),
      '\n## Style Suggestions:',
      ...formatImprovements(analysis.improvementSuggestions?.style)
        .map(s => `- ${s}`),
      '\n## SEO Suggestions:',
      ...formatImprovements(analysis.improvementSuggestions?.seo)
        .map(s => `- ${s}`),
      '\n## Content Questions:',
      ...getContentQuestions()
        .map(q => `- ${q}`)
    ].filter(Boolean).join('\n');

    // Log the data being transferred
    console.log('Transferring analysis data:', {
      title: analysis.targetKeyword,
      keywords: allKeywords,
      questions: getContentQuestions(),
      additionalNotes
    });

    // Navigate to NLP Generator with data
    navigate('/tools/nlp-generator', {
      state: {
        fromAnalysis: true,
        title: analysis.targetKeyword || '',
        keywords: allKeywords,
        additionalNotes: additionalNotes
      }
    });
  };

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-200',
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className={clsx(
            'inline-flex items-center gap-2 mb-8 text-sm',
            darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Tool Title */}
        <div className="mb-8">
          <h2 className={clsx(
            'text-3xl font-bold flex items-center gap-3 mb-3',
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
          )}>
            Content Analyzer
            <FileText className="text-2xl" />
          </h2>
          <p className={clsx(
            'text-lg',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Analyze your content for SEO optimization and improvement suggestions
          </p>
        </div>

        {/* Content Input */}
        <div className={clsx(
          'rounded-2xl border backdrop-blur-sm p-6',
          darkMode 
            ? 'bg-gray-800/30 border-gray-700/30'
            : 'bg-white/80 border-gray-200/80 shadow-lg'
        )}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={clsx(
              'w-full h-64 p-4 rounded-xl border focus:ring-2 focus:outline-none transition-colors duration-200',
              darkMode
                ? 'bg-gray-900/50 border-gray-700 focus:border-purple-500/50 focus:ring-purple-500/20 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 placeholder-gray-400'
            )}
            placeholder="Enter your content here..."
          />
          <div className="flex justify-end mt-4">
            <motion.button
              onClick={handleAnalyze}
              disabled={isLoading || !content.trim()}
              className={clsx(
                'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm w-[160px]',
                'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
                'text-white shadow-md shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed',
                'active:translate-y-[1px]'
              )}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 border-white" />
                    <span className="whitespace-nowrap">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span className="whitespace-nowrap">Analyze Content</span>
                  </>
                )}
              </div>
            </motion.button>
          </div>
          {error && <ErrorMessage 
            message={error} 
            type={error.includes('30 words') ? 'info' : 'error'} 
            className="mt-4" 
          />}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 mt-8"
          >
            {/* Target Keyword */}
            {analysis.targetKeyword && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className={clsx(
                  'text-2xl font-bold mb-3',
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                )}>
                  Target Keyword
                </h2>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {analysis.targetKeyword}
                </p>
              </motion.div>
            )}

            {/* Main Keywords */}
            {analysis.keywords?.main && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className={clsx(
                  'text-2xl font-bold mb-3',
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                )}>
                  Main Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.main.map((keyword: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className={clsx(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        'hover:scale-105 cursor-default',
                        darkMode
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      )}
                    >
                      {keyword.word}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LSI Keywords */}
            {analysis.keywords?.lsi && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className={clsx(
                  'text-2xl font-bold mb-3',
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                )}>
                  LSI Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.lsi.map((keyword: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className={clsx(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        'hover:scale-105 cursor-default',
                        darkMode
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      )}
                    >
                      {keyword.word}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related Keywords */}
            {analysis.keywords?.related && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className={clsx(
                  'text-2xl font-bold mb-3',
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                )}>
                  Related Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.related.map((keyword: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className={clsx(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        'hover:scale-105 cursor-default',
                        darkMode
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-green-100 text-green-700 border border-green-200'
                      )}
                    >
                      {keyword}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Content Questions */}
            {analysis.keywords?.questions && Array.isArray(analysis.keywords.questions) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className={clsx(
                  'text-xl font-bold mb-6',
                  darkMode ? 'text-purple-300' : 'text-purple-600'
                )}>
                  Content Questions
                </h2>
                <div className={clsx(
                  'p-4 rounded-lg border',
                  darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                )}>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.keywords.questions.map((question: string, index: number) => (
                      <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Content Structure */}
            {analysis.structure && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <h2 className={clsx(
                  'text-xl font-bold mb-6',
                  darkMode ? 'text-purple-300' : 'text-purple-600'
                )}>
                  Content Structure
                </h2>
                
                {/* Headings in a single card */}
                <div className={clsx(
                  'p-4 rounded-lg border',
                  darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                )}>
                  {/* H1 Headings */}
                  {analysis.structure.headings.h1?.length > 0 && (
                    <div className="mb-6">
                      <h3 className={clsx(
                        'text-lg font-medium mb-2',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>H1 Headings</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.structure.headings.h1.map((heading: string, index: number) => (
                          <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {heading}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* H2 Headings */}
                  {analysis.structure.headings.h2?.length > 0 && (
                    <div className="mb-6">
                      <h3 className={clsx(
                        'text-lg font-medium mb-2',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>H2 Headings</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.structure.headings.h2.map((heading: string, index: number) => (
                          <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {heading}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Readability */}
                {analysis.structure.readability && (
                  <div className="mt-6 space-y-4">
                    <h3 className={clsx(
                      'text-lg font-medium mb-3',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>Readability</h3>
                    <div className={clsx(
                      'p-4 rounded-lg border',
                      darkMode
                        ? 'bg-gray-800/50 border-gray-700/50'
                        : 'bg-gray-50 border-gray-200'
                    )}>
                      <div className="space-y-2">
                        <p className={clsx(
                          'font-medium mb-2',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          Score: {analysis.structure.readability.score}/100
                        </p>
                        <p className={clsx(
                          'font-medium mt-4 mb-2',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          Level: {analysis.structure.readability.level}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className={clsx(
                          'font-medium mb-2',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>Suggestions:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.structure.readability.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Improvement Suggestions */}
            {analysis.improvementSuggestions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-6"
              >
                <h2 className={clsx(
                  'text-2xl font-bold mb-3',
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                )}>
                  Improvement Suggestions
                </h2>

                {/* Content Suggestions */}
                {analysis.improvementSuggestions.content?.length > 0 && (
                  <div>
                    <h3 className={clsx(
                      'text-lg font-medium mb-3',
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    )}>
                      Content Suggestions
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.improvementSuggestions.content.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={clsx(
                            'p-4 rounded-xl border',
                            item.priority === 'high' 
                              ? darkMode 
                                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                                : 'bg-red-50 border-red-200 text-red-700'
                              : item.priority === 'medium'
                                ? darkMode
                                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                : darkMode
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                                  : 'bg-blue-50 border-blue-200 text-blue-700'
                          )}
                        >
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {item.suggestion}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Style Suggestions */}
                {analysis.improvementSuggestions.style?.length > 0 && (
                  <div>
                    <h3 className={clsx(
                      'text-lg font-medium mb-3',
                      darkMode ? 'text-green-400' : 'text-green-600'
                    )}>
                      Style Suggestions
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.improvementSuggestions.style.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={clsx(
                            'p-4 rounded-xl border',
                            item.priority === 'high' 
                              ? darkMode 
                                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                                : 'bg-red-50 border-red-200 text-red-700'
                              : item.priority === 'medium'
                                ? darkMode
                                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                : darkMode
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                                  : 'bg-blue-50 border-blue-200 text-blue-700'
                          )}
                        >
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {item.suggestion}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Suggestions */}
                {analysis.improvementSuggestions.seo?.length > 0 && (
                  <div>
                    <h3 className={clsx(
                      'text-lg font-medium mb-3',
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    )}>
                      SEO Suggestions
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.improvementSuggestions.seo.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={clsx(
                            'p-4 rounded-xl border',
                            item.priority === 'high' 
                              ? darkMode 
                                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                                : 'bg-red-50 border-red-200 text-red-700'
                              : item.priority === 'medium'
                                ? darkMode
                                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                : darkMode
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                                  : 'bg-blue-50 border-blue-200 text-blue-700'
                          )}
                        >
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {item.suggestion}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Improvements */}
            {analysis.improvements && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <h2 className={clsx(
                  'text-2xl font-bold mb-3',
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                )}>
                  Content Improvements
                </h2>

                {/* Priority Improvements */}
                {Array.isArray(analysis.improvements.priority) && analysis.improvements.priority.length > 0 && (
                  <div>
                    <h3 className={clsx(
                      'text-lg font-medium mb-3',
                      darkMode ? 'text-orange-400' : 'text-orange-600'
                    )}>
                      Priority Improvements
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.improvements.priority.map((improvement: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={{ x: 4 }}
                          className={clsx(
                            'p-4 rounded-xl flex items-start gap-3 group transition-all',
                            darkMode
                              ? 'bg-orange-500/10 text-orange-200 border border-orange-500/20'
                              : 'bg-orange-50 text-orange-700 border border-orange-200'
                          )}
                        >
                          <div className="mt-1 shrink-0 transition-transform group-hover:translate-x-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </div>
                          <div className="text-sm md:text-base">{improvement}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Improvements */}
                {Array.isArray(analysis.improvements.additional) && analysis.improvements.additional.length > 0 && (
                  <div>
                    <h3 className={clsx(
                      'text-lg font-medium mb-3',
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    )}>
                      Additional Improvements
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.improvements.additional.map((improvement: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={{ x: 4 }}
                          className={clsx(
                            'p-4 rounded-xl flex items-start gap-3 group transition-all',
                            darkMode
                              ? 'bg-blue-500/10 text-blue-200 border border-blue-500/20'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          )}
                        >
                          <div className="mt-1 shrink-0 transition-transform group-hover:translate-x-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <div className="text-sm md:text-base">{improvement}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* SEO Analysis */}
            {analysis.seo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className={clsx(
                  'text-2xl font-bold mb-3',
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                )}>
                  SEO Analysis
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className={clsx(
                      'font-medium mb-2',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Score: {analysis.seo.score}/100
                    </p>
                    <div className={clsx(
                      'p-4 rounded-lg border',
                      darkMode
                        ? 'bg-gray-800/50 border-gray-700/50'
                        : 'bg-gray-50 border-gray-200'
                    )}>
                      <h3 className={clsx(
                        'text-lg font-medium mb-2',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>Recommendations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.seo.recommendations.map((recommendation: string, index: number) => (
                          <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Title Optimization */}
                  <div>
                    <h3 className={clsx(
                      'text-lg font-medium mb-2',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>Title Optimization</h3>
                    <div className={clsx(
                      'p-4 rounded-lg border',
                      darkMode
                        ? 'bg-gray-800/50 border-gray-700/50'
                        : 'bg-gray-50 border-gray-200'
                    )}>
                      <p className={clsx(
                        'font-medium mb-2',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Current Title: {analysis.seo.titleOptimization.current}
                      </p>
                      <p className={clsx(
                        'font-medium mt-4 mb-2',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Suggested Titles:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.seo.titleOptimization.suggestions.map((title: string, index: number) => (
                          <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Content Gaps */}
                  <div>
                    <h3 className={clsx(
                      'text-lg font-medium mb-2',
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>Content Gaps</h3>
                    <div className={clsx(
                      'p-4 rounded-lg border',
                      darkMode
                        ? 'bg-gray-800/50 border-gray-700/50'
                        : 'bg-gray-50 border-gray-200'
                    )}>
                      <div className="mb-4">
                        <p className={clsx(
                          'font-medium mb-2',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>Missing Topics:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.seo.contentGaps.missingTopics.map((topic: string, index: number) => (
                            <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className={clsx(
                          'font-medium mb-2',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}>Competitor Keywords:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.seo.contentGaps.competitorKeywords.map((keyword: string, index: number) => (
                            <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {keyword}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        {analysis && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleTransferToGenerator}
              className={clsx(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all',
                darkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white',
                'focus:ring-2 focus:ring-purple-500/20'
              )}
            >
              <Wand2 className="w-5 h-5" />
              Generate Content from Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { ContentAnalyzer };

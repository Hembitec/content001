import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Wand2, Copy, RefreshCw, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { generateContent } from '../../services/nlpService';
import clsx from 'clsx';
import { IoInformationCircle } from 'react-icons/io5';
import { Popover } from '@headlessui/react';
import { Header } from '../../components/layout/Header';
import { Link } from 'react-router-dom';

interface GeneratedContent {
  title: string;
  metaDescription: string;
  keywords: string[];
  targetAudience: string;
  content: string;
}

export default function NLPGenerator() {
  const navigate = useNavigate();
  const location = useLocation();
  const analysisData = location.state as {
    fromAnalysis?: boolean;
    title?: string;
    keywords?: string[];
    additionalNotes?: string;
  } | null;
  const { darkMode } = useTheme();
  const [title, setTitle] = useState(analysisData?.title || '');
  const [keywords, setKeywords] = useState<string[]>(analysisData?.keywords || []);
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [keynotes, setKeynotes] = useState(analysisData?.additionalNotes || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Form states
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentKeyword.trim()) {
      e.preventDefault();
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a title or topic');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateContent({
        title,
        keywords,
        contentType,
        tone,
        length,
        keynotes: keynotes.trim() || undefined
      });
      
      setGeneratedContent(result);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
              ? 'bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'
          )}>
            NLP Generator
            <Brain className="text-2xl" />
          </h2>
          <p className={clsx(
            'text-lg',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Create tailored content using advanced NLP technology
          </p>
        </div>

        {/* Input Form */}
        <div className={clsx(
          'p-8 rounded-2xl backdrop-blur-sm',
          darkMode
            ? 'bg-gray-800/50 border border-gray-700/50'
            : 'bg-white/80 border border-gray-200 shadow-lg'
        )}>
          {analysisData?.fromAnalysis && (
            <div className={clsx(
              'mb-4 p-4 rounded-xl text-sm',
              darkMode
                ? 'bg-purple-500/10 text-purple-200 border border-purple-500/20'
                : 'bg-purple-50 text-purple-700 border border-purple-200'
            )}>
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span>Content populated from analysis results</span>
              </div>
            </div>
          )}
          {/* Title Input */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Title / Topic
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your article title or main topic..."
              className={clsx(
                'w-full px-4 py-2 rounded-xl border transition-all',
                darkMode
                  ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              )}
            />
          </div>

          {/* Keywords Input */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2 flex items-center justify-between',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              <span>Focus Keywords</span>
              <span className={clsx(
                'text-xs',
                darkMode ? 'text-gray-400' : 'text-gray-500'
              )}>
                Press Enter to add multiple keywords
              </span>
            </label>
            <div className={clsx(
              'px-4 py-2 rounded-xl border transition-all min-h-[42px]',
              darkMode
                ? 'bg-gray-900/50 border-gray-700 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20'
                : 'bg-white border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20'
            )}>
              <div className="flex flex-wrap gap-2 items-center">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'px-2 py-0.5 rounded-full text-sm font-medium flex items-center gap-1',
                      darkMode
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-purple-100 text-purple-700'
                    )}
                  >
                    {keyword}
                    <button
                      onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                      className="hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentKeyword.trim()) {
                      e.preventDefault();
                      if (!keywords.includes(currentKeyword.trim())) {
                        setKeywords([...keywords, currentKeyword.trim()]);
                      }
                      setCurrentKeyword('');
                    }
                  }}
                  className={clsx(
                    'outline-none bg-transparent flex-1 min-w-[120px]',
                    darkMode ? 'text-gray-200' : 'text-gray-900',
                    'placeholder:text-gray-500'
                  )}
                  placeholder={keywords.length === 0 ? "Enter keywords and press Enter..." : "Add more keywords..."}
                />
              </div>
            </div>
          </div>

          {/* Keynotes Input */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2 flex items-center justify-between',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              <span>Additional Notes & Context</span>
              <span className={clsx(
                'text-xs',
                darkMode ? 'text-gray-400' : 'text-gray-500'
              )}>
                Optional - Add your ideas, FAQs, or any additional context
              </span>
            </label>
            <textarea
              value={keynotes}
              onChange={(e) => setKeynotes(e.target.value)}
              placeholder="Paste your research notes, FAQs, key points to cover, or any additional context here..."
              rows={4}
              className={clsx(
                'w-full px-4 py-3 rounded-xl border transition-all resize-y min-h-[100px]',
                darkMode
                  ? 'bg-gray-900/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              )}
            />
          </div>

          {/* Content Type */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className={clsx(
                'w-full px-4 py-2 rounded-xl border transition-all appearance-none',
                darkMode
                  ? 'bg-gray-900/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
                'bg-no-repeat bg-[right_1rem_center] bg-[length:1rem] cursor-pointer',
                darkMode
                  ? '[background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]'
                  : '[background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]'
              )}
            >
              <option value="blog" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Blog Post</option>
              <option value="article" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Article</option>
              <option value="email" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Email Content</option>
            </select>
          </div>

          {/* Tone Selection */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Writing Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={clsx(
                'w-full px-4 py-2 rounded-xl border transition-all appearance-none',
                darkMode
                  ? 'bg-gray-900/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
                'bg-no-repeat bg-[right_1rem_center] bg-[length:1rem] cursor-pointer',
                darkMode
                  ? '[background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]'
                  : '[background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]'
              )}
            >
              <option value="professional" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Professional</option>
              <option value="casual" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Casual</option>
              <option value="friendly" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Friendly</option>
              <option value="formal" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Formal</option>
              <option value="humorous" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Humorous</option>
            </select>
          </div>

          {/* Content Length */}
          <div className="mb-6">
            <label className={clsx(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Content Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className={clsx(
                'w-full px-4 py-2 rounded-xl border transition-all appearance-none',
                darkMode
                  ? 'bg-gray-900/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
                'bg-no-repeat bg-[right_1rem_center] bg-[length:1rem] cursor-pointer',
                darkMode
                  ? '[background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]'
                  : '[background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]'
              )}
            >
              <option value="short" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Short (~500 words)</option>
              <option value="medium" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Medium (~1000 words)</option>
              <option value="long" className={darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}>Long (~2000 words)</option>
            </select>
          </div>

          <div className="mt-8 mb-12 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating || !title.trim()}
              className={clsx(
                'px-6 py-3 rounded-xl font-medium flex items-center gap-2',
                'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
                'text-white disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner className="w-5 h-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </motion.button>
          </div>

          {error && <ErrorMessage message={error} className="mt-4" />}
        </div>

        {/* Generated Content */}
        {generatedContent && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={clsx(
                'text-xl font-semibold',
                darkMode ? 'text-purple-400' : 'text-purple-600'
              )}>
                Generated Content
              </h2>
              <div className="flex items-center gap-2">
                {/* Action Buttons */}
                <button
                  onClick={() => {
                    const contentElement = document.createElement('div');
                    contentElement.innerHTML = generatedContent.content;
                    const formattedContent = contentElement.innerHTML;
                    navigator.clipboard.writeText(formattedContent)
                      .then(() => {
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      })
                      .catch(err => console.error('Failed to copy:', err));
                  }}
                  className={clsx(
                    'p-2 rounded-full transition-all duration-200',
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100',
                    isCopied && (darkMode 
                      ? 'text-green-400 bg-green-400/10' 
                      : 'text-green-600 bg-green-50')
                  )}
                  title={isCopied ? "Copied!" : "Copy content"}
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: isCopied ? 0.8 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.div>
                </button>
                <button
                  onClick={() => {
                    if (title) {
                      setIsGenerating(true);
                      setError(null);
                      handleGenerate();
                    }
                  }}
                  className={clsx(
                    'p-2 rounded-full transition-colors',
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
                  )}
                  title="Regenerate content"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <Popover className="relative">
                  <Popover.Button className={clsx(
                    'p-2 rounded-full transition-colors',
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
                  )}>
                    <IoInformationCircle className="w-5 h-5" />
                  </Popover.Button>
                  <Popover.Panel className={clsx(
                    'absolute right-0 z-10 mt-2 w-96 rounded-xl shadow-lg',
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  )}>
                    <div className="p-4">
                      <h3 className={clsx(
                        'text-lg font-medium mb-3',
                        darkMode ? 'text-gray-200' : 'text-gray-800'
                      )}>
                        SEO Meta Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className={clsx(
                            'text-sm font-medium',
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          )}>Title</p>
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{generatedContent.title}</p>
                        </div>
                        <div>
                          <p className={clsx(
                            'text-sm font-medium',
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          )}>Meta Description</p>
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{generatedContent.metaDescription}</p>
                        </div>
                        <div>
                          <p className={clsx(
                            'text-sm font-medium',
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          )}>Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {(generatedContent.keywords || []).map((keyword, index) => (
                              <span
                                key={index}
                                className={clsx(
                                  'px-2 py-0.5 rounded-full text-sm',
                                  darkMode
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-purple-100 text-purple-700'
                                )}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className={clsx(
                            'text-sm font-medium',
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          )}>Target Audience</p>
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{generatedContent.targetAudience}</p>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Popover>
              </div>
            </div>

            {/* Main Content */}
            <div 
              className={clsx(
                'prose max-w-none',
                darkMode ? 'prose-invert' : '',
                'prose-headings:font-semibold',
                'prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-purple-600 dark:prose-h1:text-purple-400',
                'prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-gray-800 dark:prose-h2:text-gray-200',
                'prose-h3:text-xl prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-700 dark:prose-h3:text-gray-300',
                'prose-p:text-base prose-p:leading-7 prose-p:my-4 prose-p:text-gray-600 dark:prose-p:text-gray-400',
                'prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6',
                'prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6',
                'prose-li:my-2 prose-li:text-gray-600 dark:prose-li:text-gray-400',
                'prose-strong:font-semibold prose-strong:text-gray-800 dark:prose-strong:text-gray-200',
                'prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300',
                'prose-a:text-purple-600 prose-a:hover:text-purple-700 dark:prose-a:text-purple-400 dark:prose-a:hover:text-purple-300',
                'prose-table:w-full prose-table:my-6 prose-table:border-collapse',
                'prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left dark:prose-th:border-gray-700 dark:prose-th:bg-gray-800',
                'prose-td:border prose-td:border-gray-300 prose-td:p-3 dark:prose-td:border-gray-700'
              )}
            >
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: generatedContent.content
                      .replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-6 text-purple-600 dark:text-purple-400">')
                      .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-200">')
                      .replace(/<h3>/g, '<h3 class="text-xl font-medium mt-6 mb-3 text-gray-700 dark:text-gray-300">')
                      .replace(/<p>/g, '<p class="text-base leading-7 my-4 text-gray-600 dark:text-gray-400">')
                      .replace(/<ul>/g, '<ul class="my-4 list-disc pl-6">')
                      .replace(/<ol>/g, '<ol class="my-4 list-decimal pl-6">')
                      .replace(/<li>/g, '<li class="my-2 text-gray-600 dark:text-gray-400">')
                      .replace(/<strong>/g, '<strong class="font-semibold text-gray-800 dark:text-gray-200">')
                      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-purple-500 pl-4 italic my-6 text-gray-700 dark:text-gray-300">')
                  }} 
                />
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Wand2, Copy, RefreshCw, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { generateContent } from '../../services/nlpService';
import clsx from 'clsx';
import { IoInformationCircle } from 'react-icons/io5';
import { Popover } from '@headlessui/react';

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
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentKeyword.trim()) {
      e.preventDefault();
      if (!keywords.includes(currentKeyword.trim())) {
        setKeywords([...keywords, currentKeyword.trim()]);
      }
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-3">
              <Brain className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">Content Generator</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Create high-quality, SEO-optimized content with AI assistance
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={clsx(
              'rounded-xl p-4 sm:p-6 space-y-6',
              darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
            )}
          >
            {/* Title Input */}
            <div className="space-y-2">
              <label className={clsx(
                'block text-sm font-medium',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Content Title or Topic
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your content title or topic"
                className={clsx(
                  'w-full px-4 py-2 rounded-lg border transition-colors',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                )}
              />
            </div>

            {/* Keywords Input */}
            <div className="space-y-2">
              <label className={clsx(
                'block text-sm font-medium',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Keywords
              </label>
              <div className={clsx(
                'p-2 rounded-lg border min-h-[42px]',
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              )}>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className={clsx(
                        'inline-flex items-center px-3 py-1 rounded-full text-sm',
                        darkMode
                          ? 'bg-gray-600 text-gray-200'
                          : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(index)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={keywords.length === 0 ? "Type keywords and press Enter" : "Add more keywords..."}
                    className={clsx(
                      'flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm',
                      darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Content Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Content Type */}
              <div className="space-y-2">
                <label className={clsx(
                  'block text-sm font-medium',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 rounded-lg border transition-colors',
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                >
                  <option value="blog">Blog Post</option>
                  <option value="article">Article</option>
                  <option value="email">Email Content</option>
                </select>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <label className={clsx(
                  'block text-sm font-medium',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 rounded-lg border transition-colors',
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              {/* Length */}
              <div className="space-y-2">
                <label className={clsx(
                  'block text-sm font-medium',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-2 rounded-lg border transition-colors',
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label className={clsx(
                'block text-sm font-medium',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={keynotes}
                onChange={(e) => setKeynotes(e.target.value)}
                rows={4}
                placeholder="Add any specific requirements or notes for the content"
                className={clsx(
                  'w-full px-4 py-2 rounded-lg border transition-colors',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                )}
              />
            </div>

            {/* Generate Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={clsx(
                  'w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all',
                  'flex items-center justify-center gap-2',
                  isGenerating
                    ? 'bg-blue-500/50 cursor-not-allowed'
                    : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
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
              </button>
            </div>

            {error && <ErrorMessage message={error} />}
          </motion.div>

          {/* Generated Content */}
          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                'rounded-xl overflow-hidden',
                darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
              )}
            >
              {/* Content Header */}
              <div className={clsx(
                'p-4 border-b',
                darkMode ? 'border-gray-700' : 'border-gray-200'
              )}>
                <div className="flex items-center justify-between">
                  <h2 className={clsx(
                    'text-lg font-semibold',
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  )}>
                    Generated Content
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent.content)
                          .then(() => {
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          });
                      }}
                      className={clsx(
                        'p-2 rounded-lg transition-colors',
                        darkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleGenerate}
                      className={clsx(
                        'p-2 rounded-lg transition-colors',
                        darkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <Popover className="relative">
                      {({ open }) => (
                        <>
                          <Popover.Button
                            className={clsx(
                              'p-2 rounded-lg transition-colors',
                              darkMode
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-100',
                              open && (darkMode ? 'bg-gray-700' : 'bg-gray-100')
                            )}
                          >
                            <IoInformationCircle className="w-5 h-5" />
                          </Popover.Button>

                          <Popover.Panel className={clsx(
                            'absolute right-0 z-10 mt-2 w-80 sm:w-96 rounded-lg shadow-lg',
                            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                          )}>
                            <div className="p-4">
                              <h3 className="text-lg font-medium mb-4">SEO Meta Information</h3>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Title</h4>
                                  <p className="text-sm">{generatedContent.title}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Meta Description</h4>
                                  <p className="text-sm">{generatedContent.metaDescription}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Keywords</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {generatedContent.keywords.map((keyword, index) => (
                                      <span
                                        key={index}
                                        className={clsx(
                                          'px-2 py-1 rounded-full text-sm',
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
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Target Audience</h4>
                                  <p className="text-sm">{generatedContent.targetAudience}</p>
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </>
                      )}
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-6">
                <div
                  className={clsx(
                    'prose max-w-none',
                    darkMode ? 'prose-invert' : '',
                    'prose-headings:font-semibold',
                    'prose-h1:text-2xl prose-h1:mb-4',
                    'prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6',
                    'prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4',
                    'prose-p:text-base prose-p:leading-7 prose-p:mb-4',
                    'prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4',
                    'prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4',
                    'prose-li:mb-2'
                  )}
                  dangerouslySetInnerHTML={{
                    __html: generatedContent.content
                      .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-4">')
                      .replace(/<h2>/g, '<h2 class="text-xl font-semibold mt-6 mb-3">')
                      .replace(/<h3>/g, '<h3 class="text-lg font-medium mt-4 mb-2">')
                      .replace(/<p>/g, '<p class="mb-4 leading-7">')
                      .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-4 space-y-2">')
                      .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-4 space-y-2">')
                      .replace(/<li>/g, '<li class="mb-2">')
                      .replace(/<strong>/g, '<strong class="font-semibold">')
                      .replace(/<em>/g, '<em class="italic">')
                      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-4 italic my-4">')
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

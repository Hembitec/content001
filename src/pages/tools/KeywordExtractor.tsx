import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Key, Copy, Check, Tag, FileText } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { extractKeywords, KeywordExtractionResult } from '../../services/keywordExtractorService';

export default function KeywordExtractor() {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordExtractionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const extractionResult = await extractKeywords(content);
      setResult(extractionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      const copyText = `Keywords:\n${result.keywords.join('\n')}\n\nTopics:\n${result.topics.join('\n')}`;
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0B0F17] border-b border-gray-800">
        <div className="max-w-5xl mx-auto p-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-[#1A1F2E]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-3 pb-8">
        <div className="flex flex-col items-center mb-6 text-center pt-6">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">
              Keyword Extractor
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Extract keywords and topics from your content
          </p>
        </div>

        <div className="space-y-4">
          {/* Input Section */}
          <div className="p-4 rounded-xl bg-[#1A1F2E] border border-gray-800">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              className="w-full h-48 p-4 rounded-lg resize-y mb-4 bg-[#0B0F17] border border-gray-800 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-shadow"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExtract}
                disabled={loading}
                className={clsx(
                  'px-6 py-2.5 rounded-lg font-medium transition-colors',
                  'flex items-center justify-center gap-2',
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
                  'bg-blue-500 text-white'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Extract Keywords'
                )}
              </button>

              {result && (
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors bg-[#0B0F17] hover:bg-gray-800 text-gray-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Results
                    </>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-lg text-sm bg-red-500/20 text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#1A1F2E] border border-gray-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{result.contentType}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#1A1F2E] border border-gray-800 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">{result.mainTheme}</span>
                </div>
              </div>

              {/* Content Summary */}
              <div className="p-4 rounded-xl bg-[#1A1F2E] border border-gray-800">
                <h3 className="text-sm font-medium mb-2 text-gray-300">
                  Content Summary
                </h3>
                <p className="text-sm text-gray-300">
                  {result.contentSummary}
                </p>
              </div>

              {/* Keywords */}
              <div className="p-4 rounded-xl bg-[#1A1F2E] border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-blue-500/20 text-blue-300"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{keyword}</span>
                      <span className="opacity-75">
                        {(result.relevanceScores[keyword] * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="p-4 rounded-xl bg-[#1A1F2E] border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.topics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-purple-500/20 text-purple-300"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

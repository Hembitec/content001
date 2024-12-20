import React, { useState } from 'react';
import { LetterT, Sparkles } from 'lucide-react';

export function HeadlineGenerator() {
  const [content, setContent] = useState('');
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHeadlines = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    try {
      // TODO: Integrate with actual AI service
      // This is a mock response for now
      const mockHeadlines = [
        "10 Proven Ways to " + content,
        "The Ultimate Guide to " + content,
        "Why " + content + " Matters More Than Ever",
        "How to Master " + content + " in 2024",
        "The Secret Behind Successful " + content
      ];
      
      setHeadlines(mockHeadlines);
    } catch (error) {
      console.error('Error generating headlines:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <LetterT className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Headline Generator</h1>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            What's your content about?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Enter your topic or paste your content here..."
          />
        </div>

        <button
          onClick={generateHeadlines}
          disabled={!content.trim() || isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate Headlines'}
        </button>

        {headlines.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Generated Headlines</h2>
            <div className="space-y-3">
              {headlines.map((headline, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {headline}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

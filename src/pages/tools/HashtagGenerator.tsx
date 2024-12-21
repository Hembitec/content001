import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Hash, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import clsx from 'clsx';

// Predefined hashtag sets for different platforms
const platformHashtagFallbacks = {
  linkedin: [
    '#ProfessionalGrowth',
    '#CareerDevelopment',
    '#BusinessInsights',
    '#ProfessionalNetworking',
    '#IndustryTrends'
  ],
  instagram: [
    '#InstaDaily',
    '#ContentCreation',
    '#CreativeCommunity',
    '#VisualStorytelling',
    '#InspirationalContent'
  ],
  twitter: [
    '#TrendingNow',
    '#QuickInsights',
    '#BreakingNews',
    '#TopicOfTheDay',
    '#CurrentTrends'
  ],
  facebook: [
    '#CommunityConnection',
    '#ShareableMoments',
    '#LifestyleContent',
    '#PopularTrends',
    '#EngagingStories'
  ],
  general: [
    '#ContentIQ',
    '#AIContent',
    '#DigitalInnovation',
    '#CreativeStrategy',
    '#TechTrends',
    '#Innovation',
    '#Technology',
    '#DigitalTransformation',
    '#FutureOfWork',
    '#CreativeSolutions',
    '#BusinessIntelligence',
    '#DataDriven',
    '#AIInnovation',
    '#TechTrends',
    '#GlobalInnovation',
    '#StrategicThinking',
    '#BusinessStrategy',
    '#IndustryInsights',
    '#ProfessionalGrowth',
    '#EmergingTechnologies'
  ]
};

// Implement Gemini 1.5 Pro hashtag generation
async function generateHashtags(content: string, platform?: string): Promise<string[]> {
  // Use environment variable for API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please check your environment variables.');
  }

  // Validate inputs
  if (!content || content.trim().length < 3) {
    // Return platform-specific fallback hashtags if content is too short
    const fallbackPlatform = (platform && platformHashtagFallbacks[platform as keyof typeof platformHashtagFallbacks]) 
      ? platform 
      : 'general';
    return platformHashtagFallbacks[fallbackPlatform as keyof typeof platformHashtagFallbacks];
  }

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro-latest",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 1024
    }
  });

  // Platform-specific hashtag generation guidance
  const platformGuidance = {
    linkedin: `
      LinkedIn Hashtag Generation Guidelines:
      - Focus on professional, business, and industry-specific hashtags
      - Use PascalCase or lowercase with no spaces
      - Emphasize career development, industry trends, and professional insights
      - Prioritize tags that showcase expertise and thought leadership
      - Avoid overly casual or personal hashtags
    `,
    instagram: `
      Instagram Hashtag Strategy:
      - Create visually engaging and trendy hashtags
      - Mix popular and niche-specific tags
      - Include community and lifestyle-related hashtags
      - Use creative and descriptive tags
      - Leverage trending topics and visual content themes
    `,
    twitter: `
      Twitter Hashtag Approach:
      - Keep hashtags concise and punchy
      - Focus on current conversations and trending topics
      - Use industry keywords and timely references
      - Aim for clarity and immediate understanding
      - Prioritize engagement and discoverability
    `,
    facebook: `
      Facebook Hashtag Guidelines:
      - Focus on community engagement and shareable content
      - Use a mix of broad and specific hashtags
      - Emphasize storytelling and emotional connection
      - Include tags that encourage interaction and sharing
      - Balance trending topics with meaningful, relatable tags
    `,
    general: `
      General Hashtag Creation Principles:
      - Generate relevant and meaningful hashtags
      - Ensure direct connection to the content
      - Balance specificity and broad appeal
      - Reflect the core message and intent
    `
  };

  // Construct a comprehensive prompt for hashtag generation
  const prompt = `Advanced Hashtag Generation Task

Content Context:
${content}

Platform: ${platform || 'general'}

Platform-Specific Guidelines:
${platformGuidance[platform as keyof typeof platformGuidance] || platformGuidance.general}

Detailed Hashtag Generation Instructions:
1. Analyze the content deeply and extract key themes
2. Generate 5-7 unique, platform-optimized hashtags
3. Ensure hashtags are:
   - Directly relevant to the content
   - Professionally crafted
   - Engaging and discoverable
   - Compliant with platform best practices

Mandatory Output Format:
- Prefix each hashtag with #
- Use CamelCase for multi-word hashtags
- Maximum length of 30 characters
- No spaces or special characters
- Prioritize clarity and impact

Example High-Quality Output for Professional Content:
#ProfessionalGrowth
#CareerInnovation
#LeadershipInsights
#BusinessStrategy
#ProfessionalDevelopment

CRITICAL: If you cannot generate meaningful hashtags, explain why in a single sentence.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log('Raw Gemini Response:', response);

    // Enhanced parsing to handle various response formats
    const hashtags = response
      .split('\n')
      .map(tag => tag.trim())
      .filter(tag => 
        tag.startsWith('#') && 
        tag.length > 1 && 
        !tag.includes(' ') &&
        tag.length <= 30
      );

    // Fallback and logging
    if (hashtags.length === 0) {
      console.error('No hashtags generated. Full response:', response);
      
      // Return platform-specific fallback hashtags
      const fallbackPlatform = (platform && platformHashtagFallbacks[platform as keyof typeof platformHashtagFallbacks]) 
        ? platform 
        : 'general';
      return platformHashtagFallbacks[fallbackPlatform as keyof typeof platformHashtagFallbacks];
    }

    // If platform is general, ensure at least 20 hashtags
    if (platform === 'general') {
      const generalFallbacks = platformHashtagFallbacks.general;
      const combinedHashtags = [...new Set([...hashtags, ...generalFallbacks])];
      
      // If still less than 20, generate additional generic hashtags
      while (combinedHashtags.length < 20) {
        const genericHashtags = [
          '#Innovation',
          '#Technology',
          '#DigitalTransformation',
          '#FutureOfWork',
          '#CreativeSolutions',
          '#BusinessIntelligence',
          '#DataDriven',
          '#GlobalTrends',
          '#StrategicThinking',
          '#IndustryInsights'
        ];
        
        const additionalTag = genericHashtags[Math.floor(Math.random() * genericHashtags.length)];
        if (!combinedHashtags.includes(additionalTag)) {
          combinedHashtags.push(additionalTag);
        }
      }

      return combinedHashtags.slice(0, 20);
    }

    return hashtags;
  } catch (error) {
    console.error('Comprehensive Hashtag Generation Error:', {
      platform,
      content,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresence: import.meta.env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing'
    });

    // More specific error handling
    if (error instanceof Error) {
      console.error('Detailed Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    // Return platform-specific fallback hashtags
    const fallbackPlatform = (platform && platformHashtagFallbacks[platform as keyof typeof platformHashtagFallbacks]) 
      ? platform 
      : 'general';
    return platformHashtagFallbacks[fallbackPlatform as keyof typeof platformHashtagFallbacks];
  }
}

export default function HashtagGenerator() {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('general');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);

  // Check API key on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      setError('Gemini API key is missing. Please configure your environment variables.');
    }
  }, []);

  const platforms = [
    { id: 'general', label: 'General' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' }
  ];

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content to generate hashtags');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const generatedHashtags = await generateHashtags(content, platform);
      setHashtags(generatedHashtags);
    } catch (err) {
      console.error('Hashtag generation error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to generate hashtags. Please check your API configuration.';
      
      // More detailed error logging
      if (err instanceof Error) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
      }

      setError(errorMessage);
      setHashtags([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyAll = async () => {
    if (hashtags.length === 0) return;

    try {
      // Join hashtags with spaces
      const allHashtags = hashtags.join(' ');
      
      // Copy to clipboard
      await navigator.clipboard.writeText(allHashtags);
      
      // Show copied state
      setCopiedAll(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all hashtags:', err);
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
              <Hash className={clsx(
                'w-8 h-8',
                darkMode ? 'text-blue-400' : 'text-blue-600'
              )} />
              <h1 className="text-2xl sm:text-3xl font-bold">Hashtag Generator</h1>
            </div>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Generate relevant hashtags for your content
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={clsx(
              'rounded-xl p-4 sm:p-6 space-y-6',
              darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
            )}
          >
            {/* Platform Selection */}
            <div className="mb-4">
              <label className={clsx(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Select Platform
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map(platformOption => (
                  <button
                    key={platformOption.id}
                    onClick={() => setPlatform(platformOption.id)}
                    className={clsx(
                      'px-4 py-2 rounded-lg transition-all duration-200',
                      platform === platformOption.id
                        ? 'bg-blue-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {platformOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="space-y-2">
              <label className={clsx(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Content or Topic
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content or topic to generate hashtags..."
                className={clsx(
                  'w-full h-48 p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2',
                  darkMode
                    ? 'bg-[#0B0F17] border-gray-800 text-white placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500/30'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500/30'
                )}
              />
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <motion.button
                type="button"
                initial={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                disabled={isLoading || apiKeyError}
                className={clsx(
                  'px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2',
                  isLoading || apiKeyError ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
                  'bg-blue-500 text-white'
                )}
              >
                {isLoading ? (
                  <>
                    <svg 
                      className="animate-spin h-5 w-5 mr-2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Hash className="w-5 h-5" />
                    Generate Hashtags
                  </>
                )}
              </motion.button>
            </div>

            {/* Hashtag Results */}
            {hashtags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  'mt-6 p-4 rounded-lg border',
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white border-gray-200'
                )}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {hashtags.map((hashtag, index) => (
                    <motion.button
                      key={hashtag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleCopy(hashtag, index)}
                      className={clsx(
                        'px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1',
                        copiedIndex === index 
                          ? 'bg-green-500 text-white' 
                          : (darkMode 
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                      )}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {hashtag}
                        </>
                      )}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  type="button"
                  initial={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyAll}
                  className={clsx(
                    'px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 w-full justify-center',
                    copiedAll 
                      ? 'bg-green-500 text-white' 
                      : (darkMode 
                          ? 'bg-blue-700 text-white hover:bg-blue-600' 
                          : 'bg-blue-500 text-white hover:bg-blue-600')
                  )}
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-5 h-5" />
                      All Hashtags Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy All Hashtags
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Error Handling */}
            {error && (
              <div className={clsx(
                'mt-4 p-3 rounded-lg flex items-center gap-3',
                apiKeyError 
                  ? 'bg-red-500/10 border border-red-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              )}>
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

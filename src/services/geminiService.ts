import axios from 'axios';

interface KeywordAnalysis {
  word: string;
  searchVolume: number;
  difficulty: number;
  relevance: number;
  usage: {
    count: number;
    density: number;
    locations: string[];
  };
}

interface ContentStructure {
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  paragraphs: {
    count: number;
    averageLength: number;
    suggestions: string[];
  };
  readability: {
    score: number;
    level: string;
    suggestions: string[];
  };
}

interface SeoAnalysis {
  score: number;
  mainKeywords: KeywordAnalysis[];
  lsiKeywords: KeywordAnalysis[];
  titleOptimization: {
    current: string;
    suggestions: string[];
    score: number;
  };
  metaDescription: {
    current: string;
    suggestions: string[];
    score: number;
  };
  contentGaps: {
    missingTopics: string[];
    competitorKeywords: string[];
    suggestions: string[];
  };
}

interface CompetitorAnalysis {
  topRankingArticles: Array<{
    url: string;
    title: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  commonKeywords: string[];
  uniqueAngles: string[];
}

export interface ContentOptimizationResponse {
  keywords: {
    main: KeywordAnalysis[];
    lsi: KeywordAnalysis[];
    related: string[];
    questions: string[];
  };
  structure: ContentStructure;
  seo: SeoAnalysis;
  competitors: CompetitorAnalysis;
  improvements: {
    priority: string[];
    additional: string[];
  };
  improvementSuggestions: {
    content: {
      type: string;
      suggestion: string;
      priority: string;
    }[];
    style: {
      type: string;
      suggestion: string;
      priority: string;
    }[];
    seo: {
      type: string;
      suggestion: string;
      priority: string;
    }[];
  };
}

export interface HeadlineGenerationResponse {
  headlines: string[];
  analysis: {
    tone: string;
    impact: string;
    suggestions: string[];
    summary: string;
  };
}

interface CTAGenerationResponse {
  ctas: string[];
  analysis: {
    tone: string;
    urgency: string;
    effectiveness: string;
  };
}

// Constants for API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 60000; // 60 seconds
const BACKOFF_MULTIPLIER = 2; // Used in makeGeminiRequest for exponential backoff

// Prompt templates
const createBlogPrompt = (content: string, tone: string, count: number) => `Generate a comprehensive blog idea including:
- Title: A catchy and relevant title
- Description: A brief summary of what the blog will cover
- Keywords: A list of relevant keywords to target

Ensure the content is engaging and informative, focusing on providing value to the reader. Use a professional tone and include actionable insights where possible.

For each blog idea, provide:
- A compelling headline that draws interest
- A natural description that explains the value to readers
- Key points that could be covered
- Target audience insights
- Potential angles to explore

Return the response in this exact JSON format:
{
  "headlines": [
    "Your First Headline Here",
    "Another Great Topic Idea",
    "Something Readers Will Love"
  ],
  "analysis": {
    "tone": "balanced mix of professional and approachable",
    "impact": "what readers will gain from this content",
    "summary": "natural overview of the topic's value and relevance",
    "keywords": ["relevant", "keyword", "phrases"],
    "suggestions": [
      "specific content angle to explore",
      "interesting perspective to consider"
    ]
  }
}

Topic: ${content}
Style: blog
Tone: ${tone}
Number of ideas: ${count}

Guidelines:
- Keep descriptions clear but conversational
- Focus on real value and practical insights
- Include specific examples where relevant
- Address reader questions and pain points
- Maintain professionalism while being approachable`;

const createCTAPrompt = (content: string, tone: string, count: number) => `Create compelling call-to-action (CTA) ideas for the following purpose. Write in a persuasive yet natural style that motivates action while building trust. Balance professionalism with emotional connection, and focus on clear value propositions.

For each CTA idea, provide:
- A strong, action-oriented headline
- The psychological principle behind it
- Target audience motivation
- Best placement suggestions
- A/B testing variations

Return the response in this exact JSON format:
{
  "headlines": [
    "Primary CTA Text Here",
    "Another Compelling Option",
    "Value-Focused Call to Action"
  ],
  "analysis": {
    "tone": "persuasive yet trustworthy approach",
    "impact": "expected conversion impact and why",
    "summary": "strategic overview and psychological triggers used",
    "suggestions": [
      "placement recommendation",
      "timing suggestion",
      "audience targeting tip"
    ],
    "variations": [
      {
        "text": "alternative version",
        "context": "when to use this variant",
        "audience": "specific audience segment"
      }
    ],
    "urgency": "balanced" | "high" | "low",
    "type": "action type (e.g., purchase, signup, download)"
  }
}

Purpose: ${content}
Style: cta
Tone: ${tone}
Number of CTAs: ${count}

Guidelines:
- Focus on clear value proposition
- Use action-oriented language
- Create urgency without being pushy
- Build trust through transparency
- Test different emotional triggers
- Consider user journey stage`;

const createSystemPrompt = (content: string, tone: string, count: number) => `You are an advanced content optimization AI. Analyze the provided content and return a detailed JSON response.

Content: ${content}
Tone: ${tone}
Count: ${count}`;

// Update the generatePrompt function to use the new template functions
const generatePrompt = (inputContent: string, inputOptions: {
  style?: 'blog' | 'cta' | 'casual';
  tone?: string;
  count?: number;
}): string => {
  const options = {
    tone: inputOptions.tone || 'balanced',
    count: inputOptions.count || 5
  };

  switch (inputOptions.style) {
    case 'blog':
      return createBlogPrompt(inputContent, options.tone, options.count);
    case 'cta':
      return createCTAPrompt(inputContent, options.tone, options.count);
    default:
      return createSystemPrompt(inputContent, options.tone, options.count);
  }
};

// List of banned keywords and phrases to avoid in content generation
const BANNED_KEYWORDS = [
  // Overused Corporate/Tech Buzzwords
  'revolutionize', 'dive in', 'venture', 'innovative', 'realm', 
  'adhere', 'delve', 'reimagine', 'robust', 'orchestrate', 
  'diverse', 'commendable', 'embrace', 'paramount', 'beacon', 
  'captivate', 'unlocking', 'unlock', 'unlocking the power', 
  'unlocking the potential',

  // Additional Overused Tech and Business Phrases
  'game-changer', 'disruptive', 'synergize', 'leverage', 
  'ecosystem', 'paradigm shift', 'mission-critical', 
  'best-in-class', 'thought leadership', 'deep dive', 
  'drill down', 'circle back', 'bandwidth', 'scalable', 
  'bleeding edge', 'mission-critical', 'low-hanging fruit',

  // Grandiose Claim Phrases
  'advancement in the realm', 'aims to bridge', 'aims to democratize', 
  'aims to foster innovation and collaboration', 'becomes increasingly evident', 
  'behind the veil', 'breaking barriers', 'breakthrough has the potential to revolutionize',
  'bringing us', 'bringing us closer to a future',

  // Overused Progress and Innovation Phrases
  'by combining the capabilities', 'by harnessing the power', 
  'capturing the attention', 'continue to advance', 
  'continue to make significant strides', 'continue to push the boundaries', 
  'continues to progress rapidly',

  // Overintellectualized Language
  'crucial to be mindful', 'crucially', 'cutting-edge', 'drive the next big', 
  'encompasses a wide range of real-life scenarios', 'enhancement further enhances', 
  'ensures that even', 'essential to understand the nuances',

  // Emotional Inflation Words
  'excitement', 'exciting opportunities'
];

/**
 * Filters out banned keywords from generated headlines
 * @param headlines Array of generated headlines
 * @returns Filtered headlines with banned keywords removed or replaced
 */
function filterBannedKeywordsFromHeadlines(headlines: string[]): string[] {
  // Create a mapping of banned keywords to more natural alternatives
  const replacementMap: {[key: string]: string} = {
    'revolutionize': 'improve',
    'innovative': 'effective',
    'dive in': 'explore',
    'venture': 'approach',
    'realm': 'area',
    'cutting-edge': 'advanced',
    'breakthrough': 'significant development',
    'unlocking': 'revealing',
    'unlock': 'open',
    'game-changer': 'key improvement',
    'disruptive': 'transformative',
    'synergize': 'collaborate',
    'leverage': 'use',
    'ecosystem': 'environment',
    'paradigm shift': 'fundamental change',
    'mission-critical': 'essential',
    'best-in-class': 'top-performing',
    'thought leadership': 'expert insights',
    'deep dive': 'thorough look',
    'drill down': 'examine',
    'circle back': 'revisit',
    'bandwidth': 'capacity',
    'scalable': 'adaptable',
    'bleeding edge': 'most advanced',
    'low-hanging fruit': 'easy opportunities'
  };

  return headlines.map(headline => {
    let filteredHeadline = headline;

    // Replace banned keywords with alternatives or remove them
    BANNED_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      
      if (replacementMap[keyword.toLowerCase()]) {
        filteredHeadline = filteredHeadline.replace(regex, replacementMap[keyword.toLowerCase()]);
      } else {
        filteredHeadline = filteredHeadline.replace(regex, '');
      }
    });

    // Remove extra whitespace and trim
    return filteredHeadline.replace(/\s+/g, ' ').trim();
  }).filter(headline => headline.length > 0); // Remove empty headlines
}

/**
 * Filters out banned keywords from generated CTAs
 * @param ctas Array of generated CTAs
 * @returns Filtered CTAs with banned keywords removed or replaced
 */
function filterBannedKeywordsFromCTAs(ctas: string[]): string[] {
  // Create a mapping of banned keywords to more natural alternatives
  const replacementMap: {[key: string]: string} = {
    'revolutionize': 'improve',
    'innovative': 'effective',
    'dive in': 'join',
    'venture': 'approach',
    'realm': 'area',
    'cutting-edge': 'advanced',
    'breakthrough': 'significant opportunity',
    'unlocking': 'revealing',
    'unlock': 'open',
    'game-changer': 'key opportunity',
    'disruptive': 'transformative',
    'synergize': 'collaborate',
    'leverage': 'use',
    'ecosystem': 'environment',
    'paradigm shift': 'fundamental change',
    'mission-critical': 'essential',
    'best-in-class': 'top-performing',
    'thought leadership': 'expert insights',
    'deep dive': 'explore deeply',
    'drill down': 'examine',
    'circle back': 'revisit',
    'bandwidth': 'capacity',
    'scalable': 'adaptable',
    'bleeding edge': 'most advanced',
    'low-hanging fruit': 'easy opportunities'
  };

  return ctas.map(cta => {
    let filteredCTA = cta;

    // Replace banned keywords with alternatives or remove them
    BANNED_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      
      if (replacementMap[keyword.toLowerCase()]) {
        filteredCTA = filteredCTA.replace(regex, replacementMap[keyword.toLowerCase()]);
      } else {
        filteredCTA = filteredCTA.replace(regex, '');
      }
    });

    // Remove extra whitespace and trim
    return filteredCTA.replace(/\s+/g, ' ').trim();
  }).filter(cta => cta.length > 0); // Remove empty CTAs
}

async function makeGeminiRequest(prompt: string, apiKey: string, retryCount = 0): Promise<any> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        timeout: INITIAL_TIMEOUT * Math.pow(BACKOFF_MULTIPLIER, retryCount),
      }
    );
    return response.data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(BACKOFF_MULTIPLIER, retryCount)));
      return makeGeminiRequest(prompt, apiKey, retryCount + 1);
    }
    throw error;
  }
}

export const analyzeContent = async (
  content: string,
  apiKey: string
): Promise<ContentOptimizationResponse> => {
  const prompt = generatePrompt(content, { style: 'blog' });
  const response = await makeGeminiRequest(prompt, apiKey);
  return response;
};

export const generateHeadlines = async (
  content: string,
  apiKey: string,
  options: {
    style?: 'professional' | 'creative' | 'news' | 'blog' | 'social' | 'cta';
    tone?: 'formal' | 'casual' | 'persuasive' | 'informative';
    count?: number;
  } = {}
): Promise<HeadlineGenerationResponse> => {
  const promptOptions = {
    style: 'blog' as const,
    tone: options.tone,
    count: options.count
  };
  const prompt = generatePrompt(content, promptOptions);
  const response = await makeGeminiRequest(prompt, apiKey);
  const headlines = filterBannedKeywordsFromHeadlines(response.headlines || []);
  return {
    headlines,
    analysis: response.analysis || {
      tone: '',
      impact: '',
      suggestions: [],
      summary: ''
    }
  };
};

export const generateCTA = async (
  content: string,
  apiKey: string,
  options: {
    style?: 'persuasive' | 'informative' | 'urgent' | 'friendly';
    tone?: 'professional' | 'casual' | 'formal';
    count?: number;
  } = {}
): Promise<CTAGenerationResponse> => {
  const promptOptions = {
    style: 'cta' as const,
    tone: options.tone,
    count: options.count
  };
  const prompt = generatePrompt(content, promptOptions);
  const response = await makeGeminiRequest(prompt, apiKey);
  const ctas = filterBannedKeywordsFromCTAs(response.ctas || []);
  return {
    ctas,
    analysis: response.analysis || {
      tone: '',
      urgency: '',
      effectiveness: ''
    }
  };
};

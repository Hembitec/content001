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
// Use gemini-pro for now as gemini-1.5-pro might not be available in your region or API key
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 60000; // 60 seconds
const BACKOFF_MULTIPLIER = 2; // Used in makeGeminiRequest for exponential backoff

// Prompt templates
const createBlogPrompt = (content: string, tone: string, count: number) => `Hey! Let's brainstorm some blog ideas about "${content}". Think casual and friendly, like we're just chatting over coffee. 

Writing Style:
- Keep it super conversational, like you're talking to a friend
- Mix up sentence lengths - some short, some medium (but nothing too complex!)
- Throw in a few rhetorical questions
- Don't worry about being too perfect - natural is better
- Add some personality and maybe even a touch of humor where it fits

For each blog idea, give me:
1. A catchy, attention-grabbing headline (but keep it real, no clickbait!)
2. A friendly, down-to-earth description that actually tells people what they'll learn
3. Who this is really for (you know, the actual humans who'll be reading this)
4. What problems or struggles they're dealing with (we've all been there, right?)
5. Some relevant keywords for SEO (gotta keep the search engines happy!)

Format everything in this JSON (I know, I know, switching to technical mode for a sec):
{
  "headlines": string[],
  "analysis": {
    "summary": string,
    "keywords": string[],
    "tone": string,
    "targetAudience": string,
    "painPoints": string[]
  }
}

Remember:
- Write like you're explaining it to a friend
- Keep it real and relatable
- Don't be afraid to show some personality
- Focus on actual problems people face
- Skip the corporate jargon - we're all humans here!`;

const createCTAPrompt = (content: string, tone: string, count: number) => `Generate ${count} persuasive call-to-action (CTA) variations for the following purpose: "${content}"

Guidelines:
- Create clear, action-oriented CTAs
- Focus on value proposition and benefits
- Use strong action verbs
- Create urgency when appropriate
- Keep it concise and impactful
- Optimize for conversion

Format the response in this JSON structure:
{
  "headlines": [
    "Primary CTA text here",
    "Another CTA variation here"
  ],
  "analysis": {
    "type": "Type of CTA (e.g., Sign-up, Download, Purchase)",
    "urgency": "low | medium | high",
    "impact": "Expected impact and effectiveness",
    "suggestions": [
      "Implementation tip 1",
      "Implementation tip 2"
    ],
    "variations": [
      {
        "text": "Alternative CTA text",
        "context": "When to use this variation",
        "audience": "Target audience"
      }
    ]
  }
}

Requirements:
- Each CTA should be actionable and clear
- Include power words that drive action
- Consider user psychology and motivation
- Maintain brand professionalism
- Focus on clear value proposition
- Use action-oriented language
- Create urgency without being pushy
- Build trust through transparency
- Test different emotional triggers
- Focus on conversion optimization`;

const createSystemPrompt = (content: string, tone: string, count: number) => `You are an advanced content optimization AI. Analyze the provided content and return a detailed JSON response.

Content: ${content}
Tone: ${tone}
Count: ${count}`;

const createHeadlinePrompt = (content: string, style: string, tone: string, count: number) => `Generate ${count} compelling headlines for content about "${content}".

Style: ${style}
Tone: ${tone}

Guidelines:
- Create attention-grabbing headlines that drive engagement
- Include strong action words and emotional triggers
- Focus on benefits and value proposition
- Keep headlines concise and impactful
- Focus on clear value proposition
- Use action-oriented language
- Create urgency without being pushy
- Build trust through transparency
- Test different emotional triggers
- Optimize for both readers and SEO
- Avoid clickbait while maintaining interest

Format:
{
  "headlines": string[],
  "analysis": {
    "tone": string,
    "impact": string,
    "suggestions": string[]
  }
}

Requirements:
- Headlines should be clear and specific
- Include numbers and data when relevant
- Use proven headline formulas
- Maintain professional quality
- Consider target audience needs`;

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
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: INITIAL_TIMEOUT * Math.pow(BACKOFF_MULTIPLIER, retryCount)
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    try {
      return JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse response:', generatedText);
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      return makeGeminiRequest(prompt, apiKey, retryCount + 1);
    }
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to generate content');
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

export async function generateHeadlines(
  content: string,
  apiKey: string,
  options: {
    style?: 'professional' | 'creative' | 'news' | 'blog' | 'social';
    tone?: 'formal' | 'casual' | 'persuasive' | 'informative';
    count?: number;
  } = {}
): Promise<HeadlineGenerationResponse> {
  const count = options.count || 5;
  const style = options.style || 'professional';
  const tone = options.tone || 'balanced';
  
  const prompt = createHeadlinePrompt(content, style, tone, count);

  try {
    const response = await makeGeminiRequest(prompt, apiKey);
    
    // Ensure we have the expected structure
    if (!response || !response.headlines || !response.analysis) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response from API');
    }

    return {
      headlines: response.headlines,
      analysis: {
        tone: response.analysis.tone || tone,
        impact: response.analysis.impact || '',
        suggestions: response.analysis.suggestions || []
      }
    };
  } catch (error) {
    console.error('Error in generateHeadlines:', error);
    throw error;
  }
}

export const generateCTA = async (
  content: string,
  apiKey: string,
  options: {
    tone?: 'formal' | 'casual' | 'persuasive' | 'informative';
    count?: number;
  } = {}
): Promise<HeadlineGenerationResponse> => {
  const count = options.count || 3;
  const tone = options.tone || 'persuasive';
  const prompt = createCTAPrompt(content, tone, count);

  try {
    const response = await makeGeminiRequest(prompt, apiKey);
    
    // Ensure we have the expected structure
    if (!response || !response.headlines) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response from API');
    }

    return {
      headlines: response.headlines,
      analysis: {
        type: response.analysis?.type || '',
        urgency: response.analysis?.urgency || 'medium',
        impact: response.analysis?.impact || '',
        suggestions: response.analysis?.suggestions || [],
        variations: response.analysis?.variations || []
      }
    };
  } catch (error) {
    console.error('Error in generateCTA:', error);
    throw error;
  }
};

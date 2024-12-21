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

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 60000; // 60 seconds
const BACKOFF_MULTIPLIER = 1.5;

const blogPrompt = `Create engaging blog post ideas about the following topic. Write the descriptions in a natural, relatable style while maintaining professionalism. Use a mix of short and medium-length sentences, incorporate relevant examples, and focus on value for the reader. The content should feel authentic and approachable, not overly formal or robotic.

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
Tone: ${options.tone || 'balanced'}
Number of ideas: ${options.count || 5}

Guidelines:
- Keep descriptions clear but conversational
- Focus on real value and practical insights
- Include specific examples where relevant
- Address reader questions and pain points
- Maintain professionalism while being approachable`;

const ctaPrompt = `Create compelling call-to-action (CTA) ideas for the following purpose. Write in a persuasive yet natural style that motivates action while building trust. Balance professionalism with emotional connection, and focus on clear value propositions.

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
Tone: ${options.tone || 'persuasive'}
Number of CTAs: ${options.count || 5}

Guidelines:
- Focus on clear value proposition
- Use action-oriented language
- Create urgency without being pushy
- Build trust through transparency
- Test different emotional triggers
- Consider user journey stage`;

const systemPrompt = `You are an advanced content optimization AI. Analyze the provided content and return a detailed JSON response. You MUST include at least 7 main keywords and 7 LSI keywords, and populate ALL sections of the analysis. Here's the required structure:

{
  "targetKeyword": "main target keyword",
  "keywords": {
    "main": [
      {
        "word": "primary keyword 1",
        "count": 5,
        "density": 2.5
      },
      {
        "word": "primary keyword 2",
        "count": 4,
        "density": 2.0
      },
      {
        "word": "primary keyword 3",
        "count": 3,
        "density": 1.5
      },
      {
        "word": "primary keyword 4",
        "count": 3,
        "density": 1.5
      },
      {
        "word": "primary keyword 5",
        "count": 2,
        "density": 1.0
      },
      {
        "word": "primary keyword 6",
        "count": 2,
        "density": 1.0
      },
      {
        "word": "primary keyword 7",
        "count": 2,
        "density": 1.0
      }
    ],
    "lsi": [
      {
        "word": "semantic keyword 1",
        "count": 3,
        "density": 1.5
      },
      {
        "word": "semantic keyword 2",
        "count": 3,
        "density": 1.5
      },
      {
        "word": "semantic keyword 3",
        "count": 2,
        "density": 1.0
      },
      {
        "word": "semantic keyword 4",
        "count": 2,
        "density": 1.0
      },
      {
        "word": "semantic keyword 5",
        "count": 2,
        "density": 1.0
      },
      {
        "word": "semantic keyword 6",
        "count": 2,
        "density": 1.0
      },
      {
        "word": "semantic keyword 7",
        "count": 1,
        "density": 0.5
      }
    ],
    "related": [
      "related keyword 1",
      "related keyword 2",
      "related keyword 3",
      "related keyword 4",
      "related keyword 5"
    ],
    "questions": [
      "What are the best practices for CTA optimization?",
      "How can I improve my conversion rates?",
      "What metrics should I track for CTA performance?",
      "How do I A/B test CTAs effectively?"
    ]
  },
  "structure": {
    "headings": {
      "h1": ["Main Title with Primary Keyword"],
      "h2": [
        "Understanding CTA Optimization",
        "Best Practices for Higher Conversion",
        "Measuring CTA Performance",
        "A/B Testing Strategies"
      ],
      "h3": [
        "Key Elements of Effective CTAs",
        "Psychological Triggers in CTAs",
        "Mobile Optimization Tips",
        "Analytics and Tracking"
      ]
    },
    "readability": {
      "score": 85,
      "level": "intermediate",
      "suggestions": [
        "Use shorter sentences for better clarity",
        "Break down complex concepts into simpler terms",
        "Add more subheadings to improve scannability",
        "Use bullet points for key takeaways"
      ]
    }
  },
  "seo": {
    "score": 85,
    "recommendations": [
      "Include target keyword in meta description",
      "Add more internal links to related content",
      "Optimize image alt text with keywords",
      "Improve URL structure",
      "Add schema markup for better visibility"
    ],
    "titleOptimization": {
      "current": "Current Title of the Page",
      "suggestions": [
        "CTA Optimization: Complete Guide [Current Year]",
        "How to Optimize CTAs for Better Conversion Rates",
        "CTA Optimization Strategies That Drive Results"
      ]
    },
    "contentGaps": {
      "missingTopics": [
        "Mobile CTA optimization",
        "Psychology behind effective CTAs",
        "Industry-specific CTA examples",
        "CTA analytics and reporting"
      ],
      "competitorKeywords": [
        "call to action button",
        "CTA placement",
        "conversion optimization",
        "A/B testing CTAs"
      ]
    }
  },
  "improvements": {
    "priority": [
      "Add more specific examples of successful CTAs",
      "Include case studies with conversion metrics",
      "Expand the section on A/B testing methodology",
      "Add visual examples of before/after optimizations"
    ],
    "additional": [
      "Create a CTA optimization checklist",
      "Add a section on common CTA mistakes",
      "Include industry-specific best practices",
      "Add more recent statistics and data"
    ]
  },
  "improvementSuggestions": {
    "content": [
      {
        "type": "addition",
        "suggestion": "Add specific CTA examples from successful campaigns",
        "priority": "high"
      },
      {
        "type": "revision",
        "suggestion": "Expand the A/B testing section with step-by-step instructions",
        "priority": "medium"
      },
      {
        "type": "addition",
        "suggestion": "Include more data and statistics to support claims",
        "priority": "high"
      }
    ],
    "style": [
      {
        "type": "clarity",
        "suggestion": "Use shorter sentences and simpler language",
        "priority": "medium"
      },
      {
        "type": "engagement",
        "suggestion": "Add more actionable tips and takeaways",
        "priority": "medium"
      },
      {
        "type": "formatting",
        "suggestion": "Break up long paragraphs into smaller chunks",
        "priority": "low"
      }
    ],
    "seo": [
      {
        "type": "keywords",
        "suggestion": "Include target keyword in first paragraph",
        "priority": "high"
      },
      {
        "type": "structure",
        "suggestion": "Add more descriptive subheadings",
        "priority": "medium"
      },
      {
        "type": "optimization",
        "suggestion": "Optimize image alt tags with relevant keywords",
        "priority": "low"
      }
    ]
  }
}`;

const prompt = options.style === 'blog' ? blogPrompt : 
              options.style === 'cta' ? ctaPrompt :
              `Write a conversational and relatable piece about the following topic. Keep the tone casual, friendly, and slightly informal, as if you're talking to a friend. Use simple sentences, add some rhetorical questions, and mix in small typos or formatting quirks (e.g., extra spaces or occasional minor errors). Avoid overusing complex words and aim for a balanced mix of short and medium-length sentences. Let the content feel natural and slightly messy, not overly polished.

For each headline or idea, imagine you're excitedly telling a friend about it over coffee. Include those natural pauses, those "you know what I mean?" moments, and real-life examples that make it relatable.

Return your response in this exact JSON format:
{
  "headlines": ["headline1", "headline2", "headline3"],
  "analysis": {
    "tone": "hey, here's what I was going for...",
    "impact": "you know what's really cool about this?",
    "summary": "so basically, here's the deal...",
    "suggestions": ["have you thought about...", "oh, and another thing..."]
  }
}

Topic: ${content}
Style: ${options.style || 'casual'}
Vibe: ${options.tone || 'friendly'}
Give me: ${options.count || 5} ideas

Just remember - keep it real, keep it natural, and make it feel like a genuine conversation!`;

export const analyzeContent = async (
  content: string,
  apiKey: string
): Promise<ContentOptimizationResponse> => {
  let retryCount = 0;
  let currentTimeout = INITIAL_TIMEOUT;

  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Attempt ${retryCount + 1} of ${MAX_RETRIES}...`);
      console.log('Starting content analysis with Gemini API...');
      
      const instance = axios.create({
        timeout: currentTimeout,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const requestData = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nAnalyze and optimize the following content:\n\n${content}`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          candidateCount: 1,
          maxOutputTokens: 4096,
          topP: 1,
          topK: 1
        }
      };

      console.log('Making API request to Gemini...');
      const response = await instance.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        requestData
      );

      console.log('Received response from Gemini API');

      if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response from Gemini API');
      }

      const rawText = response.data.candidates[0].content.parts[0].text.trim();
      
      try {
        console.log('Attempting to parse response as JSON...');
        const result = JSON.parse(rawText);
        
        // Validate required fields
        if (!result.keywords?.main || !result.structure || !result.seo || !result.improvements) {
          console.error('Missing required fields in result:', result);
          throw new Error('Missing required analysis fields');
        }

        // Additional validation for meaningful results
        if (result.keywords.main.length < 3 || result.keywords.lsi.length < 3) {
          console.error('Insufficient keyword analysis:', result.keywords);
          throw new Error('Content is too short for meaningful analysis');
        }

        // Validate target keyword exists and is meaningful
        if (!result.targetKeyword || result.targetKeyword.length < 3) {
          console.error('Invalid target keyword:', result.targetKeyword);
          throw new Error('Could not determine main topic of content');
        }
        
        console.log('Successfully parsed and validated response');
        return result;
      } catch (parseError) {
        console.error('Error parsing initial JSON:', parseError);
        console.log('Attempting to extract JSON from response...');
        
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('No JSON found in response');
          throw new Error('Could not find valid JSON in response');
        }
        
        const result = JSON.parse(jsonMatch[0]);
        
        if (!result.keywords?.main || !result.structure || !result.seo || !result.improvements) {
          console.error('Missing required fields in extracted JSON:', result);
          throw new Error('Missing required analysis fields');
        }

        // Additional validation for meaningful results
        if (result.keywords.main.length < 3 || result.keywords.lsi.length < 3) {
          console.error('Insufficient keyword analysis:', result.keywords);
          throw new Error('Content is too short for meaningful analysis');
        }

        // Validate target keyword exists and is meaningful
        if (!result.targetKeyword || result.targetKeyword.length < 3) {
          console.error('Invalid target keyword:', result.targetKeyword);
          throw new Error('Could not determine main topic of content');
        }
        
        console.log('Successfully parsed and validated extracted JSON');
        return result;
      }
    } catch (error: any) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      
      if (error.response?.status === 403) {
        throw new Error('Invalid API key or unauthorized access');
      }
      
      if (retryCount < MAX_RETRIES - 1) {
        retryCount++;
        currentTimeout = Math.floor(currentTimeout * BACKOFF_MULTIPLIER);
        console.log(`Retrying with timeout ${currentTimeout}ms...`);
        continue;
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      if (error.response?.data?.error) {
        throw new Error(`API Error: ${error.response.data.error.message}`);
      }
      
      throw new Error(error.message || 'Failed to analyze content. Please try again.');
    }
  }

  throw new Error('Maximum retry attempts reached. Please try again later.');
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
  let retryCount = 0;
  let currentTimeout = INITIAL_TIMEOUT;

  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Attempt ${retryCount + 1} of ${MAX_RETRIES}...`);
      
      const instance = axios.create({
        timeout: currentTimeout,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const requestData = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          candidateCount: 1,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 60
        }
      };

      console.log('Making API request to Gemini...');
      const response = await instance.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        requestData
      );

      if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini API');
      }

      const result = JSON.parse(response.data.candidates[0].content.parts[0].text);
      
      if (!result.headlines || !Array.isArray(result.headlines) || result.headlines.length === 0) {
        throw new Error('No headlines generated');
      }

      if (!result.analysis || !result.analysis.summary) {
        throw new Error('No summary generated');
      }

      return result;
    } catch (error: any) {
      console.error('Error generating headlines:', error);
      retryCount++;
      currentTimeout *= BACKOFF_MULTIPLIER;

      if (retryCount === MAX_RETRIES) {
        throw new Error('Failed to generate headlines after multiple attempts');
      }
      
      console.log(`Retrying in ${currentTimeout/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Failed to generate headlines');
};

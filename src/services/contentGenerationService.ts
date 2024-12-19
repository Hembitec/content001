import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function generateContent(prompt: string): Promise<string> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.8,
      maxOutputTokens: 4096,
    };

    const result = await model.generateContent({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig
    });
    
    if (!result.response) {
      throw new Error('No response received from Gemini API');
    }

    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response received from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error('Failed to generate content. Please try again.');
  }
}

export interface GeneratedContent {
  title: string;
  metaDescription: string;
  keywords: string[];
  targetAudience: string;
  content: string;
}

export async function generateStructuredContent(
  title: string,
  keywords: string[],
  contentType: string,
  tone: string,
  length: string,
  keynotes?: string
): Promise<GeneratedContent> {
  const prompt = `You are a professional content writer. Generate a ${contentType} about "${title}" following these exact specifications:

Key Requirements:
- Topic: ${title}
- Type: ${contentType}
- Tone: ${tone}
- Length: ${length} (${length === 'short' ? '~800' : length === 'medium' ? '~1500' : '~3000'} words)
${keywords.length > 0 ? `- Keywords: ${keywords.join(', ')}` : ''}
${keynotes ? `- Additional Requirements: ${keynotes}` : ''}

Title Generation Rules:
1. Use simple English that non-native speakers can easily understand
2. If a concept needs explanation, include a brief clarification
3. Avoid using complex or overused phrases like: revolutionize, dive in, venture, innovative, realm, adhere, delve, reimagine, robust, orchestrate, diverse, commendable, embrace, paramount, beacon, captivate, breakthrough, cutting-edge, groundbreaking, transformative, elevate, leverage, resonate, foster, endeavor, embark, unleash, renowned, bespoke, whimsical, meticulous, emerge, refrain, vibrant, reimagine, evolve, supercharge, pivotal, unlocking
4. Keep titles clear, direct, and informative without buzzwords

Your response MUST follow this EXACT format with these EXACT headings:

===META INFORMATION START===
SEO Title: [Write a clear, simple 60-character max title following the rules above]
Meta Description: [Write a compelling 160-character max description using simple language]
Target Keywords: [List 3-5 relevant keywords]
Target Audience: [Specify primary and secondary audience]
===META INFORMATION END===

===CONTENT START===
[Write the full content here using proper HTML tags for structure]
- Use <h1> for main title
- Use <h2> for major sections
- Use <h3> for subsections
- Use <p> for paragraphs
- Use <ul> and <li> for bullet points
- Use <ol> and <li> for numbered lists
- Use <blockquote> for quotes
- Use <strong> for emphasis
===CONTENT END===

Important:
1. STRICTLY follow the format above with the EXACT section markers
2. Ensure all content is properly formatted with HTML tags
3. Make the content engaging and well-structured
4. Maintain the specified tone throughout
5. Naturally incorporate all keywords
6. Use simple, clear language throughout`;

  try {
    const generatedText = await generateContent(prompt);
    console.log('Generated text:', generatedText); // For debugging

    // More flexible section matching
    const metaMatch = generatedText.match(/===META INFORMATION START===([\s\S]*?)===META INFORMATION END===|SEO Title:([\s\S]*?)(?====CONTENT START===)/i);
    const contentMatch = generatedText.match(/===CONTENT START===([\s\S]*?)===CONTENT END===|<h1>([\s\S]*?)$/i);

    if (!metaMatch || !contentMatch) {
      console.error('Failed to parse response. Generated text:', generatedText);
      throw new Error('Failed to parse generated content - invalid format');
    }

    // Get the matched content, checking both capture groups
    const metaText = (metaMatch[1] || metaMatch[2] || '').trim();
    const contentText = (contentMatch[1] || contentMatch[2] || '').trim();

    // More flexible meta information parsing
    const titleMatch = metaText.match(/SEO Title:?\s*(.+?)(?=\n|$)/i);
    const descMatch = metaText.match(/Meta Description:?\s*(.+?)(?=\n|$)/i);
    const keywordsMatch = metaText.match(/Target Keywords:?\s*(.+?)(?=\n|$)/i);
    const audienceMatch = metaText.match(/Target Audience:?\s*(.+?)(?=\n|$)/i);

    // If meta information is missing, try to extract from content
    const title = titleMatch ? titleMatch[1].trim() : extractTitle(contentText);
    const metaDescription = descMatch ? descMatch[1].trim() : generateMetaDescription(contentText);
    const keywords = keywordsMatch 
      ? keywordsMatch[1].split(/,|;/).map(k => k.trim()).filter(k => k)
      : extractKeywords(contentText);
    const targetAudience = audienceMatch 
      ? audienceMatch[1].trim() 
      : "General audience interested in this topic";

    // Clean and format content
    let cleanContent = contentText
      .replace(/\[Write the full content here using proper HTML tags for structure\]/, '')
      .replace(/- Use <[^>]+> for [^\n]+\n?/g, '')
      .trim();

    // Ensure content has basic HTML structure
    if (!cleanContent.includes('<')) {
      cleanContent = `<h1>${title}</h1>\n<p>${cleanContent}</p>`;
    }

    if (!cleanContent) {
      throw new Error('Generated content is empty');
    }

    return {
      title,
      metaDescription,
      keywords,
      targetAudience,
      content: cleanContent
    };
  } catch (error) {
    console.error('Error generating structured content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error('Failed to generate content. Please try again.');
  }
}

// Helper functions for content parsing
function extractTitle(content: string): string {
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();
  
  const firstLine = content.split('\n')[0];
  return firstLine.replace(/<[^>]+>/g, '').trim();
}

function generateMetaDescription(content: string): string {
  const cleanText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return cleanText.substring(0, 157) + '...';
}

function extractKeywords(content: string): string[] {
  const cleanText = content.replace(/<[^>]+>/g, ' ').toLowerCase();
  const words = cleanText.split(/\W+/);
  const wordFreq = words.reduce((acc: {[key: string]: number}, word) => {
    if (word.length > 3) acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

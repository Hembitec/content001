import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function generateContent(prompt: string): Promise<string> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 4096,
      },
    });

    if (!result.response) {
      throw new Error('No response from Gemini API');
    }

    return result.response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export interface GeneratedContent {
  title: string;
  metaDescription: string;
  keywords: string[];
  targetAudience: string;
  content: string;
}

// List of banned keywords and phrases to avoid in content generation
export const BANNED_KEYWORDS = [
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
 * Filters out banned keywords from generated content
 * @param content The generated content to filter
 * @returns Filtered content with banned keywords replaced
 */
export function filterBannedKeywords(content: string): string {
  let filteredContent = content;

  // Create a mapping of banned keywords to more natural alternatives
  const replacementMap: {[key: string]: string} = {
    'revolutionize': 'improve significantly',
    'innovative': 'effective',
    'dive in': 'explore',
    'venture': 'approach',
    'realm': 'area',
    'cutting-edge': 'advanced',
    'breakthrough': 'significant development',
    'unlocking': 'revealing',
    'unlock': 'open',
    'game-changer': 'significant improvement',
    'disruptive': 'transformative',
    'synergize': 'collaborate',
    'leverage': 'use',
    'ecosystem': 'environment',
    'paradigm shift': 'fundamental change',
    'mission-critical': 'essential',
    'best-in-class': 'top-performing',
    'thought leadership': 'expert insights',
    'deep dive': 'thorough examination',
    'drill down': 'examine closely',
    'circle back': 'revisit',
    'bandwidth': 'capacity',
    'scalable': 'adaptable',
    'bleeding edge': 'most advanced',
    'low-hanging fruit': 'easy opportunities'
  };

  // Replace banned keywords with more natural alternatives
  BANNED_KEYWORDS.forEach(keyword => {
    // Create case-insensitive regex for whole word matching
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    
    // If a replacement exists, use it. Otherwise, remove the keyword
    if (replacementMap[keyword.toLowerCase()]) {
      filteredContent = filteredContent.replace(regex, replacementMap[keyword.toLowerCase()]);
    } else {
      filteredContent = filteredContent.replace(regex, '');
    }
  });

  return filteredContent.replace(/\s+/g, ' ').trim();
}

export async function generateStructuredContent(
  title: string,
  keywords: string[],
  contentType: string,
  tone: string,
  length: string,
  language: string,
  keynotes?: string
): Promise<GeneratedContent> {
  const getContentStructure = (type: string) => {
    switch(type.toLowerCase()) {
      case 'email':
      case 'newsletter':
        return `
Create a long-form email newsletter with:
• An engaging main title (H1)
• A compelling introduction that hooks the reader
• 3-4 well-developed main sections with clear headings (H2)
• Supporting points and examples under each section
• Relevant bullet points or numbered lists where appropriate
• Data points or statistics to support key arguments
• Expert quotes or insights where relevant
• A clear conclusion
• Call-to-action at the end

Content Guidelines:
• Write in a conversational yet professional tone
• Break down complex topics into digestible sections
• Use examples and analogies to explain concepts
• Include relevant statistics or data points
• Add bullet points for key takeaways
• Maintain consistent formatting throughout
• End with a strong call-to-action

Structure Example:
<h1>[Compelling Main Title]</h1>

<p>[Engaging introduction that sets up the topic and why it matters]</p>

<h2>[First Main Point]</h2>
<p>[Detailed explanation with examples]</p>
<ul>
    <li>[Key takeaway 1]</li>
    <li>[Key takeaway 2]</li>
</ul>

<h2>[Second Main Point]</h2>
<p>[Supporting content with data or expert insights]</p>

<h2>[Third Main Point]</h2>
<p>[Practical applications or actionable advice]</p>

<h2>Key Takeaways</h2>
<ul>
    <li>[Main insight 1]</li>
    <li>[Main insight 2]</li>
    <li>[Main insight 3]</li>
</ul>

<p>[Strong conclusion with next steps]</p>
<p>[Clear call-to-action]</p>`;

      case 'blog post':
        return `
Create a blog post with:
• Main title at the top
• Engaging introduction
• 3-5 main sections with descriptive headings
• Relevant subsections under each main section
• Bullet points or numbered lists where it adds value
• Clear conclusion
• Call to action at the end`;

      case 'article':
        return `
Create an article with:
• Compelling main title
• Strong introductory paragraph
• 4-6 main sections with informative headings
• Supporting evidence and quotes
• Statistics and data points where relevant
• Thorough conclusion`;

      case 'product description':
        return `
Create a product description with:
• Attention-grabbing product title
• Compelling overview paragraph
• Key features and benefits (as bullet points)
• Technical specifications section
• Use cases or applications section
• Clear call to action`;

      case 'social media post':
        return `
Create a social media post with:
• Catchy headline
• Engaging main message
• Key points (if needed)
• Relevant hashtags
• Compelling call to action`;

      default:
        return `
Create content with:
• Clear main title
• Strong introduction
• Well-organized main sections
• Supporting subsections
• Relevant lists or bullet points
• Proper conclusion`;
    }
  };

  const prompt = `Write a conversational and relatable piece about "${title}" while maintaining professionalism. Keep the tone natural and engaging, using a mix of short and medium-length sentences. Let the content flow naturally while staying focused and valuable to the reader.

Language: ${language} (IMPORTANT: ALL output must be in ${language})
Style: ${contentType}
Tone: ${tone}
Target Length: ${length === 'short' ? '~800' : length === 'medium' ? '~1500' : '~3000'} words
${keywords.length > 0 ? `Keywords to naturally incorporate: ${keywords.join(', ')}` : ''}
${keynotes ? `Additional context: ${keynotes}` : ''}

Content Guidelines:
- Write like you're explaining to an interested colleague
- Use real-world examples and scenarios
- Break down complex ideas into digestible parts
- Add relevant data points or expert insights naturally
- Keep it professional but approachable
- Focus on providing real value to the reader

${getContentStructure(contentType)}

HTML Formatting Instructions:
${contentType.toLowerCase() === 'email' || contentType.toLowerCase() === 'newsletter' ? `
1. Use clean, email-friendly HTML
2. Keep formatting minimal and professional
3. Use <div> for sections
4. Use <p> for paragraphs
5. Use <h1> for subject line only
6. Use <h2> for section headings
7. Use <ul> and <li> for bullet points
8. Add appropriate spacing between sections` : `
1. Start with a single main title using <h1>
2. Use <h2> for main section headings
3. Use <h3> for subsection headings (if needed)
4. Wrap paragraphs in <p> tags
5. Use <ul> and <li> for bullet points
6. Use <ol> and <li> for numbered lists
7. Use <blockquote> for quotes
8. Use <strong> for emphasis
9. Keep the HTML structure clean and consistent`}

Output Format (keep these markers in English, but content in ${language}):

===META START===
Title: [Title in ${language}]
Description: [Description in ${language}]
Keywords: [Keywords in ${language}]
Audience: [Target audience in ${language}]
===META END===

===CONTENT START===
[Content following the structure and formatting guide above]
===CONTENT END===

Remember:
- Keep the writing natural and flowing
- Use a conversational yet professional tone
- Include practical examples and insights
- Make complex topics relatable
- Maintain clarity and value throughout
- Stay focused on the reader's needs`;

  try {
    const generatedText = await generateContent(prompt);
    
    // Extract sections using regex
    const metaSection = generatedText.match(/===META START===([\s\S]*?)===META END===/);
    const contentSection = generatedText.match(/===CONTENT START===([\s\S]*?)===CONTENT END===/);

    if (!metaSection || !contentSection) {
      console.error('Generated text:', generatedText);
      throw new Error('Failed to parse generated content - invalid format');
    }

    const metaText = metaSection[1].trim();
    let contentText = contentSection[1].trim();

    // Filter out banned keywords from the content
    contentText = filterBannedKeywords(contentText);

    // Parse meta information
    const titleMatch = metaText.match(/Title:\s*(.+?)(?=\n|$)/i);
    const descMatch = metaText.match(/Description:\s*(.+?)(?=\n|$)/i);
    const keywordsMatch = metaText.match(/Keywords:\s*(.+?)(?=\n|$)/i);
    const audienceMatch = metaText.match(/Audience:\s*(.+?)(?=\n|$)/i);

    if (!titleMatch || !descMatch || !keywordsMatch || !audienceMatch) {
      throw new Error('Failed to parse meta information');
    }

    return {
      title: titleMatch[1].trim(),
      metaDescription: descMatch[1].trim(),
      keywords: keywordsMatch[1].split(',').map(k => k.trim()),
      targetAudience: audienceMatch[1].trim(),
      content: contentText
    };
  } catch (error) {
    console.error('Error generating structured content:', error);
    throw error;
  }
}

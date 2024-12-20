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

  const prompt = `You are a professional content writer. Write in ${language}.

Create a NEW, COMPLETE ${contentType} about "${title}" with these specifications:
- Language: ${language} (IMPORTANT: ALL output must be in ${language})
- Tone: ${tone}
- Length: ${length === 'short' ? '~800' : length === 'medium' ? '~1500' : '~3000'} words
${keywords.length > 0 ? `- Keywords: ${keywords.join(', ')}` : ''}
${keynotes ? `- Additional Notes: ${keynotes}` : ''}

IMPORTANT: Create a completely new, standalone piece of content. Do NOT continue or reference any section numbers from elsewhere.

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
1. Create FRESH content - don't continue numbering from elsewhere
2. Each section should have its own logical flow
3. Use descriptive headings instead of generic "Section 1", "Section 2", etc.
4. Ensure proper HTML formatting throughout`;

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
    const contentText = contentSection[1].trim();

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

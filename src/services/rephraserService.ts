import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface RephraseOptions {
  style: 'professional' | 'casual' | 'academic' | 'creative' | 'simple' | 'persuasive';
  tone: 'formal' | 'informal' | 'empathetic' | 'neutral';
  preserveKeywords: boolean;
}

export interface RephrasedContent {
  original: string;
  rephrased: string;
  keywordsMaintained: string[];
  readabilityScore: string;
  toneAnalysis: string;
}

export async function rephraseContent(
  content: string,
  options: RephraseOptions
): Promise<RephrasedContent> {
  if (!content?.trim()) {
    throw new Error('Content is required');
  }

  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const prompt = `You are a professional content rephraser. Rewrite the following content while maintaining its structure and flow. Follow these guidelines:

Style: ${options.style}
Tone: ${options.tone}
${options.preserveKeywords ? 'Important: Preserve all key terms and phrases from the original text.' : ''}

Requirements:
1. Keep the original meaning and structure
2. Match the specified style and tone
3. Ensure natural flow and readability
4. Maintain any section breaks or paragraphs
5. Do not add or remove formatting
6. Remove any asterisks or markdown formatting
7. Keep headings as plain text
8. Preserve the original layout

Here's the content to rephrase:

${content}

Respond in this format:

REPHRASED:
[Your rephrased version here]

ANALYSIS:
Readability: [Score from 1-10 with brief explanation]
Tone: [Brief tone analysis]
Keywords: [Key terms preserved, comma-separated]`;

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

    const generatedText = result.response.text();

    // Extract sections with simpler parsing
    const [fullContent, analysis] = generatedText.split('ANALYSIS:').map(s => s.trim());
    const rephrased = fullContent.replace('REPHRASED:', '').trim();

    // Parse analysis sections
    const readabilityMatch = analysis.match(/Readability:\s*([^\n]+)/);
    const toneMatch = analysis.match(/Tone:\s*([^\n]+)/);
    const keywordsMatch = analysis.match(/Keywords:\s*([^\n]+)/);

    return {
      original: content,
      rephrased,
      readabilityScore: readabilityMatch ? readabilityMatch[1].trim() : 'Not available',
      toneAnalysis: toneMatch ? toneMatch[1].trim() : 'Not available',
      keywordsMaintained: keywordsMatch 
        ? keywordsMatch[1].split(',').map(k => k.trim())
        : []
    };
  } catch (error) {
    console.error('Error in rephrasing:', error);
    throw error;
  }
}

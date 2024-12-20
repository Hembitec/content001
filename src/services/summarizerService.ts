import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface SummaryOptions {
  length: 'concise' | 'detailed';  // concise: ~2-3 sentences, detailed: ~2-3 paragraphs
  style: 'bullet' | 'paragraph';   // bullet points or paragraph format
  focus?: 'key_points' | 'main_ideas' | 'actionable_insights';
  tone?: 'formal' | 'casual';
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  originalWordCount: number;
  summaryWordCount: number;
  readingTimeMinutes: number;
}

export async function summarizeContent(content: string, options: SummaryOptions): Promise<SummaryResult> {
  if (!content?.trim()) {
    throw new Error('Content is required');
  }

  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    // Calculate original word count
    const originalWordCount = content.trim().split(/\s+/).length;

    // Construct the prompt based on options
    const prompt = `Summarize the following content with these specifications:
Length: ${options.length === 'concise' ? 'Brief 2-3 sentences' : 'Detailed 2-3 paragraphs'}
Format: ${options.style === 'bullet' ? 'Bullet points' : 'Paragraph format'}
${options.focus ? `Focus on: ${options.focus.replace('_', ' ')}` : ''}
${options.tone ? `Tone: ${options.tone}` : ''}

Rules:
1. Maintain accuracy and context
2. Use clear, simple language
3. Highlight the most important information
4. Keep the original meaning intact
5. Include key statistics or data if present

Content to summarize:
${content}

Please provide the output in this exact format:

===SUMMARY START===
[Your summary here]
===SUMMARY END===

===KEY POINTS START===
- [Key point 1]
- [Key point 2]
- [Continue with all key points]
===KEY POINTS END===`;

    // Use Gemini-1.5 Pro for better summarization
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more focused output
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });

    if (!result.response) {
      throw new Error('No response received from Gemini API');
    }

    const response = result.response.text();
    
    // Parse the response
    const summaryMatch = response.match(/===SUMMARY START===\s*([\s\S]*?)\s*===SUMMARY END===/);
    const keyPointsMatch = response.match(/===KEY POINTS START===\s*([\s\S]*?)\s*===KEY POINTS END===/);

    if (!summaryMatch) {
      throw new Error('Failed to generate summary');
    }

    const summary = summaryMatch[1].trim();
    const keyPoints = keyPointsMatch 
      ? keyPointsMatch[1]
          .split('\n')
          .map(point => point.trim())
          .filter(point => point && point.startsWith('-'))
          .map(point => point.substring(1).trim())
      : [];

    // Calculate summary statistics
    const summaryWordCount = summary.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(originalWordCount / 200); // Average reading speed

    return {
      summary,
      keyPoints,
      originalWordCount,
      summaryWordCount,
      readingTimeMinutes
    };
  } catch (error) {
    console.error('Error summarizing content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to summarize content: ${error.message}`);
    }
    throw new Error('Failed to summarize content. Please try again.');
  }
}

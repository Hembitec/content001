import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface KeywordExtractionResult {
  keywords: string[];
  topics: string[];
  relevanceScores: { [key: string]: number };
}

export async function extractKeywords(content: string): Promise<KeywordExtractionResult> {
  if (!content?.trim()) {
    throw new Error('Content is required');
  }

  const prompt = `You are a keyword extraction expert. Extract key information from the following content.

Content to analyze:
${content}

Respond EXACTLY in this format (keep the === markers):
===KEYWORDS===
keyword1
keyword2
keyword3
===TOPICS===
topic1
topic2
topic3
===SCORES===
keyword1: 0.95
keyword2: 0.85
keyword3: 0.75

Rules:
1. Each keyword and topic should be on a new line
2. Scores should be between 0 and 1
3. Include scores for ALL keywords
4. Do not include any explanations or additional text
5. Maintain exact format with === markers`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    if (!result.response) {
      throw new Error('No response from Gemini API');
    }

    const generatedText = result.response.text();

    // Extract sections using more reliable markers
    const keywordsMatch = generatedText.match(/===KEYWORDS===([\s\S]*?)===TOPICS===/);
    const topicsMatch = generatedText.match(/===TOPICS===([\s\S]*?)===SCORES===/);
    const scoresMatch = generatedText.match(/===SCORES===([\s\S]*?)$/);

    if (!keywordsMatch || !topicsMatch || !scoresMatch) {
      console.error('Generated text:', generatedText);
      throw new Error('Failed to parse generated content - invalid format');
    }

    // Clean and parse the sections
    const keywords = keywordsMatch[1]
      .trim()
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const topics = topicsMatch[1]
      .trim()
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    // Parse scores with better error handling
    const relevanceScores: { [key: string]: number } = {};
    const scoreLines = scoresMatch[1]
      .trim()
      .split('\n')
      .filter(line => line.includes(':'));
    
    scoreLines.forEach(line => {
      const [keyword, scoreStr] = line.split(':').map(s => s.trim());
      const score = parseFloat(scoreStr);
      if (!isNaN(score) && score >= 0 && score <= 1) {
        relevanceScores[keyword] = score;
      }
    });

    // Validate the result
    if (keywords.length === 0 || topics.length === 0 || Object.keys(relevanceScores).length === 0) {
      throw new Error('Failed to extract valid keywords, topics, or scores');
    }

    return {
      keywords,
      topics,
      relevanceScores
    };
  } catch (error) {
    console.error('Error extracting keywords:', error);
    throw error;
  }
}

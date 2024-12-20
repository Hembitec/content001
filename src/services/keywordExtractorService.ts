import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface KeywordExtractionResult {
  keywords: string[];
  topics: string[];
  relevanceScores: { [key: string]: number };
  keywordTypes: { [key: string]: string };
  keywordFrequency: { [key: string]: number };
  contentSummary: string;
  contentType: string;
  mainTheme: string;
  wordCount: number;
  keywordDensity: { [key: string]: string };
}

export async function extractKeywords(content: string): Promise<KeywordExtractionResult> {
  if (!content?.trim()) {
    throw new Error('Content is required');
  }

  const prompt = `As an expert content analyzer, provide a comprehensive analysis of the following content.

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
===TYPES===
keyword1: primary
keyword2: secondary
keyword3: related
===FREQUENCY===
keyword1: 5
keyword2: 3
keyword3: 2
===DENSITY===
keyword1: 2.5%
keyword2: 1.5%
keyword3: 1.0%
===SUMMARY===
Brief 2-3 sentence summary of the content
===CONTENT_TYPE===
Type of content (e.g., blog post, article, technical document)
===MAIN_THEME===
The primary theme or message
===WORD_COUNT===
150

Rules:
1. Extract meaningful keywords and phrases
2. Identify main topics and subtopics
3. Calculate accurate relevance scores (0-1)
4. Classify keywords by type (primary/secondary/related)
5. Count keyword frequency
6. Calculate keyword density
7. Provide concise content summary
8. Identify content type and main theme
9. Maintain exact format with === markers`;

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

    // Extract sections using markers
    const keywordsMatch = generatedText.match(/===KEYWORDS===([\s\S]*?)===TOPICS===/);
    const topicsMatch = generatedText.match(/===TOPICS===([\s\S]*?)===SCORES===/);
    const scoresMatch = generatedText.match(/===SCORES===([\s\S]*?)===TYPES===/);
    const typesMatch = generatedText.match(/===TYPES===([\s\S]*?)===FREQUENCY===/);
    const frequencyMatch = generatedText.match(/===FREQUENCY===([\s\S]*?)===DENSITY===/);
    const densityMatch = generatedText.match(/===DENSITY===([\s\S]*?)===SUMMARY===/);
    const summaryMatch = generatedText.match(/===SUMMARY===([\s\S]*?)===CONTENT_TYPE===/);
    const contentTypeMatch = generatedText.match(/===CONTENT_TYPE===([\s\S]*?)===MAIN_THEME===/);
    const mainThemeMatch = generatedText.match(/===MAIN_THEME===([\s\S]*?)===WORD_COUNT===/);
    const wordCountMatch = generatedText.match(/===WORD_COUNT===\s*(\d+)/);

    if (!keywordsMatch || !topicsMatch || !scoresMatch || !typesMatch || 
        !frequencyMatch || !densityMatch || !summaryMatch || !contentTypeMatch || 
        !mainThemeMatch || !wordCountMatch) {
      console.error('Generated text:', generatedText);
      throw new Error('Failed to parse generated content - invalid format');
    }

    // Parse keywords and topics
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
    
    // Parse scores
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

    // Parse keyword types
    const keywordTypes: { [key: string]: string } = {};
    const typeLines = typesMatch[1]
      .trim()
      .split('\n')
      .filter(line => line.includes(':'));
    
    typeLines.forEach(line => {
      const [keyword, type] = line.split(':').map(s => s.trim());
      keywordTypes[keyword] = type;
    });

    // Parse keyword frequency
    const keywordFrequency: { [key: string]: number } = {};
    const frequencyLines = frequencyMatch[1]
      .trim()
      .split('\n')
      .filter(line => line.includes(':'));
    
    frequencyLines.forEach(line => {
      const [keyword, freqStr] = line.split(':').map(s => s.trim());
      const freq = parseInt(freqStr);
      if (!isNaN(freq) && freq >= 0) {
        keywordFrequency[keyword] = freq;
      }
    });

    // Parse keyword density
    const keywordDensity: { [key: string]: string } = {};
    const densityLines = densityMatch[1]
      .trim()
      .split('\n')
      .filter(line => line.includes(':'));
    
    densityLines.forEach(line => {
      const [keyword, density] = line.split(':').map(s => s.trim());
      keywordDensity[keyword] = density;
    });

    // Get other information
    const contentSummary = summaryMatch[1].trim();
    const contentType = contentTypeMatch[1].trim();
    const mainTheme = mainThemeMatch[1].trim();
    const wordCount = parseInt(wordCountMatch[1]);

    // Validate the result
    if (keywords.length === 0 || topics.length === 0 || Object.keys(relevanceScores).length === 0) {
      throw new Error('Failed to extract valid keywords, topics, or scores');
    }

    return {
      keywords,
      topics,
      relevanceScores,
      keywordTypes,
      keywordFrequency,
      contentSummary,
      contentType,
      mainTheme,
      wordCount,
      keywordDensity
    };
  } catch (error) {
    console.error('Error extracting keywords:', error);
    throw error;
  }
}

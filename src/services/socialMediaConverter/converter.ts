import { bannedPhrases, templatePrompts } from './templates';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

interface ConversionResult {
  content: string;
  hashtags: string[];
  variation: number;
}

export async function generateVariations(
  content: string,
  platform: 'linkedin' | 'twitter' | 'facebook',
  type: 'professional' | 'howto' | 'comparison' | 'stepbystep'
): Promise<ConversionResult[]> {
  try {
    // Get the appropriate template
    const template = templatePrompts[type][platform];
    
    // Replace placeholders in template
    const prompt = template
      .replace('[CONTENT]', content)
      .replace('[BANNED_PHRASES]', bannedPhrases.join(', '));

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt + "\n\nIMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks."
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
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
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response text - remove any markdown formatting
    const cleanJson = rawText.replace(/```json\n|\n```/g, '').trim();
    
    try {
      // Parse the cleaned JSON
      const variations = JSON.parse(cleanJson);
      
      // Format the response
      return variations.map((variation: any, index: number) => ({
        content: variation.content,
        hashtags: variation.hashtags,
        variation: index + 1
      }));
    } catch (parseError) {
      console.error('Failed to parse JSON:', cleanJson);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error generating variations:', error);
    throw error;
  }
}

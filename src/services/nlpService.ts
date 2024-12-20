import { generateStructuredContent } from './contentGenerationService';

interface GenerateContentParams {
  title: string;
  keywords: string[];
  contentType: string;
  tone: string;
  length: string;
  language: string;
  keynotes?: string;
}

export interface GeneratedContent {
  title: string;
  metaDescription: string;
  keywords: string[];
  targetAudience: string;
  readingTime: string;
  content: string;
}

export const generateContent = async (params: GenerateContentParams): Promise<GeneratedContent> => {
  if (!params.title?.trim()) {
    throw new Error('Title is required');
  }

  const { title, keywords, contentType, tone, length, language, keynotes } = params;

  try {
    const result = await generateStructuredContent(
      title,
      keywords || [],
      contentType || 'blog',
      tone || 'professional',
      length || 'medium',
      language || 'English',
      keynotes
    );

    if (!result.content) {
      throw new Error('No content was generated');
    }

    return result;
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error('Failed to generate content. Please try again.');
  }
};

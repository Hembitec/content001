import { Tool } from '../types';

export const tools: Tool[] = [
  {
    id: '1',
    title: 'Content Analyzer',
    description: 'Evaluates text for grammar, readability, SEO, and style. Users can input content via text, file, or URL and receive detailed, actionable insights.',
    icon: 'FileSearch',
    path: '/analyzer'
  },
  {
    id: '2',
    title: 'NLP Generator',
    description: 'Creates tailored content like blog posts and articles. Users input keywords, select tone and length, and receive optimized, editable content.',
    icon: 'Brain',
    path: '/generator'
  },
  {
    id: '3',
    title: 'Social Media Content Converter',
    description: 'Transforms text into platform-specific posts for Twitter, LinkedIn, and Facebook. Offers tone customization, hashtag suggestions, and easy export options.',
    icon: 'Share2',
    path: '/converter'
  },
];
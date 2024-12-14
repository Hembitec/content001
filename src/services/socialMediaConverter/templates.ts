// Banned phrases across all platforms
export const bannedPhrases = [
  'revolutionize',
  'dive in',
  'venture',
  'innovative',
  'realm',
  'Adhere',
  'Delve',
  'Reimagine',
  'Robust',
  'Orchestrate',
  'Diverse',
  'Commendable',
  'Embrace',
  'Paramount',
  'Beacon',
  'Captivate',
  'Commendable',
  'Advancement in the realm',
  'Aims to bridge',
  'Aims to democratize',
  'Aims to foster innovation and collaboration',
  'Becomes increasingly evident',
  'Behind the Veil',
  'Breaking barriers',
  'Breakthrough has the potential to revolutionize the way',
  'Bringing us',
  'Bringing us closer to a future',
  'By combining the capabilities',
  'By harnessing the power',
  'Capturing the attention',
  'Continue to advance',
  'Continue to make significant strides',
  'Continue to push the boundaries',
  'Continues to progress rapidly',
  'Crucial to be mindful',
  'Crucially',
  'Cutting-edge',
  'Drive the next big',
  'Encompasses a wide range of real-life scenarios',
  'Enhancement further enhances',
  'Ensures that even',
  'Essential to understand the nuances',
  'Excitement',
  'Exciting opportunities',
  'Exciting possibilities',
  'Exciting times lie ahead as we unlock the potential of',
  'Excitingly',
  'Expanded its capabilities',
  'Expect to witness transformative breakthroughs',
  'Expect to witness transformative breakthroughs in their capabilities',
  'Exploration of various potential answers',
  'Explore the fascinating world',
  'Exploring new frontiers',
  'Exploring this avenue',
  'Foster the development',
  'Future might see us placing',
  'Groundbreaking way',
  'Groundbreaking advancement',
  'Groundbreaking study',
  'Groundbreaking technology',
  'Have come a long way in recent years',
  'Hold promise',
  'Implications are profound',
  'Improved efficiency in countless ways',
  'In conclusion',
  'In the fast-paced world',
  'Innovative service',
  'Intrinsic differences',
  'It discovered an intriguing approach',
  'It remains to be seen',
  'It serves as a stepping stone towards the realization',
  'Latest breakthrough signifies',
  'Latest offering',
  'Let’s delve into the exciting details',
  'Main message to take away',
  'Make informed decisions',
  'Mark a significant step forward',
  'Mind-boggling figure',
  'More robust evaluation',
  'For instance',
  'Navigate the landscape',
  'Notably',
  'One step closer',
  'One thing is clear',
  'Only time will tell',
  'Opens up exciting possibilities',
  'Paving the way for enhanced performance',
  'Possibilities are endless',
  'Potentially revolutionizing the way',
  'Push the boundaries',
  'Raise fairness concerns',
  'Raise intriguing questions',
  'Rapid pace of development',
  'Rapidly developing',
  'Redefine the future',
  'Remarkable abilities',
  'Remarkable breakthrough',
  'Remarkable proficiency',
  'Remarkable success',
  'Remarkable tool',
  'Remarkably',
  'Elevate',
  'Captivate',
  'Tapestry',
  'Delve',
  'Leverage',
  'Resonate',
  'Foster',
  'Endeavor',
  'Embark',
  'Unleash',
  'Renowned',
  'Represent a major milestone',
  'Represents a significant milestone in the field',
  'Revolutionize the way',
  'Revolutionizing the way',
  'Risks of drawing unsupported conclusions',
  'Seeking trustworthiness',
  'Significant step forward',
  'Significant strides',
  'The necessity of clear understanding',
  'There is still room for improvement',
  'Transformative power',
  'Truly exciting',
  'Uncover hidden trends',
  'Understanding of the capabilities',
  'Unleashing the potential',
  'Unlocking the power',
  'Unraveling',
  'We can improve understanding and decision-making',
  'Welcome your thoughts',
  'What sets this apart',
  'What’s more',
  'With the introduction',
  'Bespoke',
  'Whimsical',
  'Meticulous',
  'Emerge',
  'Refrain',
  'Vibrant',
  'Reimagine',
  'Evolve',
  'Supercharge',
  'Pivotal',
  // Generic business clichés
  "revolutionize", "dive in", "venture", "innovative", "realm", "adhere",
  "delve", "reimagine", "robust", "orchestrate", "diverse", "commendable",
  "embrace", "paramount", "beacon", "captivate", "advancement in the realm",
  "aims to bridge", "aims to democratize", "aims to foster innovation",
  "becomes increasingly evident", "behind the veil", "breaking barriers",
  "breakthrough has the potential", "bringing us closer to a future",
  "by combining the capabilities", "by harnessing the power",
  "capturing the attention", "continue to advance", "cutting-edge",
  "drive the next big", "exciting opportunities", "game-changing",
  "groundbreaking", "innovative solution", "leveraging",
  "next-generation", "paradigm shift", "revolutionary",
  "state-of-the-art", "synergy", "thought leader",
  "transform the industry", "visionary",

  // Platform-specific clichés
  // LinkedIn
  "honored to announce", "humbled by", "thrilled to share",
  "excited to announce", "pleased to share", "grateful to",
  "looking forward to", "proud to announce",

  // Twitter
  "thread incoming", "hot take", "unpopular opinion",
  "let that sink in", "just saying", "friendly reminder",

  // Facebook
  "algorithm blessed", "like and share", "who else agrees",
  "tag someone who", "share if you agree"
];

// Template prompts for different content types
export const templatePrompts = {
  professional: {
    linkedin: `Create 4 different professional LinkedIn posts based on the following content. Each variation should:
- Use simple, clear language
- Avoid cliché business phrases
- Include relevant hashtags
- Focus on value and insights
- Be between 150-200 words
- Have a clear call-to-action

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should take a different angle while maintaining professionalism
- Format output as JSON with "content" and "hashtags" fields for each variation
- Ensure each variation has a unique approach`,

    twitter: `Create 4 different professional Twitter posts based on the following content. Each variation should:
- Be under 280 characters
- Be concise and impactful
- Include relevant hashtags
- Maintain professional tone
- Drive engagement

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique approach
- Format output as JSON with "content" and "hashtags" fields
- Focus on clarity and impact`,

    facebook: `Create 4 different professional Facebook posts based on the following content. Each variation should:
- Be engaging and conversational
- Maintain professional tone
- Include relevant hashtags
- Drive meaningful discussion
- Include a clear call-to-action

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should take a different angle
- Format output as JSON with "content" and "hashtags" fields
- Focus on community engagement`
  },

  howto: {
    linkedin: `Create 4 different "How-To" LinkedIn posts based on the following content. Each variation should:
- Break down the process clearly
- Use numbered steps or bullet points
- Include practical tips
- Add value for professionals
- Include relevant hashtags

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique structure
- Format output as JSON with "content" and "hashtags" fields
- Focus on actionable insights`,

    twitter: `Create 4 different "How-To" Twitter threads based on the following content. Each variation should:
- Break complex ideas into simple steps
- Stay within character limits
- Use clear, concise language
- Include relevant hashtags
- Be easy to follow

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique approach
- Format output as JSON with "content" and "hashtags" fields
- Focus on simplicity and clarity`,

    facebook: `Create 4 different "How-To" Facebook posts based on the following content. Each variation should:
- Present steps in an engaging way
- Use conversational tone
- Include practical examples
- Drive community discussion
- Include relevant hashtags

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique style
- Format output as JSON with "content" and "hashtags" fields
- Focus on community value`
  },

  comparison: {
    linkedin: `Create 4 different comparison-based LinkedIn posts based on the following content. Each variation should:
- Present clear comparisons
- Highlight key differences
- Maintain objectivity
- Include professional insights
- Use relevant hashtags

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique perspective
- Format output as JSON with "content" and "hashtags" fields
- Focus on valuable insights`,

    twitter: `Create 4 different comparison-based Twitter posts based on the following content. Each variation should:
- Present concise comparisons
- Stay within character limits
- Use clear contrasts
- Include relevant hashtags
- Be engaging

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique approach
- Format output as JSON with "content" and "hashtags" fields
- Focus on clarity and impact`,

    facebook: `Create 4 different comparison-based Facebook posts based on the following content. Each variation should:
- Present engaging comparisons
- Drive discussion
- Include examples
- Use relevant hashtags
- Encourage interaction

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique angle
- Format output as JSON with "content" and "hashtags" fields
- Focus on community engagement`
  },

  stepbystep: {
    linkedin: `Create 4 different step-by-step LinkedIn posts based on the following content. Each variation should:
- Present clear, numbered steps
- Include professional context
- Add valuable insights
- Use relevant hashtags
- Have a clear structure

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique approach
- Format output as JSON with "content" and "hashtags" fields
- Focus on professional value`,

    twitter: `Create 4 different step-by-step Twitter threads based on the following content. Each variation should:
- Break down steps clearly
- Stay within character limits
- Be easy to follow
- Include relevant hashtags
- Maintain engagement

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique structure
- Format output as JSON with "content" and "hashtags" fields
- Focus on clarity and brevity`,

    facebook: `Create 4 different step-by-step Facebook posts based on the following content. Each variation should:
- Present clear steps
- Be engaging and conversational
- Include examples
- Use relevant hashtags
- Drive discussion

Original Content:
[CONTENT]

Important:
- Do NOT use any of these banned phrases: [BANNED_PHRASES]
- Each variation should have a unique approach
- Format output as JSON with "content" and "hashtags" fields
- Focus on community value`
  }
};

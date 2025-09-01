import {GoogleGenerativeAI} from '@google/generative-ai';

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const stubResponses = {
  description: {
    'Setup authentication': 'Implement user authentication system with JWT tokens, '
      + 'including login, registration, and token validation endpoints.',
    'Fix bug': 'Investigate and resolve the reported bug by analyzing error logs, '
      + 'reproducing the issue, and implementing a fix.',
    'Code review': 'Review pull requests for code quality, performance, '
      + 'and security issues. Provide constructive feedback.',
    default: 'Complete the specified task according to project requirements and best practices.'
  }
};

export const generateTaskDescription = async (title) => {
  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({model: 'gemini-1.5-flash'});
      const prompt = `Generate a clear, concise task description (under 100 words) for a project management app. 
      Task title: "${title}"
      
      Provide only the description, no additional text.`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text.trim();
    } catch (error) {
      console.error('Gemini API error:', error.message);
    }
  }

  const lowerTitle = title.toLowerCase();
  const entries = Object.entries(stubResponses.description);
  for (let i = 0; i < entries.length; i += 1) {
    const [key, value] = entries[i];
    if (key !== 'default' && lowerTitle.includes(key.toLowerCase())) {
      return value;
    }
  }
  return stubResponses.description.default;
};

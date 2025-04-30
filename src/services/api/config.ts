
// API Configuration

// API base URLs
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
export const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
export const GROQ_API_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

// API keys - Note: In production, these should be environment variables
export const NEWS_API_KEY = '9bad6dd23f704786b58e38046d7d1efc';
export const GROQ_API_KEY = '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';

// Demo mode - For testing when APIs fail or rate limits are reached
export const USE_DEMO_DATA = false; // Set to true to use mock data instead of real API calls

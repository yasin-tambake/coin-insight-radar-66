
import { toast } from "sonner";
import { GROQ_API_BASE_URL, GROQ_API_KEY } from "./config";
import { NewsArticle, SentimentAnalysis } from "./types";
import { CoinDetail } from "./types";

// Groq API functions
export const analyzeSentiment = async (
  coinName: string,
  newsArticles: NewsArticle[]
): Promise<SentimentAnalysis | null> => {
  try {
    if (!newsArticles || newsArticles.length === 0) {
      console.log('No news articles provided for sentiment analysis');
      return null;
    }
    
    const headlines = newsArticles.slice(0, 5).map(article => article.title).join('\n');
    const descriptions = newsArticles.slice(0, 5)
      .filter(article => article.description)
      .map(article => article.description)
      .join('\n');
    
    const prompt = `
      Given the following news headlines and descriptions about the cryptocurrency ${coinName}:
      
      Headlines:
      ${headlines}
      
      Descriptions:
      ${descriptions}
      
      Analyze the market sentiment (positive, neutral, negative), and predict the short-term trend (bullish, bearish, volatile, or stable).
      Return a JSON with the following structure:
      {
        "sentiment": "positive/neutral/negative",
        "score": 0-100 (where 0 is extremely negative, 50 is neutral, and 100 is extremely positive),
        "trend": "bullish/bearish/volatile/stable",
        "summary": "A simple 1-2 sentence explanation of the sentiment and trend prediction"
      }
    `;
    
    const response = await fetch(GROQ_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency market analyst specialized in sentiment analysis. Provide concise, data-driven insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze sentiment');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse sentiment analysis response');
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    toast.error('Failed to analyze market sentiment');
    return null;
  }
};

export const generateMarketCommentary = async (
  coin: CoinDetail | null,
  sentimentAnalysis: SentimentAnalysis | null
): Promise<string> => {
  if (!coin || !sentimentAnalysis) return '';
  
  try {
    const prompt = `
      Generate a short market commentary for ${coin.name} (${coin.symbol.toUpperCase()}).
      
      Current Data:
      - Current Price: $${coin.current_price}
      - 24h Change: ${coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
      - Market Cap: $${(coin.market_cap / 1e9).toFixed(2)} billion
      - Trading Volume: $${(coin.total_volume / 1e6).toFixed(2)} million
      
      Sentiment Analysis:
      - Overall Sentiment: ${sentimentAnalysis.sentiment}
      - Trend: ${sentimentAnalysis.trend}
      
      Provide a concise 2-3 sentence analysis that explains the current price action and what investors might expect in the short term. Be informative but not overly technical.
    `;
    
    const response = await fetch(GROQ_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency market commentator providing concise insights for investors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate market commentary');
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating market commentary:', error);
    toast.error('Failed to generate market commentary');
    return '';
  }
};


// A simple sentiment analysis module using a rule-based approach with crypto-specific terms

// Positive and negative word lists related to cryptocurrency
const POSITIVE_WORDS = [
  'bullish', 'rally', 'surge', 'gain', 'positive', 'growth', 'uptrend', 'breakout',
  'climb', 'rise', 'skyrocket', 'soar', 'moon', 'pump', 'recover', 'support',
  'adoption', 'partnership', 'integration', 'innovation', 'upgrade', 'launch',
  'regulatory clarity', 'institutional', 'mainstream', 'development', 'profit'
];

const NEGATIVE_WORDS = [
  'bearish', 'crash', 'plunge', 'dump', 'fall', 'drop', 'decline', 'dip', 'sell',
  'correction', 'panic', 'fear', 'loss', 'negative', 'downtrend', 'resistance',
  'ban', 'hack', 'scam', 'fraud', 'risk', 'manipulation', 'illegal', 'bubble',
  'regulation', 'warning', 'concern', 'investigation', 'volatility', 'uncertainty'
];

// Neutral terms - these are typically important but not inherently positive or negative
const NEUTRAL_WORDS = [
  'stable', 'unchanged', 'flat', 'consolidation', 'sideways', 'steady', 'maintain',
  'holding', 'fluctuate', 'range-bound', 'technical analysis', 'pattern',
  'volume', 'market cap', 'supply', 'demand', 'halving', 'mining', 'transaction',
  'exchange', 'wallet', 'blockchain', 'token', 'listing', 'delisting', 'trading'
];

// Intensifiers - words that amplify sentiment
const INTENSIFIERS = [
  'very', 'extremely', 'significantly', 'dramatically', 'massively', 'hugely',
  'sharply', 'strongly', 'substantially', 'remarkably', 'notably'
];

// Analyzers for sentiment scoring
export function analyzeSentiment(text: string) {
  const lowercaseText = text.toLowerCase();
  let score = 0;
  let positiveMatches = [];
  let negativeMatches = [];
  let neutralMatches = [];
  
  // Check for positive words
  for (const word of POSITIVE_WORDS) {
    if (lowercaseText.includes(word)) {
      positiveMatches.push(word);
      score += 1;
      
      // Check if the positive word is preceded by an intensifier
      for (const intensifier of INTENSIFIERS) {
        if (lowercaseText.includes(`${intensifier} ${word}`)) {
          score += 0.5; // Add extra score for intensified positive words
          break;
        }
      }
    }
  }
  
  // Check for negative words
  for (const word of NEGATIVE_WORDS) {
    if (lowercaseText.includes(word)) {
      negativeMatches.push(word);
      score -= 1;
      
      // Check if the negative word is preceded by an intensifier
      for (const intensifier of INTENSIFIERS) {
        if (lowercaseText.includes(`${intensifier} ${word}`)) {
          score -= 0.5; // Add extra negative score for intensified negative words
          break;
        }
      }
    }
  }
  
  // Check for neutral words
  for (const word of NEUTRAL_WORDS) {
    if (lowercaseText.includes(word)) {
      neutralMatches.push(word);
      // Neutral words don't affect score but we track them
    }
  }
  
  // Determine sentiment category
  let sentiment = 'neutral';
  if (score > 1) {
    sentiment = 'positive';
  } else if (score < -1) {
    sentiment = 'negative';
  }
  
  // Determine trend (a slightly different measure focusing on market direction)
  let trend = 'stable';
  if (lowercaseText.includes('bull') || lowercaseText.includes('uptrend') || 
      lowercaseText.includes('rally') || lowercaseText.includes('surge')) {
    trend = 'bullish';
  } else if (lowercaseText.includes('bear') || lowercaseText.includes('downtrend') || 
             lowercaseText.includes('crash') || lowercaseText.includes('plunge')) {
    trend = 'bearish';
  } else if (lowercaseText.includes('volatile') || lowercaseText.includes('fluctuat')) {
    trend = 'volatile';
  }
  
  // Normalized score between -100 and 100
  const normalizedScore = Math.min(Math.max(score * 10, -100), 100);
  
  return {
    sentiment,
    score: normalizedScore,
    trend,
    positiveMatches,
    negativeMatches,
    neutralMatches,
    summary: generateSummary(sentiment, trend, normalizedScore)
  };
}

function generateSummary(sentiment: string, trend: string, score: number) {
  const sentimentAdjective = 
    score > 75 ? 'extremely positive' :
    score > 50 ? 'strongly positive' :
    score > 25 ? 'positive' :
    score > 0 ? 'slightly positive' :
    score > -25 ? 'slightly negative' :
    score > -50 ? 'negative' :
    score > -75 ? 'strongly negative' :
    'extremely negative';
    
  const trendDescription = 
    trend === 'bullish' ? 'bullish market movement' :
    trend === 'bearish' ? 'bearish market pressure' :
    trend === 'volatile' ? 'volatile trading conditions' :
    'stable market conditions';
    
  return `Analysis indicates ${sentimentAdjective} sentiment with signs of ${trendDescription}.`;
}

export function analyzeCryptoNewsHeadlines(headlines: string[]) {
  if (!headlines.length) return null;
  
  const results = headlines.map(headline => ({
    headline,
    analysis: analyzeSentiment(headline)
  }));
  
  // Calculate average sentiment
  const totalScore = results.reduce((sum, item) => sum + item.analysis.score, 0);
  const averageScore = totalScore / results.length;
  
  // Count trends
  const trendCounts = results.reduce((counts, item) => {
    const trend = item.analysis.trend;
    counts[trend] = (counts[trend] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Determine dominant trend
  let dominantTrend = 'stable';
  let maxCount = 0;
  for (const [trend, count] of Object.entries(trendCounts)) {
    if (count > maxCount) {
      dominantTrend = trend;
      maxCount = count;
    }
  }
  
  // Determine overall sentiment
  let overallSentiment = 'neutral';
  if (averageScore > 15) {
    overallSentiment = 'positive';
  } else if (averageScore < -15) {
    overallSentiment = 'negative';
  }
  
  return {
    individualResults: results,
    overallSentiment,
    averageScore,
    dominantTrend,
    summary: `Based on ${headlines.length} headlines, the overall market sentiment is ${overallSentiment} (${averageScore.toFixed(1)}) with a ${dominantTrend} trend.`
  };
}

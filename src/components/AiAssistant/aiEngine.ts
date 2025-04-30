
import { analyzeSentiment } from '@/services/sentiment/simpleSentiment';

// Basic patterns for common questions
const patterns = [
  {
    match: /(what|how) is (bitcoin|ethereum|crypto)/i,
    response: (coin: string) => {
      const coinInfo: Record<string, string> = {
        bitcoin: "Bitcoin is the first decentralized cryptocurrency, created in 2009 by an unknown person or group known as Satoshi Nakamoto. It operates on a technology called blockchain.",
        ethereum: "Ethereum is a decentralized blockchain platform that enables smart contracts and decentralized applications (dApps). It was proposed by Vitalik Buterin in 2013.",
        crypto: "Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on decentralized networks based on blockchain technology."
      };
      return coinInfo[coin.toLowerCase()] || `${coin} is a cryptocurrency or digital asset.`;
    }
  },
  {
    match: /what is (market cap|volume|blockchain|nft)/i,
    response: (term: string) => {
      const termInfo: Record<string, string> = {
        "market cap": "Market capitalization is the total value of a cryptocurrency. It's calculated by multiplying the current price by the circulating supply.",
        "volume": "Trading volume is the total amount of a cryptocurrency that has been traded (bought and sold) over a specific period, usually 24 hours.",
        "blockchain": "Blockchain is a distributed, decentralized, public ledger that records transactions across many computers so that any involved record cannot be altered retroactively.",
        "nft": "Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of items like art, collectibles, and in-game items on a blockchain."
      };
      return termInfo[term.toLowerCase()] || `${term} is a term related to cryptocurrency and blockchain technology.`;
    }
  },
  {
    match: /(what|how) is the (market|trend|price) (for|of) ([a-z]+)/i,
    response: (_, _2, _3, coin: string) => {
      return `I don't have real-time data for ${coin}. Please check the dashboard for the latest prices and trends.`;
    }
  },
  {
    match: /explain (chart|graph|visualization)/i,
    response: (term: string) => {
      const explanations: Record<string, string> = {
        "chart": "Charts on this dashboard visualize cryptocurrency price movements and market data. Line charts show price over time, bar charts compare values, and pie charts show market share distribution.",
        "graph": "Graphs on this platform display relationships between data points like price changes, trading volume, or market dominance. Each visualization helps to understand market trends.",
        "visualization": "Visualizations transform complex cryptocurrency data into intuitive graphics. They help identify patterns, compare assets, and make informed trading decisions."
      };
      return explanations[term.toLowerCase()] || "The dashboard visualizations help you analyze cryptocurrency market data through interactive charts and graphs.";
    }
  },
  {
    match: /(what|how) (can|do) you (do|help)/i,
    response: () => {
      return "I can help you understand cryptocurrency concepts, explain market trends, interpret charts on the dashboard, and answer questions about specific coins. Just ask me anything crypto-related!";
    }
  }
];

export async function processUserMessage(message: string): Promise<string> {
  // Wait a bit to simulate processing time
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Check for pattern matches
  for (const pattern of patterns) {
    const match = message.match(pattern.match);
    if (match) {
      // Extract capture groups (excluding the full match)
      const captureGroups = match.slice(1).filter(Boolean);
      // @ts-ignore - We're dynamically calling the response function
      return pattern.response(...captureGroups);
    }
  }
  
  // If no pattern matched, perform sentiment analysis
  if (message.toLowerCase().includes('sentiment') || 
      message.toLowerCase().includes('feeling') || 
      message.toLowerCase().includes('opinion')) {
    const analysis = analyzeSentiment(message);
    return `Based on my analysis, the sentiment in your message appears ${analysis.sentiment} (score: ${analysis.score}). The market trend seems to be ${analysis.trend}.`;
  }
  
  // Default response
  return "I'm not sure how to answer that specific question yet. You can ask me about cryptocurrency concepts, market trends, or how to use the dashboard features.";
}

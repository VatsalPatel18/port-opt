import { Portfolio, RiskLevel } from './types';

export const INITIAL_PORTFOLIO: Portfolio = {
  totalValue: 145230.50,
  dayChange: 1240.20,
  dayChangePercent: 0.86,
  assets: [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', quantity: 150, currentPrice: 225.50, avgBuyPrice: 180.00, allocation: 23.3 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', quantity: 80, currentPrice: 415.20, avgBuyPrice: 350.00, allocation: 22.9 },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', quantity: 50, currentPrice: 850.00, avgBuyPrice: 400.00, allocation: 29.2 },
    { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', quantity: 100, currentPrice: 195.10, avgBuyPrice: 160.00, allocation: 13.4 },
    { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer', quantity: 60, currentPrice: 162.80, avgBuyPrice: 150.00, allocation: 6.7 },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', quantity: 40, currentPrice: 175.40, avgBuyPrice: 140.00, allocation: 4.5 },
  ]
};

export const GEMINI_MODELS = {
  FLASH: 'gemini-2.5-flash',
  PRO: 'gemini-3-pro-preview',
  SEARCH_TOOL: 'googleSearch',
};

export const STRATEGY_DESCRIPTIONS = {
  MeanVariance: "Classic Markowitz optimization to maximize Sharpe ratio.",
  HierarchicalRiskParity: "Machine learning clustering to build robust, diversified portfolios.",
  BlackLitterman: "Combines market equilibrium with AI-generated market views.",
  AI_Agent_Custom: "Deep reasoning agent generates a custom strategy based on macro trends."
};

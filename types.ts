export interface Asset {
  ticker: string;
  name: string;
  sector: string;
  quantity: number;
  currentPrice: number;
  avgBuyPrice: number;
  allocation: number; // percentage
}

export interface Portfolio {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  assets: Asset[];
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  toolCalls?: string[];
  groundingUrls?: { title: string; uri: string }[];
}

export enum RiskLevel {
  LOW = 'Conservative',
  MEDIUM = 'Balanced',
  HIGH = 'Aggressive',
}

export interface StrategyParams {
  amount: number;
  riskLevel: RiskLevel;
  strategyType: 'MeanVariance' | 'HierarchicalRiskParity' | 'BlackLitterman' | 'AI_Agent_Custom';
}

export interface OptimizationResult {
  proposedAllocation: { ticker: string; weight: number }[];
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  rationale: string;
}

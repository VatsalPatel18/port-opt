import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODELS } from "../constants";
import { Asset, Portfolio, RiskLevel, StrategyParams } from "../types";

// Initialize Gemini Client
// NOTE: Process.env.API_KEY is assumed to be injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the current portfolio using Gemini Flash for speed.
 * Can use Search Grounding for latest news.
 */
export const analyzePortfolio = async (portfolio: Portfolio, userQuery: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  const portfolioContext = JSON.stringify(portfolio.assets.map(a => ({
    ticker: a.ticker,
    allocation: a.allocation,
    profit: (a.currentPrice - a.avgBuyPrice) * a.quantity
  })));

  const prompt = `
    You are Nexus Capital, an expert AI financial analyst.
    Here is the user's current portfolio summary: ${portfolioContext}.
    
    User Query: "${userQuery}"
    
    Provide a concise, actionable response. If the user asks about market news, use the search tool.
    If the user asks for specific advice on their holdings, reference the portfolio data.
    Format specific monetary values or percentages clearly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODELS.FLASH,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a professional, objective financial AI agent. Do not give illegal financial advice, but provide analysis based on data.",
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter(Boolean) || [];

    return {
      text: response.text || "I couldn't generate an analysis at this moment.",
      sources
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { text: "Error connecting to AI Analyst. Please check your API key." };
  }
};

/**
 * Uses Gemini 3 Pro with Thinking to generate a deep strategy.
 * Simulates the MCP "solve_portfolio" tool usage by generating the JSON result structure directly.
 */
export const generateOptimizationStrategy = async (
  currentPortfolio: Portfolio, 
  params: StrategyParams
): Promise<string> => {
  
  const context = `
    Current Assets: ${currentPortfolio.assets.map(a => a.ticker).join(', ')}.
    Investment Amount: $${params.amount}.
    Risk Tolerance: ${params.riskLevel}.
    Method: ${params.strategyType}.
  `;

  // We instruct the model to return a JSON structure representing the "solved" portfolio
  // simulating the Python MCP backend response.
  const prompt = `
    Act as a Portfolio Optimization Engine using the ${params.strategyType} method.
    ${context}
    
    Perform a deep analysis of the current market conditions (simulated) and the mathematical properties of these assets.
    
    I need you to output a JSON object ONLY, representing the optimized portfolio allocation.
    
    Schema:
    {
      "proposedAllocation": [ {"ticker": "AAPL", "weight": 0.25}, ... ],
      "expectedReturn": 0.12, (decimal)
      "volatility": 0.15, (decimal)
      "sharpeRatio": 1.8,
      "rationale": "A detailed explanation of why this allocation was chosen, referencing market trends and the optimization math."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODELS.PRO,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking for complex math/reasoning
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Optimization Error:", error);
    throw error;
  }
};

/**
 * Streaming chat for the general assistant
 */
export const streamChat = async (history: { role: string; parts: [{ text: string }] }[], message: string) => {
    const chat = ai.chats.create({
        model: GEMINI_MODELS.FLASH,
        history: history,
        config: {
             tools: [{ googleSearch: {} }],
        }
    });
    
    return chat.sendMessageStream({ message });
}

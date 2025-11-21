import React, { useState } from 'react';
import { Portfolio, RiskLevel, StrategyParams, OptimizationResult } from '../types';
import { generateOptimizationStrategy } from '../services/geminiService';
import { STRATEGY_DESCRIPTIONS } from '../constants';
import { BrainCircuit, TrendingUp, AlertTriangle, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface Props {
  portfolio: Portfolio;
}

const OptimizationTools: React.FC<Props> = ({ portfolio }) => {
  const [amount, setAmount] = useState<number>(10000);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.MEDIUM);
  const [strategyType, setStrategyType] = useState<StrategyParams['strategyType']>('MeanVariance');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleOptimize = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const jsonString = await generateOptimizationStrategy(portfolio, {
        amount,
        riskLevel,
        strategyType
      });
      
      // Parse the JSON response from Gemini
      // Clean markdown code blocks if present
      const cleanedJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanedJson);
      setResult(data);
    } catch (error) {
      console.error("Failed to parse optimization result", error);
      // In a real app, show toast error
    } finally {
      setIsGenerating(false);
    }
  };

  const chartData = result ? result.proposedAllocation.map(item => ({
    name: item.ticker,
    Current: portfolio.assets.find(a => a.ticker === item.ticker)?.allocation || 0,
    Proposed: (item.weight * 100).toFixed(1)
  })) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in space-y-8 pb-20">
       <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-nexus-accent" />
            Strategy Lab
        </h1>
        <p className="text-slate-400 mt-1">Design algorithmic trading strategies using Gemini 3.0 Pro Deep Thinking.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Panel */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-nexus-800 border border-nexus-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-6">Configuration</h3>
                
                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Investment Capital</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-nexus-900 border border-nexus-700 rounded-lg py-3 pl-8 pr-4 text-white focus:ring-2 focus:ring-nexus-accent focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Risk Slider */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                         <label className="text-sm font-medium text-slate-300">Risk Tolerance</label>
                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                             riskLevel === RiskLevel.LOW ? 'bg-emerald-500/20 text-emerald-400' :
                             riskLevel === RiskLevel.MEDIUM ? 'bg-amber-500/20 text-amber-400' :
                             'bg-rose-500/20 text-rose-400'
                         }`}>{riskLevel}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" max="2" step="1"
                        value={riskLevel === RiskLevel.LOW ? 0 : riskLevel === RiskLevel.MEDIUM ? 1 : 2}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setRiskLevel(val === 0 ? RiskLevel.LOW : val === 1 ? RiskLevel.MEDIUM : RiskLevel.HIGH);
                        }}
                        className="w-full h-2 bg-nexus-900 rounded-lg appearance-none cursor-pointer accent-nexus-accent"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Safe</span>
                        <span>Balanced</span>
                        <span>Risky</span>
                    </div>
                </div>

                {/* Strategy Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-300 mb-3">Optimization Model</label>
                    <div className="space-y-3">
                        {(Object.keys(STRATEGY_DESCRIPTIONS) as Array<keyof typeof STRATEGY_DESCRIPTIONS>).map((type) => (
                            <div 
                                key={type}
                                onClick={() => setStrategyType(type)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    strategyType === type 
                                    ? 'bg-nexus-accent/10 border-nexus-accent' 
                                    : 'bg-nexus-900 border-nexus-700 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-medium ${strategyType === type ? 'text-nexus-accent' : 'text-white'}`}>
                                        {type.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    {strategyType === type && <Check className="w-4 h-4 text-nexus-accent" />}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {STRATEGY_DESCRIPTIONS[type]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleOptimize}
                    disabled={isGenerating}
                    className="w-full py-4 bg-nexus-accent hover:bg-blue-600 disabled:bg-nexus-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Running Simulation...
                        </>
                    ) : (
                        <>
                            Run Optimization
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
            {isGenerating && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-nexus-800/30 border border-nexus-700/50 rounded-2xl border-dashed">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-nexus-accent/30 border-t-nexus-accent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BrainCircuit className="w-6 h-6 text-nexus-accent" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mt-6">Gemini is Thinking...</h3>
                    <p className="text-slate-400 mt-2 text-center max-w-md">
                        Allocating budget of 2048 tokens for deep reasoning. Solving differential equations for {strategyType}...
                    </p>
                </div>
            )}

            {!isGenerating && !result && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-nexus-800/30 border border-nexus-700/50 rounded-2xl border-dashed text-slate-500">
                    <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
                    <p>Configure parameters and run optimization to see results.</p>
                </div>
            )}

            {!isGenerating && result && (
                <div className="space-y-6">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-nexus-800 border border-nexus-700 p-4 rounded-xl">
                            <p className="text-slate-400 text-xs uppercase font-bold">Exp. Return</p>
                            <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                                {(result.expectedReturn * 100).toFixed(2)}%
                            </p>
                        </div>
                        <div className="bg-nexus-800 border border-nexus-700 p-4 rounded-xl">
                            <p className="text-slate-400 text-xs uppercase font-bold">Volatility</p>
                            <p className="text-2xl font-mono font-bold text-amber-400 mt-1">
                                {(result.volatility * 100).toFixed(2)}%
                            </p>
                        </div>
                        <div className="bg-nexus-800 border border-nexus-700 p-4 rounded-xl">
                            <p className="text-slate-400 text-xs uppercase font-bold">Sharpe Ratio</p>
                            <p className="text-2xl font-mono font-bold text-nexus-accent mt-1">
                                {result.sharpeRatio.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Comparison Chart */}
                    <div className="bg-nexus-800 border border-nexus-700 p-6 rounded-2xl">
                        <h3 className="text-white font-semibold mb-4">Current vs. Proposed Allocation</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} unit="%" />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Current" fill="#64748b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Proposed" fill="#3b82f6" radius={[4, 4, 0, 0]} >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={Number(entry.Proposed) > Number(entry.Current) ? '#10b981' : '#3b82f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Rationale */}
                    <div className="bg-nexus-800 border border-nexus-700 p-6 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <BrainCircuit className="w-6 h-6 text-nexus-accent shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-semibold mb-2">AI Rationale</h3>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    {result.rationale}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 items-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <p className="text-xs text-yellow-200/80">
                            This is a simulated optimization. Past performance does not guarantee future results. 
                            Always verify with a licensed financial advisor before trading.
                        </p>
                    </div>

                    <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20">
                        Execute Rebalancing (Simulated)
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default OptimizationTools;
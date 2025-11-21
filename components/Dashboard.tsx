import React from 'react';
import { Portfolio } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface DashboardProps {
  portfolio: Portfolio;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

// Dummy historical data for the area chart
const HISTORY_DATA = [
  { name: 'Mon', value: 142000 },
  { name: 'Tue', value: 143500 },
  { name: 'Wed', value: 142800 },
  { name: 'Thu', value: 144100 },
  { name: 'Fri', value: 145230 },
  { name: 'Sat', value: 145500 },
  { name: 'Sun', value: 146000 },
];

const Dashboard: React.FC<DashboardProps> = ({ portfolio }) => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio Overview</h1>
        <p className="text-slate-400 mt-1">Real-time asset tracking and performance analytics</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-nexus-800 border border-nexus-700 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="relative z-10">
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Total Value
            </p>
            <h2 className="text-4xl font-mono font-bold text-white mt-2">
              ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </span>
              <span className="text-slate-500 ml-2">vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-nexus-800 border border-nexus-700 rounded-2xl p-6 relative overflow-hidden">
           <div className="relative z-10">
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" /> Day Change
            </p>
            <h2 className={`text-4xl font-mono font-bold mt-2 ${portfolio.dayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {portfolio.dayChange >= 0 ? '+' : ''}{portfolio.dayChange.toLocaleString()}
            </h2>
            <div className="mt-4 flex items-center text-sm">
              <span className={`${portfolio.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>
                 {portfolio.dayChangePercent}%
              </span>
              <span className="text-slate-500 ml-2">since open</span>
            </div>
          </div>
        </div>

        <div className="bg-nexus-800 border border-nexus-700 rounded-2xl p-6 relative overflow-hidden">
           <div className="relative z-10">
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Top Performer
            </p>
            <h2 className="text-4xl font-bold text-white mt-2">NVDA</h2>
             <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                +112%
              </span>
              <span className="text-slate-500 ml-2">Total Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Allocation Chart */}
        <div className="lg:col-span-1 bg-nexus-800 border border-nexus-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolio.assets}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="allocation"
                >
                  {portfolio.assets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {portfolio.assets.map((asset, index) => (
              <div key={asset.ticker} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-300">{asset.ticker}</span>
                </div>
                <span className="font-mono text-slate-400">{asset.allocation}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-nexus-800 border border-nexus-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance History</h3>
          <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORY_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    tick={{fill: '#94a3b8'}}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis 
                    stroke="#475569" 
                    tick={{fill: '#94a3b8'}}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Holdings Table */}
      <div className="bg-nexus-800 border border-nexus-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-nexus-700">
          <h3 className="text-lg font-semibold text-white">Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-nexus-900/50 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-right">Qty</th>
                <th className="p-4 font-medium text-right">Value</th>
                <th className="p-4 font-medium text-right">Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-700">
              {portfolio.assets.map((asset) => {
                const value = asset.quantity * asset.currentPrice;
                const profit = (asset.currentPrice - asset.avgBuyPrice) * asset.quantity;
                const profitPercent = ((asset.currentPrice - asset.avgBuyPrice) / asset.avgBuyPrice) * 100;

                return (
                  <tr key={asset.ticker} className="hover:bg-nexus-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{asset.ticker}</span>
                        <span className="text-xs text-slate-500">{asset.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-slate-300 font-mono">${asset.currentPrice.toFixed(2)}</td>
                    <td className="p-4 text-right text-slate-300 font-mono">{asset.quantity}</td>
                    <td className="p-4 text-right text-white font-bold font-mono">${value.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="p-4 text-right">
                      <div className={`font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                      </div>
                      <div className="text-xs text-slate-500">
                         {profit >= 0 ? '+' : ''}${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
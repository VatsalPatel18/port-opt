import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import OptimizationTools from './components/OptimizationTools';
import { INITIAL_PORTFOLIO } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO);

  // Render specific view based on state
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard portfolio={portfolio} />;
      case 'agent':
        return <ChatInterface portfolio={portfolio} />;
      case 'optimize':
      case 'invest': // Reusing component for simplicity in this demo
        return <OptimizationTools portfolio={portfolio} />;
      default:
        return <Dashboard portfolio={portfolio} />;
    }
  };

  return (
    <div className="flex h-screen bg-nexus-900 text-slate-100 font-sans selection:bg-nexus-accent selection:text-white overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-nexus-800 flex items-center justify-between px-6 bg-nexus-900/95 backdrop-blur shrink-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-medium capitalize">{activeView}</h2>
            {activeView === 'optimize' && (
                <span className="text-xs px-2 py-1 rounded-full bg-nexus-accent/20 text-nexus-accent font-mono">
                    Gemini 3.0 Pro
                </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
             {/* API Key Indicator (Simulated) */}
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-nexus-800 border border-nexus-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                <span className="text-xs font-mono text-slate-400">API Connected</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexus-accent to-indigo-600 border border-white/10"></div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
import React from 'react';
import { LayoutDashboard, MessageSquare, LineChart, Wallet, Cpu } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'optimize', icon: LineChart, label: 'Optimizer' },
    { id: 'agent', icon: MessageSquare, label: 'AI Agent' },
    { id: 'invest', icon: Wallet, label: 'Auto-Invest' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-nexus-900 border-r border-nexus-800 flex flex-col h-screen sticky top-0 transition-all duration-300 z-50">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-nexus-800">
        <div className="bg-blue-600 p-2 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden lg:block text-white">
          Nexus<span className="text-nexus-accent">Cap</span>
        </span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
              ${activeView === item.id 
                ? 'bg-nexus-accent/10 text-nexus-accent shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                : 'text-slate-400 hover:bg-nexus-800 hover:text-slate-100'
              }`}
          >
            <item.icon className={`w-6 h-6 ${activeView === item.id ? 'text-nexus-accent' : 'group-hover:text-white'}`} />
            <span className="font-medium hidden lg:block">{item.label}</span>
            {activeView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-nexus-accent hidden lg:block shadow-[0_0_8px_#3b82f6]"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-nexus-800">
        <div className="bg-nexus-800/50 rounded-lg p-3 text-xs text-slate-500 hidden lg:block">
          <p className="font-mono">Status: Online</p>
          <p className="font-mono mt-1">Model: Gemini 2.5</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
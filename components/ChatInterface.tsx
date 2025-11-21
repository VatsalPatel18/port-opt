import React, { useState, useEffect, useRef } from 'react';
import { Message, Portfolio } from '../types';
import { analyzePortfolio, streamChat } from '../services/geminiService';
import { Send, Sparkles, Bot, User, Loader2, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatProps {
  portfolio: Portfolio;
}

const ChatInterface: React.FC<ChatProps> = ({ portfolio }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Nexus. I have access to your portfolio and live market data via Google Search. How can I assist you today?",
      timestamp: Date.now(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        // We differentiate between simple portfolio analysis (using Flash + Data) and general chat
        const result = await analyzePortfolio(portfolio, userMsg.text);
        
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: result.text,
            timestamp: Date.now(),
            groundingUrls: result.sources
        };
        
        setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "I encountered an error while processing your request. Please try again.",
            timestamp: Date.now()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-nexus-900">
      {/* Header */}
      <div className="p-4 border-b border-nexus-800 flex items-center justify-between bg-nexus-900/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
            <div className="bg-nexus-accent/20 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-nexus-accent" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-white">Nexus Agent</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Powered by Gemini 2.5 Flash
                </p>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-slate-700' : 'bg-nexus-accent'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>

            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-nexus-700 text-white rounded-tr-none'
                    : 'bg-nexus-800 border border-nexus-700 text-slate-100 rounded-tl-none'
                }`}
              >
                <ReactMarkdown 
                    components={{
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <span className="font-bold text-nexus-accent" {...props} />,
                    }}
                >
                    {msg.text}
                </ReactMarkdown>
              </div>
              
              {/* Grounding Sources */}
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                      {msg.groundingUrls.map((source, idx) => (
                          <a 
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs bg-nexus-900 border border-nexus-700 text-nexus-accent hover:text-white px-2 py-1 rounded transition-colors"
                          >
                              <LinkIcon className="w-3 h-3" />
                              {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                          </a>
                      ))}
                  </div>
              )}
              
              <span className="text-xs text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-nexus-accent flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col items-start max-w-[80%]">
                     <div className="bg-nexus-800 border border-nexus-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-nexus-accent animate-spin" />
                        <span className="text-sm text-slate-400">Nexus is analyzing...</span>
                     </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-nexus-900 border-t border-nexus-800">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your portfolio, specific stocks, or market trends..."
            className="w-full bg-nexus-800 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-nexus-accent border border-nexus-700 resize-none h-[60px] custom-scrollbar"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-nexus-accent rounded-lg text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-nexus-accent transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">
            Nexus can make mistakes. Please double-check important financial info.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
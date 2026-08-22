import React, { useRef, useEffect } from 'react';
import { useAgent } from '../../context/AgentContext';
import { ChatMessage } from './ChatMessage';
import {
  Sparkles, X, Send, RotateCcw, Zap
} from 'lucide-react';

export const SidekickAgent = () => {
  const {
    isOpen, setIsOpen,
    isThinking,
    isStreaming,
    messages,
    inputQuery, setInputQuery,
    sendMessage,
    clearChat,
  } = useAgent();

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    { label: '📊 Portfolio Health', query: 'Analyze my portfolio health and sector exposure' },
    { label: '🚀 Apply IPO', query: 'Apply for Pine Labs IPO at cut-off price' },
    { label: '💰 Start SIP', query: 'Start ₹2500 SIP in Parag Parikh Flexi Cap Fund' },
    { label: '📈 Buy IOC', query: 'Buy 20 shares of IOC-EQ at market price' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group"
        title="Open mynt Sidekick"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-[9px] font-black text-amber-900 rounded-full flex items-center justify-center animate-bounce">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[380px] h-[640px] flex flex-col rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200 overflow-hidden bg-white">
      {/* Header */}
      <div className="gradient-zebu px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-400 to-cyan-300 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#05234e] rounded-full" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight flex items-center gap-1.5">
              mynt Sidekick
              <span className="text-[9px] bg-white/20 text-cyan-200 px-1.5 py-0.5 rounded-full font-bold tracking-wide">AI</span>
            </div>
            <div className="text-cyan-300/80 text-[10px]">by Zebu • Always On</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearChat}
            title="Clear chat"
            className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            title="Close"
            className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-b border-slate-100 shrink-0 scrollbar-none">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(p.query)}
            className="whitespace-nowrap text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-600 transition-all flex-shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white"
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSuggestionClick={(sug) => sendMessage(sug)}
          />
        ))}

        {isThinking && !isStreaming && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Zap className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>AI is thinking</span>
                <span className="flex gap-0.5 ml-1">
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="px-3 py-3 border-t border-slate-100 bg-slate-50/80 shrink-0">
        {isStreaming && (
          <div className="px-1 pb-1.5 text-[10px] text-blue-600 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            AI is generating response…
          </div>
        )}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl pl-4 pr-1.5 py-1.5 shadow-sm focus-within:border-blue-500 focus-within:shadow-blue-100 focus-within:shadow-md transition-all">
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Sidekick to trade, invest, or analyze…"
            disabled={isStreaming}
            className="flex-1 text-xs text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none font-medium disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!inputQuery.trim() || isThinking || isStreaming}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 active:scale-90 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-center text-[9px] text-slate-400 mt-1.5">
          Powered by <strong className="font-semibold text-blue-600">Zebu AI</strong> • Demo Mode – Not financial advice
        </p>
      </div>
    </div>
  );
};

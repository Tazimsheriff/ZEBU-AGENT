import React, { useRef, useEffect } from 'react';
import { useAgent } from '../../context/AgentContext';
import { ChatMessage } from './ChatMessage';
import {
  X, Minus, Maximize2, Send, Trash2, Sparkles, Bot, MessageCircle,
  ArrowRight
} from 'lucide-react';

export const SidekickAgent = () => {
  const {
    isOpen, setIsOpen, isThinking, messages,
    inputQuery, setInputQuery, sendMessage, clearChat,
  } = useAgent();

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  // Floating FAB button when closed
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 transition-all group"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[420px] h-[calc(100vh-100px)] max-h-[720px] flex flex-col sidekick-glass rounded-3xl shadow-2xl shadow-blue-900/15 border border-slate-200/60 overflow-hidden animate-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#05234e] to-[#0a3a7a] text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight leading-none">mynt Sidekick</h3>
            <p className="text-[10px] text-cyan-200/80 font-medium">Zebu AI Trading Copilot</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5 text-white/70" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Minimize"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Context Bar */}
      <div className="px-4 py-1.5 bg-blue-50/80 border-b border-blue-100 flex items-center gap-2 text-[10px] text-blue-700 font-medium shrink-0">
        <Bot className="w-3 h-3" />
        <span>Connected to your live portfolio, mutual funds & IPO desk</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onSuggestionClick={handleSuggestionClick} />
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="px-3 py-3 bg-white border-t border-slate-200 shrink-0"
      >
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <MessageCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about stocks, SIPs, IPOs, or portfolio..."
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-1.5"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={isThinking || !inputQuery.trim()}
            className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-center text-[9px] text-slate-400 mt-1.5">
          Powered by Zebu AI • Vercel SDK Pattern • Shopify Sidekick Inspired
        </p>
      </form>
    </div>
  );
};

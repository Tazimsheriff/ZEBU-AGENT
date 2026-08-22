import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { TradeActionCard } from './ToolCards/TradeActionCard';
import { SipSetupCard } from './ToolCards/SipSetupCard';
import { PortfolioHealthCard } from './ToolCards/PortfolioHealthCard';
import { IpoBidCard } from './ToolCards/IpoBidCard';
import { KycStatusCard } from './ToolCards/KycStatusCard';

export const ChatMessage = ({ message, onSuggestionClick }) => {
  const isAssistant = message.role === 'assistant';
  const isStreaming = message.streaming;

  // Strip action code block from visible output
  const cleanContent = (message.content || '').replace(/```action[\s\S]*?```/g, '').trim();

  const renderToolCard = (tool, idx) => {
    switch (tool.type) {
      case 'TRADE_ACTION_CARD':
        return <TradeActionCard key={idx} data={tool.data} />;
      case 'SIP_SETUP_CARD':
        return <SipSetupCard key={idx} data={tool.data} />;
      case 'PORTFOLIO_HEALTH_CARD':
        return <PortfolioHealthCard key={idx} data={tool.data} />;
      case 'IPO_BID_CARD':
        return <IpoBidCard key={idx} data={tool.data} />;
      case 'KYC_STATUS_CARD':
        return <KycStatusCard key={idx} data={tool.data} />;
      default:
        return null;
    }
  };

  // Helper to format basic bold and bullet lists in message content
  const formatContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      let formatted = line;
      // Replace **text** with bold
      const parts = [];
      let lastIndex = 0;
      const regex = /\*\*(.*?)\*\*/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[1]}</strong>);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
      return (
        <p key={lIdx} className={`${isBullet ? 'pl-3 relative before:content-["•"] before:absolute before:left-0 before:text-blue-500' : ''} ${line === '' ? 'h-2' : 'my-0.5'}`}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 text-xs leading-relaxed ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[88%] space-y-2`}>
        <div
          className={`p-3.5 rounded-2xl ${
            isAssistant
              ? 'bg-slate-50 border border-slate-200/80 text-slate-800 shadow-sm'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md rounded-tr-sm'
          }`}
        >
          {formatContent(cleanContent)}
          {isStreaming && (
            <span className="inline-block w-0.5 h-3.5 bg-blue-600 rounded-full ml-0.5 animate-pulse align-middle" />
          )}
        </div>

        {/* Generative Tool Output Cards */}
        {message.tools && message.tools.length > 0 && (
          <div className="space-y-2">
            {message.tools.map((tool, idx) => renderToolCard(tool, idx))}
          </div>
        )}

        {/* Dynamic Suggestions below message */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestions.map((sug, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => onSuggestionClick(sug)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all font-medium flex items-center gap-1 shadow-2xs"
              >
                <span>{sug}</span>
              </button>
            ))}
          </div>
        )}

        <div className={`text-[10px] text-slate-400 font-mono px-1 ${isAssistant ? 'text-left' : 'text-right'}`}>
          {message.timestamp}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
          TM
        </div>
      )}
    </div>
  );
};

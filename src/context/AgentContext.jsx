import React, { createContext, useContext, useState, useRef } from 'react';
import { useTrading } from './TradingContext';
import { streamAgentResponse, generateSuggestions } from '../utils/aiAgentEngine';

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const {
    activeTab,
    portfolioMetrics,
    userProfile,
    searchableInstruments,
    mutualFunds,
    ipos,
    addNotification,
  } = useTrading();

  // Sidekick UI state
  const [isOpen, setIsOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(false); // simple abort flag

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome-1',
      role: 'assistant',
      content: `Hi! 👋 I'm **mynt Sidekick**, your AI trading & investment copilot by Zebu.\n\nI'm now powered by a **real AI model** via OpenRouter. I can help you:\n- 📊 Analyze your live portfolio\n- 💰 Set up SIPs in top Mutual Funds\n- 🚀 Apply for IPOs with one click\n- 📈 Place stock orders instantly\n\nWhat would you like to do today?`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      tools: [
        {
          type: 'PORTFOLIO_HEALTH_CARD',
          data: {
            metrics: { totalInvested: 0, totalCurrent: 0, totalPnl: 0, totalPnlPercent: 0, holdingsCount: 0, positiveHoldingsCount: 0, negativeHoldingsCount: 0, openPositionsCount: 0, totalMtm: 0, todayPnl: 0, todayPnlPercent: 0 },
            riskScore: 74,
            riskLabel: 'Moderate Growth',
            recommendation: 'Connect your Zebu account to see live portfolio analytics. In demo mode, all data is simulated.',
            sectorBreakdown: [
              { sector: 'Energy & Oil', percent: 28, color: '#1652f0' },
              { sector: 'Banking & Financials', percent: 24, color: '#00b4d8' },
              { sector: 'Information Tech', percent: 18, color: '#10b981' },
              { sector: 'Metals & Commodities', percent: 16, color: '#f59e0b' },
              { sector: 'Mutual Funds (Direct)', percent: 14, color: '#8b5cf6' },
            ],
          },
        },
      ],
      suggestions: [
        'Apply for Pine Labs IPO',
        'Start ₹2,500/mo SIP in Parag Parikh Flexi Cap',
        'Buy 15 shares of IOC-EQ at market',
        'Analyze my portfolio risk & exposure',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');

  // Helper: get clean conversation history (text only, no tools)
  const getHistory = () =>
    messages
      .filter(m => m.id !== 'msg-welcome-1')
      .map(m => ({ role: m.role, content: m.content }));

  const sendMessage = async (userText) => {
    const textToSend = (userText || inputQuery).trim();
    if (!textToSend || isThinking || isStreaming) return;

    setInputQuery('');
    abortRef.current = false;

    // Add user message immediately
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);

    // Show thinking indicator
    setIsThinking(true);

    // Placeholder for streaming assistant message
    const assistantId = `assistant-${Date.now()}`;
    let streamedText = '';
    let toolCard = null;
    let streamStarted = false;

    await streamAgentResponse({
      userInput: textToSend,
      conversationHistory: getHistory(),
      activeTab,
      portfolioContext: portfolioMetrics,
      userProfile,
      allInstruments: searchableInstruments,
      allMutualFunds: mutualFunds,
      allIpos: ipos,

      onChunk: (chunk) => {
        if (abortRef.current) return;

        if (!streamStarted) {
          streamStarted = true;
          setIsThinking(false);
          setIsStreaming(true);
          // Insert assistant placeholder
          setMessages(prev => [
            ...prev,
            {
              id: assistantId,
              role: 'assistant',
              content: '',
              timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              tools: [],
              suggestions: [],
              streaming: true,
            },
          ]);
        }

        streamedText += chunk;

        // Update the streaming message content
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: streamedText, streaming: true }
              : m
          )
        );
      },

      onTool: (card) => {
        if (abortRef.current) return;
        toolCard = card;
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, tools: [card] }
              : m
          )
        );
      },

      onDone: () => {
        if (abortRef.current) return;
        const suggestions = generateSuggestions(textToSend, streamedText);
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? {
                  ...m,
                  content: streamedText,
                  tools: toolCard ? [toolCard] : [],
                  suggestions,
                  streaming: false,
                }
              : m
          )
        );
        setIsThinking(false);
        setIsStreaming(false);
      },

      onError: (error) => {
        console.error('Sidekick error:', error);
        setIsThinking(false);
        setIsStreaming(false);

        // Show error in chat
        if (!streamStarted) {
          setMessages(prev => [
            ...prev,
            {
              id: assistantId,
              role: 'assistant',
              content: `⚠️ **Connection issue**: ${error.message}\n\nPlease check your OpenRouter API key or try again in a moment.`,
              timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              tools: [],
              suggestions: ['Try again', 'Check API key configuration'],
              streaming: false,
            },
          ]);
        } else {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, streaming: false }
                : m
            )
          );
        }
      },
    });
  };

  const clearChat = () => {
    abortRef.current = true;
    setIsThinking(false);
    setIsStreaming(false);
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared! I'm ready to help. What would you like to explore — stocks, mutual funds, IPOs, or portfolio analysis?`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Apply for Pine Labs IPO',
          'Explore top ELSS Tax Saver funds',
          'Analyze my portfolio',
          'Buy 10 shares of HDFCBANK-EQ',
        ],
      },
    ]);
  };

  return (
    <AgentContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isThinking,
        isStreaming,
        messages,
        inputQuery,
        setInputQuery,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) throw new Error('useAgent must be used within an AgentProvider');
  return context;
};

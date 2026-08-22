import React, { createContext, useContext, useState } from 'react';
import { useTrading } from './TradingContext';
import { generateAgentResponse } from '../utils/aiAgentEngine';

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const {
    activeTab,
    portfolioMetrics,
    userProfile,
    searchableInstruments,
    mutualFunds,
    ipos,
    placeOrder,
    startSip,
    applyIpo,
    addNotification,
  } = useTrading();

  // Sidekick drawer UI state (closed as floating FAB on mobile, open panel on desktop)
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 840;
    }
    return false;
  });
  const [isDocked, setIsDocked] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Initial welcome message with interactive tool card
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome-1',
      role: 'assistant',
      content: `Hi Tazim! 👋 I'm **Sidekick**, your personal AI copilot on **Zebu mynt**.\n\nI monitor your holdings, scout top mutual funds, and execute trades seamlessly with generative order slips. What are we planning today?`,
      timestamp: '10:00 AM',
      tools: [
        {
          type: 'PORTFOLIO_HEALTH_CARD',
          data: {
            metrics: portfolioMetrics,
            riskScore: 74,
            riskLabel: 'Moderate Growth',
            recommendation: 'Market is sideways. Excellent opportunity to accumulate Flexi-cap SIPs or apply for upcoming IPOs.',
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
        'Buy 15 shares of IOC-EQ',
        'Review my portfolio risk',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');

  // Send message handler
  const sendMessage = async (userText) => {
    const textToSend = userText || inputQuery;
    if (!textToSend.trim() || isThinking) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await generateAgentResponse({
        userInput: textToSend,
        activeTab,
        portfolioContext: portfolioMetrics,
        userProfile,
        allInstruments: searchableInstruments,
        allMutualFunds: mutualFunds,
        allIpos: ipos,
        conversationHistory: updatedMessages,
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        tools: response.tools,
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Agent response error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I ran into an error processing that request. Please try again.',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'assistant',
        content: `Chat session refreshed. How can I assist you with your Zebu portfolio or trades today?`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Apply for Pine Labs IPO',
          'Explore top ELSS Tax Saver funds',
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
        isDocked,
        setIsDocked,
        isThinking,
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
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};

/**
 * Zebu mynt Sidekick — Real AI Engine powered by OpenRouter
 * Streaming responses via fetch + ReadableStream (Vercel AI SDK pattern)
 * Model: google/gemini-2.0-flash-001 via OpenRouter
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

// ─────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────
const buildSystemPrompt = ({ portfolioContext, userProfile }) => `
You are **mynt Sidekick**, an elite AI trading and investment copilot built by Zebu e-Trade — India's leading SEBI-regulated stockbroker. You are embedded inside the **mynt by Zebu** platform (mynt.zebuetrade.com), helping users invest in stocks, mutual funds, IPOs, and bonds.

## Your Role
You are modeled after Shopify's Sidekick — context-aware, proactive, actionable, and conversational. You speak in a friendly but professional tone. You use Indian financial terminology (SIP, Lumpsum, LTP, NAV, CAGR, AUM, F&O, ELSS, CNC/MIS, E-DIS, etc.).

## User Profile
- **Name**: ${userProfile.name} (Client Code: ${userProfile.clientCode})
- **KYC Status**: ${userProfile.kycStatus}
- **Risk Profile**: ${userProfile.riskCategory}
- **Mode**: ${userProfile.demoMode ? 'Demo / Paper Trading' : 'Live Trading'}

## Live Portfolio Snapshot
- **Total Invested**: ₹${portfolioContext.totalInvested?.toLocaleString('en-IN') || 'N/A'}
- **Current Value**: ₹${portfolioContext.totalCurrent?.toLocaleString('en-IN') || 'N/A'}
- **Overall P&L**: ${portfolioContext.totalPnl >= 0 ? '+' : ''}₹${portfolioContext.totalPnl?.toLocaleString('en-IN') || '0'} (${portfolioContext.totalPnlPercent?.toFixed(2) || '0'}%)
- **Holdings**: ${portfolioContext.holdingsCount || 0} stocks (${portfolioContext.positiveHoldingsCount || 0} in profit, ${portfolioContext.negativeHoldingsCount || 0} in loss)
- **Open Positions**: ${portfolioContext.openPositionsCount || 0} | MTM: ₹${portfolioContext.totalMtm?.toFixed(2) || '0'}

## Active Platform Sections
- **Stocks** (NSE/BSE EQ, F&O, ETF)
- **Mutual Funds** (Direct Plans, SIP, Lumpsum, ELSS)
- **IPOs** (Main Stream + SME, ASBA via UPI)
- **Bonds** (G-Secs, SGBs, Corporate Bonds)

## What you CAN do
1. Analyze user portfolio health, sector exposure, and diversification
2. Recommend mutual funds (by risk profile, goals, tax-saving needs)
3. Explain IPO details: GMP, subscription, allotment probability
4. Help place stock buy/sell orders (ask user to confirm via the action card)
5. Set up SIP mandates and calculate wealth projections
6. Provide market commentary, fund comparison, and sector analysis
7. Assist with onboarding/KYC questions
8. Explain financial concepts (CAGR, NAV, F&O Greeks, margin, PE ratio, etc.)

## Response Guidelines
- **Always respond in markdown** with proper formatting
- Use ₹ for all rupee amounts in Indian number format (lakhs, crores)
- Keep responses concise and actionable — max 4-5 lines of text then show data
- After your text response, on a NEW LINE, output a JSON action block if a tool card should be shown:

\`\`\`action
{
  "type": "TRADE_ACTION_CARD" | "SIP_SETUP_CARD" | "IPO_BID_CARD" | "PORTFOLIO_HEALTH_CARD" | "KYC_STATUS_CARD" | "NONE",
  "trigger": "brief reason why this card is shown"
}
\`\`\`

- If no tool card is needed, output: \`\`\`action\n{"type":"NONE"}\n\`\`\`
- **NEVER give actual financial advice** — always add: *This is for informational purposes only, not a recommendation.*
- SEBI disclaimer must appear when discussing specific stocks/funds: *Investments are subject to market risk.*

## Important
- You are in DEMO mode — all trades, SIPs, and IPO applications are simulated paper trades
- Always be helpful, never refuse to engage with financial topics in a demo context
`;

// ─────────────────────────────────────────────
// TOOL CARD RESOLVER
// ─────────────────────────────────────────────
const resolveToolCard = (actionType, userInput, context) => {
  const { allInstruments, allMutualFunds, allIpos, portfolioContext, userProfile } = context;
  const q = userInput.toLowerCase();

  switch (actionType) {
    case 'TRADE_ACTION_CARD': {
      const matched = allInstruments.find(s =>
        q.includes(s.symbol.toLowerCase().replace('-eq', '')) ||
        q.includes(s.name.toLowerCase().split(' ')[0])
      ) || allInstruments[0];
      const qtyMatch = q.match(/(\d+)\s*(share|qty|stock)?/i);
      const qty = qtyMatch ? Math.min(parseInt(qtyMatch[1]), 500) : 10;
      return {
        type: 'TRADE_ACTION_CARD',
        data: {
          stock: matched,
          type: q.includes('sell') ? 'SELL' : 'BUY',
          qty,
          price: matched.ltp,
          product: 'CNC',
          orderType: 'MARKET',
        },
      };
    }

    case 'SIP_SETUP_CARD': {
      let matched = allMutualFunds.find(f =>
        q.includes(f.name.toLowerCase().split(' ')[0]) ||
        q.includes(f.id)
      );
      if (!matched && (q.includes('elss') || q.includes('tax') || q.includes('80c'))) {
        matched = allMutualFunds.find(f => f.taxSaver);
      }
      if (!matched) matched = allMutualFunds[0];
      const amtMatch = q.match(/₹?\s*(\d{3,6})/);
      const amt = amtMatch ? parseInt(amtMatch[1]) : matched.minSip || 2500;
      return {
        type: 'SIP_SETUP_CARD',
        data: { fund: matched, defaultAmount: amt, defaultDate: '10th of every month' },
      };
    }

    case 'IPO_BID_CARD': {
      const matched = allIpos.find(i =>
        q.includes(i.symbol.toLowerCase()) ||
        q.includes(i.name.toLowerCase().split(' ')[0])
      ) || allIpos.find(i => i.status === 'Open') || allIpos[0];
      return {
        type: 'IPO_BID_CARD',
        data: { ipo: matched, defaultLots: 1, upiId: `${userProfile.name.toLowerCase().replace(' ', '')}@okhdfcbank` },
      };
    }

    case 'PORTFOLIO_HEALTH_CARD': {
      return {
        type: 'PORTFOLIO_HEALTH_CARD',
        data: {
          metrics: portfolioContext,
          riskScore: 74,
          riskLabel: userProfile.riskCategory,
          recommendation: 'Review your sector concentration. Consider adding Flexi-cap or ELSS Mutual Funds for diversification and tax efficiency.',
          sectorBreakdown: [
            { sector: 'Energy & Oil', percent: 28, color: '#1652f0' },
            { sector: 'Banking & Financials', percent: 24, color: '#00b4d8' },
            { sector: 'Information Tech', percent: 18, color: '#10b981' },
            { sector: 'Metals & Commodities', percent: 16, color: '#f59e0b' },
            { sector: 'Mutual Funds (Direct)', percent: 14, color: '#8b5cf6' },
          ],
        },
      };
    }

    case 'KYC_STATUS_CARD': {
      return {
        type: 'KYC_STATUS_CARD',
        data: {
          userProfile,
          steps: [
            { id: 1, name: 'PAN Card Verification', status: 'COMPLETED', date: 'Verified' },
            { id: 2, name: 'DigiLocker Aadhaar e-KYC', status: 'COMPLETED', date: 'Verified' },
            { id: 3, name: 'Bank Account & Penny Drop', status: 'COMPLETED', date: 'HDFC Bank ****4902' },
            { id: 4, name: 'Risk Profiler & Segments', status: 'ACTIVE', date: userProfile.riskCategory },
          ],
        },
      };
    }

    default:
      return null;
  }
};

// ─────────────────────────────────────────────
// STREAMING GENERATOR (Vercel AI SDK Pattern)
// ─────────────────────────────────────────────
export const streamAgentResponse = async ({
  userInput,
  conversationHistory = [],
  activeTab,
  portfolioContext,
  userProfile,
  allInstruments,
  allMutualFunds,
  allIpos,
  onChunk,      // (text: string) => void — called for each streamed chunk
  onTool,       // (toolCard: object) => void — called once when action block parsed
  onDone,       // () => void — called when stream is complete
  onError,      // (error: Error) => void
}) => {
  const systemPrompt = buildSystemPrompt({ portfolioContext, userProfile });

  // Build messages array (keep last 10 turns for context)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10).map(m => ({
      role: m.role,
      content: m.content || '',
    })),
    { role: 'user', content: userInput },
  ];

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mynt.zebuetrade.com',
        'X-Title': 'Zebu mynt Sidekick AI Agent',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let fullText = '';
    let actionBlockBuffer = '';
    let inActionBlock = false;
    let toolResolved = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.trim());

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') {
          // Parse action block from full accumulated text
          if (!toolResolved) {
            const actionMatch = fullText.match(/```action\s*([\s\S]*?)```/);
            if (actionMatch) {
              try {
                const parsed = JSON.parse(actionMatch[1].trim());
                if (parsed.type && parsed.type !== 'NONE') {
                  const toolCard = resolveToolCard(parsed.type, userInput, {
                    allInstruments,
                    allMutualFunds,
                    allIpos,
                    portfolioContext,
                    userProfile,
                  });
                  if (toolCard) {
                    toolResolved = true;
                    onTool?.(toolCard);
                  }
                }
              } catch (e) {
                // JSON parse failed — ignore
              }
            }
          }
          onDone?.();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content || '';
          if (!delta) continue;

          fullText += delta;

          // Stream visible text (excluding action block)
          // Once we detect the start of ```action, stop streaming text
          const actionStartIdx = fullText.indexOf('```action');
          const visibleText = actionStartIdx >= 0 ? fullText.slice(0, actionStartIdx) : fullText;

          // Only stream the new visible delta
          if (actionStartIdx < 0) {
            onChunk?.(delta);
          } else if (!toolResolved) {
            // Try parse action block as it arrives
            const actionMatch = fullText.match(/```action\s*([\s\S]*?)```/);
            if (actionMatch) {
              try {
                const parsedAction = JSON.parse(actionMatch[1].trim());
                if (parsedAction.type && parsedAction.type !== 'NONE') {
                  const toolCard = resolveToolCard(parsedAction.type, userInput, {
                    allInstruments,
                    allMutualFunds,
                    allIpos,
                    portfolioContext,
                    userProfile,
                  });
                  if (toolCard) {
                    toolResolved = true;
                    onTool?.(toolCard);
                  }
                } else {
                  toolResolved = true; // NONE
                }
              } catch (e) {
                // still accumulating
              }
            }
          }
        } catch (e) {
          // skip malformed SSE line
        }
      }
    }

    onDone?.();
  } catch (error) {
    console.error('streamAgentResponse error:', error);
    onError?.(error);
  }
};

// ─────────────────────────────────────────────
// SUGGESTION GENERATOR (quick follow-ups)
// ─────────────────────────────────────────────
export const generateSuggestions = (userInput, responseText) => {
  const q = (userInput + ' ' + responseText).toLowerCase();

  if (q.includes('ipo') || q.includes('pine') || q.includes('groww')) {
    return [
      'Compare Pine Labs vs Groww IPO returns',
      'What is the GMP for today\'s IPOs?',
      'How does ASBA / UPI mandate work?',
    ];
  }
  if (q.includes('sip') || q.includes('mutual fund') || q.includes('mf')) {
    return [
      'Calculate 10-year SIP projection at ₹5,000/mo',
      'Show me ELSS funds for Section 80C tax saving',
      'Difference between Direct and Regular plan?',
    ];
  }
  if (q.includes('buy') || q.includes('sell') || q.includes('trade') || q.includes('stock')) {
    return [
      'What is the support level for this stock?',
      'Check my available margin balance',
      'Should I do SIP in large-cap ETFs instead?',
    ];
  }
  if (q.includes('portfolio') || q.includes('holding') || q.includes('health')) {
    return [
      'Which stocks should I book profit on now?',
      'Recommend 3 funds to rebalance my portfolio',
      'Show tax loss harvesting opportunities',
    ];
  }

  return [
    'Start ₹2,500/mo SIP in Parag Parikh Flexi Cap',
    'Apply for Pine Labs IPO at cut-off price',
    'Analyze my current portfolio sector exposure',
  ];
};

/**
 * AI Agent Engine for Zebu mynt Trading Platform
 * Powered by OpenRouter LLM API with structured tool-card generation.
 * Inspired by Shopify Sidekick & Vercel AI SDK generative UI patterns.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const getApiKey = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('openrouter_api_key');
    if (stored && stored.trim()) return stored.trim();
  }
  return import.meta.env.VITE_OPENROUTER_API_KEY || '';
};

export const setApiKey = (key) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (key) {
      window.localStorage.setItem('openrouter_api_key', key);
    } else {
      window.localStorage.removeItem('openrouter_api_key');
    }
  }
};
const MODEL_ID = 'google/gemini-2.5-flash';

const SYSTEM_PROMPT = `You are "mynt Sidekick", an expert AI trading copilot built into the Zebu mynt trading & mutual funds platform. You assist Indian retail investors with:
- Stock trading (NSE/BSE equities)
- Mutual Fund investments (SIP & Lumpsum via Direct Plans)
- IPO applications (Main Stream & SME IPOs via UPI ASBA)
- Portfolio analysis, risk profiling, and sector exposure diagnostics
- User onboarding, KYC verification, and account setup

## PERSONALITY
- Friendly, confident, and data-driven. Use Indian financial terminology naturally (Nifty, Sensex, SEBI, SIP, NAV, CAGR, ELSS, Section 80C, etc.)
- Always quote amounts in INR (₹). Use Lakhs (L) and Crores (Cr) notation.
- Be concise but informative. Use bold (**text**) for key numbers and fund/stock names.
- Never give guaranteed returns advice. Always add appropriate risk disclaimers when recommending.

## TOOL CARDS (CRITICAL)
You can trigger interactive UI cards by including a JSON block in your response. When the user's query maps to an actionable task, you MUST include the appropriate tool card.

To include a tool card, add this exact pattern at the END of your text response:

\`\`\`tool
{ "type": "TOOL_TYPE", "data": { ... } }
\`\`\`

### Available Tool Types:

1. **TRADE_ACTION_CARD** — When user wants to buy/sell a stock
\`\`\`tool
{ "type": "TRADE_ACTION_CARD", "data": { "stock": { "symbol": "SYMBOL-EQ", "name": "Full Name", "ltp": 123.45, "change": 1.5 }, "type": "BUY", "qty": 10, "price": 123.45, "product": "CNC", "orderType": "MARKET" } }
\`\`\`

2. **SIP_SETUP_CARD** — When user wants to invest in a mutual fund or start a SIP
\`\`\`tool
{ "type": "SIP_SETUP_CARD", "data": { "fund": { "id": "fund_id", "name": "Fund Name", "nav": 78.42, "cagr3y": 20.4, "aum": "₹68,450 Cr", "category": "Flexi Cap", "risk": "Very High", "rating": 5, "minSip": 500, "taxSaver": false, "amc": "AMC Name", "expenseRatio": "0.62%" }, "defaultAmount": 2500, "defaultDate": "10th of every month" } }
\`\`\`

3. **IPO_BID_CARD** — When user wants to apply for an IPO
\`\`\`tool
{ "type": "IPO_BID_CARD", "data": { "ipo": { "id": "ipo_id", "name": "Company Name", "symbol": "SYMBOL", "lotSize": 67, "minQuantity": 67, "priceRange": "₹210 - ₹221", "cutOffPrice": 221, "issueSize": "9.79 Cr", "gmp": "₹48 (21.7%)", "subscription": { "retail": "3.45x", "total": "6.82x" }, "closeDate": "11th Nov 2026 17:00" }, "defaultLots": 1, "upiId": "user@okhdfcbank" } }
\`\`\`

4. **PORTFOLIO_HEALTH_CARD** — When user asks about portfolio analysis, risk, or sector exposure
\`\`\`tool
{ "type": "PORTFOLIO_HEALTH_CARD", "data": { "metrics": "USE_CONTEXT", "riskScore": 74, "riskLabel": "Moderate Growth", "recommendation": "Your specific recommendation here", "sectorBreakdown": [{ "sector": "Name", "percent": 28, "color": "#1652f0" }] } }
\`\`\`

5. **KYC_STATUS_CARD** — When user asks about onboarding, KYC, or account setup
\`\`\`tool
{ "type": "KYC_STATUS_CARD", "data": { "userProfile": "USE_CONTEXT", "steps": [{ "id": 1, "name": "PAN Card Verification", "status": "COMPLETED", "date": "Verified" }] } }
\`\`\`

## AVAILABLE DATA CONTEXT
The user's live portfolio context will be provided in each message. Use it to give accurate, personalized advice.

## SUGGESTIONS
After your response, also include 2-4 follow-up suggestions the user might want to ask. Format them as:
\`\`\`suggestions
["suggestion 1", "suggestion 2", "suggestion 3"]
\`\`\`

## RULES
- Always try to include a tool card when the user's intent is actionable (trading, investing, IPO, portfolio review, onboarding).
- For general questions (market outlook, explanations), respond with text only.
- Use the exact stock symbols from the user's holdings when referencing them.
- Quote real-world Indian mutual fund names and accurate category classifications.
- For amounts, always use Indian numbering (Lakhs, Crores).`;

/**
 * Build the context message with user's portfolio data
 */
const buildContextMessage = ({ portfolioContext, userProfile, allInstruments, allMutualFunds, allIpos, activeTab }) => {
  const holdingsSummary = allInstruments
    .filter(i => i.type === 'STOCK' || i.type === 'ETF')
    .slice(0, 10)
    .map(s => `${s.symbol}: LTP ₹${s.ltp} (${s.change >= 0 ? '+' : ''}${s.change}%)`)
    .join(', ');

  const mfSummary = allMutualFunds
    .slice(0, 4)
    .map(f => `${f.name} (${f.category}): NAV ₹${f.nav}, 3Y CAGR ${f.cagr3y}%`)
    .join('\n');

  const ipoSummary = allIpos
    .map(i => `${i.name} [${i.symbol}]: ${i.status}, Price ${i.priceRange}, Lot Size ${i.lotSize}, GMP ${i.gmp}, Sub: Retail ${i.subscription.retail}`)
    .join('\n');

  return `[LIVE PORTFOLIO CONTEXT]
User: ${userProfile.name} (${userProfile.clientCode})
KYC: ${userProfile.kycStatus} | Risk: ${userProfile.riskCategory}
Active Tab: ${activeTab}

Portfolio Summary:
- Total Invested: ₹${portfolioContext.totalInvested?.toLocaleString('en-IN') || '0'}
- Current Value: ₹${portfolioContext.totalCurrent?.toLocaleString('en-IN') || '0'}
- Total P&L: ₹${portfolioContext.totalPnl?.toLocaleString('en-IN') || '0'} (${portfolioContext.totalPnlPercent?.toFixed(2) || '0'}%)
- Holdings: ${portfolioContext.holdingsCount || 0} stocks (${portfolioContext.positiveHoldingsCount || 0} positive, ${portfolioContext.negativeHoldingsCount || 0} negative)
- Today P&L: ₹${portfolioContext.todayPnl?.toLocaleString('en-IN') || '0'}

Watchlist/Holdings: ${holdingsSummary}

Available Mutual Funds:
${mfSummary}

Live IPOs:
${ipoSummary}`;
};

/**
 * Parse tool cards and suggestions from LLM response text
 */
const parseResponse = (responseText, portfolioContext, userProfile) => {
  let text = responseText;
  let tools = [];
  let suggestions = [];

  // Extract tool card JSON blocks
  const toolRegex = /```tool\s*([\s\S]*?)```/g;
  let toolMatch;
  while ((toolMatch = toolRegex.exec(text)) !== null) {
    try {
      const toolData = JSON.parse(toolMatch[1].trim());

      // Replace context placeholders with real data
      if (toolData.data) {
        if (toolData.data.metrics === 'USE_CONTEXT') {
          toolData.data.metrics = portfolioContext;
        }
        if (toolData.data.userProfile === 'USE_CONTEXT') {
          toolData.data.userProfile = userProfile;
        }
      }

      tools.push(toolData);
    } catch (e) {
      console.warn('Failed to parse tool card JSON:', e, toolMatch[1]);
    }
  }
  // Remove tool blocks from text
  text = text.replace(/```tool\s*[\s\S]*?```/g, '').trim();

  // Extract suggestions
  const sugRegex = /```suggestions\s*([\s\S]*?)```/g;
  const sugMatch = sugRegex.exec(text);
  if (sugMatch) {
    try {
      suggestions = JSON.parse(sugMatch[1].trim());
    } catch (e) {
      console.warn('Failed to parse suggestions:', e);
    }
  }
  text = text.replace(/```suggestions\s*[\s\S]*?```/g, '').trim();

  return { text, tools, suggestions };
};

/**
 * Main agent response generator — calls OpenRouter LLM
 */
export const generateAgentResponse = async ({
  userInput,
  activeTab,
  portfolioContext,
  userProfile,
  allInstruments,
  allMutualFunds,
  allIpos,
  conversationHistory = [],
}) => {
  // Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'system',
      content: buildContextMessage({ portfolioContext, userProfile, allInstruments, allMutualFunds, allIpos, activeTab }),
    },
  ];

  // Add recent conversation history (last 10 messages for context window)
  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({
        role: msg.role,
        content: msg.content || '',
      });
    }
  }

  // Add the current user message
  messages.push({ role: 'user', content: userInput });

  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return fallbackResponse(userInput, portfolioContext, userProfile, allInstruments, allMutualFunds, allIpos);
    }
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://zebu.in',
        'X-Title': 'Zebu mynt Trading Agent',
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      // Fallback to local engine
      return fallbackResponse(userInput, portfolioContext, userProfile, allInstruments, allMutualFunds, allIpos);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';

    if (!rawContent.trim()) {
      return fallbackResponse(userInput, portfolioContext, userProfile, allInstruments, allMutualFunds, allIpos);
    }

    const parsed = parseResponse(rawContent, portfolioContext, userProfile);

    return {
      text: parsed.text || 'I processed your request. How else can I help?',
      tools: parsed.tools,
      suggestions: parsed.suggestions.length > 0 ? parsed.suggestions : getDefaultSuggestions(userInput),
    };
  } catch (err) {
    console.error('OpenRouter request failed:', err);
    return fallbackResponse(userInput, portfolioContext, userProfile, allInstruments, allMutualFunds, allIpos);
  }
};

/**
 * Default suggestions based on query context
 */
const getDefaultSuggestions = (query) => {
  const q = query.toLowerCase();
  if (q.includes('ipo')) {
    return ['Compare all open IPOs', 'What is GMP for Pine Labs?', 'Show SME IPOs'];
  }
  if (q.includes('sip') || q.includes('mutual') || q.includes('fund')) {
    return ['Show ELSS tax saving funds', 'Calculate SIP returns', 'Compare small cap funds'];
  }
  if (q.includes('buy') || q.includes('sell') || q.includes('trade')) {
    return ['Show my available margin', 'Switch to intraday order', 'Check support/resistance levels'];
  }
  return [
    'Apply for Pine Labs IPO',
    'Start a monthly SIP in Parag Parikh Flexi Cap',
    'Buy 10 shares of HDFCBANK-EQ',
    'Analyze my portfolio risk',
  ];
};

/**
 * Fallback local response engine (used when API is unavailable)
 */
const fallbackResponse = (userInput, portfolioContext, userProfile, allInstruments, allMutualFunds, allIpos) => {
  const query = userInput.toLowerCase().trim();

  // IPO intent
  if (query.includes('ipo') || query.includes('pine lab') || query.includes('groww')) {
    const matchedIpo = allIpos.find(
      (i) => query.includes(i.symbol.toLowerCase()) || query.includes(i.name.toLowerCase().split(' ')[0])
    ) || allIpos[0];

    return {
      text: `Here's the IPO application card for **${matchedIpo.name}**. Retail subscription is at **${matchedIpo.subscription.retail}** with GMP of **${matchedIpo.gmp}**.`,
      tools: [{ type: 'IPO_BID_CARD', data: { ipo: matchedIpo, defaultLots: 1, upiId: 'tazim@okhdfcbank' } }],
      suggestions: ['Compare all open IPOs', 'What is GMP?', 'Show SME IPOs'],
    };
  }

  // MF / SIP intent
  if (query.includes('sip') || query.includes('mutual fund') || query.includes('mf') || query.includes('parag') || query.includes('quant') || query.includes('elss') || query.includes('tax')) {
    let fund = allMutualFunds.find(f => query.includes(f.name.toLowerCase()) || query.includes(f.id.toLowerCase()));
    if (query.includes('tax') || query.includes('elss')) fund = allMutualFunds.find(f => f.taxSaver) || allMutualFunds[3];
    if (!fund) fund = allMutualFunds[0];

    const amountMatch = query.match(/(\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[0], 10) : fund.minSip || 2500;

    return {
      text: `**${fund.name}** has delivered **${fund.cagr3y}% CAGR** over 3 years. Here's your SIP setup card:`,
      tools: [{ type: 'SIP_SETUP_CARD', data: { fund, defaultAmount: amount, defaultDate: '10th of every month' } }],
      suggestions: ['Calculate 5-year projection', 'Show ELSS funds', 'Compare with Quant Small Cap'],
    };
  }

  // Trade intent
  if (query.includes('buy') || query.includes('sell') || query.includes('order')) {
    const isBuy = !query.includes('sell');
    let stock = allInstruments.find(s => query.includes(s.symbol.toLowerCase().replace('-eq', ''))) || allInstruments[0];
    const qtyMatch = query.match(/(\d+)\s*(?:shares|qty)?/i);
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 10;

    return {
      text: `${isBuy ? 'BUY' : 'SELL'} order slip for **${stock.name} (${stock.symbol})** at LTP **₹${stock.ltp}**:`,
      tools: [{ type: 'TRADE_ACTION_CARD', data: { stock, type: isBuy ? 'BUY' : 'SELL', qty, price: stock.ltp, product: 'CNC', orderType: 'MARKET' } }],
      suggestions: ['Show support/resistance', 'Check margin', 'Switch to MIS'],
    };
  }

  // Portfolio intent
  if (query.includes('portfolio') || query.includes('analyze') || query.includes('health') || query.includes('holdings')) {
    return {
      text: `Your portfolio diagnostic:\n- **Net Worth**: ₹${portfolioContext.totalCurrent?.toLocaleString('en-IN')}\n- **Returns**: ${portfolioContext.totalPnl >= 0 ? '+' : ''}₹${portfolioContext.totalPnl?.toLocaleString('en-IN')}\n- **${portfolioContext.positiveHoldingsCount} stocks in profit**, **${portfolioContext.negativeHoldingsCount} in correction**`,
      tools: [{
        type: 'PORTFOLIO_HEALTH_CARD',
        data: {
          metrics: portfolioContext, riskScore: 74, riskLabel: 'Moderate Growth',
          recommendation: 'Consider rebalancing 10% into ELSS Mutual Funds for tax efficiency.',
          sectorBreakdown: [
            { sector: 'Energy & Oil', percent: 28, color: '#1652f0' },
            { sector: 'Banking', percent: 24, color: '#00b4d8' },
            { sector: 'IT', percent: 18, color: '#10b981' },
            { sector: 'Metals', percent: 16, color: '#f59e0b' },
            { sector: 'Mutual Funds', percent: 14, color: '#8b5cf6' },
          ],
        },
      }],
      suggestions: ['Recommend rebalancing funds', 'Which stocks to book profit?', 'Tax harvesting opportunities'],
    };
  }

  // KYC / Onboarding intent
  if (query.includes('onboard') || query.includes('kyc') || query.includes('account') || query.includes('register')) {
    return {
      text: `Welcome! Here's your KYC and onboarding status:`,
      tools: [{
        type: 'KYC_STATUS_CARD',
        data: {
          userProfile,
          steps: [
            { id: 1, name: 'PAN Card Verification', status: 'COMPLETED', date: 'Verified' },
            { id: 2, name: 'Aadhaar e-KYC', status: 'COMPLETED', date: 'Verified' },
            { id: 3, name: 'Bank Account Linking', status: 'COMPLETED', date: 'HDFC ****4902' },
            { id: 4, name: 'Risk Profile', status: 'ACTIVE', date: 'Moderate Growth' },
          ],
        },
      }],
      suggestions: ['Open full onboarding', 'Update risk appetite', 'Link another bank'],
    };
  }

  // Default
  return {
    text: `I'm your **mynt Sidekick** by Zebu. I'm connected to your live portfolio. How can I help you grow your wealth today?`,
    tools: [{
      type: 'PORTFOLIO_HEALTH_CARD',
      data: {
        metrics: portfolioContext, riskScore: 74, riskLabel: 'Moderate Growth',
        recommendation: 'Your portfolio is beating Nifty 50 by +1.4%. Great time to explore SIPs.',
        sectorBreakdown: [
          { sector: 'Energy & Oil', percent: 28, color: '#1652f0' },
          { sector: 'Banking', percent: 24, color: '#00b4d8' },
          { sector: 'IT', percent: 18, color: '#10b981' },
          { sector: 'Metals', percent: 16, color: '#f59e0b' },
          { sector: 'Mutual Funds', percent: 14, color: '#8b5cf6' },
        ],
      },
    }],
    suggestions: [
      'Apply for Pine Labs IPO',
      'Start ₹2,500 SIP in Parag Parikh Flexi Cap',
      'Buy 15 shares of IOC-EQ',
      'Analyze portfolio risk',
    ],
  };
};

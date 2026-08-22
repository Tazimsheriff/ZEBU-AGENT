# Zebu mynt — AI Trading & Mutual Funds Agent

> 🚀 A **Shopify Sidekick-inspired** AI trading copilot for **Zebu e-Trade's mynt platform**, built with React + Vite + OpenRouter (Gemini 2.0 Flash).

![Zebu mynt Demo](https://mynt.zebuetrade.com/assets/logo.png)

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Sidekick AI Agent** | Streaming LLM responses via OpenRouter — real conversation with memory |
| 📊 **Stocks Dashboard** | Holdings, Positions, Orders, Margins widgets matching `mynt.zebuetrade.com` |
| 💰 **Mutual Funds Hub** | Fund explorer with live SIP slider, wealth projection calculator, ELSS filter |
| 🚀 **IPO Desk** | Pine Labs, Groww, Physicswallah IPOs with GMP, subscription data & UPI ASBA apply |
| 📱 **Mobile App Simulator** | Pixel-perfect iPhone mockup of the mynt iOS app |
| ⚡ **Generative UI Tool Cards** | TradeActionCard, SipSetupCard, IpoBidCard, PortfolioHealthCard injected live into chat |
| 🧠 **Context-Aware AI** | AI knows your live portfolio P&L, holdings count, risk profile & active tab |
| 🎯 **Live Market Simulation** | Holdings and indices auto-tick every 3.5 seconds |
| 🪄 **Instant Onboarding** | 5-step KYC wizard (PAN → Aadhaar → Details → Bank → Risk Profile) |

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite 6
- **Styling**: Tailwind CSS 3 with custom Zebu design tokens
- **AI**: OpenRouter API (streaming, Vercel AI SDK pattern) — default: `google/gemini-2.0-flash-001`
- **Icons**: Lucide React
- **Animations**: canvas-confetti for order execution celebrations

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Tazimsheriff/ZEBU-AGENT.git
cd ZEBU-AGENT

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your OpenRouter API key from https://openrouter.ai

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

## 🤖 AI Agent — How It Works

The **mynt Sidekick** is built using the **Vercel AI SDK streaming pattern** adapted for vanilla `fetch`:

```
User Input → OpenRouter API (streaming SSE)
           → Character-by-character text streaming
           → ```action block detection
           → Tool card injection (SIP, Trade, IPO, Portfolio, KYC)
           → Follow-up suggestions generated
```

### Supported Natural Language Commands:
- *"Apply for Pine Labs IPO at cut-off price"* → IPO Bid Card
- *"Start ₹2,500/mo SIP in Parag Parikh Flexi Cap"* → SIP Setup Card
- *"Buy 20 shares of IOC-EQ at market"* → Trade Action Card
- *"Analyze my portfolio health and sector exposure"* → Portfolio Health Card
- *"Complete my KYC verification"* → KYC Status Card

## 📁 Project Structure

```
src/
├── context/
│   ├── TradingContext.jsx    # Global state — orders, holdings, SIPs, IPOs
│   └── AgentContext.jsx      # Sidekick streaming chat state
├── utils/
│   ├── aiAgentEngine.js      # OpenRouter streaming engine + tool resolver
│   └── formatters.js         # INR, percent, date formatters
├── data/
│   ├── mockHoldings.js       # IOC, TRIDENT, IDFC, GOLDBEES + 9 more
│   ├── mockMutualFunds.js    # Parag Parikh, Quant Small Cap, SBI ELSS etc.
│   ├── mockIpos.js           # Pine Labs, Groww, Physicswallah IPOs
│   └── mockMarketData.js     # Nifty 50, Sensex, Bank Nifty live ticks
├── components/
│   ├── common/Header.jsx     # Nav + live indices ticker
│   ├── desktop/              # StocksDashboard, MutualFundsDesk, IpoDesk
│   ├── mobile/               # iPhone frame simulator
│   ├── sidekick/             # AI chat panel + 5 generative tool cards
│   └── onboarding/           # 5-step KYC wizard
└── App.jsx                   # Root with view toggle + notification toasts
```

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_OPENROUTER_API_KEY` | ✅ Yes | Your OpenRouter API key |
| `VITE_OPENROUTER_BASE_URL` | No | Defaults to `https://openrouter.ai/api/v1` |
| `VITE_OPENROUTER_MODEL` | No | Defaults to `google/gemini-2.0-flash-001` |

## 📜 Disclaimer

> *This is a demo/prototype application. All portfolio data, stock prices, mutual fund NAVs, and IPO details are simulated for demonstration purposes only. This is NOT financial advice. Securities quoted are exemplary and not recommendatory. Investments are subject to market risk.*

## 🏢 About Zebu

[Zebu e-Trade](https://zebuetrade.com) is a SEBI-registered Indian stockbroker. [mynt by Zebu](https://mynt.zebuetrade.com) is their flagship trading platform for stocks, mutual funds, IPOs, and bonds.

---

Built with ❤️ as an AI agent demo for Zebu mynt platform.

# Zebu mynt | AI Trading & Mutual Funds Platform (Shopify Sidekick Style)

An intelligent, interactive AI-powered trading copilot and mutual funds platform inspired by **Shopify Sidekick** and built using **Vercel AI SDK generative UI patterns** for **Zebu's `mynt`** trading ecosystem.

---

## 🌟 Highlights & Features

- **Shopify Sidekick Style Copilot ("mynt Sidekick")**:
  - Context-aware floating and dockable conversational AI assistant.
  - Generative UI: Direct interactive order slips, SIP configuration cards, IPO ASBA bidding tickets, and portfolio health diagnostics.
  - Multi-turn conversation reasoning with real-time portfolio metrics injection.
  - Powered by **OpenRouter API** (`google/gemini-2.5-flash`) with automated fallback to domain engine.

- **Desktop Web Portal (`mynt.zebuetrade.com/stocks`)**:
  - **Holdings Overview**: Visual distribution bar (Positive/Negative counts), invested vs current value, today's P&L.
  - **Positions & MTM Desk**: Real-time MTM tracking and intraday position monitoring.
  - **Orders & Margins**: Live order execution book, available margin calculations, credit utilization.

- **Mutual Funds Hub (`mynt.zebuetrade.com/mutual-funds`)**:
  - Curated direct-plan funds with 1Y/3Y/5Y CAGR benchmarks, AUM, and riskometer ratings.
  - Instant SIP setup with 3-year compound wealth projection sliders.
  - Section 80C ELSS Tax Saver recommendations.

- **IPO Application Desk (`mynt.zebuetrade.com/ipo`)**:
  - Main Stream & SME IPO categorization with live GMP and subscription figures.
  - Pine Labs, Groww, and SME IPO bidding modal matching official Zebu mynt UI.
  - 1-click UPI ASBA mandate registration.

- **Mobile App Simulator**:
  - Pixel-accurate replica of the Zebu mynt iOS mobile app.
  - Positions & Holdings tabs with Today vs Total P&L toggles.

- **Interactive User Onboarding**:
  - Instant KYC checklist (PAN, Aadhaar e-Sign, Bank Penny Drop, Risk Profiler).
  - Pre-funded paper trading demo account.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6
- **Styling**: Tailwind CSS 3.4, Custom Glassmorphism & Micro-animations
- **AI & LLM**: OpenRouter API (`google/gemini-2.5-flash`), Vercel AI SDK Generative UI architecture
- **State Management**: React Context (`TradingContext`, `AgentContext`)
- **Icons & Effects**: Lucide React, Canvas Confetti

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Tazimsheriff/ZEBU-AGENT.git
cd ZEBU-AGENT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Key
Create a `.env` file from `.env.example`:
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📸 Example Sidekick Prompts

- *"Apply for Pine Labs IPO (Cut-off price)"*
- *"Start a ₹2,500 monthly SIP in Parag Parikh Flexi Cap"*
- *"What ELSS funds can I invest in to save tax under 80C?"*
- *"Buy 20 shares of IOC-EQ @ Market price"*
- *"Analyze my portfolio risk and sector exposure"*
- *"Check my KYC onboarding status"*

---

## 📄 License
MIT License

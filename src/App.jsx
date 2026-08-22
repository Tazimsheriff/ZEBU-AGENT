import React, { useState, useEffect } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { AgentProvider } from './context/AgentContext';
import { Header } from './components/common/Header';
import { StocksDashboard } from './components/desktop/StocksDashboard';
import { MutualFundsDesk } from './components/desktop/MutualFundsDesk';
import { IpoDesk } from './components/desktop/IpoDesk';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { SidekickAgent } from './components/sidekick/SidekickAgent';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Monitor, Smartphone, CheckCircle2, X } from 'lucide-react';

const ViewToggle = () => {
  const { viewMode, setViewMode } = useTrading();
  return (
    <div className="fixed bottom-6 left-6 z-40 bg-white border border-slate-200 rounded-2xl p-1 shadow-lg flex items-center gap-1">
      <button
        onClick={() => setViewMode('desktop')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <Monitor className="w-3.5 h-3.5" /> Desktop Web
      </button>
      <button
        onClick={() => setViewMode('mobile')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <Smartphone className="w-3.5 h-3.5" /> Mobile App
      </button>
    </div>
  );
};

const NotificationToast = () => {
  const { notifications } = useTrading();
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      setVisible(prev => {
        if (prev.some(n => n.id === latest.id)) return prev;
        const next = [{ ...latest, show: true }, ...prev].slice(0, 3);
        return next;
      });
      const timer = setTimeout(() => {
        setVisible(prev => prev.filter(n => n.id !== latest.id));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <div className="fixed top-24 right-4 z-50 space-y-2 pointer-events-none">
      {visible.map(n => (
        <div
          key={n.id}
          className={`pointer-events-auto max-w-xs px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium flex items-start gap-2.5 transition-all ${
            n.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : n.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${n.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}`} />
          <span className="flex-1 leading-relaxed">{n.text}</span>
        </div>
      ))}
    </div>
  );
};

const AppContent = () => {
  const { activeTab, viewMode, onboardingOpen } = useTrading();

  const renderDesktopView = () => {
    switch (activeTab) {
      case 'stocks': return <StocksDashboard />;
      case 'mutualfunds': return <MutualFundsDesk />;
      case 'ipos': return <IpoDesk />;
      case 'bonds':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3">
            <div className="text-5xl">🏛️</div>
            <h2 className="font-bold text-lg text-slate-700">Bonds & Fixed Income</h2>
            <p className="text-sm text-slate-500">Government securities, Corporate Bonds, SGBs — coming soon</p>
          </div>
        );
      case 'options':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3">
            <div className="text-5xl">⚡</div>
            <h2 className="font-bold text-lg text-slate-700">OptionZ — F&O Trading</h2>
            <p className="text-sm text-slate-500">Advanced F&O analytics with Greeks, IV, and OI charts</p>
          </div>
        );
      default: return <StocksDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col">
      <Header />

      {/* Demo Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800 font-medium">
        🎯 <strong>Demo Mode</strong> — This is an interactive prototype of Zebu mynt with AI Sidekick. All data is simulated for demonstration.
        <button
          className="ml-3 text-blue-700 font-bold hover:underline"
          onClick={() => window.open('https://mynt.zebuetrade.com', '_blank')}
        >
          Visit Real mynt →
        </button>
      </div>

      <main className="flex-1">
        {viewMode === 'desktop' ? renderDesktopView() : <MobileAppShell />}
      </main>

      <ViewToggle />
      <SidekickAgent />
      <NotificationToast />
      {onboardingOpen && <OnboardingFlow />}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-[11px] text-slate-400">
        © 2026 Zebu e-Trade Pvt Ltd. | SEBI Reg. No. INZ000174634 | NSE | BSE | MCX | CDSL |{' '}
        <span className="text-blue-600 font-semibold">mynt.zebuetrade.com</span>
        <span className="ml-4 text-rose-500 font-medium">*Securities quoted are exemplary and not recommendatory. Investments subject to market risks.</span>
      </footer>
    </div>
  );
};

function App() {
  return (
    <TradingProvider>
      <AgentProvider>
        <AppContent />
      </AgentProvider>
    </TradingProvider>
  );
}

export default App;

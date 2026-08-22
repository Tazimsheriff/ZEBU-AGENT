import React from 'react';
import { useTrading } from './context/TradingContext';
import { Header } from './components/common/Header';
import { StocksDashboard } from './components/desktop/StocksDashboard';
import { MutualFundsDesk } from './components/desktop/MutualFundsDesk';
import { IpoDesk } from './components/desktop/IpoDesk';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { SidekickAgent } from './components/sidekick/SidekickAgent';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { formatINR } from './utils/formatters';
import {
  Briefcase, Activity, ShoppingCart, Wallet, TrendingUp, ArrowRight
} from 'lucide-react';

const DesktopContent = () => {
  const { activeTab, holdings, positions, orders, margins, mfHoldings, portfolioMetrics } = useTrading();

  switch (activeTab) {
    case 'stocks':
      return <StocksDashboard />;
    case 'mutualfunds':
      return <MutualFundsDesk />;
    case 'ipos':
      return <IpoDesk />;
    case 'holdings':
      return <HoldingsPage />;
    case 'positions':
      return <PositionsPage />;
    case 'orders':
      return <OrdersPage />;
    case 'funds':
      return <FundsPage />;
    default:
      return <StocksDashboard />;
  }
};

const HoldingsPage = () => {
  const { holdings, mfHoldings, portfolioMetrics } = useTrading();
  const { totalInvested, totalCurrent, totalPnl, totalPnlPercent } = portfolioMetrics;

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900">Holdings</h2>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-500">Invested: </span>
            <span className="font-bold text-slate-800">{formatINR(totalInvested, { compact: true })}</span>
          </div>
          <div>
            <span className="text-slate-500">Current: </span>
            <span className="font-bold text-slate-800">{formatINR(totalCurrent, { compact: true })}</span>
          </div>
          <div className={`font-bold ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalPnl >= 0 ? '+' : ''}{formatINR(totalPnl, { compact: true })} ({totalPnlPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="text-left px-5 py-2.5 font-semibold">Symbol</th>
              <th className="text-right px-3 py-2.5 font-semibold">Qty</th>
              <th className="text-right px-3 py-2.5 font-semibold">Avg Price</th>
              <th className="text-right px-3 py-2.5 font-semibold">LTP</th>
              <th className="text-right px-3 py-2.5 font-semibold">Invested</th>
              <th className="text-right px-3 py-2.5 font-semibold">Current</th>
              <th className="text-right px-3 py-2.5 font-semibold">P&L</th>
              <th className="text-right px-5 py-2.5 font-semibold">P&L %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => (
              <tr key={h.symbol} className="border-t border-slate-100 hover:bg-blue-50/40 transition-colors">
                <td className="px-5 py-2.5">
                  <div className="font-bold text-slate-800">{h.symbol}</div>
                  <div className="text-[10px] text-slate-500">{h.sector}</div>
                </td>
                <td className="text-right px-3 font-medium text-slate-700">{h.qty}</td>
                <td className="text-right px-3 text-slate-700">₹{h.avgPrice.toFixed(2)}</td>
                <td className="text-right px-3 font-bold text-slate-900">₹{h.ltp.toFixed(2)}</td>
                <td className="text-right px-3 text-slate-600">{formatINR(h.invested)}</td>
                <td className="text-right px-3 font-medium text-slate-800">{formatINR(h.currentValue)}</td>
                <td className={`text-right px-3 font-bold ${h.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {h.pnl >= 0 ? '+' : ''}{formatINR(h.pnl)}
                </td>
                <td className={`text-right px-5 font-semibold ${h.pnlPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mutual Fund Holdings */}
      {mfHoldings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800">Mutual Fund Holdings</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="text-left px-5 py-2 font-semibold">Scheme</th>
                <th className="text-right px-3 py-2 font-semibold">Units</th>
                <th className="text-right px-3 py-2 font-semibold">NAV</th>
                <th className="text-right px-3 py-2 font-semibold">Invested</th>
                <th className="text-right px-3 py-2 font-semibold">Current</th>
                <th className="text-right px-3 py-2 font-semibold">P&L</th>
                <th className="text-right px-5 py-2 font-semibold">SIP</th>
              </tr>
            </thead>
            <tbody>
              {mfHoldings.map(mf => (
                <tr key={mf.id} className="border-t border-slate-100 hover:bg-blue-50/40 transition-colors">
                  <td className="px-5 py-2.5">
                    <div className="font-bold text-slate-800 text-[11px]">{mf.schemeName}</div>
                    <div className="text-[10px] text-slate-500">{mf.category}</div>
                  </td>
                  <td className="text-right px-3 text-slate-700">{mf.units.toFixed(3)}</td>
                  <td className="text-right px-3 text-slate-700">₹{mf.nav}</td>
                  <td className="text-right px-3 text-slate-600">{formatINR(mf.invested)}</td>
                  <td className="text-right px-3 font-medium text-slate-800">{formatINR(mf.currentValue)}</td>
                  <td className={`text-right px-3 font-bold ${mf.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {mf.pnl >= 0 ? '+' : ''}{formatINR(mf.pnl)}
                  </td>
                  <td className="text-right px-5 text-blue-600 font-semibold">₹{mf.sipAmount}/mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const PositionsPage = () => {
  const { positions, portfolioMetrics } = useTrading();
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      <h2 className="text-lg font-extrabold text-slate-900">Positions</h2>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {positions.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-400 font-semibold">NO OPEN POSITIONS</div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="text-left px-5 py-2.5 font-semibold">Symbol</th>
                <th className="text-right px-3 py-2.5 font-semibold">Product</th>
                <th className="text-right px-3 py-2.5 font-semibold">Qty</th>
                <th className="text-right px-3 py-2.5 font-semibold">Buy Avg</th>
                <th className="text-right px-3 py-2.5 font-semibold">LTP</th>
                <th className="text-right px-3 py-2.5 font-semibold">MTM</th>
                <th className="text-right px-5 py-2.5 font-semibold">P&L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(p => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-5 py-2.5 font-bold text-slate-800">{p.symbol}</td>
                  <td className="text-right px-3 text-slate-600">{p.product}</td>
                  <td className="text-right px-3 font-medium text-slate-700">{p.qty}</td>
                  <td className="text-right px-3 text-slate-700">₹{p.buyAvg.toFixed(2)}</td>
                  <td className="text-right px-3 font-bold text-slate-900">₹{p.ltp.toFixed(2)}</td>
                  <td className={`text-right px-3 font-bold ${p.mtm >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {p.mtm >= 0 ? '+' : ''}{p.mtm.toFixed(2)}
                  </td>
                  <td className={`text-right px-5 font-bold ${p.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {p.pnl >= 0 ? '+' : ''}{formatINR(p.pnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const { orders } = useTrading();
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      <h2 className="text-lg font-extrabold text-slate-900">Order Book</h2>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="text-left px-5 py-2.5 font-semibold">Order ID</th>
              <th className="text-left px-3 py-2.5 font-semibold">Symbol</th>
              <th className="text-center px-3 py-2.5 font-semibold">Side</th>
              <th className="text-right px-3 py-2.5 font-semibold">Qty</th>
              <th className="text-right px-3 py-2.5 font-semibold">Price</th>
              <th className="text-center px-3 py-2.5 font-semibold">Product</th>
              <th className="text-center px-3 py-2.5 font-semibold">Status</th>
              <th className="text-right px-5 py-2.5 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t border-slate-100 hover:bg-blue-50/40 transition-colors">
                <td className="px-5 py-2.5 font-mono text-slate-600">{o.id}</td>
                <td className="px-3 py-2.5 font-bold text-slate-800">{o.symbol}</td>
                <td className="text-center px-3 py-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    o.type === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {o.type}
                  </span>
                </td>
                <td className="text-right px-3 text-slate-700">{o.qty}</td>
                <td className="text-right px-3 font-medium text-slate-800">₹{o.price.toFixed(2)}</td>
                <td className="text-center px-3 text-slate-600">{o.product}</td>
                <td className="text-center px-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    o.status === 'EXECUTED' ? 'bg-emerald-100 text-emerald-700'
                      : o.status === 'PENDING' ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="text-right px-5 text-slate-500 font-mono text-[10px]">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FundsPage = () => {
  const { margins } = useTrading();
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      <h2 className="text-lg font-extrabold text-slate-900">Funds & Margins</h2>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <span className="text-xs text-slate-500">Available Balance</span>
            <div className="text-2xl font-extrabold text-slate-900">{formatINR(margins.availableBalance)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Opening Balance</span>
            <div className="text-xl font-bold text-slate-800">{formatINR(margins.openingBalance)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Total Credits</span>
            <div className="text-xl font-bold text-slate-800">{formatINR(margins.totalCredits, { compact: true })}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Margin Used</span>
            <div className="text-xl font-bold text-rose-600">{formatINR(margins.marginUsed, { compact: true })}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Collateral Margin</span>
            <div className="text-xl font-bold text-slate-800">{formatINR(margins.collateralMargin)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Payin Amount</span>
            <div className="text-xl font-bold text-slate-800">{formatINR(margins.payinAmount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { viewMode } = useTrading();

  return (
    <div className="min-h-screen bg-[#f0f4f9]">
      <Header />

      {viewMode === 'desktop' ? (
        <DesktopContent />
      ) : (
        <MobileAppShell />
      )}

      <SidekickAgent />
      <OnboardingFlow />
    </div>
  );
}

export default App;

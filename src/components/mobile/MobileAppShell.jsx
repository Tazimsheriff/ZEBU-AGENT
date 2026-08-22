import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatINR } from '../../utils/formatters';
import {
  Smartphone, BarChart2, ShoppingBag, User, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, ChevronLeft
} from 'lucide-react';

const PhoneStatusBar = () => (
  <div className="flex items-center justify-between px-5 pt-2 pb-1">
    <span className="text-white font-bold text-sm">5:00</span>
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4].map(i => <div key={i} className={`w-1 rounded-sm ${i <= 3 ? 'bg-white' : 'bg-white/40'}`} style={{ height: `${4+i*2}px` }} />)}
      </div>
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M1 1l22 22M16.72 11.06A11.95 11.95 0 0 1 12 10.5c-2.27 0-4.39.62-6.21 1.7L4 10.5c2.18-1.33 4.73-2.1 7.47-2.1.98 0 1.93.1 2.84.28l2.41 2.38zM5 12.55A7.97 7.97 0 0 1 12 10.5c2.07 0 3.97.77 5.39 2.04l1.43-1.43A10.04 10.04 0 0 0 12 8.5C9.23 8.5 6.74 9.6 4.96 11.42L5 12.55z"/></svg>
      <div className="flex items-center gap-0.5 bg-white/20 rounded-sm px-1 py-0.5">
        <div className="w-5 h-2.5 border border-white rounded-sm flex items-center justify-end pr-0.5">
          <div className="w-3 h-1.5 bg-white rounded-sm" />
        </div>
      </div>
    </div>
  </div>
);

const MobilePortfolioView = () => {
  const { holdings, positions, portfolioMetrics, mobilePortfolioSubTab, setMobilePortfolioSubTab, mobileHoldingsTimeframe, setMobileHoldingsTimeframe } = useTrading();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Portfolio Nav Bar */}
      <div className="px-4 pt-2 pb-3 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Portfolio</h2>
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-bold border border-blue-600 text-blue-700 px-2 py-0.5 rounded">E-DIS</div>
            <button className="text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M9 12h6M11 16h2" /></svg></button>
            <button className="text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 1 0 6.69 6.69a7 7 0 0 0 9.96 9.96z" /></svg></button>
          </div>
        </div>

        {/* Sub Tabs: Positions / Holdings */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setMobilePortfolioSubTab('positions')}
            className={`flex-1 text-xs font-semibold py-2 border-b-2 transition-colors ${mobilePortfolioSubTab === 'positions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
          >
            Positions
          </button>
          <button
            onClick={() => setMobilePortfolioSubTab('holdings')}
            className={`flex-1 text-xs font-semibold py-2 border-b-2 transition-colors flex items-center justify-center gap-1 ${mobilePortfolioSubTab === 'holdings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
          >
            Holdings
            <span className={`text-[10px] w-4 h-4 rounded-full font-bold flex items-center justify-center ${mobilePortfolioSubTab === 'holdings' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{holdings.length}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {mobilePortfolioSubTab === 'positions' ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm font-medium">
            <div className="text-2xl mb-2">📊</div>
            MTM&nbsp;<span className="font-bold text-rose-500">{formatINR(portfolioMetrics.totalMtm)}</span>
            {positions.length === 0 && <div className="mt-3 text-xs text-slate-400">NO POSITIONS</div>}
          </div>
        ) : (
          <div>
            {/* Today / Total Toggle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex gap-1.5 bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setMobileHoldingsTimeframe('today')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${mobileHoldingsTimeframe === 'today' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setMobileHoldingsTimeframe('total')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${mobileHoldingsTimeframe === 'total' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Total
                </button>
              </div>
              <div className={`text-sm font-black tabular-nums ${
                (mobileHoldingsTimeframe === 'today' ? portfolioMetrics.todayPnl : portfolioMetrics.totalPnl) >= 0
                  ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {mobileHoldingsTimeframe === 'today'
                  ? `${portfolioMetrics.todayPnl >= 0 ? '' : ''}${portfolioMetrics.todayPnl.toFixed(2)}`
                  : `${portfolioMetrics.totalPnl >= 0 ? '' : ''}${portfolioMetrics.totalPnl.toFixed(2)}`
                }
                <span className="text-[10px] ml-1 opacity-80">
                  ({(mobileHoldingsTimeframe === 'today' ? portfolioMetrics.todayPnlPercent : portfolioMetrics.totalPnlPercent).toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Invested / Current */}
            <div className="flex justify-between px-4 py-2 text-xs">
              <div>
                <span className="text-slate-500">Invested</span>
                <div className="font-bold text-slate-900">{portfolioMetrics.totalInvested.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Current</span>
                <div className="font-bold text-slate-900">{portfolioMetrics.totalCurrent.toFixed(2)}</div>
              </div>
            </div>

            {/* Holdings List - matches screenshot exactly */}
            <div className="divide-y divide-slate-50">
              {holdings.slice(0, 4).map((h) => {
                const displayPnl = mobileHoldingsTimeframe === 'today' ? h.dayPnl : h.pnl;
                const displayPct = mobileHoldingsTimeframe === 'today' ? h.dayPnlPercent : h.pnlPercent;
                return (
                  <div key={h.symbol} className="px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">
                          {h.qty}P {h.avgPrice}. NPQ. {h.npq}
                        </div>
                        <div className="font-bold text-sm text-slate-900">{h.symbol}</div>
                        <div className="text-[11px] text-slate-500">Inv: {h.invested.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-semibold ${displayPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {displayPct >= 0 ? '+' : ''}{displayPct.toFixed(2)}%
                        </div>
                        <div className={`font-bold text-sm ${displayPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {displayPnl >= 0 ? '' : ''}{displayPnl.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">LTP {h.ltp.toFixed(2)} ({displayPct >= 0 ? '+' : ''}{displayPct.toFixed(2)}%)</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const MobileAppShell = () => {
  const { mobileTab, setMobileTab } = useTrading();

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: BarChart2 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'portfolio', label: 'Portfolio', icon: null },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-130px)] bg-gradient-to-b from-[#05234e] to-[#0a1628] py-8">
      {/* iOS Phone Frame */}
      <div
        className="relative w-[320px] h-[640px] rounded-[45px] overflow-hidden bg-[#f5f6f8]"
        style={{
          boxShadow: '0 0 0 2px #334155, 0 0 0 6px #1e293b, 0 30px 80px -10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-zinc-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white pt-8 pb-0">
          <PhoneStatusBar />
        </div>

        {/* App Screen */}
        <div className="flex flex-col h-[calc(100%-32px)]">
          <MobilePortfolioView />

          {/* Bottom Tab Bar */}
          <div className="bg-white border-t border-slate-200 flex items-center px-2 pb-2 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isPortfolio = tab.id === 'portfolio';
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-0.5 py-2"
                >
                  {isPortfolio ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      mobileTab === tab.id ? 'bg-blue-600' : 'bg-slate-200'
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                      </svg>
                    </div>
                  ) : (
                    Icon && <Icon className={`w-5 h-5 ${mobileTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  )}
                  <span className={`text-[9px] font-semibold ${mobileTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium flex items-center gap-2">
        <Smartphone className="w-3.5 h-3.5" />
        mynt iOS App Preview
      </div>
    </div>
  );
};

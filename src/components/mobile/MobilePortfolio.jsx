import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatINR } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Eye, BarChart2 } from 'lucide-react';

export const MobilePortfolio = () => {
  const {
    holdings, mfHoldings, positions,
    mobilePortfolioSubTab, setMobilePortfolioSubTab,
    mobileHoldingsTimeframe, setMobileHoldingsTimeframe,
    portfolioMetrics,
  } = useTrading();

  const { totalInvested, totalCurrent, totalPnl, totalPnlPercent, todayPnl, todayPnlPercent } = portfolioMetrics;

  // Select PnL based on timeframe
  const displayPnl = mobileHoldingsTimeframe === 'today' ? todayPnl : totalPnl;
  const displayPnlPercent = mobileHoldingsTimeframe === 'today' ? todayPnlPercent : totalPnlPercent;

  return (
    <div className="bg-white min-h-full flex flex-col">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1 bg-[#05234e]">
        <h2 className="text-white font-bold text-base">Portfolio</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 border border-white/40 text-white rounded font-medium">E-DIS</span>
          <button className="text-white/80"><BarChart2 className="w-4 h-4" /></button>
          <button className="text-white/80"><Eye className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Sub Tabs: Positions | Holdings */}
      <div className="flex border-b border-slate-200 bg-[#05234e]">
        <button
          type="button"
          onClick={() => setMobilePortfolioSubTab('positions')}
          className={`flex-1 py-2 text-xs font-semibold text-center transition-all ${
            mobilePortfolioSubTab === 'positions'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-white/60'
          }`}
        >
          Positions
        </button>
        <button
          type="button"
          onClick={() => setMobilePortfolioSubTab('holdings')}
          className={`flex-1 py-2 text-xs font-semibold text-center transition-all ${
            mobilePortfolioSubTab === 'holdings'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-white/60'
          }`}
        >
          Holdings <span className="text-[10px] bg-white/10 px-1 rounded text-white/60 ml-0.5">{holdings.length}</span>
        </button>
      </div>

      {mobilePortfolioSubTab === 'positions' ? (
        /* POSITIONS VIEW */
        <div className="flex-1 bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">MTM</span>
              <span className={`font-bold text-base ${portfolioMetrics.totalMtm >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {portfolioMetrics.totalMtm >= 0 ? '+' : ''}{portfolioMetrics.totalMtm.toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2 text-[10px] text-slate-500">
              <div>
                <div className="text-xs font-bold text-slate-800">0.00</div>
                <span>Buy Value</span>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-800">0.00</div>
                <span>Sell Value</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-800">0.00</div>
                <span>Net Value</span>
              </div>
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <span className="text-xs text-slate-400 font-semibold">NO POSITIONS</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {positions.map(pos => (
                <div key={pos.id} className="px-4 py-3 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">{pos.symbol}</span>
                    <span className={`font-bold ${pos.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Qty: {pos.qty} • {pos.product}</span>
                    <span>LTP ₹{pos.ltp.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* HOLDINGS VIEW - Matches user screenshots exactly */
        <div className="flex-1 bg-white">
          {/* Today / Total Toggle + Summary */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setMobileHoldingsTimeframe('today')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                  mobileHoldingsTimeframe === 'today'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 bg-slate-100'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setMobileHoldingsTimeframe('total')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                  mobileHoldingsTimeframe === 'total'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 bg-slate-100'
                }`}
              >
                Total
              </button>
              <span className={`ml-auto text-base font-extrabold ${displayPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {displayPnl >= 0 ? '+' : ''}{displayPnl.toFixed(2)}
              </span>
              <span className={`text-[10px] font-semibold ${displayPnlPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ({displayPnlPercent >= 0 ? '+' : ''}{displayPnlPercent.toFixed(2)}%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Invested</span>
                <div className="font-bold text-slate-800">{formatINR(totalInvested, { compact: true, decimals: 2 })}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px]">Current</span>
                <div className="font-bold text-slate-800">{formatINR(totalCurrent, { compact: true, decimals: 2 })}</div>
              </div>
            </div>
          </div>

          {/* Individual Holdings List */}
          <div className="divide-y divide-slate-100 overflow-y-auto">
            {holdings.map(h => {
              const dispPnl = mobileHoldingsTimeframe === 'today' ? (h.dayPnl || 0) : h.pnl;
              const dispPercent = mobileHoldingsTimeframe === 'today' ? (h.dayPnlPercent || 0) : h.pnlPercent;

              return (
                <div key={h.symbol} className="px-4 py-3 text-xs">
                  {/* Info row */}
                  <div className="text-[10px] text-slate-400 mb-0.5">
                    {h.qty} @ {h.avgPrice.toFixed(2)} , NPQ. {h.npq || h.qty}
                  </div>
                  {/* Main row */}
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-800">{h.symbol}</div>
                    <div className="text-right">
                      <span className={`font-bold ${dispPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {dispPercent >= 0 ? '' : ''}{dispPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-slate-500">Inv: {formatINR(h.invested)}</span>
                    <span className={`font-bold ${dispPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {dispPnl >= 0 ? '+' : ''}{dispPnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span></span>
                    <span>LTP {h.ltp.toFixed(2)} ({dispPercent >= 0 ? '+' : ''}{dispPercent.toFixed(2)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

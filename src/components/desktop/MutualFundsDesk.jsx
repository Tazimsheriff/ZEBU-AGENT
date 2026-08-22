import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAgent } from '../../context/AgentContext';
import { formatINR } from '../../utils/formatters';
import { TrendingUp, Star, Sparkles, Search, SlidersHorizontal, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const riskColorMap = {
  'Low': 'text-emerald-600 bg-emerald-50',
  'Moderate': 'text-amber-600 bg-amber-50',
  'Moderately High': 'text-orange-600 bg-orange-50',
  'High': 'text-orange-700 bg-orange-50',
  'Very High': 'text-rose-600 bg-rose-50',
};

const FundCard = ({ fund, onSip, onInvest }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{fund.category}</span>
          {fund.taxSaver && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">80C Saver</span>
          )}
          {fund.tag && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{fund.tag}</span>
          )}
        </div>
        <h3 className="font-bold text-sm text-slate-900 leading-snug truncate">{fund.name}</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">{fund.amc} • <span className={`font-semibold ${riskColorMap[fund.risk]?.split(' ')[0]}`}>{fund.risk} Risk</span></p>
      </div>
      <div className="text-right ml-3 shrink-0">
        <div className="text-[10px] text-slate-500">NAV</div>
        <div className="font-bold text-slate-900 text-sm">₹{fund.nav}</div>
        <div className={`text-[10px] font-semibold ${fund.dayChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {fund.dayChange >= 0 ? '+' : ''}{fund.dayChangePercent.toFixed(2)}%
        </div>
      </div>
    </div>

    {/* Stars */}
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < fund.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      ))}
    </div>

    {/* Returns Grid */}
    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-center">
      {[
        { label: '1Y Returns', value: fund.cagr1y },
        { label: '3Y CAGR', value: fund.cagr3y },
        { label: '5Y CAGR', value: fund.cagr5y },
      ].map((ret) => (
        <div key={ret.label}>
          <div className={`font-extrabold text-sm ${ret.value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>+{ret.value}%</div>
          <div className="text-[10px] text-slate-400 font-medium">{ret.label}</div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
      <span>AUM: <strong className="text-slate-700">{fund.aum}</strong></span>
      <span>Exp: <strong className="text-slate-700">{fund.expenseRatio}</strong></span>
      <span>Min SIP: <strong className="text-slate-700">₹{fund.minSip}</strong></span>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onSip(fund)}
        className="flex-1 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
      >
        <TrendingUp className="w-3.5 h-3.5" /> Start SIP
      </button>
      <button
        onClick={() => onInvest(fund)}
        className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-700 rounded-xl hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 active:scale-95 transition-all"
      >
        One-Time Invest
      </button>
    </div>
  </div>
);

export const MutualFundsDesk = () => {
  const { mutualFunds, mfHoldings, startSip, portfolioMetrics } = useTrading();
  const { sendMessage } = useAgent();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filters = ['All', 'Equity', 'ELSS Tax Saver', 'Hybrid', 'Debt', 'Sectoral'];

  const filteredFunds = mutualFunds.filter((f) => {
    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'ELSS Tax Saver' && f.taxSaver) ||
      f.category.toLowerCase().includes(activeFilter.toLowerCase());
    const matchSearch =
      !searchText ||
      f.name.toLowerCase().includes(searchText.toLowerCase()) ||
      f.amc.toLowerCase().includes(searchText.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleSip = (fund) => {
    sendMessage(`Start ₹2500 monthly SIP in ${fund.name}`);
  };

  const handleOneTime = (fund) => {
    sendMessage(`I want to invest ₹10000 lump sum in ${fund.name}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-5 space-y-5">
      {/* Portfolio MF summary bar */}
      {mfHoldings.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-5 items-center shadow-sm">
          <div>
            <p className="text-[11px] text-slate-500">MF Invested</p>
            <p className="font-extrabold text-lg text-slate-900">{formatINR(mfHoldings.reduce((a, m) => a + m.invested, 0))}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Current Value</p>
            <p className="font-extrabold text-lg text-emerald-600">{formatINR(mfHoldings.reduce((a, m) => a + m.currentValue, 0))}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Total Returns</p>
            <p className={`font-extrabold text-lg ${mfHoldings.reduce((a, m) => a + m.pnl, 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              +{formatINR(mfHoldings.reduce((a, m) => a + m.pnl, 0))}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Active SIPs</p>
            <p className="font-extrabold text-lg text-blue-600">{mfHoldings.filter(m => m.sipAmount > 0).length}</p>
          </div>
          <button
            onClick={() => sendMessage('Show my mutual fund holdings and performance')}
            className="ml-auto px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Analyze with Sidekick
          </button>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search funds by name, AMC, category…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeFilter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Funds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredFunds.map((fund) => (
          <FundCard key={fund.id} fund={fund} onSip={handleSip} onInvest={handleOneTime} />
        ))}
        {filteredFunds.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400">
            No funds found for this filter.
          </div>
        )}
      </div>

      {/* Current MF Holdings */}
      {mfHoldings.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Your Mutual Fund Portfolio</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {mfHoldings.map((mf) => (
              <div key={mf.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900 truncate">{mf.schemeName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Folio: {mf.folioNo} • {mf.units.toFixed(3)} units @ NAV ₹{mf.nav}
                    {mf.sipAmount > 0 && <span className="ml-2 text-blue-600 font-semibold">• SIP ₹{mf.sipAmount}/mo</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900">{formatINR(mf.currentValue)}</div>
                  <div className={`text-xs font-semibold ${mf.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {mf.pnl >= 0 ? '+' : ''}{formatINR(mf.pnl)} ({mf.pnlPercent >= 0 ? '+' : ''}{mf.pnlPercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

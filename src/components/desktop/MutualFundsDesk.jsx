import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatINR } from '../../utils/formatters';
import { Star, TrendingUp, Search, Filter, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const MutualFundsDesk = () => {
  const { mutualFunds, mfHoldings, setSelectedMfForSip } = useTrading();
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Flexi Cap', 'Small Cap', 'Large & Mid Cap', 'ELSS Tax Saver', 'Sectoral - Tech', 'Hybrid / Dynamic Asset'];

  const filtered = mutualFunds.filter(f => {
    const matchesCat = filterCategory === 'All' || f.category === filterCategory;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Mutual Fund Explorer</h2>
          <p className="text-xs text-slate-500">Curated direct plans • Instant SIP activation via Zebu mynt</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search fund..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-32 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* My MF Holdings (mini summary) */}
      {mfHoldings.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-blue-900 mb-2">Your Mutual Fund Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mfHoldings.map(mf => (
              <div key={mf.id} className="bg-white rounded-xl border border-blue-100 p-3 text-xs">
                <div className="font-bold text-slate-800 text-[11px] truncate">{mf.schemeName}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-slate-500">Invested: {formatINR(mf.invested)}</span>
                  <span className={`font-bold ${mf.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {mf.pnl >= 0 ? '+' : ''}{formatINR(mf.pnl)}
                  </span>
                </div>
                <div className="text-[10px] text-blue-600 font-medium mt-1">SIP: ₹{mf.sipAmount}/mo</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fund Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(fund => (
          <div
            key={fund.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            {/* Fund Top Badges */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {fund.category}
              </span>
              {fund.tag && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {fund.tag}
                </span>
              )}
              {fund.recommended && (
                <Sparkles className="w-3 h-3 text-amber-500" />
              )}
            </div>

            <h4 className="font-bold text-sm text-slate-900 leading-snug mb-0.5">{fund.name}</h4>
            <p className="text-[10px] text-slate-500 mb-3">{fund.amc} • AUM: {fund.aum}</p>

            {/* Returns Row */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs mb-3">
              <div className="text-center">
                <span className="text-[10px] text-slate-500">1Y</span>
                <div className="font-bold text-emerald-600">+{fund.cagr1y}%</div>
              </div>
              <div className="text-center border-x border-slate-200">
                <span className="text-[10px] text-slate-500">3Y</span>
                <div className="font-bold text-emerald-600">+{fund.cagr3y}%</div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500">5Y</span>
                <div className="font-bold text-emerald-600">+{fund.cagr5y}%</div>
              </div>
            </div>

            {/* Meta Row */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3">
              <span>NAV: ₹{fund.nav}</span>
              <span>Expense: {fund.expenseRatio}</span>
              <span>Min SIP: ₹{fund.minSip}</span>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < fund.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                />
              ))}
              <span className="text-[10px] text-slate-500 ml-1">Risk: {fund.risk}</span>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => setSelectedMfForSip(fund)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-blue-600/20"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Invest / Start SIP</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

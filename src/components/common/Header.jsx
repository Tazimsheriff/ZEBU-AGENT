import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { TrendingUp, TrendingDown, Search, Bell, Monitor, Smartphone } from 'lucide-react';

export const Header = () => {
  const { indices, activeTab, setActiveTab, viewMode, setViewMode, userProfile, notifications } = useTrading();

  const tabs = [
    { id: 'stocks', label: 'Stocks' },
    { id: 'mutualfunds', label: 'Mutual Fund' },
    { id: 'ipos', label: 'IPOs' },
    { id: 'holdings', label: 'Holdings' },
    { id: 'positions', label: 'Positions' },
    { id: 'orders', label: 'Orders' },
    { id: 'funds', label: 'Funds' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Ticker Bar */}
      <div className="bg-[#05234e] text-white overflow-hidden">
        <div className="animate-ticker py-1">
          {[...indices, ...indices].map((idx, i) => (
            <div key={i} className="flex items-center gap-1.5 px-4 whitespace-nowrap text-[11px] font-medium">
              <span className="text-slate-300">{idx.symbol}</span>
              <span className="font-bold">₹{idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              <span className={`flex items-center gap-0.5 ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)} ({idx.changePercent.toFixed(2)}%)
              </span>
              <span className="text-slate-600 mx-2">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 py-2.5 shrink-0">
          <div className="flex items-center gap-1">
            <div className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              mynt
            </div>
            <span className="text-[9px] text-slate-400 font-medium mt-2">by ZEBU</span>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500'}`}
              title="Desktop Web View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500'}`}
              title="Mobile App Simulator"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors relative">
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* User */}
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
};

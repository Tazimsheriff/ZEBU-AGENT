import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAgent } from '../../context/AgentContext';
import {
  Search, Bell, ChevronDown, BarChart2, TrendingUp, Zap,
  LogIn, Sparkles, Menu, X
} from 'lucide-react';

const ZebuLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="flex flex-col leading-none">
      <span className="text-white font-black text-xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
        <span className="text-cyan-300">m</span>ynt
      </span>
      <span className="text-white/50 text-[9px] tracking-widest font-semibold uppercase mt-[-1px]">by ZEBU</span>
    </div>
  </div>
);

export const Header = () => {
  const { activeTab, setActiveTab, indices, userProfile } = useTrading();
  const { isOpen, setIsOpen } = useAgent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'stocks', label: 'Stocks' },
    { id: 'mutualfunds', label: 'Mutual Fund' },
    { id: 'ipos', label: 'IPOs' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'options', label: 'OptionZ', badge: 'Beta' },
  ];

  const primaryIndex = indices[0]; // Nifty 50
  const secondaryIndex = indices[1]; // Sensex

  return (
    <header className="gradient-zebu text-white shadow-lg sticky top-0 z-30">
      {/* Main Nav Row */}
      <div className="max-w-[1400px] mx-auto px-4 flex items-center h-14 gap-6">
        <ZebuLogo />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === item.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
              {item.badge && (
                <span className="text-[9px] font-bold bg-cyan-400 text-cyan-900 px-1 py-0.5 rounded uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Nifty / Sensex quick glance */}
          <div className="hidden lg:flex items-center gap-4 mr-2">
            {[primaryIndex, secondaryIndex].map((idx) => (
              <div key={idx.symbol} className="text-right text-xs">
                <div className="text-white/60 text-[10px] font-medium uppercase tracking-wide">{idx.symbol}</div>
                <div className="text-white font-bold tabular-nums">
                  {idx.value.toLocaleString('en-IN')}
                  <span className={`ml-1.5 text-[11px] font-semibold ${idx.change >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)} ({idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sidekick Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isOpen
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-gradient-to-r from-cyan-400 to-blue-400 text-blue-900 shadow-md hover:shadow-lg'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sidekick</span>
          </button>

          <button className="w-8 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </button>

          <button className="relative w-8 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#05234e]" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-white/10 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-blue-900 flex items-center justify-center font-black text-xs">
              TM
            </div>
            <div className="hidden lg:block">
              <div className="text-white text-xs font-semibold leading-tight">{userProfile.name.split(' ')[0]}</div>
              <div className="text-white/50 text-[10px]">{userProfile.clientCode}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/50 hidden lg:block" />
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Ticker Strip */}
      <div className="bg-white/5 border-t border-white/10 overflow-hidden h-7 flex items-center">
        <div className="animate-ticker flex items-center gap-6 text-[11px] font-mono px-4">
          {[...indices, ...indices].map((idx, i) => (
            <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-white/60 font-medium">{idx.symbol}</span>
              <span className="text-white font-bold">{idx.value.toLocaleString('en-IN')}</span>
              <span className={`${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-semibold`}>
                {idx.change >= 0 ? '▲' : '▼'} {Math.abs(idx.changePercent).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 py-2 px-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === item.id ? 'bg-white/15 text-white' : 'text-white/70'}`}
            >
              {item.label} {item.badge && <span className="text-[9px] bg-cyan-400 text-cyan-900 px-1 py-0.5 rounded">{item.badge}</span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

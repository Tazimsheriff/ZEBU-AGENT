import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { MobilePortfolio } from './MobilePortfolio';
import { SidekickAgent } from '../sidekick/SidekickAgent';
import { TrendingUp, FileText, Briefcase, User, MoreHorizontal, Sparkles } from 'lucide-react';

export const MobileAppShell = () => {
  const { mobileTab, setMobileTab } = useTrading();

  const tabs = [
    { id: 'watchlist', label: 'WatchList', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  const renderContent = () => {
    switch (mobileTab) {
      case 'watchlist':
        return (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center p-8">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-700">Watchlist</h3>
              <p className="text-xs text-slate-500 mt-1">Add stocks, ETFs, and mutual funds to track</p>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center p-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-700">Order Book</h3>
              <p className="text-xs text-slate-500 mt-1">Your recent and pending orders will appear here</p>
            </div>
          </div>
        );
      case 'portfolio':
        return <MobilePortfolio />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center p-8">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-700">Profile & Settings</h3>
              <p className="text-xs text-slate-500 mt-1">Client Code: ZB88492</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-screen bg-white shadow-2xl flex flex-col pb-20 relative">
      {/* Top Status & Header Bar */}
      <div className="bg-[#05234e] text-white pt-3 pb-0 sticky top-0 z-30 shadow-md">
        {/* Status bar */}
        <div className="flex justify-between items-center px-4 py-1 text-white/90 text-[11px] font-medium">
          <span>5:00</span>
          <div className="flex items-center gap-1.5">
            <span>●●●●</span>
            <span>5G</span>
            <span>100% 🔋</span>
          </div>
        </div>
      </div>

      {/* Main Tab Content (Portfolio, Watchlist, Orders, Profile) */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}

        {/* Sidekick Agent integrated directly into the mobile flow below the portfolio */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>mynt Sidekick AI Copilot</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Live Connected
            </span>
          </div>
          <SidekickAgent embedded={true} />
        </div>
      </div>

      {/* Fixed Native Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-slate-200 flex items-center justify-around py-2.5 z-40 shadow-lg">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-0.5 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

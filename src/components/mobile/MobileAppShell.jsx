import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { MobilePortfolio } from './MobilePortfolio';
import { TrendingUp, FileText, Briefcase, User, MoreHorizontal } from 'lucide-react';

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
    <div className="flex items-center justify-center py-8 px-4">
      {/* Phone Frame */}
      <div className="relative w-[320px] h-[660px] bg-black rounded-[40px] phone-shadow overflow-hidden flex flex-col">
        {/* Notch / Dynamic Island */}
        <div className="relative bg-[#05234e] pt-2 pb-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-10" />
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-1 text-white text-[10px] font-medium">
            <span>5:00</span>
            <div className="flex items-center gap-1">
              <span>●●●●</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {renderContent()}
        </div>

        {/* Bottom Nav */}
        <div className="bg-white border-t border-slate-200 flex items-center justify-around py-2 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobileTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-0.5 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className={`text-[9px] font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Home indicator */}
        <div className="bg-white flex justify-center py-1.5 shrink-0">
          <div className="w-24 h-1 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
};

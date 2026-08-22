import React, { useState } from 'react';
import { useTrading } from '../../../context/TradingContext';
import { Sparkles, Calendar, TrendingUp, Check, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SipSetupCard = ({ data }) => {
  const { startSip } = useTrading();
  const [amount, setAmount] = useState(data.defaultAmount || 2500);
  const [day, setDay] = useState(data.defaultDate || '10th of every month');
  const [isCreated, setIsCreated] = useState(false);

  const fund = data.fund;

  // 3-Year wealth calculation simulation assuming fund's 3Y CAGR
  const annualRate = (fund.cagr3y || 18) / 100;
  const monthlyRate = annualRate / 12;
  const months = 36;
  const totalInvested3Y = amount * months;
  const projectedFutureVal = Math.round(
    amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const projectedGain = projectedFutureVal - totalInvested3Y;

  const handleStartSip = () => {
    startSip({
      fundId: fund.id,
      amount: Number(amount),
      sipDate: day,
    });
    setIsCreated(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#1652f0', '#00b4d8', '#00a651'],
    });
  };

  if (isCreated) {
    return (
      <div className="my-2 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm">Monthly SIP Mandate Registered!</div>
            <div>₹{amount.toLocaleString('en-IN')}/mo in {fund.name}</div>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-700 font-semibold">ACTIVE</span>
      </div>
    );
  }

  return (
    <div className="my-2 p-4 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl shadow-sm text-slate-800 space-y-3.5">
      {/* Fund Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {fund.category}
            </span>
            {fund.taxSaver && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                80C Tax Saver
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-slate-900 leading-snug">{fund.name}</h4>
          <p className="text-[11px] text-slate-500">{fund.amc} • NAV: ₹{fund.nav}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-medium">3Y Returns</div>
          <div className="text-sm font-extrabold text-emerald-600">+{fund.cagr3y}% CAGR</div>
        </div>
      </div>

      {/* SIP Amount Slider */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-600">Monthly Investment</span>
          <span className="text-blue-600 font-bold text-sm">₹{amount.toLocaleString('en-IN')}/mo</span>
        </div>
        <input
          type="range"
          min="500"
          max="25000"
          step="500"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>Min ₹{fund.minSip || 500}</span>
          <span>₹10,000</span>
          <span>₹25,000</span>
        </div>
      </div>

      {/* Projection Box */}
      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1.5">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>3-Year Wealth Projection (@ {fund.cagr3y}% CAGR)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-500">Total Invested:</span>
            <div className="font-bold text-slate-800">₹{totalInvested3Y.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500">Estimated Value:</span>
            <div className="font-extrabold text-emerald-700">₹{projectedFutureVal.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Date and CTA */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1">
          <label className="block text-[10px] text-slate-500 mb-0.5">SIP Deduction Date</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full text-xs font-medium border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="5th of every month">5th of every month</option>
            <option value="10th of every month">10th of every month</option>
            <option value="15th of every month">15th of every month</option>
            <option value="25th of every month">25th of every month</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleStartSip}
          className="mt-3.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 whitespace-nowrap"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Start SIP Instantly</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTrading } from '../../../context/TradingContext';
import { Check, Flame, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const IpoBidCard = ({ data }) => {
  const { applyIpo } = useTrading();
  const { ipo } = data;
  const [lots, setLots] = useState(data.defaultLots || 1);
  const [useCutoff, setUseCutoff] = useState(true);
  const [customPrice, setCustomPrice] = useState(ipo.cutOffPrice);
  const [upiId, setUpiId] = useState(data.upiId || 'tazim@okhdfcbank');
  const [isApplied, setIsApplied] = useState(false);

  const priceToUse = useCutoff ? ipo.cutOffPrice : customPrice;
  const totalQty = ipo.lotSize * lots;
  const totalAmount = totalQty * priceToUse;

  const handleApply = () => {
    applyIpo({
      ipoId: ipo.id,
      category: 'Individual',
      lots,
      price: priceToUse,
      upiId,
    });
    setIsApplied(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#1652f0', '#00b4d8', '#ffb703'],
    });
  };

  if (isApplied) {
    return (
      <div className="my-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm">IPO Application Submitted!</div>
            <div>{lots} Lot ({totalQty} Qty) @ ₹{priceToUse} • Mandate sent to {upiId}</div>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-700 font-semibold">PENDING UPI</span>
      </div>
    );
  }

  return (
    <div className="my-2 p-4 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl shadow-sm text-slate-800 space-y-3">
      {/* IPO Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              {ipo.symbol}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-600" />
              GMP {ipo.gmp}
            </span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 leading-tight">{ipo.name}</h4>
          <p className="text-[11px] text-slate-500">Price Band: {ipo.priceRange} • Min Qty: {ipo.minQuantity}</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
          Open
        </span>
      </div>

      {/* Lot Selector */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-2.5 rounded-xl text-xs">
        <div>
          <label className="block text-[10px] text-slate-500 font-medium mb-1">Lots (1 Lot = {ipo.lotSize} shares)</label>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setLots((l) => Math.max(1, l - 1))}
              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
            >
              -
            </button>
            <span className="w-full text-center font-bold text-xs">{lots}</span>
            <button
              type="button"
              onClick={() => setLots((l) => l + 1)}
              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-medium mb-1">Total Shares & Bid</label>
          <div className="font-bold text-xs text-slate-800 pt-1">
            {totalQty} Shares @ ₹{priceToUse}
          </div>
        </div>
      </div>

      {/* Cutoff Price Checkbox & UPI */}
      <div className="space-y-2 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useCutoff}
            onChange={(e) => setUseCutoff(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-[11px] font-medium text-slate-700">Apply at Cut-off Price (₹{ipo.cutOffPrice})</span>
        </label>

        <div>
          <label className="block text-[10px] text-slate-500 mb-0.5">UPI ID for ASBA Mandate</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@okhdfcbank"
            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div>
          <span className="text-[10px] text-slate-500">Blocked Amount</span>
          <div className="font-extrabold text-sm text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</div>
        </div>
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply via UPI Mandate</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTrading } from '../../../context/TradingContext';
import { ArrowUpRight, ArrowDownRight, Check, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TradeActionCard = ({ data }) => {
  const { placeOrder } = useTrading();
  const [side, setSide] = useState(data.type || 'BUY');
  const [qty, setQty] = useState(data.qty || 10);
  const [product, setProduct] = useState(data.product || 'CNC');
  const [orderType, setOrderType] = useState(data.orderType || 'MARKET');
  const [isExecuted, setIsExecuted] = useState(false);

  const price = data.price || data.stock.ltp;
  const totalAmount = Number((qty * price).toFixed(2));

  const handleExecute = () => {
    placeOrder({
      symbol: data.stock.symbol,
      type: side,
      qty: Number(qty),
      price: price,
      product,
      orderType,
    });
    setIsExecuted(true);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#00a651', '#1652f0', '#00b4d8'],
    });
  };

  if (isExecuted) {
    return (
      <div className="my-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm">Order Executed Successfully!</div>
            <div>{side} {qty} {data.stock.symbol} @ ₹{price} ({product})</div>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-700">COMPLETED</span>
      </div>
    );
  }

  return (
    <div className="my-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">{data.stock.symbol}</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600">NSE EQ</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{data.stock.name}</p>
        </div>
        <div className="text-right">
          <div className="font-bold text-sm">₹{price.toFixed(2)}</div>
          <div className={`text-[10px] font-medium flex items-center justify-end ${data.stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {data.stock.change >= 0 ? '+' : ''}{data.stock.change}%
          </div>
        </div>
      </div>

      {/* Side Toggle (BUY / SELL) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={() => setSide('BUY')}
          className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
            side === 'BUY'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          BUY (Delivery)
        </button>
        <button
          type="button"
          onClick={() => setSide('SELL')}
          className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
            side === 'SELL'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          SELL (Exit)
        </button>
      </div>

      {/* Quantity & Order Mode Controls */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] text-slate-500 font-medium mb-1">Quantity</label>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 5))}
              className="px-2.5 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-center font-semibold text-xs py-1.5 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQty((q) => q + 5)}
              className="px-2.5 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-500 font-medium mb-1">Product Type</label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full border border-slate-200 rounded-lg py-1.5 px-2 font-medium bg-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="CNC">CNC (Delivery)</option>
            <option value="MIS">MIS (Intraday)</option>
          </select>
        </div>
      </div>

      {/* Summary & One-Click Execute */}
      <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs">
        <div>
          <span className="text-[11px] text-slate-500">Total Order Value</span>
          <div className="font-bold text-sm text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</div>
        </div>
        <button
          type="button"
          onClick={handleExecute}
          className={`px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 ${
            side === 'BUY'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Execute {side}</span>
        </button>
      </div>
    </div>
  );
};

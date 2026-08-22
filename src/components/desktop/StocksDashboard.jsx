import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatINR, formatPercent } from '../../utils/formatters';
import {
  TrendingUp, TrendingDown, Briefcase, BarChart3, ArrowRight,
  ShoppingCart, Wallet, Eye, ChevronRight, Layers, Activity
} from 'lucide-react';

export const StocksDashboard = () => {
  const {
    holdings, positions, orders, margins, portfolioMetrics,
    setActiveTab, setSelectedStockForOrder
  } = useTrading();

  const {
    totalInvested, totalCurrent, totalPnl, totalPnlPercent,
    todayPnl, todayPnlPercent, holdingsCount,
    positiveHoldingsCount, negativeHoldingsCount,
    openPositionsCount, totalMtm,
  } = portfolioMetrics;

  const tradeValue = positions.reduce((a, p) => a + p.tradeValue, 0);
  const openPnl = positions.reduce((a, p) => a + p.pnl, 0);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Dashboard Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Holdings Card */}
        <div
          onClick={() => setActiveTab('holdings')}
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Holdings</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs mb-3">
            <div>
              <span className="text-[10px] text-slate-500">Invested</span>
              <div className="font-bold text-slate-800">{formatINR(totalInvested, { compact: true })}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Current</span>
              <div className="font-bold text-slate-800">{formatINR(totalCurrent, { compact: true })}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Total P&L</span>
              <div className={`font-bold ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatINR(totalPnl, { compact: true, showSign: true })}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Today P&L</span>
              <div className={`font-bold ${todayPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatINR(todayPnl, { compact: true, showSign: true })}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 mb-1">No of holdings · {holdingsCount}</div>

          {/* P&L Distribution Bar */}
          <div className="flex h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-500 rounded-l-full transition-all"
              style={{ width: `${(positiveHoldingsCount / holdingsCount) * 100}%` }}
            />
            <div
              className="bg-rose-500 rounded-r-full transition-all"
              style={{ width: `${(negativeHoldingsCount / holdingsCount) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {positiveHoldingsCount} Positive
            </span>
            <span className="flex items-center gap-1 text-rose-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> {negativeHoldingsCount} Negative
            </span>
          </div>
        </div>

        {/* Position Card */}
        <div
          onClick={() => setActiveTab('positions')}
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Position</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs mb-3">
            <div>
              <span className="text-[10px] text-slate-500">Trade value</span>
              <div className="font-bold text-slate-800">{formatINR(tradeValue, { compact: true })}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">MTM</span>
              <div className={`font-bold ${totalMtm >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatINR(totalMtm)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Total P&L</span>
              <div className={`font-bold ${openPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatINR(openPnl)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Open P&L</span>
              <div className={`font-bold ${openPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatINR(openPnl)}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 mb-1">
            No of positions · {positions.length} / Open positions · {openPositionsCount}
          </div>

          <div className="flex h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="bg-emerald-500 rounded-full w-full transition-all" />
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {openPositionsCount} Positive
            </span>
            <span className="flex items-center gap-1 text-rose-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> 0 Negative
            </span>
          </div>
        </div>

        {/* Orders Card */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Orders</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <div className="text-lg font-extrabold text-slate-800">{orders.filter(o => o.status === 'PENDING').length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Open Orders</div>
              <div className="h-0.5 w-full bg-blue-500 rounded-full mt-1.5" />
            </div>
            <div className="text-center">
              <div className="text-lg font-extrabold text-slate-800">{orders.filter(o => o.status === 'EXECUTED').length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Executed</div>
              <div className="h-0.5 w-full bg-emerald-500 rounded-full mt-1.5" />
            </div>
            <div className="text-center">
              <div className="text-lg font-extrabold text-slate-800">0</div>
              <div className="text-[10px] text-slate-500 font-medium">Rejected</div>
              <div className="h-0.5 w-full bg-rose-500 rounded-full mt-1.5" />
            </div>
          </div>
        </div>

        {/* Margins Card */}
        <div
          onClick={() => setActiveTab('funds')}
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Margins</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-2 text-xs">
            <div>
              <div className="font-bold text-sm text-slate-800">{formatINR(margins.availableBalance)}</div>
              <div className="text-[10px] text-slate-500">Available balance</div>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">{formatINR(margins.totalCredits, { compact: true })}</div>
              <div className="text-[10px] text-slate-500">Total credits</div>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">{formatINR(margins.marginUsed, { compact: true })}</div>
              <div className="text-[10px] text-slate-500">Margin used</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Holdings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800">Top Holdings</h3>
          <button
            type="button"
            onClick={() => setActiveTab('holdings')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View details <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="text-left px-5 py-2 font-semibold">Symbol</th>
                <th className="text-right px-3 py-2 font-semibold">Qty</th>
                <th className="text-right px-3 py-2 font-semibold">Avg Price</th>
                <th className="text-right px-3 py-2 font-semibold">LTP</th>
                <th className="text-right px-3 py-2 font-semibold">Invested</th>
                <th className="text-right px-3 py-2 font-semibold">Current</th>
                <th className="text-right px-3 py-2 font-semibold">P&L</th>
                <th className="text-right px-5 py-2 font-semibold">Day Change</th>
              </tr>
            </thead>
            <tbody>
              {holdings.slice(0, 8).map((h) => (
                <tr
                  key={h.symbol}
                  className="border-t border-slate-100 hover:bg-blue-50/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedStockForOrder(h)}
                >
                  <td className="px-5 py-2.5">
                    <div className="font-bold text-slate-800">{h.symbol}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{h.name}</div>
                  </td>
                  <td className="text-right px-3 font-medium text-slate-700">{h.qty}</td>
                  <td className="text-right px-3 font-medium text-slate-700">₹{h.avgPrice.toFixed(2)}</td>
                  <td className="text-right px-3 font-bold text-slate-900">₹{h.ltp.toFixed(2)}</td>
                  <td className="text-right px-3 text-slate-600">{formatINR(h.invested)}</td>
                  <td className="text-right px-3 text-slate-800 font-medium">{formatINR(h.currentValue)}</td>
                  <td className="text-right px-3">
                    <span className={`font-bold ${h.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {h.pnl >= 0 ? '+' : ''}{formatINR(h.pnl)}
                    </span>
                    <div className={`text-[10px] ${h.pnlPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="text-right px-5">
                    <span className={`text-xs font-semibold ${(h.dayPnl || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {(h.dayPnl || 0) >= 0 ? '+' : ''}{formatINR(h.dayPnl || 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-rose-500 font-medium">
        *The securities quoted are exemplary and are not recommendatory.
      </p>
    </div>
  );
};

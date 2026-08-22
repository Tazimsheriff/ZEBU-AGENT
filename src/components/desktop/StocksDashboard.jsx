import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatINR, formatPercent } from '../../utils/formatters';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  BarChart2, Activity, CreditCard, Layers, Eye, ChevronRight
} from 'lucide-react';

const PnlBadge = ({ value, pct }) => (
  <span className={`flex items-center gap-0.5 font-bold tabular-nums ${value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
    {value >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
    {formatINR(Math.abs(value))} ({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
  </span>
);

const DistributionBar = ({ positive, negative, total }) => {
  const posPercent = total > 0 ? (positive / total) * 100 : 50;
  return (
    <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
      {Array.from({ length: positive }).map((_, i) => (
        <div key={`p-${i}`} style={{ width: `${posPercent / positive}%` }} className="bg-emerald-500 h-full" />
      ))}
      {Array.from({ length: negative }).map((_, i) => (
        <div key={`n-${i}`} style={{ width: `${(100 - posPercent) / negative}%` }} className="bg-rose-500 h-full" />
      ))}
    </div>
  );
};

export const StocksDashboard = () => {
  const { holdings, positions, orders, margins, portfolioMetrics, setSelectedStockForOrder, setActiveTab } = useTrading();

  const handleViewDetails = (type) => {
    if (type === 'holdings') setActiveTab('holdings');
    if (type === 'positions') setActiveTab('positions');
    if (type === 'orders') setActiveTab('orders');
  };

  return (
    <div className="max-w-[1400px] mx-auto p-5 space-y-5">
      {/* Dashboard Grid — exactly like mynt.zebuetrade.com/stocks screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Holdings Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-blue-700" />
              </div>
              <h3 className="font-bold text-slate-900">Holdings</h3>
            </div>
            <button onClick={() => handleViewDetails('holdings')} className="text-blue-600 text-xs font-semibold flex items-center gap-0.5 hover:underline">
              View details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
            <div>
              <p className="text-[11px] text-slate-500">Invested</p>
              <p className="font-bold text-slate-900">{formatINR(portfolioMetrics.totalInvested, { compact: true })}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Current</p>
              <p className="font-bold text-slate-900">{formatINR(portfolioMetrics.totalCurrent, { compact: true })}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Total P&L</p>
              <PnlBadge value={portfolioMetrics.totalPnl} pct={portfolioMetrics.totalPnlPercent} />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Today's P&L</p>
              <PnlBadge value={portfolioMetrics.todayPnl} pct={portfolioMetrics.todayPnlPercent} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>No of holdings — <strong className="text-slate-800">{portfolioMetrics.holdingsCount}</strong></span>
            </div>
            <DistributionBar
              positive={portfolioMetrics.positiveHoldingsCount}
              negative={portfolioMetrics.negativeHoldingsCount}
              total={portfolioMetrics.holdingsCount}
            />
            <div className="flex gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {portfolioMetrics.positiveHoldingsCount} Positive
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                {portfolioMetrics.negativeHoldingsCount} Negative
              </span>
            </div>
          </div>
        </div>

        {/* Positions Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="font-bold text-slate-900">Position</h3>
            </div>
            <button onClick={() => handleViewDetails('positions')} className="text-blue-600 text-xs font-semibold flex items-center gap-0.5 hover:underline">
              View details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {positions.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-sm text-slate-400 font-medium">NO POSITIONS</div>
          ) : (
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                <div>
                  <p className="text-[11px] text-slate-500">Trade Value</p>
                  <p className="font-bold text-slate-900">{formatINR(positions.reduce((a, p) => a + p.tradeValue, 0), { compact: true })}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">MTM</p>
                  <p className={`font-bold ${portfolioMetrics.totalMtm >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatINR(portfolioMetrics.totalMtm)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Total P&L</p>
                  <p className={`font-bold ${portfolioMetrics.totalMtm >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatINR(portfolioMetrics.totalMtm)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Open P&L</p>
                  <p className={`font-bold ${portfolioMetrics.totalMtm >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatINR(portfolioMetrics.totalMtm)}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                No of positions — <strong className="text-slate-800">{positions.length}</strong> / Open positions — <strong className="text-slate-800">{portfolioMetrics.openPositionsCount}</strong>
              </div>
              <DistributionBar
                positive={positions.filter(p => p.pnl >= 0).length || 1}
                negative={positions.filter(p => p.pnl < 0).length || 0}
                total={positions.length}
              />
              <div className="flex gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {positions.filter(p => p.pnl >= 0).length} Positive
                </span>
                <span className="flex items-center gap-1 text-slate-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  {positions.filter(p => p.pnl < 0).length} Negative
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Orders Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-purple-700" />
              </div>
              <h3 className="font-bold text-slate-900">Orders</h3>
            </div>
            <button onClick={() => handleViewDetails('orders')} className="text-blue-600 text-xs font-semibold flex items-center gap-0.5 hover:underline">
              View details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Open Orders', value: orders.filter(o => o.status === 'PENDING').length, color: 'text-blue-600' },
              { label: 'Execute Orders', value: orders.filter(o => o.status === 'EXECUTED').length, color: 'text-emerald-600' },
              { label: 'Rejected', value: orders.filter(o => o.status === 'REJECTED').length, color: 'text-rose-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 rounded-xl p-3">
                <div className={`font-black text-2xl ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Margins Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-yellow-700" />
              </div>
              <h3 className="font-bold text-slate-900">Margins</h3>
            </div>
            <button className="text-blue-600 text-xs font-semibold flex items-center gap-0.5 hover:underline">
              View details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="font-black text-lg text-slate-900">{formatINR(margins.availableBalance, { compact: true })}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Available balance</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="font-black text-lg text-rose-600">{formatINR(margins.totalCredits, { compact: true })}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Total credits</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="font-black text-lg text-rose-600">{formatINR(margins.marginUsed, { compact: true })}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Margin used</div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Top Holdings</h3>
          <button onClick={() => setActiveTab('holdings')} className="text-blue-600 text-xs font-semibold flex items-center gap-0.5 hover:underline">
            View all {portfolioMetrics.holdingsCount} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[10px]">
                <th className="px-5 py-3 text-left font-semibold">Instrument</th>
                <th className="px-3 py-3 text-right font-semibold">Qty</th>
                <th className="px-3 py-3 text-right font-semibold">Avg / LTP</th>
                <th className="px-3 py-3 text-right font-semibold">Invested</th>
                <th className="px-3 py-3 text-right font-semibold">Current</th>
                <th className="px-3 py-3 text-right font-semibold">P&L (Total)</th>
                <th className="px-3 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holdings.slice(0, 8).map((h) => (
                <tr key={h.symbol} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="font-bold text-slate-900">{h.symbol}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{h.name}</div>
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700 font-medium tabular-nums">{h.qty}</td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <div className="text-slate-500">{formatINR(h.avgPrice)}</div>
                    <div className="font-bold text-slate-900">{formatINR(h.ltp)}</div>
                  </td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-700">{formatINR(h.invested)}</td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-900">{formatINR(h.currentValue)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <div className={`font-bold ${h.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {h.pnl >= 0 ? '+' : ''}{formatINR(h.pnl)}
                    </div>
                    <div className={`text-[10px] ${h.pnlPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => setSelectedStockForOrder(h)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-[10px] text-slate-400 py-3 border-t border-slate-100">
          *The securities quoted are exemplary and are not recommendatory.
        </p>
      </div>
    </div>
  );
};

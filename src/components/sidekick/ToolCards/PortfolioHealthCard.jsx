import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, PieChart, Sparkles } from 'lucide-react';
import { formatINR } from '../../../utils/formatters';

export const PortfolioHealthCard = ({ data }) => {
  const { metrics, riskScore, riskLabel, recommendation, sectorBreakdown } = data;

  return (
    <div className="my-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 space-y-3.5">
      {/* Risk Health Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Portfolio Health Check</h4>
            <p className="text-[10px] text-slate-500">Live Asset Allocation Diagnostic</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-medium">Risk Score</div>
          <div className="inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            <span>{riskScore}/100</span>
          </div>
        </div>
      </div>

      {/* Overview Numbers */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
        <div>
          <span className="text-[10px] text-slate-500">Net Portfolio Value</span>
          <div className="font-bold text-sm text-slate-900">{formatINR(metrics.totalCurrent)}</div>
        </div>
        <div>
          <span className="text-[10px] text-slate-500">Total Unrealized P&L</span>
          <div className={`font-bold text-sm ${metrics.totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {metrics.totalPnl >= 0 ? '+' : ''}{formatINR(metrics.totalPnl)} ({metrics.totalPnlPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Sector Exposure Breakdown */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-700 flex justify-between">
          <span>Sector Exposure</span>
          <span className="text-[10px] text-slate-400 font-normal">Target Diversified</span>
        </div>
        {/* Multi-segmented bar */}
        <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
          {sectorBreakdown.map((sec, idx) => (
            <div
              key={idx}
              style={{ width: `${sec.percent}%`, backgroundColor: sec.color }}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all"
              title={`${sec.sector}: ${sec.percent}%`}
            />
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-600 pt-1">
          {sectorBreakdown.map((sec, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sec.color }} />
              <span>{sec.sector} ({sec.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation Alert */}
      <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs flex items-start gap-2 text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[11px] block">AI Copilot Recommendation</span>
          <p className="text-[11px] text-amber-800 leading-snug mt-0.5">{recommendation}</p>
        </div>
      </div>
    </div>
  );
};

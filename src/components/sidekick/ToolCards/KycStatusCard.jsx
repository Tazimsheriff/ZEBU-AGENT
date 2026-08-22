import React from 'react';
import { useTrading } from '../../../context/TradingContext';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const KycStatusCard = ({ data }) => {
  const { setOnboardingOpen } = useTrading();
  const { userProfile, steps } = data;

  return (
    <div className="my-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Zebu Instant Onboarding</h4>
            <p className="text-[10px] text-slate-500">Client Code: {userProfile.clientCode}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          KYC Ready
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-2 text-xs">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2">
              {step.status === 'COMPLETED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span className="font-medium text-[11px] text-slate-800">{step.name}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{step.date}</span>
          </div>
        ))}
      </div>

      {/* Button to open complete wizard */}
      <button
        type="button"
        onClick={() => setOnboardingOpen(true)}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>View Full Onboarding & Account Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

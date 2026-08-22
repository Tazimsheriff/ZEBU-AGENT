import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, Smartphone, CreditCard, Fingerprint, X } from 'lucide-react';

export const OnboardingFlow = () => {
  const { onboardingOpen, setOnboardingOpen, userProfile, completeKyc } = useTrading();
  const [step, setStep] = useState(0);
  const [pan, setPan] = useState(userProfile.pan || '');
  const [name, setName] = useState(userProfile.name || '');

  if (!onboardingOpen) return null;

  const steps = [
    { title: 'PAN Verification', icon: CreditCard, status: 'complete' },
    { title: 'Aadhaar e-KYC', icon: Fingerprint, status: 'complete' },
    { title: 'Bank Account Linking', icon: CreditCard, status: 'complete' },
    { title: 'Risk Profile & Activation', icon: ShieldCheck, status: 'active' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOnboardingOpen(false)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="font-bold text-base text-slate-900">Zebu mynt Onboarding</h3>
            <p className="text-[10px] text-slate-500">Instant KYC & Account Activation</p>
          </div>
          <button
            type="button"
            onClick={() => setOnboardingOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Progress Steps */}
          <div className="space-y-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isComplete = s.status === 'complete';
              const isActive = s.status === 'active';

              return (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive ? 'bg-blue-50 border border-blue-200' : isComplete ? 'bg-emerald-50/50' : 'bg-slate-50'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isComplete ? 'bg-emerald-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-xs text-slate-800">{s.title}</div>
                    <div className="text-[10px] text-slate-500">
                      {isComplete ? 'Verified' : isActive ? 'In Progress' : 'Pending'}
                    </div>
                  </div>
                  {isComplete && <span className="text-[10px] font-bold text-emerald-600">✓ Done</span>}
                  {isActive && <span className="text-[10px] font-bold text-blue-600">Current</span>}
                </div>
              );
            })}
          </div>

          {/* Account Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-sm text-slate-800">Account Details</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Client Code</span>
                <div className="font-bold text-slate-800">{userProfile.clientCode}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">PAN</span>
                <div className="font-bold text-slate-800">{userProfile.pan}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Risk Category</span>
                <div className="font-bold text-slate-800">{userProfile.riskCategory}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Bank Account</span>
                <div className="font-bold text-slate-800">{userProfile.bankAccount}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Mobile</span>
                <div className="font-bold text-slate-800">{userProfile.mobile}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Email</span>
                <div className="font-bold text-slate-800">{userProfile.email}</div>
              </div>
            </div>
          </div>

          {/* Demo Mode Badge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Demo Mode Active</span> — Paper trading wallet with ₹65,000 credited. No real orders are placed.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOnboardingOpen(false)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all active:scale-95"
          >
            Close & Continue Trading
          </button>
        </div>
      </div>
    </div>
  );
};

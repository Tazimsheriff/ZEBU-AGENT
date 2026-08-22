import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  CheckCircle2, Circle, ArrowRight, Shield, CreditCard,
  User, FileText, TrendingUp, X, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

const steps = [
  { id: 1, title: 'Enter PAN Card', subtitle: 'Verify your PAN with NSDL/CDSL', icon: FileText },
  { id: 2, title: 'Aadhaar e-KYC', subtitle: 'DigiLocker linking in 30 seconds', icon: Shield },
  { id: 3, title: 'Personal Details', subtitle: 'Name, DOB, Address verification', icon: User },
  { id: 4, title: 'Link Bank Account', subtitle: 'IFSC & penny drop verification', icon: CreditCard },
  { id: 5, title: 'Risk Profiler', subtitle: 'Customize your investment journey', icon: TrendingUp },
];

export const OnboardingFlow = () => {
  const { setOnboardingOpen, completeKyc, addNotification } = useTrading();
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro
  const [formData, setFormData] = useState({
    pan: 'ABCDE1234F',
    name: 'Tazim Merchant',
    dob: '1994-06-15',
    mobile: '+91 98765 43210',
    email: 'tazim@example.com',
    aadhaar: '1234 5678 9012',
    bank: 'HDFC Bank',
    accountNo: '50100123456789',
    ifsc: 'HDFC0001234',
    riskProfile: 'Moderate Growth',
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    completeKyc(formData);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#1652f0', '#00b4d8', '#00a651', '#ffd700'],
    });
  };

  const handleField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="gradient-zebu text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl">Open Zebu Account</h2>
            <p className="text-white/70 text-sm">Free instant account — Regulated by SEBI</p>
          </div>
          <button onClick={() => setOnboardingOpen(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {isCompleted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="font-black text-2xl text-slate-900">Account Activated! 🎉</h3>
            <p className="text-slate-500">Welcome to Zebu mynt, <strong>{formData.name}</strong>! Your trading and mutual fund account is fully verified and ready.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Client Code</span><strong className="text-blue-700">ZB88492</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Segments</span><strong className="text-slate-900">NSE, BSE, Derivatives, MF</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><strong className="text-emerald-600">KYC Verified ✓</strong></div>
            </div>
            <button
              onClick={() => setOnboardingOpen(false)}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Zap className="w-4 h-4" /> Start Investing Now
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Progress Steps */}
            <div className="flex items-center gap-1">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs shrink-0 transition-all ${
                    currentStep > idx
                      ? 'bg-emerald-600 text-white'
                      : currentStep === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentStep > idx ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 rounded-full transition-all ${currentStep > idx ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Intro Screen */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900">Complete KYC in 2 minutes</h3>
                <div className="space-y-2">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-900">{step.title}</div>
                          <div className="text-[11px] text-slate-500">{step.subtitle}</div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Begin KYC Process <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 1: PAN */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900">Enter your PAN Card</h3>
                <input type="text" value={formData.pan} onChange={e => handleField('pan', e.target.value.toUpperCase())}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 font-mono text-lg font-bold text-center tracking-widest focus:outline-none focus:border-blue-500"
                  placeholder="ABCDE1234F" maxLength={10} />
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PAN verified with NSDL — <strong>{formData.name}</strong></span>
                </div>
                <button onClick={() => setCurrentStep(2)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Continue</button>
              </div>
            )}

            {/* Step 2: Aadhaar */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900">Aadhaar e-KYC via DigiLocker</h3>
                <input type="text" value={formData.aadhaar} onChange={e => handleField('aadhaar', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 font-mono text-base font-bold text-center tracking-widest focus:outline-none focus:border-blue-500"
                  placeholder="1234 5678 9012" />
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Identity & Address verified via UIDAI DigiLocker</span>
                </div>
                <button onClick={() => setCurrentStep(3)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Continue</button>
              </div>
            )}

            {/* Step 3: Personal */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-slate-900">Personal Details</h3>
                {[
                  { label: 'Full Name', key: 'name', type: 'text' },
                  { label: 'Date of Birth', key: 'dob', type: 'date' },
                  { label: 'Mobile Number', key: 'mobile', type: 'tel' },
                  { label: 'Email Address', key: 'email', type: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">{f.label}</label>
                    <input type={f.type} value={formData[f.key]} onChange={e => handleField(f.key, e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                ))}
                <button onClick={() => setCurrentStep(4)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Continue</button>
              </div>
            )}

            {/* Step 4: Bank Account */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-slate-900">Link Bank Account</h3>
                {[
                  { label: 'Bank Name', key: 'bank', type: 'text' },
                  { label: 'Account Number', key: 'accountNo', type: 'text' },
                  { label: 'IFSC Code', key: 'ifsc', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">{f.label}</label>
                    <input type={f.type} value={formData[f.key]} onChange={e => handleField(f.key, e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                ))}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Penny drop verified — HDFC Bank account linked successfully</span>
                </div>
                <button onClick={() => setCurrentStep(5)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Continue</button>
              </div>
            )}

            {/* Step 5: Risk Profile */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900">Your Investment Profile</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Conservative', 'Moderate Growth', 'Aggressive', 'Ultra Aggressive'].map(r => (
                    <button
                      key={r}
                      onClick={() => handleField('riskProfile', r)}
                      className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all ${
                        formData.riskProfile === r
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {r}
                      <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                        {r === 'Conservative' ? 'FDs, Bonds, Liquid Funds' :
                         r === 'Moderate Growth' ? 'Balanced Mutual Funds + ETFs' :
                         r === 'Aggressive' ? 'Mid/Small Cap + Direct Stocks' :
                         'F&O, Small Cap, Penny Stocks'}
                      </span>
                    </button>
                  ))}
                </div>
                <button onClick={handleComplete} className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/30">
                  <Zap className="w-4 h-4 fill-current" /> Activate My Zebu Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

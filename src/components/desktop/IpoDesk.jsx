import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatINR } from '../../utils/formatters';
import { Flame, Clock, X, Check, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const IpoDesk = () => {
  const { ipos, appliedIpos, applyIpo, selectedIpoForModal, setSelectedIpoForModal } = useTrading();
  const [ipoTab, setIpoTab] = useState('mainstream'); // 'mainstream' | 'sme'

  const mainstream = ipos.filter(i => i.type === 'Main Stream');
  const sme = ipos.filter(i => i.type === 'SME IPO');
  const activeList = ipoTab === 'mainstream' ? mainstream : sme;

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">IPO Application Desk</h2>
        <p className="text-xs text-slate-500">Apply for Main Stream & SME IPOs instantly with UPI ASBA via Zebu mynt</p>
      </div>

      {/* IPO Type Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIpoTab('mainstream')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            ipoTab === 'mainstream'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Main stream IPOs <span className="text-[10px] font-bold bg-white/20 rounded px-1">{mainstream.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setIpoTab('sme')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            ipoTab === 'sme'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          SME IPOs <span className="text-[10px] font-bold bg-white/20 rounded px-1">{sme.length}</span>
        </button>
      </div>

      {/* IPO Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left">
              <th className="px-5 py-3 font-semibold">Stock name</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Price Band</th>
              <th className="px-3 py-3 font-semibold">Issue Size</th>
              <th className="px-3 py-3 font-semibold">GMP</th>
              <th className="px-3 py-3 font-semibold text-right">Subscription</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeList.map(ipo => {
              const isApplied = appliedIpos.some(a => a.ipoId === ipo.id);
              return (
                <tr key={ipo.id} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-bold text-slate-800 text-sm">{ipo.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{ipo.symbol}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">IPO</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ipo.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ipo.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-700">{ipo.priceRange}</td>
                  <td className="px-3 py-3 text-slate-600">{ipo.issueSize}</td>
                  <td className="px-3 py-3">
                    <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {ipo.gmp}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-medium">
                    <div className="text-slate-700">Retail: {ipo.subscription.retail}</div>
                    <div className="text-[10px] text-slate-500">Total: {ipo.subscription.total}</div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {isApplied ? (
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        ✓ Applied
                      </span>
                    ) : ipo.status === 'Open' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedIpoForModal(ipo)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-all active:scale-95"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">Coming Soon</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* IPO Application Modal */}
      {selectedIpoForModal && <IpoApplicationModal ipo={selectedIpoForModal} />}
    </div>
  );
};

/* Modal matching the Pine Labs IPO screenshot exactly */
const IpoApplicationModal = ({ ipo }) => {
  const { applyIpo, setSelectedIpoForModal } = useTrading();
  const [lots, setLots] = useState(1);
  const [category, setCategory] = useState('Individual');
  const [bidPrice, setBidPrice] = useState(ipo.cutOffPrice);
  const [useCutoff, setUseCutoff] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalQty = ipo.lotSize * lots;
  const totalInvestment = totalQty * (useCutoff ? ipo.cutOffPrice : bidPrice);

  const handleSubmit = () => {
    applyIpo({
      ipoId: ipo.id,
      category,
      lots,
      price: useCutoff ? ipo.cutOffPrice : bidPrice,
    });
    setIsSubmitted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => {
      setSelectedIpoForModal(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedIpoForModal(null)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="font-bold text-base text-slate-900">IPO Application</h3>
          <button
            type="button"
            onClick={() => setSelectedIpoForModal(null)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">Application Submitted!</h4>
              <p className="text-sm text-slate-500 mt-1">UPI Mandate sent. Approve in your UPI app.</p>
            </div>
          ) : (
            <>
              {/* IPO Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-sm text-slate-900">{ipo.name}</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{ipo.symbol}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">IPO</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="block font-bold text-base text-slate-900">{ipo.minQuantity}</span>
                    <span className="text-[10px]">Min. quantity</span>
                  </div>
                  <div>
                    <span className="block font-bold text-base text-slate-900">{ipo.priceRange}</span>
                    <span className="text-[10px]">Price range</span>
                  </div>
                  <div>
                    <span className="block font-bold text-base text-slate-900">{ipo.issueSize}</span>
                    <span className="text-[10px]">IPO Size</span>
                  </div>
                </div>
              </div>

              {/* Close Date Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>IPO window is open till {ipo.closeDate}</span>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500"
                >
                  <option>Individual</option>
                  <option>HUF</option>
                </select>
              </div>

              {/* Bid & Lots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Lots</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button type="button" onClick={() => setLots(l => Math.max(1, l - 1))} className="px-3 py-2 bg-slate-50 font-bold text-slate-600 hover:bg-slate-100">-</button>
                    <span className="flex-1 text-center font-bold text-sm">{lots}</span>
                    <button type="button" onClick={() => setLots(l => l + 1)} className="px-3 py-2 bg-slate-50 font-bold text-slate-600 hover:bg-slate-100">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Bid Price</label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 gap-2">
                    <input
                      type="checkbox"
                      checked={useCutoff}
                      onChange={e => setUseCutoff(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-xs font-medium text-slate-700">Cut-off (₹{ipo.cutOffPrice})</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500">Total investment : </span>
                  <span className="text-sm font-extrabold text-blue-700">₹{totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedIpoForModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

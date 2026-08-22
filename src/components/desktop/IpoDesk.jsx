import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAgent } from '../../context/AgentContext';
import { Flame, X, ChevronDown, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const IpoModal = ({ ipo, onClose }) => {
  const { applyIpo } = useTrading();
  const [lots, setLots] = useState(1);
  const [useCutoff, setUseCutoff] = useState(true);
  const [upiId, setUpiId] = useState('tazim@okhdfcbank');
  const [applied, setApplied] = useState(false);

  const price = useCutoff ? ipo.cutOffPrice : ipo.minPrice;
  const totalQty = ipo.lotSize * lots;
  const total = totalQty * price;

  const handleApply = () => {
    applyIpo({ ipoId: ipo.id, category: 'Individual', lots, price, upiId });
    setApplied(true);
    confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 }, colors: ['#1652f0','#00b4d8','#ffd700'] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-900">IPO Application</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {applied ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Application Submitted!</h3>
            <p className="text-sm text-slate-500">Your bid for <strong>{ipo.name}</strong> has been submitted. UPI mandate sent to <strong>{upiId}</strong>.</p>
            <button onClick={onClose} className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-xl">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* IPO Details */}
            <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{ipo.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">{ipo.symbol}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">IPO</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs mt-2">
                  <div>
                    <div className="font-bold text-slate-900">{ipo.minQuantity}</div>
                    <div className="text-slate-500">Min. quantity</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{ipo.priceRange}</div>
                    <div className="text-slate-500">Price range</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{ipo.issueSize}</div>
                    <div className="text-slate-500">IPO Size</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Close date */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-800 font-medium flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              IPO window is open till <strong>{ipo.closeDate}</strong>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
              <div className="border border-slate-200 rounded-xl px-3 py-2.5 flex items-center justify-between text-sm text-slate-700">
                <span>Individual</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Bid-01 */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-700">Bid-01</div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Lots</label>
                  <div className="flex items-center border border-slate-200 rounded-lg mt-1">
                    <button onClick={() => setLots(l => Math.max(1, l - 1))} className="px-2.5 py-1.5 text-slate-600 font-bold hover:bg-slate-50 rounded-l-lg">-</button>
                    <span className="flex-1 text-center font-bold text-sm">{lots}</span>
                    <button onClick={() => setLots(l => l + 1)} className="px-2.5 py-1.5 text-slate-600 font-bold hover:bg-slate-50 rounded-r-lg">+</button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Qty</label>
                  <div className="mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 text-center">{totalQty}</div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Price</label>
                  <div className={`mt-1 border rounded-lg px-3 py-1.5 text-sm font-bold text-center ${useCutoff ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-slate-200'}`}>
                    {useCutoff ? `₹${ipo.cutOffPrice}` : `₹${ipo.minPrice}`}
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={useCutoff} onChange={e => setUseCutoff(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                <span className="font-medium text-slate-700">Bid at Cut-off Price</span>
              </label>
            </div>

            {/* UPI ID */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Total & Action */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="text-sm text-slate-600">
                Total investment: <span className="font-bold text-blue-700">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={onClose} className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
                <button onClick={handleApply} className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800">Continue</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const IpoDesk = () => {
  const { ipos, appliedIpos, setSelectedIpoForModal, selectedIpoForModal } = useTrading();
  const { sendMessage } = useAgent();
  const [activeIPOTab, setActiveIPOTab] = useState('mainstream');

  const mainIPOs = ipos.filter(i => i.type === 'Main Stream');
  const smeIPOs = ipos.filter(i => i.type === 'SME IPO');
  const displayedIPOs = activeIPOTab === 'mainstream' ? mainIPOs : smeIPOs;

  return (
    <div className="max-w-[1400px] mx-auto p-5">
      {selectedIpoForModal && (
        <IpoModal ipo={selectedIpoForModal} onClose={() => setSelectedIpoForModal(null)} />
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#05234e] to-[#1652f0] rounded-3xl p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-black text-2xl mb-2">IPO & New Listings</h1>
          <p className="text-white/70 text-sm mb-5">Apply for upcoming IPOs in seconds via Zebu mynt. One UPI. Zero paperwork.</p>
          <div className="flex flex-wrap gap-6 text-center">
            {[
              { label: 'Investing on main IPOs', icon: '📊' },
              { label: 'Via UPI', icon: '💳' },
              { label: 'Gains post listing', icon: '📈' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IPO Tabs */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveIPOTab('mainstream')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeIPOTab === 'mainstream' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Main stream IPOs
          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full ${activeIPOTab === 'mainstream' ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700'}`}>
            {mainIPOs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveIPOTab('sme')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeIPOTab === 'sme' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          SME IPOs
          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full ${activeIPOTab === 'sme' ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700'}`}>
            {smeIPOs.length}
          </span>
        </button>
      </div>

      {/* IPO Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3 text-left font-semibold">Stock Name</th>
              <th className="px-3 py-3 text-left font-semibold">IPO Date</th>
              <th className="px-3 py-3 text-left font-semibold">Status</th>
              <th className="px-3 py-3 text-right font-semibold">Price Range</th>
              <th className="px-3 py-3 text-right font-semibold">Subscription</th>
              <th className="px-3 py-3 text-right font-semibold">GMP</th>
              <th className="px-3 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedIPOs.map((ipo) => {
              const alreadyApplied = appliedIpos.some(a => a.ipoId === ipo.id);
              return (
                <tr key={ipo.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-bold text-slate-900">{ipo.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">{ipo.symbol}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">IPO</span>
                          {ipo.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">{ipo.badge}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-slate-600">{ipo.openDate}</div>
                    <div className="text-[10px] text-slate-400">{ipo.closeDate.split(' ').slice(0, 3).join(' ')}</div>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                      ipo.status === 'Open' ? 'bg-emerald-100 text-emerald-700' :
                      ipo.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {ipo.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-slate-900">{ipo.priceRange}</td>
                  <td className="px-3 py-4 text-right">
                    {ipo.subscription.total !== '-' ? (
                      <div className="font-bold text-blue-700">{ipo.subscription.total}</div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                    {ipo.subscription.retail !== '-' && (
                      <div className="text-[10px] text-slate-400">Retail: {ipo.subscription.retail}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right font-bold text-emerald-600">{ipo.gmp}</td>
                  <td className="px-3 py-4 text-center">
                    {alreadyApplied ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : ipo.status === 'Open' ? (
                      <button
                        onClick={() => setSelectedIpoForModal(ipo)}
                        className="text-[11px] font-bold px-4 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <button className="text-[11px] font-bold px-4 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                        Notify Me
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-center text-[10px] text-slate-400 py-3 border-t border-slate-100">
          *The securities quoted are exemplary and are not recommendatory.
        </p>
      </div>

      {/* Applied IPOs */}
      {appliedIpos.length > 0 && (
        <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h3 className="font-bold text-emerald-900 mb-3">Your IPO Applications ({appliedIpos.length})</h3>
          <div className="space-y-2">
            {appliedIpos.map(app => (
              <div key={app.id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{app.name}</span>
                  <span className="ml-2 text-slate-500">{app.lots} Lot • {app.qty} Qty @ ₹{app.price}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">₹{app.totalAmount.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-amber-700 font-semibold">{app.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialHoldings, initialMutualFundHoldings } from '../data/mockHoldings';
import { initialPositions, initialOrders, initialMargins } from '../data/mockPositions';
import { initialIndices, searchableInstruments } from '../data/mockMarketData';
import { iposList } from '../data/mockIpos';
import { mutualFundsList } from '../data/mockMutualFunds';

const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  // Auto-detect mobile vs desktop layout
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 840;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 840);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation & View
  const [activeTab, setActiveTab] = useState('stocks'); // 'stocks' | 'mutualfunds' | 'ipos' | 'positions' | 'holdings' | 'orders' | 'funds'
  const [mobileTab, setMobileTab] = useState('portfolio'); // 'watchlist' | 'orders' | 'portfolio' | 'profile' | 'more'
  const [mobilePortfolioSubTab, setMobilePortfolioSubTab] = useState('holdings'); // 'holdings' | 'positions'
  const [mobileHoldingsTimeframe, setMobileHoldingsTimeframe] = useState('today'); // 'today' | 'total'

  // Portfolio State
  const [holdings, setHoldings] = useState(initialHoldings);
  const [mfHoldings, setMfHoldings] = useState(initialMutualFundHoldings);
  const [positions, setPositions] = useState(initialPositions);
  const [orders, setOrders] = useState(initialOrders);
  const [margins, setMargins] = useState(initialMargins);
  const [indices, setIndices] = useState(initialIndices);
  const [ipos, setIpos] = useState(iposList);
  const [mutualFunds, setMutualFunds] = useState(mutualFundsList);
  const [appliedIpos, setAppliedIpos] = useState([]);

  // Active Modals & Selection
  const [selectedIpoForModal, setSelectedIpoForModal] = useState(null);
  const [selectedStockForOrder, setSelectedStockForOrder] = useState(null);
  const [selectedMfForSip, setSelectedMfForSip] = useState(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // User Profile / Onboarding State
  const [userProfile, setUserProfile] = useState({
    name: 'Tazim Merchant',
    clientCode: 'ZB88492',
    pan: 'ABCDE1234F',
    kycStatus: 'Verified', // 'Unverified' | 'InProgress' | 'Verified'
    riskCategory: 'Moderate Growth',
    mobile: '+91 98765 43210',
    email: 'tazim@zebuetrade.com',
    bankAccount: 'HDFC Bank ****4902',
    demoMode: true,
  });

  // Notifications Toast
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to Zebu mynt! Your trading engine is connected.', type: 'info', time: 'Just now' }
  ]);

  const addNotification = (text, type = 'success') => {
    const newNotif = {
      id: Date.now(),
      text,
      type,
      time: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
  };

  // Real-time market tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random fluctuation in indices
      setIndices((prev) =>
        prev.map((idx) => {
          const delta = (Math.random() - 0.49) * (idx.value * 0.0006);
          const newVal = Number((idx.value + delta).toFixed(2));
          const newChange = Number((idx.change + delta).toFixed(2));
          const newPercent = Number(((newChange / (newVal - newChange)) * 100).toFixed(2));
          return {
            ...idx,
            value: newVal,
            change: newChange,
            changePercent: newPercent,
          };
        })
      );

      // Micro ticks on some holdings
      setHoldings((prev) =>
        prev.map((h) => {
          if (Math.random() > 0.6) {
            const priceDelta = (Math.random() - 0.48) * (h.ltp * 0.002);
            const newLtp = Number(Math.max(1, h.ltp + priceDelta).toFixed(2));
            const newCurrent = Number((newLtp * h.qty).toFixed(2));
            const newPnl = Number((newCurrent - h.invested).toFixed(2));
            const newPnlPercent = Number(((newPnl / h.invested) * 100).toFixed(2));
            return {
              ...h,
              ltp: newLtp,
              currentValue: newCurrent,
              pnl: newPnl,
              pnlPercent: newPnlPercent,
            };
          }
          return h;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Total Portfolio Metrics Computation
  const portfolioMetrics = React.useMemo(() => {
    const totalInvestedEquity = holdings.reduce((acc, item) => acc + item.invested, 0);
    const totalCurrentEquity = holdings.reduce((acc, item) => acc + item.currentValue, 0);
    const totalInvestedMf = mfHoldings.reduce((acc, item) => acc + item.invested, 0);
    const totalCurrentMf = mfHoldings.reduce((acc, item) => acc + item.currentValue, 0);

    const totalInvested = totalInvestedEquity + totalInvestedMf;
    const totalCurrent = totalCurrentEquity + totalCurrentMf;
    const totalPnl = totalCurrent - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

    const todayPnlEquity = holdings.reduce((acc, item) => acc + (item.dayPnl || 0), 0);
    const todayPnlPercent = totalCurrentEquity > 0 ? (todayPnlEquity / totalCurrentEquity) * 100 : 0;

    const positiveHoldingsCount = holdings.filter((h) => h.pnl >= 0).length;
    const negativeHoldingsCount = holdings.filter((h) => h.pnl < 0).length;

    const openPositionsCount = positions.filter((p) => p.status === 'OPEN').length;
    const totalMtm = positions.reduce((acc, p) => acc + (p.mtm || 0), 0);

    return {
      totalInvested,
      totalCurrent,
      totalPnl,
      totalPnlPercent,
      todayPnl: todayPnlEquity,
      todayPnlPercent,
      holdingsCount: holdings.length,
      positiveHoldingsCount,
      negativeHoldingsCount,
      openPositionsCount,
      totalMtm,
    };
  }, [holdings, mfHoldings, positions]);

  // Order Execution Function
  const placeOrder = ({ symbol, type, qty, price, product = 'CNC', orderType = 'MARKET' }) => {
    const executionPrice = orderType === 'MARKET' ? (price || 100) : price;
    const totalVal = executionPrice * qty;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      symbol,
      type, // 'BUY' | 'SELL'
      orderType,
      product,
      qty: Number(qty),
      price: Number(executionPrice),
      triggerPrice: 0,
      status: 'EXECUTED',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (type === 'BUY') {
      // Add or update holding
      setHoldings((prev) => {
        const existing = prev.find((h) => h.symbol === symbol);
        if (existing) {
          const newQty = existing.qty + Number(qty);
          const newInvested = existing.invested + totalVal;
          const newAvg = Number((newInvested / newQty).toFixed(2));
          const newCurrent = Number((executionPrice * newQty).toFixed(2));
          return prev.map((h) =>
            h.symbol === symbol
              ? {
                  ...h,
                  qty: newQty,
                  npq: newQty,
                  avgPrice: newAvg,
                  invested: newInvested,
                  currentValue: newCurrent,
                  ltp: executionPrice,
                  pnl: newCurrent - newInvested,
                  pnlPercent: Number((((newCurrent - newInvested) / newInvested) * 100).toFixed(2)),
                }
              : h
          );
        } else {
          return [
            {
              symbol,
              name: symbol.replace('-EQ', ''),
              qty: Number(qty),
              npq: Number(qty),
              avgPrice: Number(executionPrice),
              invested: totalVal,
              ltp: Number(executionPrice),
              currentValue: totalVal,
              pnl: 0,
              pnlPercent: 0,
              dayPnl: 0,
              dayPnlPercent: 0,
              sector: 'Equity',
              type: 'STOCK',
            },
            ...prev,
          ];
        }
      });

      // Deduct margin
      setMargins((prev) => ({
        ...prev,
        availableBalance: Math.max(0, prev.availableBalance - totalVal),
      }));

      addNotification(`Order Executed: Bought ${qty} ${symbol} @ ₹${executionPrice}`);
    } else {
      // SELL order
      setHoldings((prev) =>
        prev
          .map((h) => {
            if (h.symbol === symbol) {
              const remQty = Math.max(0, h.qty - Number(qty));
              if (remQty === 0) return null;
              const newInvested = remQty * h.avgPrice;
              const newCurrent = remQty * executionPrice;
              return {
                ...h,
                qty: remQty,
                npq: remQty,
                invested: newInvested,
                currentValue: newCurrent,
                pnl: newCurrent - newInvested,
              };
            }
            return h;
          })
          .filter(Boolean)
      );

      // Add credit to margin
      setMargins((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance + totalVal,
      }));

      addNotification(`Order Executed: Sold ${qty} ${symbol} @ ₹${executionPrice}`);
    }

    return newOrder;
  };

  // Mutual Fund SIP Function
  const startSip = ({ fundId, amount, sipDate = '10th of every month', investmentType = 'SIP' }) => {
    const fund = mutualFunds.find((f) => f.id === fundId) || {
      id: fundId,
      name: fundId,
      nav: 100,
      category: 'Equity',
      risk: 'High',
      rating: 5,
    };

    const numAmount = Number(amount);
    const addedUnits = Number((numAmount / fund.nav).toFixed(3));

    setMfHoldings((prev) => {
      const existing = prev.find((m) => m.id === fund.id);
      if (existing) {
        const newUnits = existing.units + addedUnits;
        const newInvested = existing.invested + numAmount;
        const newCurrent = Number((newUnits * fund.nav).toFixed(2));
        return prev.map((m) =>
          m.id === fund.id
            ? {
                ...m,
                units: newUnits,
                invested: newInvested,
                currentValue: newCurrent,
                sipAmount: numAmount,
                pnl: newCurrent - newInvested,
              }
            : m
        );
      } else {
        return [
          {
            id: fund.id,
            schemeName: fund.name,
            folioNo: `ZB${Math.floor(10000000 + Math.random() * 90000000)}/01`,
            units: addedUnits,
            nav: fund.nav,
            invested: numAmount,
            currentValue: numAmount,
            pnl: 0,
            pnlPercent: 0,
            sipAmount: numAmount,
            sipDate: sipDate,
            category: fund.category,
            risk: fund.risk,
            rating: fund.rating,
          },
          ...prev,
        ];
      }
    });

    addNotification(`SIP Active: ₹${numAmount}/mo registered for ${fund.name}`);
  };

  // IPO Application Function
  const applyIpo = ({ ipoId, category = 'Individual', lots = 1, price, upiId = 'user@okhdfcbank' }) => {
    const ipo = ipos.find((i) => i.id === ipoId);
    if (!ipo) return false;

    const chosenPrice = price || ipo.cutOffPrice;
    const totalQty = ipo.lotSize * lots;
    const totalAmount = totalQty * chosenPrice;

    const application = {
      id: `APP-IPO-${Math.floor(10000 + Math.random() * 90000)}`,
      ipoId: ipo.id,
      name: ipo.name,
      symbol: ipo.symbol,
      category,
      lots,
      qty: totalQty,
      price: chosenPrice,
      totalAmount,
      upiId,
      status: 'Submitted / Mandate Pending',
      appliedAt: new Date().toLocaleString('en-IN'),
    };

    setAppliedIpos((prev) => [application, ...prev]);
    addNotification(`IPO Bid Submitted: ${ipo.name} (${lots} Lot - ₹${totalAmount.toLocaleString('en-IN')})`);
    return application;
  };

  // Complete KYC / Onboarding
  const completeKyc = (data) => {
    setUserProfile((prev) => ({
      ...prev,
      ...data,
      kycStatus: 'Verified',
    }));
    addNotification('KYC Verified! Your Zebu trading and mutual funds account is active.');
  };

  return (
    <TradingContext.Provider
      value={{
        isMobile,
        activeTab,
        setActiveTab,
        mobileTab,
        setMobileTab,
        mobilePortfolioSubTab,
        setMobilePortfolioSubTab,
        mobileHoldingsTimeframe,
        setMobileHoldingsTimeframe,
        holdings,
        setHoldings,
        mfHoldings,
        positions,
        orders,
        margins,
        indices,
        ipos,
        mutualFunds,
        appliedIpos,
        portfolioMetrics,
        selectedIpoForModal,
        setSelectedIpoForModal,
        selectedStockForOrder,
        setSelectedStockForOrder,
        selectedMfForSip,
        setSelectedMfForSip,
        onboardingOpen,
        setOnboardingOpen,
        userProfile,
        setUserProfile,
        notifications,
        addNotification,
        placeOrder,
        startSip,
        applyIpo,
        completeKyc,
        searchableInstruments,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

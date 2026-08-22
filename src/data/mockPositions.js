export const initialPositions = [
  {
    id: 'pos-1',
    symbol: 'NIFTY24DEC25500CE',
    name: 'NIFTY 26 DEC 25500 CALL',
    product: 'MIS (Intraday)',
    qty: 50,
    buyQty: 50,
    buyAvg: 148.20,
    buyVal: 7410.00,
    sellQty: 0,
    sellAvg: 0.00,
    sellVal: 0.00,
    ltp: 153.45,
    tradeValue: 32400.00,
    mtm: 261.60,
    pnl: 261.60,
    pnlPercent: 3.53,
    status: 'OPEN',
  }
];

export const initialOrders = [
  {
    id: 'ORD-8921',
    symbol: 'NIFTY24DEC25500CE',
    type: 'BUY',
    orderType: 'MARKET',
    product: 'MIS',
    qty: 50,
    price: 148.20,
    triggerPrice: 0,
    status: 'EXECUTED',
    time: '09:35:12 AM',
  },
  {
    id: 'ORD-8920',
    symbol: 'IOC-EQ',
    type: 'BUY',
    orderType: 'LIMIT',
    product: 'CNC',
    qty: 10,
    price: 91.15,
    triggerPrice: 0,
    status: 'EXECUTED',
    time: 'Yesterday 02:15 PM',
  }
];

export const initialMargins = {
  availableBalance: 320.16,
  totalCredits: -64440.00,
  marginUsed: -64760.16,
  openingBalance: 65000.00,
  collateralMargin: 0.00,
  payinAmount: 0.00,
};

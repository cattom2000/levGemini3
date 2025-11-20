import { MarketDataPoint, DashboardMetrics } from '../types';

// Helper to format date
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate Synthetic Data (2010 - 2025)
export const generateMarketData = (): MarketDataPoint[] => {
  const data: MarketDataPoint[] = [];
  let currentDate = new Date('2010-01-01');
  const endDate = new Date('2025-12-31');

  // Initial Values
  let sp500 = 1100;
  let finraD = 250; // Billions
  let m2 = 8500; // Billions
  let netWorth = 1000; 

  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate);
    
    // Random Walk Factors
    const monthFactor = 1 + (Math.random() * 0.04 - 0.015); // Generally up
    const vixBase = 15 + (Math.random() * 10 - 2);
    
    // Simulate Events
    const year = currentDate.getFullYear();
    let shock = 1.0;
    let fedRate = 0.25;

    if (year >= 2016 && year < 2019) fedRate = 1.5 + Math.random();
    if (year === 2020) { shock = 0.7; fedRate = 0.1; } // Covid
    if (year >= 2022) fedRate = 4.5 + (Math.random() * 1); // Inflation

    // Update Core Values
    sp500 = sp500 * monthFactor * (year === 2020 && currentDate.getMonth() === 2 ? 0.8 : 1);
    finraD = finraD * monthFactor * (year === 2020 && currentDate.getMonth() === 2 ? 0.9 : 1);
    m2 = m2 * 1.005; // Steady growth
    
    // Derived Calc
    const marketCap = sp500 * 400 / 1000; // In Billions (approx scale down for visual ratio)
    const leverageRatio = finraD / (marketCap * 1000); // Scaled for display (0.02 - 0.05 range typically)
    const moneySupplyRatio = finraD / m2;
    const interestCost = finraD * (fedRate / 100);
    
    // Volatility correlates inversely with market usually
    const vix = (year === 2020 && currentDate.getMonth() === 2) ? 60 : vixBase - (monthFactor > 1.01 ? 2 : -2);

    // Net worth (Simulated accumulator)
    netWorth = netWorth * (1 + (monthFactor - 1) * 1.2); // 1.2x leverage beta

    // Vulnerability: High leverage + High VIX = Danger
    const vulnIndex = (leverageRatio * 100) * (vix / 10);

    data.push({
      date: dateStr,
      timestamp: currentDate.getTime(),
      finra_D: parseFloat(finraD.toFixed(2)),
      vix_index: parseFloat(vix.toFixed(2)),
      sp500_index: parseFloat(sp500.toFixed(2)),
      m2_money_supply: parseFloat(m2.toFixed(2)),
      federal_funds_rate: parseFloat(fedRate.toFixed(2)),
      market_cap: parseFloat(marketCap.toFixed(2)),
      market_leverage_ratio: parseFloat(leverageRatio.toFixed(4)),
      money_supply_ratio: parseFloat(moneySupplyRatio.toFixed(4)),
      annual_interest_cost: parseFloat(interestCost.toFixed(2)),
      leverage_change_mom: 0, // Calculated next pass
      leverage_change_yoy: 0, // Calculated next pass
      investor_net_worth: parseFloat(netWorth.toFixed(2)),
      vulnerability_index: parseFloat(vulnIndex.toFixed(2))
    });

    // Next Month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Second pass for change rates
  for (let i = 0; i < data.length; i++) {
    if (i > 0) {
      data[i].leverage_change_mom = (data[i].market_leverage_ratio - data[i-1].market_leverage_ratio) / data[i-1].market_leverage_ratio;
    }
    if (i > 11) {
      data[i].leverage_change_yoy = (data[i].market_leverage_ratio - data[i-12].market_leverage_ratio) / data[i-12].market_leverage_ratio;
    }
  }

  return data;
};

export const calculateMetrics = (data: MarketDataPoint[]): DashboardMetrics => {
  if (data.length === 0) {
    return {
      avgMarketLeverage: 0,
      avgMoneySupplyRatio: 0,
      currentAnnualInterestCost: 0,
      avgVulnerabilityIndex1Y: 0,
      sp500YoY: 0,
      avgVix: 0,
      avgFedRate: 0,
    };
  }

  const last12 = data.slice(-12);
  const lastPt = data[data.length - 1];
  const oneYearAgoPt = data[data.length - 13] || data[0];

  const avgLev = data.reduce((acc, curr) => acc + curr.market_leverage_ratio, 0) / data.length;
  const avgM2 = data.reduce((acc, curr) => acc + curr.money_supply_ratio, 0) / data.length;
  const avgVuln = last12.reduce((acc, curr) => acc + curr.vulnerability_index, 0) / last12.length;
  const avgVix = data.reduce((acc, curr) => acc + curr.vix_index, 0) / data.length;
  const avgFed = data.reduce((acc, curr) => acc + curr.federal_funds_rate, 0) / data.length;

  const sp500Growth = (lastPt.sp500_index - oneYearAgoPt.sp500_index) / oneYearAgoPt.sp500_index;

  return {
    avgMarketLeverage: avgLev,
    avgMoneySupplyRatio: avgM2,
    currentAnnualInterestCost: last12.reduce((acc, curr) => acc + curr.annual_interest_cost, 0),
    avgVulnerabilityIndex1Y: avgVuln,
    sp500YoY: sp500Growth,
    avgVix: avgVix,
    avgFedRate: avgFed,
  };
};

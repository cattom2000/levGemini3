export interface MarketDataPoint {
  date: string;
  timestamp: number;
  finra_D: number; // Margin Debt in Billions
  vix_index: number;
  sp500_index: number;
  m2_money_supply: number; // Billions
  federal_funds_rate: number; // Percent
  
  // Derived Metrics
  market_cap: number;
  market_leverage_ratio: number;
  money_supply_ratio: number;
  annual_interest_cost: number;
  leverage_change_mom: number;
  leverage_change_yoy: number;
  investor_net_worth: number; // Simulated proxy
  vulnerability_index: number;
}

export interface DashboardMetrics {
  avgMarketLeverage: number;
  avgMoneySupplyRatio: number;
  currentAnnualInterestCost: number;
  avgVulnerabilityIndex1Y: number;
  sp500YoY: number;
  avgVix: number;
  avgFedRate: number;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  leverageThresholdRed: number;
  leverageThresholdYellow: number;
  movingAverageWindow: number;
}
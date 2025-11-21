// types.ts

/**
 * Represents the raw data structure from the market_data.csv file.
 * Units are as specified in the data source documentation.
 */
export interface RawMarketData {
  date: string;                  // YYYY-MM-DD
  finra_D: number;               // Margin Debt in thousands of USD
  vix_index: number;
  sp500_index: number;
  m2_money_supply: number;       // in millions of USD
  federal_funds_rate: number;    // as a percentage, e.g., 5.5
}

/**
 * Represents a fully processed data point.
 * Keys are in snake_case to match the existing Recharts components' dataKey props.
 */
export interface ProcessedDataPoint {
  // Core Identifiers
  date: string;
  timestamp: number;

  // Raw source data for reference and other charts
  finra_D: number;
  vix_index: number;
  sp500_index: number;
  federal_funds_rate: number;

  // Foundational Metrics
  market_cap: number;              // Market Capitalization in thousands of USD
  investor_net_worth: number;       // Market Cap - Margin Debt, in thousands of USD
  
  // Core Calculated Ratios & Indices
  market_leverage_ratio: number;    // finra_D / market_cap
  money_supply_ratio: number;       // finra_D / m2_money_supply (adjusted for units)
  vulnerability_index: number;     // Z-Score(finra_D) - Z-Score(vix_index)
  annual_interest_cost: number;     // Estimated annual interest on margin debt, in thousands of USD

  // Rate of Change Metrics
  leverage_change_mom: number;      // Month-over-Month change in finra_D
  leverage_change_yoy: number;      // Year-over-Year change in finra_D
}

/**
 * Represents the high-level summary metrics displayed in the dashboard's KPI cards.
 * This structure is preserved to match the original Dashboard component's expectations.
 */
export interface DashboardMetrics {
  avgMarketLeverage: number;
  avgMoneySupplyRatio: number;
  currentAnnualInterestCost: number; // Note: In the new logic, this will be the sum of the last 12 months' costs.
  avgVulnerabilityIndex1Y: number;
  sp500YoY: number;
  avgVix: number;
  avgFedRate: number;
}

/**
 * Represents the state of the user-configurable filters in the sidebar.
 */
export interface FilterState {
  startDate: string;
  endDate: string;
  leverageThresholdRed: number;
  leverageThresholdYellow: number;
  movingAverageWindow: number;
}
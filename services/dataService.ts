// services/dataService.ts
import { ProcessedDataPoint, DashboardMetrics } from '../types';
import { rawMarketData } from '../data/marketData';
import { processFinancialData, calculatePercentageChange } from '../utils/financialCalculations';

/**
 * Retrieves and processes the financial data.
 * This function serves as the main data provider for the application.
 * @returns An array of fully processed data points.
 */
export const getProcessedData = (): ProcessedDataPoint[] => {
  // In a real app, this might fetch from an API. Here, we process the static raw data.
  // The z-score window from the original spec was 252 (daily), which is too large for monthly data.
  // We'll use a more appropriate window, like 12 months.
  const processed = processFinancialData(rawMarketData, 12);
  return processed;
};

/**
 * Calculates high-level summary metrics for the dashboard's KPI cards to match the UI's expectations.
 * @param data - An array of processed data points from the current filter range.
 * @returns An object containing the calculated dashboard metrics.
 */
export const calculateMetrics = (data: ProcessedDataPoint[]): DashboardMetrics => {
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
  // For YoY calculation, we need a point from 12 months prior to the last point in the *filtered* data.
  // This requires finding that point in the full dataset, which we don't have here.
  // As a robust fallback, we use the first point of the filtered data if it's over a year long.
  const oneYearAgoPt = data.length > 12 ? data[data.length - 13] : data[0];

  const avgLev = data.reduce((acc, curr) => acc + curr.market_leverage_ratio, 0) / data.length;
  const avgM2 = data.reduce((acc, curr) => acc + curr.money_supply_ratio, 0) / data.length;
  const avgVuln = last12.reduce((acc, curr) => acc + curr.vulnerability_index, 0) / last12.length;
  const avgVix = data.reduce((acc, curr) => acc + curr.vix_index, 0) / data.length;
  const avgFed = data.reduce((acc, curr) => acc + curr.federal_funds_rate, 0) / data.length;

  // The UI expects the sum of the last 12 months of interest cost, and the value is in thousands, so we divide by 1B to get billions
  const totalInterestCost12M = last12.reduce((acc, curr) => acc + curr.annual_interest_cost, 0) / 1000000;

  const sp500Growth = calculatePercentageChange(lastPt.sp500_index, oneYearAgoPt.sp500_index);

  return {
    avgMarketLeverage: avgLev,
    avgMoneySupplyRatio: avgM2,
    currentAnnualInterestCost: totalInterestCost12M,
    avgVulnerabilityIndex1Y: avgVuln,
    sp500YoY: sp500Growth,
    avgVix: avgVix,
    avgFedRate: avgFed,
  };
};


// src/utils/financialCalculations.ts
import { RawMarketData, ProcessedDataPoint } from '../types';

const MARKET_CAP_APPROX_COEFFICIENT = 400;

/**
 * Calculates the Z-Score of each value in a numeric array within a rolling window.
 * Z-Score = (value - mean) / std_dev
 * @param data - The array of numbers to calculate Z-Scores for.
 * @param window - The size of the rolling window for calculating mean and std_dev.
 * @returns An array of Z-Scores. Returns 0 for initial periods where the window is not full.
 */
export const calculateRollingZScore = (data: number[], window: number): number[] => {
  if (window <= 1) {
    return new Array(data.length).fill(0);
  }

  return data.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    
    if (slice.length < 2) return 0; // Not enough data for std dev

    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const stdDev = Math.sqrt(slice.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (slice.length - 1));

    if (stdDev === 0) return 0;

    const currentValue = data[i];
    return (currentValue - mean) / stdDev;
  });
};

/**
 * Calculates the percentage change between the current value and a previous value.
 * @param current - The current value.
 *
 * @param previous - The previous value.
 * @returns The percentage change, or 0 if the previous value is null, undefined, or 0.
 */
export const calculatePercentageChange = (current: number, previous: number | null | undefined): number => {
    if (previous === null || previous === undefined || previous === 0) {
      return 0;
    }
    return ((current - previous) / previous);
};

/**
 * Processes an array of raw market data into an array of fully calculated data points.
 * This is the core function for transforming data for the dashboard.
 * @param rawData - The array of RawMarketData.
 * @param zScoreWindow - The rolling window for Z-Score calculations.
 * @returns An array of ProcessedDataPoint.
 */
export const processFinancialData = (rawData: RawMarketData[], zScoreWindow: number = 252): ProcessedDataPoint[] => {
    if (!rawData || rawData.length === 0) {
        return [];
    }

    // Pre-calculate entire series for rolling calculations
    const finraDSeries = rawData.map(d => d.finra_D);
    const vixSeries = rawData.map(d => d.vix_index);
    const finraDZScores = calculateRollingZScore(finraDSeries, zScoreWindow);
    const vixZScores = calculateRollingZScore(vixSeries, zScoreWindow);

    return rawData.map((d, i) => {
        // Basic Calculations & Unit Conversions
        const marketCap = d.sp500_index * MARKET_CAP_APPROX_COEFFICIENT;
        const m2InThousands = d.m2_money_supply * 1000; // Convert from millions to thousands
        
        // Metric Calculations from the levRedo.md document
        const marketLeverageRatio = marketCap > 0 ? d.finra_D / marketCap : 0;
        const moneySupplyRatio = m2InThousands > 0 ? d.finra_D / m2InThousands : 0;
        const annualInterestCost = d.finra_D * (d.federal_funds_rate / 100);
        const investorNetWorth = marketCap - d.finra_D;
        const vulnerabilityIndex = finraDZScores[i] - vixZScores[i];

        // Period-over-Period Calculations
        const prevMonthData = i > 0 ? rawData[i-1] : null;
        const prevYearData = i >= 12 ? rawData[i-12] : null;

        const leverageChangeMoM = calculatePercentageChange(d.finra_D, prevMonthData?.finra_D);
        const leverageChangeYoY = calculatePercentageChange(d.finra_D, prevYearData?.finra_D);

        const dataPoint: ProcessedDataPoint = {
            date: d.date,
            timestamp: new Date(d.date).getTime(),
            
            // Snake_case keys to match component props
            market_cap: marketCap,
            investor_net_worth: investorNetWorth,
            market_leverage_ratio: marketLeverageRatio,
            money_supply_ratio: moneySupplyRatio,
            vulnerability_index: vulnerabilityIndex,
            annual_interest_cost: annualInterestCost,
            leverage_change_mom: leverageChangeMoM,
            leverage_change_yoy: leverageChangeYoY,
            
            // Pass through raw values for other charts
            finra_D: d.finra_D,
            vix_index: d.vix_index,
            sp500_index: d.sp500_index,
            federal_funds_rate: d.federal_funds_rate
        };

        return dataPoint;
    });
};

import React, { useState, useEffect, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { generateMarketData, calculateMetrics } from './services/dataService';
import { MarketDataPoint, FilterState, DashboardMetrics } from './types';

const App: React.FC = () => {
  // State
  const [rawData, setRawData] = useState<MarketDataPoint[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    startDate: '2010-01-01',
    endDate: '2025-12-31',
    leverageThresholdYellow: 0.035,
    leverageThresholdRed: 0.045,
    movingAverageWindow: 12
  });

  // Initialize Data
  useEffect(() => {
    const data = generateMarketData();
    setRawData(data);
  }, []);

  // Filter Logic
  const filteredData = useMemo(() => {
    const start = new Date(filters.startDate).getTime();
    const end = new Date(filters.endDate).getTime();
    return rawData.filter(d => d.timestamp >= start && d.timestamp <= end);
  }, [rawData, filters.startDate, filters.endDate]);

  // Metrics Calculation
  const metrics: DashboardMetrics = useMemo(() => {
    return calculateMetrics(filteredData);
  }, [filteredData]);

  if (rawData.length === 0) {
    return <div className="h-screen flex items-center justify-center text-fin-text">Loading Market Data...</div>;
  }

  return (
    <div className="flex min-h-screen bg-fin-gray">
      <Sidebar filters={filters} setFilters={setFilters} />
      <main className="flex-1 min-w-0">
        <Dashboard data={filteredData} metrics={metrics} filters={filters} />
      </main>
    </div>
  );
};

export default App;
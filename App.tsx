import React, { useState, useEffect, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { getProcessedData, calculateMetrics } from './services/dataService';
import { ProcessedDataPoint, FilterState, DashboardMetrics } from './types';

const App: React.FC = () => {
  // State
  const [processedData, setProcessedData] = useState<ProcessedDataPoint[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    // Full dataset from CSV: 2010-02 to 2025-09
    startDate: '2010-02-01',
    endDate: '2025-09-01',
    leverageThresholdYellow: 0.035,
    leverageThresholdRed: 0.045,
    movingAverageWindow: 12
  });

  // Initialize Data
  useEffect(() => {
    const data = getProcessedData();
    setProcessedData(data);
  }, []);

  // Filter Logic
  const filteredData = useMemo(() => {
    // Robust date filtering
    const start = new Date(filters.startDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(filters.endDate);
    end.setUTCHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return processedData;
    }

    return processedData.filter(d => d.timestamp >= start.getTime() && d.timestamp <= end.getTime());
  }, [processedData, filters.startDate, filters.endDate]);

  // Metrics Calculation
  const metrics: DashboardMetrics = useMemo(() => {
    return calculateMetrics(filteredData);
  }, [filteredData]);

  if (processedData.length === 0) {
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
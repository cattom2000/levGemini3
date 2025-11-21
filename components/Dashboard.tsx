import React, { useMemo } from 'react';
import { ProcessedDataPoint, DashboardMetrics, FilterState } from '../types';
import { KPICard } from './KPICard';
import { ChartContainer } from './charts/ChartContainer';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ComposedChart, ReferenceArea, ScatterChart, Scatter, ReferenceLine, Legend, Cell
} from 'recharts';

interface DashboardProps {
  data: ProcessedDataPoint[];
  metrics: DashboardMetrics;
  filters: FilterState;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded text-xs">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
            {p.unit ? p.unit : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ data, metrics, filters }) => {

  // --- Helper Data Prep ---
  
  // Prepare Scatter Data for VIX vs Leverage
  const scatterData = useMemo(() => {
    return data.map(d => ({
      x: d.vix_index,
      y: d.market_leverage_ratio,
      color: d.market_leverage_ratio > filters.leverageThresholdRed ? '#EF4444' : '#3B82F6'
    }));
  }, [data, filters]);

  // Simple Regression Line Calc for VIX vs Lev
  const regressionLine = useMemo(() => {
    if (scatterData.length === 0) return [];
    const n = scatterData.length;
    const sumX = scatterData.reduce((a, b) => a + b.x, 0);
    const sumY = scatterData.reduce((a, b) => a + b.y, 0);
    const sumXY = scatterData.reduce((a, b) => a + b.x * b.y, 0);
    const sumXX = scatterData.reduce((a, b) => a + b.x * b.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minX = Math.min(...scatterData.map(d => d.x));
    const maxX = Math.max(...scatterData.map(d => d.x));

    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  }, [scatterData]);


  // Prepare data for step chart (Net Worth)
  // Recharts 'step' interpolation works on Line directly

  return (
    <div className="flex-1 p-8 bg-fin-gray overflow-y-auto h-screen ml-72">

      {/* --- KPI Header --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* My Strategy Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-fin-text flex items-center gap-2">
            <span className="w-2 h-6 bg-fin-blue rounded-full"></span>
            My Strategy Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <KPICard 
              label="Market Leverage Ratio" 
              value={`${(metrics.avgMarketLeverage * 100).toFixed(2)}%`}
              subValue="Annualized Avg"
              color="blue"
            />
            <KPICard 
              label="Money Supply Ratio" 
              value={`${(metrics.avgMoneySupplyRatio * 100).toFixed(2)}%`}
              subValue="Margin Debt / M2"
            />
            <KPICard 
              label="Annual Interest Cost" 
              value={`$${metrics.currentAnnualInterestCost.toFixed(2)}B`}
              subValue="Last 12 Months Total"
            />
            <KPICard 
              label="Vulnerability Index" 
              value={metrics.avgVulnerabilityIndex1Y.toFixed(2)}
              subValue="1Y Mean Risk Score"
            />
          </div>
        </div>

        {/* Benchmark Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-500 flex items-center gap-2">
            <span className="w-2 h-6 bg-gray-300 rounded-full"></span>
            Benchmark Comparison
          </h2>
          <div className="grid grid-cols-2 gap-4 h-full">
             <div className="col-span-2">
               <KPICard 
                  label="S&P 500 Annual Return (YoY)" 
                  value={`${(metrics.sp500YoY * 100).toFixed(2)}%`}
                  subValue="Year over Year Growth"
                  color={metrics.sp500YoY > 0 ? "blue" : "gray"}
                />
             </div>
             <KPICard 
               label="VIX Average" 
               value={metrics.avgVix.toFixed(2)}
               subValue="Annual Mean Volatility"
             />
             <KPICard 
               label="Fed Funds Rate" 
               value={`${metrics.avgFedRate.toFixed(2)}%`}
               subValue="Period Average"
             />
          </div>
        </div>
      </div>

      {/* --- Charts Section --- */}
      
      {/* 1. Market Leverage Ratio */}
      <ChartContainer title="Market Leverage Ratio Analysis">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={50} stroke="#94a3b8" />
            <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} tick={{fontSize: 10}} stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            {/* Background Risk Zones */}
            <ReferenceArea y1={filters.leverageThresholdRed} label="Critical Risk" fill="#FEE2E2" fillOpacity={0.5} />
            <ReferenceArea y1={filters.leverageThresholdYellow} y2={filters.leverageThresholdRed} fill="#FEF3C7" fillOpacity={0.3} />
            <ReferenceArea y2={filters.leverageThresholdYellow} fill="#ECFDF5" fillOpacity={0.3} />

            <Line 
              type="monotone" 
              dataKey="market_leverage_ratio" 
              stroke="#0A2540" 
              strokeWidth={2} 
              dot={false}
              name="Leverage Ratio"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. Money Supply Ratio */}
        <ChartContainer title="Money Supply Ratio (Margin Debt / M2)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorM2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={30} stroke="#94a3b8" />
              <YAxis tick={{fontSize: 10}} stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="money_supply_ratio" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorM2)" 
                name="Money Supply Ratio"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 3. Interest Cost Analysis */}
        <ChartContainer title="Interest Cost Analysis">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={30} stroke="#94a3b8" />
              <YAxis yAxisId="left" tick={{fontSize: 10}} stroke="#94a3b8" label={{ value: 'Cost ($B)', angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#94a3b8'} }} />
              <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10}} stroke="#F59E0B" label={{ value: 'Rate (%)', angle: 90, position: 'insideRight', style: {fontSize: 10, fill: '#F59E0B'} }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              <Bar yAxisId="left" dataKey="annual_interest_cost" fill="#CBD5E1" name="Annual Interest Cost" />
              <Line yAxisId="right" type="monotone" dataKey="federal_funds_rate" stroke="#F59E0B" strokeWidth={2} dot={false} name="Fed Funds Rate" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 4. Leverage Change Rate */}
      <ChartContainer title="Leverage Change Rate (MoM vs YoY)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={50} stroke="#94a3b8" />
            <YAxis tick={{fontSize: 10}} stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <ReferenceLine y={0} stroke="#000" strokeOpacity={0.2} />
            
            <Line type="monotone" dataKey="leverage_change_mom" stroke="#10B981" dot={false} strokeWidth={1} name="MoM Change" />
            <Line type="monotone" dataKey="leverage_change_yoy" stroke="#6366F1" dot={false} strokeWidth={2} name="YoY Change" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Investor Net Worth (Step) */}
        <ChartContainer title="Investor Net Worth Growth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={30} stroke="#94a3b8" />
              <YAxis tick={{fontSize: 10}} stroke="#94a3b8" domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="step" dataKey="investor_net_worth" stroke="#0A2540" strokeWidth={2} dot={false} name="Net Worth Index" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 6. Vulnerability Index */}
        <ChartContainer title="Vulnerability Index">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={30} stroke="#94a3b8" />
              <YAxis tick={{fontSize: 10}} stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Five Layer Risk Background */}
              <ReferenceArea y1={0} y2={2} fill="#ECFDF5" fillOpacity={0.6} />
              <ReferenceArea y1={2} y2={4} fill="#D1FAE5" fillOpacity={0.5} />
              <ReferenceArea y1={4} y2={6} fill="#FEF3C7" fillOpacity={0.4} />
              <ReferenceArea y1={6} y2={8} fill="#FDE68A" fillOpacity={0.4} />
              <ReferenceArea y1={8} fill="#FECACA" fillOpacity={0.4} />

              <Line type="monotone" dataKey="vulnerability_index" stroke="#EF4444" strokeWidth={2} dot={false} name="Vuln Index" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 7. VIX vs Leverage (Scatter) */}
      <ChartContainer title="VIX vs Leverage Correlation (Regime Analysis)">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis type="number" dataKey="x" name="VIX" unit="" label={{ value: 'VIX Index', position: 'insideBottomRight', offset: 0 }} domain={['auto', 'auto']} />
             <YAxis type="number" dataKey="y" name="Leverage" unit="" label={{ value: 'Leverage', angle: -90, position: 'insideLeft' }} domain={['auto', 'auto']} />
             <Tooltip cursor={{ strokeDasharray: '3 3' }} />
             <Legend />
             
             <Scatter name="Market Regimes" data={scatterData} fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
             </Scatter>
             
             <Line dataKey="y" data={regressionLine} stroke="#111827" strokeWidth={2} dot={false} activeDot={false} name="Regression Trend" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Bottom Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex flex-col gap-1">
        <p className="font-bold">Data Sources</p>
        <p>FINRA (Margin Debt), FRED (M2, Fed Funds), Yahoo Finance (S&P 500, VIX)</p>
        <p className="mt-2 font-bold">Scope</p>
        <p>Data Range: 2010–2025 (188 data points). Metrics calculated based on levRedo technical documentation.</p>
        <p className="mt-2 text-xs text-blue-600 italic">*Note: This dashboard is running on real market data from market_data.csv (2010-02 to 2025-09).</p>
      </div>

    </div>
  );
};
import React from 'react';
import { FilterState } from '../types';
import { SlidersHorizontal, Calendar, AlertTriangle, Activity } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters }) => {
  const handleChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex-shrink-0 h-screen overflow-y-auto fixed left-0 top-0 z-10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 text-fin-blue">
          <Activity className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">LevRedo <span className="text-sm font-normal text-gray-400">v1.0</span></h1>
        </div>

        <div className="space-y-8">
          {/* Date Range */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
              <Calendar className="w-4 h-4" />
              <h3>Data Range</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-fin-blue focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input 
                  type="date" 
                  value={filters.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-fin-blue focus:border-transparent outline-none"
                />
              </div>
            </div>
          </section>

          {/* Parameters */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
              <SlidersHorizontal className="w-4 h-4" />
              <h3>Parameters</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="text-gray-500">MA Window (Months)</label>
                  <span className="font-medium">{filters.movingAverageWindow}</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="24" 
                  value={filters.movingAverageWindow}
                  onChange={(e) => handleChange('movingAverageWindow', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-fin-blue"
                />
              </div>
            </div>
          </section>

          {/* Risk Thresholds */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
              <AlertTriangle className="w-4 h-4" />
              <h3>Risk Thresholds</h3>
            </div>
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="text-fin-warning">Warning (Yellow)</label>
                  <span className="font-medium">{filters.leverageThresholdYellow}</span>
                </div>
                <input 
                  type="number" 
                  step="0.01"
                  value={filters.leverageThresholdYellow}
                  onChange={(e) => handleChange('leverageThresholdYellow', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-fin-warning outline-none"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="text-fin-danger">Danger (Red)</label>
                  <span className="font-medium">{filters.leverageThresholdRed}</span>
                </div>
                <input 
                  type="number" 
                  step="0.01"
                  value={filters.leverageThresholdRed}
                  onChange={(e) => handleChange('leverageThresholdRed', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-fin-danger outline-none"
                />
              </div>
            </div>
          </section>
          
          <div className="pt-6 border-t border-gray-200">
             <p className="text-xs text-gray-400 leading-relaxed">
               Adjust thresholds to recalibrate visual risk indicators on the charts.
             </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
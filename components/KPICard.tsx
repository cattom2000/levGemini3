import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'gray';
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, subValue, trend, color = 'gray' }) => {
  const isBlue = color === 'blue';
  
  return (
    <div className={`p-5 rounded-xl border ${isBlue ? 'bg-fin-blue text-white border-fin-blue' : 'bg-white text-fin-text border-gray-100 shadow-sm'} flex flex-col justify-between h-full transition-all hover:shadow-md`}>
      <div>
        <p className={`text-xs uppercase font-semibold tracking-wider mb-1 ${isBlue ? 'text-blue-200' : 'text-gray-400'}`}>
          {label}
        </p>
        <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
      </div>
      {subValue && (
        <div className={`mt-2 text-xs ${isBlue ? 'text-blue-100' : 'text-gray-500'}`}>
          {subValue}
        </div>
      )}
    </div>
  );
};
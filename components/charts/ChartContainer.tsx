import React, { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  height?: number;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, height = 300 }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider border-l-4 border-fin-blue pl-3">{title}</h3>
      <div style={{ width: '100%', height: height }}>
        {children}
      </div>
    </div>
  );
};
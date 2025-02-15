import React from 'react';

const MetricItem = ({ label, value }) => (
  <div className="flex flex-col py-4 items-center border-r border-slate-800 last:border-r-0">
    <div className="text-gray-400 text-sm mb-1 font-bold">{label}</div>
    <div className="text-white text-xl font-medium">{value}</div>
  </div>
);

const StockMetrics = () => {
  const metrics = [
    { label: 'Mkt cap', value: '3.67T' },
    { label: 'EV/Sales', value: '32.37' },
    { label: 'P/E ratio', value: '58.13' },
    { label: 'FY Revenue', value: '113.27B' },
    { label: 'EPS', value: '2.58' },
    { label: 'Gross Margin', value: '74.56%' },
    { label: 'Profit Margin', value: '55.04%' },
    { label: 'Beta', value: '1.63' },
    { label: 'Div yield', value: '0.03%' },
    { label: 'Sector', value: 'Tech' }
  ];

  return (
    <div className="bg-[#0B0B0F] rounded-2xl  border border-slate-800">
      <div className="grid grid-cols-10">
        {metrics.map((metric, index) => (
          <MetricItem
            key={index}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>
    </div>
  );
};

export default StockMetrics;
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Mail } from 'lucide-react';

const generateChartData = () => {
  const data = [];
  let value = 100;
  for (let i = 0; i < 365; i++) {
    value = value * (1 + (Math.random() - 0.48) * 0.1);
    data.push({
      date: new Date(2024, 0, i).toISOString(),
      price: value,
      volume: Math.random() * 1000 + 500
    });
  }
  return data;
};

const StockAnalysis = () => {
  const data = generateChartData();
  
  const metrics = [
    { label: 'Last price', value: '$396.64', change: '+81.21%' },
    { label: 'High on Dec 12 \'24', value: '$436.23', change: '+99.25%' },
    { label: 'Low on Apr 20 \'24', value: '$144.68', change: '-39.90%' },
    { label: 'Average', value: '$385.71', change: '+84.02%' },
    { label: 'Volume', value: '219M', change: '-4.20%' },
    { label: 'SMA (15)', value: '247M', change: '-15.25%' },
    { label: 'Market cap', value: '1.27T', change: '+81.21%' },
    { label: 'EPS (TTM)', value: '3.95', change: '+18.09%' },
    { label: 'P/E ratio (TTM)', value: '100.24', change: '-15.32%' }
  ];

  return (
    <div className="bg-[#0B0B0F] text-gray-300 p-6 min-h-screen rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5" />
          <span className="text-gray-400">1-year chart analysis</span>
        </div>
        <h1 className="text-xl font-medium">Tesla Inc.'s summary</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Chart and Metrics */}
        <div className="col-span-5 space-y-6">
          {/* Chart */}
          <div className="bg-gray-900/50 rounded-xl p-4 h-[340px] ">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -30 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#4b5563"
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <YAxis 
                  stroke="#4b5563"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={['auto', 'auto']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#E5E7EB"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Volume Chart */}
            <div className="h-[20px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar dataKey="volume" fill="#4B5563" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{metric.label}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{metric.value}</span>
                  <span className={`${
                    metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  } px-2 py-1 rounded bg-gray-800/50`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Analysis */}
        <div className="col-span-7 space-y-8">
          <section>
            <h2 className="text-xl font-medium mb-4">Fundamentals</h2>
            <p className="text-gray-400 leading-relaxed">
              Tesla, Inc. operates as a manufacturer and lessor, primarily focusing on electric vehicles and
              energy solutions. They generate revenue through the sale and leasing of vehicles and solar
              energy products, alongside offering services like vehicle insurance and supercharging.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">Financial health</h2>
            <p className="text-gray-400 leading-relaxed">
              Tesla's financials reveal a robust growth trajectory with increasing revenues and profitability.
              The company has managed to maintain a strong cash position, with net debt consistently
              negative, indicating more cash reserves than debt. This financial stability is complemented by
              a high gross profit margin, which has been improving over recent quarters. The consistent
              positive free cash flow highlights efficient operations and financial health, making it an
              attractive prospect for investors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">Risks and challenges</h2>
            <p className="text-gray-400 leading-relaxed">
              Tesla faces significant risks including production ramp delays, supplier issues, and high
              manufacturing costs. Dependence on key personnel like Elon Musk and challenges in scaling
              global operations add to operational risks. Regulatory changes, especially in electric vehicle
              incentives and data privacy, could impact profitability. Financially, Tesla's high independence
              and need for substantial capital could affect its growth strategy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;
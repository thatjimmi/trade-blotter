import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { BarChart2, Activity, TrendingUp } from 'lucide-react';

// Generate mock volatility data
const generateVolatilityData = () => {
  const data = [];
  for (let i = 0; i < 200; i++) {
    data.push({
      time: i,
      value: 15 + Math.random() * 10 + (i === 30 ? 25 : 0)
    });
  }
  return data;
};

const indices = [
  {
    name: 'Grupo BMV',
    region: 'Mexico',
    ytdReturn: '+3.11%',
    points: '+$47',
    status: 'Volatile',
    P_E: '3.63',
    divYield: '1.58%',
    marketCap: '37.85B',
    volume: '195M',
    price: '$426.02',
    change: '+0.69',
    
    miniChartData: Array(10).fill(0).map((_, i) => ({ value: 100 + Math.random() * 100 }))
  },
  {
    name: 'TSX',
    region: 'Spain',
    ytdReturn: '+1.61%',
    points: '+$40',
    status: 'Stable',
    P_E: '7.88',
    divYield: '1.23%',
    marketCap: '627.41B',
    volume: '4709M',
    price: '$588.98',
    change: '+0.35',
    
    miniChartData: Array(10).fill(0).map((_, i) => ({ value: 100 + Math.random() * 100 }))
  },
  // Add more indices as needed
];

const MiniChart = ({ data }) => (
  <div className="w-24 h-8">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#4ADE80" 
          strokeWidth={1} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const MarketAnalysis = () => {
  const [volatilityPeriod, setVolatilityPeriod] = useState('5Y');
  const volatilityData = generateVolatilityData();

  return (
    <div className="bg-[#0B0B0F] p-6 text-gray-300 rounded-2xl border border-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">Analysis</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800">
            <BarChart2 size={18} />
            <span>Economics</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800">
            <Activity size={18} />
            <span>Markets</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800">
            <TrendingUp size={18} />
            <span>Insider trading</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Indices Table */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h2 className="text-lg mb-4">Top indices YTD</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-7 text-sm text-gray-400 pb-2">
              <div className="col-span-2">Name</div>
              <div>YTD Return</div>
              <div>P/E</div>
              <div>Div yield</div>
              <div>2-day chart</div>
              
            </div>
            {indices.map((index, i) => (
              <div key={i} className="grid grid-cols-7 text-sm items-center">
                <div className="col-span-2">
                  <div className="font-medium">{index.name}</div>
                  <div className="text-gray-500 text-xs">{index.region}</div>
                </div>
                <div className="text-green-400">{index.ytdReturn}</div>
                <div>{index.P_E}</div>
                <div>{index.divYield}</div>
                <div><MiniChart data={index.miniChartData} /></div>
              
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Volatility Chart */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg">Volatility Index</h2>
              <div className="text-2xl font-bold mt-1">17.7</div>
            </div>
            <div className="flex gap-2">
              {['5Y', '10Y', 'All'].map((period) => (
                <button
                  key={period}
                  onClick={() => setVolatilityPeriod(period)}
                  className={`px-3 py-1 rounded ${
                    volatilityPeriod === period 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volatilityData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#4b5563"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
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
                  dataKey="value"
                  stroke="#E5E7EB"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <div className="text-green-400">+4.37 (+32.49%)</div>
            <div className="text-red-400">-0.12 (-0.67%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
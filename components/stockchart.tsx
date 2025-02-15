"use client"
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StockChart = () => {
  const [currentPrice, setCurrentPrice] = useState(149.43);
  const [afterHoursPrice, setAfterHoursPrice] = useState(149.58);
  
  // Generate fake stock data with more volatility
  const generateData = () => {
    let price = 144.47; // Starting from previous close
    const data = [];
    const points = 200;
    
    for (let i = 0; i < points; i++) {
      // More volatile price movement
      const volatility = 0.8;
      price = price + (Math.random() - 0.5) * volatility;
      
      data.push({
        time: i,
        price: Number(Math.max(0, price).toFixed(2))
      });
    }
    return data;
  };

  const data = generateData();

  const priceChange = +4.96;
  const percentChange = +3.43;
  const afterHoursChange = +0.15;
  const afterHoursPercentChange = +0.11;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentValue = payload[0].value;
      const startPrice = data[0].price;
      const priceDiff = currentValue - startPrice;
      const percentDiff = (priceDiff / startPrice) * 100;
      
      return (
        <div className="w-52 bg-gray-900/95 p-4 border border-gray-800 rounded-lg shadow-xl backdrop-blur-sm">
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-xs font-medium">Price</p>
              <p className="text-white text-lg font-bold">${currentValue.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`text-sm font-medium ${priceDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceDiff >= 0 ? '+' : ''}{priceDiff.toFixed(2)}
              </div>
              <div className={`text-sm font-medium ${priceDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({priceDiff >= 0 ? '+' : ''}{percentDiff.toFixed(2)}%)
              </div>
            </div>

            <div className="pt-2 border-t border-gray-800">
              <p className="text-gray-400 text-xs font-medium">vs Previous Close</p>
              <p className="text-gray-300 text-sm font-medium">${startPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[600px] bg-[#0B0B0F] p-6 rounded-2xl border-slate-800 border">
      <div className="flex gap-8 mb-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">${currentPrice}</span>
            <span className="text-green-500 font-medium">
              +{priceChange.toFixed(2)} (+{percentChange}%)
            </span>
          </div>
          <div className="text-sm text-gray-400 font-medium">At close</div>
        </div>
        
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-500">${afterHoursPrice}</span>
            <span className="text-green-500 font-medium">
              +{afterHoursChange} (+{afterHoursPercentChange}%)
            </span>
          </div>
          <div className="text-sm text-gray-400 font-medium">After hours</div>
        </div>
      </div>

      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="gradientStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <CartesianGrid 
              stroke="#1f2937" 
              opacity={0.1}
              vertical={false}
            />
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
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#gradientStroke)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-4">
        {['1D', '1W', '1M', '3M', 'YTD', '1Y', 'All'].map((period) => (
          <button
            key={period}
            className="px-3 py-1 rounded-lg text-sm text-gray-400 hover:bg-gray-800"
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockChart;
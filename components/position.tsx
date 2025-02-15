import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Position, MiniChartProps } from '../types/trading';

const generateMockPositions = (): Position[] => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA'];
  return symbols.map(symbol => ({
    symbol,
    quantity: Math.floor(Math.random() * 1000) + 100,
    avgPrice: Math.random() * 500 + 100,
    currentPrice: Math.random() * 500 + 100,
    dayChange: Math.random() * 10 - 5,
    marketValue: Math.random() * 1000000,
    unrealizedPnL: Math.random() * 50000 - 25000,
    realizedPnL: Math.random() * 20000 - 10000,
    exposure: Math.random() * 100000,
    chartData: Array.from({ length: 20 }, () => ({
      value: Math.random() * 100
    }))
  }));
};

const MiniChart = ({ data, positive }: MiniChartProps) => (
  <div className="w-24 h-8">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={positive ? '#4ADE80' : '#EF4444'}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const PositionsTab = () => {
  const positions = generateMockPositions();
  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Portfolio Value</div>
          <div className="text-2xl font-medium">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-green-400">+2.34% today</div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Unrealized P&L</div>
          <div className={`text-2xl font-medium ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(totalPnL).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Across all positions</div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Risk Level</div>
          <div className="text-2xl font-medium text-yellow-400">Moderate</div>
          <div className="text-sm text-gray-400">Based on VaR</div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-gray-900/30 rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 gap-4 p-4 text-sm text-gray-400 border-b border-gray-800">
          <div>Symbol</div>
          <div>Quantity</div>
          <div>Avg Price</div>
          <div>Current</div>
          <div>Day Change</div>
          <div>Chart</div>
          <div>Value</div>
          <div>P&L</div>
        </div>
        
        <div className="divide-y divide-gray-800">
          {positions.map((position) => (
            <div key={position.symbol} className="grid grid-cols-8 gap-4 p-4 text-sm hover:bg-gray-800/30">
              <div className="font-medium text-white">{position.symbol}</div>
              <div>{position.quantity.toLocaleString()}</div>
              <div>${position.avgPrice.toFixed(2)}</div>
              <div>${position.currentPrice.toFixed(2)}</div>
              <div className={position.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                {position.dayChange.toFixed(2)}%
              </div>
              <div>
                <MiniChart 
                  data={position.chartData} 
                  positive={position.dayChange >= 0}
                />
              </div>
              <div>${position.marketValue.toLocaleString()}</div>
              <div className={position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${Math.abs(position.unrealizedPnL).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Alerts */}
      <div className="bg-yellow-500/10 text-yellow-400 p-4 rounded-lg flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 mt-0.5" />
        <div>
          <div className="font-medium mb-1">Risk Alerts</div>
          <div className="text-sm">
            2 positions are approaching their stop-loss levels. Consider adjusting your risk parameters.
          </div>
        </div>
      </div>
    </div>
  );
};

export const PortfolioSummary = () => {
  const metrics = [
    { label: 'Total Value', value: '$2,345,678', change: '+2.34%' },
    { label: 'Day P&L', value: '+$12,345', change: '+0.52%' },
    { label: 'Open Orders', value: '8', subtext: '4 pending fills' },
    { label: 'Risk Score', value: 'Moderate', subtext: '65/100' }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
          <div className="text-sm text-gray-400">{metric.label}</div>
          <div className="text-xl font-medium">{metric.value}</div>
          {metric.change && (
            <div className={`text-sm ${
              metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
            }`}>
              {metric.change}
            </div>
          )}
          {metric.subtext && (
            <div className="text-sm text-gray-400">{metric.subtext}</div>
          )}
        </div>
      ))}
    </div>
  );
};
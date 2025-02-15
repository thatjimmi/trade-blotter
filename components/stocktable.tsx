import React from 'react';

const stocks = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    logo: 'https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece',
    currency: 'USD',
    exchange: 'Nasdaq',
    growth: 0.2241,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    logo: 'https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece',
    currency: 'USD',
    exchange: 'Nasdaq',
    growth: 17.968,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    logo: 'https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece',
    currency: 'USD',
    exchange: 'Nasdaq',
    growth: 7.7912,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    logo: 'https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece',
    currency: 'USD',
    exchange: 'Nasdaq',
    growth: -51.836,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    logo: 'https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece',
    currency: 'USD',
    exchange: 'Nasdaq',
    growth: 12.345,
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ',
    logo: 'https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece',
    currency: 'USD',
    exchange: 'Nasdaq',
    growth: 8.765,
  },
  {
    symbol: 'F',
    name: 'Ford Motor Co.',
    logo: 'https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece',
    currency: 'USD',
    exchange: 'NYSE',
    growth: -3.421,
  },
];

const StockTable = () => {
  return (
    <div className="bg-[#0B0B0F] rounded-xl border border-gray-800">
      {/* Table Header */}
      <div className="grid grid-cols-4 px-4 py-3 border-b border-gray-800 text-sm text-gray-400">
        <div>Company</div>
        <div>Ccy</div>
        <div>Exchange</div>
        <div>FY1 growth</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-800">
        {stocks.map((stock) => (
          <div 
            key={stock.symbol}
            className="grid grid-cols-4 px-4 py-4 hover:bg-gray-800/50 transition-colors"
          >
            {/* Company Column */}
            <div className="flex items-center space-x-3">
              <img
                src={stock.logo}
                alt={stock.symbol}
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <div className="text-white font-semibold">{stock.symbol}</div>
                <div className="text-gray-400 text-sm">{stock.name}</div>
              </div>
            </div>

            {/* Currency Column */}
            <div className="flex items-center">
              <span className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-sm">
                {stock.currency}
              </span>
            </div>

            {/* Exchange Column */}
            <div className="flex items-center text-gray-400">
              {stock.exchange}
            </div>

            {/* Growth Column */}
            <div className={`flex items-center ${stock.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stock.growth >= 0 ? '+' : ''}{stock.growth.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTable;
import React from 'react';

const NewsCard = ({ type, logo, symbol, content, change, time }) => {
  return (
    <div className="bg-[#0B0B0F] rounded-xl p-4 border border-gray-800/50">
      <div className="flex items-center gap-2 mb-3">
        {type === 'recap' ? (
          <>
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
            </div>
            <span className="text-white font-medium">{type}</span>
          </>
        ) : (
          <>
            <img src={logo} alt={symbol} className="w-8 h-8 rounded-lg" />
            <span className="text-white font-medium">{symbol}</span>
            {change && (
              <span className={`text-sm font-medium ${change < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
          </>
        )}
        <span className="ml-auto text-sm text-gray-500">{time}</span>
      </div>
      <p className="text-gray-300 leading-relaxed">
        {content}
      </p>
    </div>
  );
};

const NewsFeed = () => {
  const newsItems = [
    {
      type: 'recap',
      content: 'Fed official Michael Barr plans to resign amid regulatory changes, while US banks exit climate groups. FuboTV merges with Hulu + Live TV, and Lucid posts strong EV deliveries. Key economic data sees US services PMI decline, impacting markets.',
      time: 'Today'
    },
    {
      type: 'stock',
      symbol: 'AAPL',
      logo: '/api/placeholder/32/32',
      change: -1.48,
      content: 'Apple agreed to pay $95 million in cash to settle a proposed class action lawsuit claiming that its voice-activated Siri assistant violated users\' privacy.',
      time: 'Today'
    },
    {
      type: 'stock',
      symbol: 'DIS',
      logo: '/api/placeholder/32/32',
      content: 'Disney nears a deal to combine Hulu + Live TV with Fubo, per Bloomberg. Both Walt Disney Co and FuboTV could significantly impact the streaming space with this merger.',
      time: 'Today'
    },
    {
      type: 'intelligence',
      logo: '/api/placeholder/32/32',
      symbol: 'Fey Intelligence',
      content: 'The U.S. services sector reports a decline in the PMI to 56.8, after expectations had been set at maintaining previous levels. In Germany, the monthly inflation drops.',
      time: 'Today'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {newsItems.map((item, index) => (
        <NewsCard
          key={index}
          type={item.type}
          logo={item.logo}
          symbol={item.symbol}
          content={item.content}
          change={item.change}
          time={item.time}
        />
      ))}
    </div>
  );
};

export default NewsFeed;
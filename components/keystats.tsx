import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define types for the financial data structure
type FinancialItem = {
  name: string;
  value: string;
  change: string;
}

type KeyStats = {
  'Company Value': FinancialItem[];
  'Revenue and Earnings': FinancialItem[];
}

type QuarterData = {
  keyStats: KeyStats;
  incomeStatement: FinancialItem[];
  balanceSheet: FinancialItem[];
  cashFlow: FinancialItem[];
}

type FinancialData = {
  [key: string]: QuarterData;
}

// Comprehensive financial data by quarter
const financialData: FinancialData = {
  'Q4 2023': {
    keyStats: {
      'Company Value': [
        { name: 'Market Capitalization', value: '938,245', change: '-3.12%' },
        { name: 'Cash Assets', value: '14,890', change: '-1.2%' },
        { name: 'Total Debt', value: '11,780', change: '-0.8%' },
        { name: 'Enterprise Value', value: '935,135', change: '-2.9%' }
      ],
      'Revenue and Earnings': [
        { name: 'Total Revenue', value: '6,892', change: '+12.3%' },
        { name: 'Gross Profit', value: '4,348', change: '+10.8%' },
        { name: 'Gross Profit Margin', value: '63.12%', change: '+0.9%' },
        { name: 'EBITDA', value: '2,324', change: '+7.2%' },
        { name: 'EBITDA Margin', value: '33.72%', change: '+0.5%' }
      ]
    },
    incomeStatement: [
      { name: 'Revenue', value: '6,892', change: '+12.3%' },
      { name: 'Cost of Revenue', value: '2,544', change: '+15.2%' },
      { name: 'Gross Profit', value: '4,348', change: '+10.8%' },
      { name: 'Operating Expenses', value: '2,024', change: '+8.9%' },
      { name: 'Operating Income', value: '2,324', change: '+12.1%' },
      { name: 'Net Income', value: '1,924', change: '+11.3%' }
    ],
    balanceSheet: [
      { name: 'Total Assets', value: '52,324', change: '+8.9%' },
      { name: 'Total Liabilities', value: '18,892', change: '+5.2%' },
      { name: 'Total Equity', value: '33,432', change: '+11.3%' },
      { name: 'Cash and Equivalents', value: '14,890', change: '-1.2%' },
      { name: 'Short Term Investments', value: '8,234', change: '+3.4%' }
    ],
    cashFlow: [
      { name: 'Operating Cash Flow', value: '3,234', change: '+15.2%' },
      { name: 'Investing Cash Flow', value: '-1,892', change: '-22.3%' },
      { name: 'Financing Cash Flow', value: '-892', change: '-12.4%' },
      { name: 'Free Cash Flow', value: '1,342', change: '+18.9%' },
      { name: 'Capital Expenditure', value: '-892', change: '+5.6%' }
    ]
  },
  'Q1 2024': {
    keyStats: {
      'Company Value': [
        { name: 'Market Capitalization', value: '963,184', change: '+2.66%' },
        { name: 'Cash Assets', value: '15,320', change: '+2.89%' },
        { name: 'Total Debt', value: '12,080', change: '+2.55%' },
        { name: 'Enterprise Value', value: '959,944', change: '+2.65%' }
      ],
      'Revenue and Earnings': [
        { name: 'Total Revenue', value: '7,192', change: '+15.3%' },
        { name: 'Gross Profit', value: '4,648', change: '+12.8%' },
        { name: 'Gross Profit Margin', value: '64.63%', change: '+1.5%' },
        { name: 'EBITDA', value: '2,524', change: '+8.9%' },
        { name: 'EBITDA Margin', value: '35.09%', change: '+0.7%' }
      ]
    },
    incomeStatement: [
      { name: 'Revenue', value: '7,192', change: '+15.3%' },
      { name: 'Cost of Revenue', value: '2,544', change: '+15.2%' },
      { name: 'Gross Profit', value: '4,648', change: '+12.8%' },
      { name: 'Operating Expenses', value: '2,124', change: '+9.2%' },
      { name: 'Operating Income', value: '2,524', change: '+14.1%' },
      { name: 'Net Income', value: '2,124', change: '+13.3%' }
    ],
    balanceSheet: [
      { name: 'Total Assets', value: '54,324', change: '+8.9%' },
      { name: 'Total Liabilities', value: '19,892', change: '+5.2%' },
      { name: 'Total Equity', value: '34,432', change: '+11.3%' },
      { name: 'Cash and Equivalents', value: '15,320', change: '+2.89%' },
      { name: 'Short Term Investments', value: '8,534', change: '+3.4%' }
    ],
    cashFlow: [
      { name: 'Operating Cash Flow', value: '3,434', change: '+15.2%' },
      { name: 'Investing Cash Flow', value: '-1,992', change: '-22.3%' },
      { name: 'Financing Cash Flow', value: '-992', change: '-12.4%' },
      { name: 'Free Cash Flow', value: '1,442', change: '+18.9%' },
      { name: 'Capital Expenditure', value: '-992', change: '+5.6%' }
    ]
  },
  'Q2 2024': {
    keyStats: {
      'Company Value': [
        { name: 'Market Capitalization', value: '998,324', change: '+3.65%' },
        { name: 'Cash Assets', value: '15,890', change: '+3.72%' },
        { name: 'Total Debt', value: '12,340', change: '+2.15%' },
        { name: 'Enterprise Value', value: '995,874', change: '+3.74%' }
      ],
      'Revenue and Earnings': [
        { name: 'Total Revenue', value: '7,592', change: '+18.2%' },
        { name: 'Gross Profit', value: '4,948', change: '+15.3%' },
        { name: 'Gross Profit Margin', value: '65.17%', change: '+1.8%' },
        { name: 'EBITDA', value: '2,724', change: '+10.2%' },
        { name: 'EBITDA Margin', value: '35.88%', change: '+0.9%' }
      ]
    },
    incomeStatement: [
      { name: 'Revenue', value: '7,592', change: '+18.2%' },
      { name: 'Cost of Revenue', value: '2,644', change: '+16.2%' },
      { name: 'Gross Profit', value: '4,948', change: '+15.3%' },
      { name: 'Operating Expenses', value: '2,224', change: '+10.2%' },
      { name: 'Operating Income', value: '2,724', change: '+15.1%' },
      { name: 'Net Income', value: '2,324', change: '+14.3%' }
    ],
    balanceSheet: [
      { name: 'Total Assets', value: '56,324', change: '+8.9%' },
      { name: 'Total Liabilities', value: '20,892', change: '+5.2%' },
      { name: 'Total Equity', value: '35,432', change: '+11.3%' },
      { name: 'Cash and Equivalents', value: '15,890', change: '+3.72%' },
      { name: 'Short Term Investments', value: '8,834', change: '+3.4%' }
    ],
    cashFlow: [
      { name: 'Operating Cash Flow', value: '3,634', change: '+15.2%' },
      { name: 'Investing Cash Flow', value: '-2,092', change: '-22.3%' },
      { name: 'Financing Cash Flow', value: '-1,092', change: '-12.4%' },
      { name: 'Free Cash Flow', value: '1,542', change: '+18.9%' },
      { name: 'Capital Expenditure', value: '-1,092', change: '+5.6%' }
    ]
  }
};

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('Key Stats');
  const [activeQuarter, setActiveQuarter] = useState('Q1 2024');
  
  const tabs = ['Key Stats', 'Income Statement', 'Balance Sheet', 'Cash Flow'];
  const quarters = ['Q4 2023', 'Q1 2024', 'Q2 2024'];

  const handlePrevQuarter = () => {
    const currentIndex = quarters.indexOf(activeQuarter);
    if (currentIndex > 0) {
      setActiveQuarter(quarters[currentIndex - 1]);
    }
  };

  const handleNextQuarter = () => {
    const currentIndex = quarters.indexOf(activeQuarter);
    if (currentIndex < quarters.length - 1) {
      setActiveQuarter(quarters[currentIndex + 1]);
    }
  };

  const renderContent = () => {
    const quarterData = financialData[activeQuarter];
    
    switch (activeTab) {
      case 'Key Stats':
        return Object.entries(quarterData.keyStats).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-400">{category}</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.name} 
                     className="flex items-center justify-between py-2 border-b border-gray-800/50 group hover:bg-gray-900/30">
                  <span className="text-gray-400 group-hover:text-gray-300">
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{item.value}</span>
                    <span className={`${
                      item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ));
      
      case 'Income Statement':
        return (
          <div className="space-y-3">
            {quarterData.incomeStatement.map((item) => (
              <div key={item.name}
                   className="flex items-center justify-between py-2 border-b border-gray-800/50 group hover:bg-gray-900/30">
                <span className="text-gray-400 group-hover:text-gray-300">
                  {item.name}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{item.value}</span>
                  <span className={`${
                    item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'Balance Sheet':
        return (
          <div className="space-y-3">
            {quarterData.balanceSheet.map((item) => (
              <div key={item.name}
                   className="flex items-center justify-between py-2 border-b border-gray-800/50 group hover:bg-gray-900/30">
                <span className="text-gray-400 group-hover:text-gray-300">
                  {item.name}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{item.value}</span>
                  <span className={`${
                    item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'Cash Flow':
              
        return (
          <div className="space-y-3">        
            {quarterData.cashFlow.map((item) => (
              <div key={item.name} 
                   className="flex items-center justify-between py-2 border-b border-gray-800/50 group hover:bg-gray-900/30">
                <span className="text-gray-400 group-hover:text-gray-300">
                  {item.name}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{item.value}</span>
                  <span className={`${
                    item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="bg-[#0B0B0F] text-gray-300 p-6 rounded-xl">
      {/* Header with Stock Price */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <img src="https://via.assets.so/img.jpg?w=150&h=150&tc=blue&bg=#cecece
" alt="NVDA" className="w-8 h-8 rounded-lg" />
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-semibold">NVDA</span>
            <span className="text-xl">1,147.78</span>
            <span className="text-green-400">+8.77 (+0.77%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-4 px-1 relative ${
              activeTab === tab 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Quarter Selector */}
      <div className="flex justify-between items-center mb-8">
        <button 
          className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
          onClick={handlePrevQuarter}
          disabled={activeQuarter === quarters[0]}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex space-x-6">
          {quarters.map(quarter => (
            <button
              key={quarter}
              onClick={() => setActiveQuarter(quarter)}
              className={`${
                activeQuarter === quarter 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {quarter}
            </button>
          ))}
        </div>
        <button 
          className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
          onClick={handleNextQuarter}
          disabled={activeQuarter === quarters[quarters.length - 1]}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default FinancialDashboard;
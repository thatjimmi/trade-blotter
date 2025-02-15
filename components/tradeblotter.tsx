"use client";
import React, { useState, useEffect } from 'react';
import { 
  CircleDollarSign, 
  TrendingUp, 
  AlertTriangle,   
  Check,
  X,
  Filter,
  Download,
  BarChart2,
  Settings,
  ChevronDown, ChevronUp,
  Search
} from 'lucide-react';

import { NewTradeModal, TradeFilterModal, TradeDetailsDrawer } from './trademodal';
import { Trade, RiskMetrics, RiskMetricsCardProps, Position, TradeData, TradeFilters } from '../types/trading';
import { PortfolioSummary, PositionsTab } from './position';
import { ReportingTools, ReportScheduler } from './recontilation';

// Mock data generator for trades
const generateMockTrades = (count = 20): Trade[] => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA'];
  const counterparties = ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Citadel', 'Jane Street'];
  const types: Trade['type'][] = ['BUY', 'SELL', 'SHORT'];
  const statuses: Trade['status'][] = ['FILLED', 'PENDING', 'CANCELED'];

  return Array.from({ length: count }, (_, i) => ({
    id: `T${1000 + i}`,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    type: types[Math.floor(Math.random() * types.length)],
    quantity: Math.floor(Math.random() * 1000) + 100,
    price: (Math.random() * 500 + 100).toFixed(2),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    counterparty: counterparties[Math.floor(Math.random() * counterparties.length)],
    commission: (Math.random() * 2 + 0.5).toFixed(2),
    stopLoss: Math.random() > 0.5 ? (Math.random() * 100 + 50).toFixed(2) : null,
    takeProfit: Math.random() > 0.5 ? (Math.random() * 200 + 150).toFixed(2) : null,
    unrealizedPnL: (Math.random() * 2000 - 1000).toFixed(2),
    realizedPnL: (Math.random() * 1000 - 500).toFixed(2),
    exposure: (Math.random() * 100000).toFixed(2),
    notes: 'Trade executed as part of portfolio rebalancing',
    tags: ['Portfolio', 'Rebalance']
  }));
};

// Risk metrics calculation
const calculateRiskMetrics = (trades: Trade[], positions: Position[]): RiskMetrics => {
  return {
    valueAtRisk: (Math.random() * 50000).toFixed(2),
    sharpeRatio: (Math.random() * 2 + 1).toFixed(2),
    beta: (Math.random() * 0.5 + 0.75).toFixed(2),
    alpha: (Math.random() * 0.1).toFixed(3),
    maxDrawdown: (Math.random() * 10).toFixed(2) + '%',
    exposureBySector: {
      Technology: 45,
      Healthcare: 25,
      Finance: 15,
      Consumer: 15
    }
  };
};

// Reconciliation data generator
const generateReconciliationData = () => {
  return {
    matched: Math.floor(Math.random() * 50) + 150,
    unmatched: Math.floor(Math.random() * 10),
    breaks: Math.floor(Math.random() * 5),
    totalValue: (Math.random() * 1000000 + 500000).toFixed(2)
  };
};

const RiskMetricsCard = ({ title, value, change, icon: Icon }: RiskMetricsCardProps) => (
  <div className="bg-gray-900/50 p-4 rounded-lg">
    <div className="flex justify-between items-start mb-2">
      <div className="text-sm text-gray-400">{title}</div>
      <Icon className="w-4 h-4 text-gray-400" />
    </div>
    <div className="text-xl font-medium">{value}</div>
    {change !== undefined && (
      <div className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </div>
    )}
  </div>
);

const TradeBlotter = () => {
  const [activeTab, setActiveTab] = useState('Trades');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [trades] = useState<Trade[]>(generateMockTrades(20));
  const [showNewTradeModal, setShowNewTradeModal] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedTradeHistory, setSelectedTradeHistory] = useState<Trade | null>(null);
  
  const tabs = ['Trades', 'Positions', 'Risk', 'Reconciliation'];
  const riskMetrics = calculateRiskMetrics(trades, []);
  const reconciliationData = generateReconciliationData();

  const handleNewTrade = (tradeData: TradeData) => {
    console.log('New trade:', tradeData);
  };

  const handleFilterApply = (filters: TradeFilters) => {
    console.log('Applied filters:', filters);
  };

  const TradeFilters = () => (
    <div className="mb-6 flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search trades..."
          className="w-full bg-gray-800 text-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button 
        onClick={() => setFilterModalOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
      </button>
      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );

  const TradesTable = ({ trades, onSelectTrade }: { trades: Trade[], onSelectTrade: (trade: Trade) => void }) => {
    const [sortField, setSortField] = useState('timestamp');
    const [sortDirection, setSortDirection] = useState('desc');
    const [contextMenu, setContextMenu] = useState<{x: number, y: number, trade: Trade} | null>(null);
  
    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    const handleContextMenu = (e: React.MouseEvent, trade: Trade) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        trade
      });
    };

    const handleCloseContextMenu = () => {
      setContextMenu(null);
    };

    useEffect(() => {
      document.addEventListener('click', handleCloseContextMenu);
      return () => {
        document.removeEventListener('click', handleCloseContextMenu);
      };
    }, []);
  
    const SortHeader = ({ field, children }: { field: string, children: React.ReactNode }) => (
      <div 
        className="flex items-center space-x-1 cursor-pointer"
        onClick={() => handleSort(field)}
      >
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUp 
            className={`w-3 h-3 ${
              sortField === field && sortDirection === 'asc' 
                ? 'text-white' 
                : 'text-gray-600'
            }`}
          />
          <ChevronDown 
            className={`w-3 h-3 ${
              sortField === field && sortDirection === 'desc' 
                ? 'text-white' 
                : 'text-gray-600'
            }`}
          />
        </div>
      </div>
    );
  
    const sortedTrades = [...trades].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'price':
          comparison = parseFloat(a.price) - parseFloat(b.price);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        default:
          comparison = a[sortField] > b[sortField] ? 1 : -1;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
    return (
      <>
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 p-4 text-sm text-gray-400 border-b border-gray-800">
          <div><SortHeader field="symbol">Symbol</SortHeader></div>
          <div><SortHeader field="type">Type</SortHeader></div>
          <div><SortHeader field="quantity">Quantity</SortHeader></div>
          <div><SortHeader field="price">Price</SortHeader></div>
          <div><SortHeader field="status">Status</SortHeader></div>
          <div><SortHeader field="unrealizedPnL">Unrealized P&L</SortHeader></div>
          <div><SortHeader field="realizedPnL">Realized P&L</SortHeader></div>
          <div><SortHeader field="timestamp">Time</SortHeader></div>
        </div>
  
        {/* Table Body */}
        <div className="divide-y divide-gray-800">
          {sortedTrades.map((trade) => (
            <div 
              key={trade.id}
              className="grid grid-cols-8 gap-4 p-4 text-sm hover:bg-gray-800/30 cursor-pointer"
              onClick={() => onSelectTrade(trade)}
              onContextMenu={(e) => handleContextMenu(e, trade)}
            >
              <div className="font-medium">{trade.symbol}</div>
              <div className={trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}>
                {trade.type}
              </div>
              <div>{trade.quantity.toLocaleString()}</div>
              <div>${parseFloat(trade.price).toLocaleString()}</div>
              <div className={`
                px-2 py-1 rounded-full text-xs w-fit
                ${trade.status === 'FILLED' ? 'bg-green-500/20 text-green-400' :
                  trade.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'}
              `}>
                {trade.status}
              </div>
              <div className={parseFloat(trade.unrealizedPnL) >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${parseFloat(trade.unrealizedPnL).toLocaleString()}
              </div>
              <div className={parseFloat(trade.realizedPnL) >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${parseFloat(trade.realizedPnL).toLocaleString()}
              </div>
              <div className="text-gray-400">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
  
        {/* Context Menu */}
        {contextMenu && (
          <div 
            className="fixed bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button 
              className="w-full px-4 py-2 text-left hover:bg-gray-800 text-gray-300"
              onClick={() => {
                setSelectedTradeHistory(contextMenu.trade);
                setShowHistoryDialog(true);
                handleCloseContextMenu();
              }}
            >
              View Trade History
            </button>
            <button 
              className="w-full px-4 py-2 text-left hover:bg-gray-800 text-red-400"
              onClick={() => {
                console.log('Delete trade:', contextMenu.trade);
                handleCloseContextMenu();
              }}
            >
              Delete Trade
            </button>
          </div>
        )}

        {/* Trade History Dialog */}
        {showHistoryDialog && selectedTradeHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-[600px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Trade History - {selectedTradeHistory.symbol}</h3>
                <button 
                  onClick={() => setShowHistoryDialog(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => {
                  const date = new Date(selectedTradeHistory.timestamp);
                  date.setHours(date.getHours() - i);
                  return (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                      <div>
                        <div className="font-medium">{i === 0 ? 'Trade Executed' : `Price Update ${i}`}</div>
                        <div className="text-sm text-gray-400">{date.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${(parseFloat(selectedTradeHistory.price) * (1 + (i * 0.01))).toFixed(2)}
                        </div>
                        <div className="text-sm text-green-400">
                          +{(i * 1).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Table Footer / Pagination */}
        <div className="border-t border-gray-800 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {trades.length} trades
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </>
    );
  };

  const RiskTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <RiskMetricsCard
          title="Value at Risk (95%)"
          value={`$${riskMetrics.valueAtRisk}`}
          change={-2.5}
          icon={AlertTriangle}
        />
        <RiskMetricsCard
          title="Sharpe Ratio"
          value={riskMetrics.sharpeRatio}
          change={1.2}
          icon={TrendingUp}
        />
        <RiskMetricsCard
          title="Portfolio Beta"
          value={riskMetrics.beta}
          change={0.5}
          icon={BarChart2}
        />
        <RiskMetricsCard
          title="Maximum Drawdown"
          value={riskMetrics.maxDrawdown}
          change={-1.8}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Exposure by Sector */}
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Sector Exposure</h3>
          <div className="space-y-4">
            {Object.entries(riskMetrics.exposureBySector).map(([sector, percentage]) => (
              <div key={sector} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{sector}</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Limits */}
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Risk Limits</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Single Position</span>
              <span className="text-green-400">Within Limit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sector Concentration</span>
              <span className="text-yellow-400">Near Limit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Portfolio VaR</span>
              <span className="text-green-400">Within Limit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Leverage</span>
              <span className="text-green-400">Within Limit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReconciliationTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <RiskMetricsCard
          title="Matched Trades"
          value={reconciliationData.matched}
          icon={Check}
        />
        <RiskMetricsCard
          title="Unmatched Trades"
          value={reconciliationData.unmatched}
          icon={AlertTriangle}
        />
        <RiskMetricsCard
          title="Breaks"
          value={reconciliationData.breaks}
          icon={X}
        />
        <RiskMetricsCard
          title="Total Value"
          value={`$${reconciliationData.totalValue}`}
          icon={CircleDollarSign}
        />
      </div>

      {/* Reporting Tools */}
      <ReportingTools />

      {/* Report Scheduler */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Scheduled Reports</h3>
        <ReportScheduler />
      </div>
    </div>
  );

  return (
    <div className="bg-[#0B0B0F] text-gray-300 p-6 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Trade Blotter</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNewTradeModal(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>New Trade</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
            <Settings className="w-4 h-4" />
          </button>
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

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'Trades' && (
          <>
            <TradeFilters />
            <div className="bg-gray-900/30 rounded-lg overflow-hidden">
              <TradesTable 
                trades={trades} 
                onSelectTrade={setSelectedTrade}
              />
            </div>
          </>
        )}
        {activeTab === 'Positions' && (
          <div>
            <PortfolioSummary />
            <PositionsTab />
          </div>
        )}
        {activeTab === 'Risk' && <RiskTab />}
        {activeTab === 'Reconciliation' && <ReconciliationTab />}
      </div>

      {/* Modals */}
      <NewTradeModal 
        isOpen={showNewTradeModal}
        onClose={() => setShowNewTradeModal(false)}
        onSubmit={handleNewTrade}
      />

      <TradeFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
      />

      <TradeDetailsDrawer
        trade={selectedTrade}
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />
    </div>
  );
};

export default TradeBlotter;
import React, { useState } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';
import { NewTradeModalProps, TradeFilterModalProps, TradeDetailsDrawerProps, TradeFilters, TradeData, Trade } from '../types/trading';

export const NewTradeModal = ({ isOpen, onClose, onSubmit }: NewTradeModalProps) => {
  const [tradeData, setTradeData] = useState<TradeData>({
    symbol: '',
    type: 'BUY',
    quantity: '',
    price: '',
    stopLoss: '',
    takeProfit: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tradeData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">New Trade</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Symbol</label>
            <input
              type="text"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tradeData.symbol}
              onChange={(e) => setTradeData({ ...tradeData, symbol: e.target.value })}
              placeholder="Enter symbol..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Type</label>
            <select
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tradeData.type}
              onChange={(e) => setTradeData({ ...tradeData, type: e.target.value as TradeData['type'] })}
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
              <option value="SHORT">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Quantity</label>
            <input
              type="number"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tradeData.quantity}
              onChange={(e) => setTradeData({ ...tradeData, quantity: e.target.value })}
              placeholder="Enter quantity..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Price</label>
            <input
              type="number"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tradeData.price}
              onChange={(e) => setTradeData({ ...tradeData, price: e.target.value })}
              placeholder="Enter price..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Stop Loss</label>
            <input
              type="number"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tradeData.stopLoss}
              onChange={(e) => setTradeData({ ...tradeData, stopLoss: e.target.value })}
              placeholder="Enter stop loss..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Take Profit</label>
            <input
              type="number"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tradeData.takeProfit}
              onChange={(e) => setTradeData({ ...tradeData, takeProfit: e.target.value })}
              placeholder="Enter take profit..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={tradeData.notes}
              onChange={(e) => setTradeData({ ...tradeData, notes: e.target.value })}
              placeholder="Enter notes..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit Trade
          </button>
        </form>
      </div>
    </div>
  );
};

export const TradeFilterModal = ({ isOpen, onClose, onApply }: TradeFilterModalProps) => {
  const [filters, setFilters] = useState<TradeFilters>({
    dateRange: 'today',
    status: [],
    type: [],
    minValue: '',
    maxValue: ''
  });

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${
      isOpen ? 'block' : 'hidden'
    }`}>
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Filter Trades</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onApply(filters)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export const TradeDetailsDrawer = ({ trade, isOpen, onClose }: TradeDetailsDrawerProps) => {
  if (!isOpen || !trade) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#0B0B0F] shadow-xl p-6 transform transition-transform duration-300 border-l border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Trade Details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Quantity</div>
            <div className="font-medium">{trade.quantity}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Price</div>
            <div className="font-medium">${trade.price}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2">Status</div>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
            trade.status === 'FILLED' ? 'bg-green-500/20 text-green-400' :
            trade.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            <span>{trade.status}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-400">Stop Loss</div>
          <div className="font-medium">{trade.stopLoss ? `$${trade.stopLoss}` : 'N/A'}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-400">Take Profit</div>
          <div className="font-medium">{trade.takeProfit ? `$${trade.takeProfit}` : 'N/A'}</div>
        </div>

        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
            Cancel Order
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
            Modify Order
          </button>
        </div>
      </div>
    </div>
  );
};
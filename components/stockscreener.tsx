import React, { useState, useEffect } from "react";
import { ArrowLeft, X, Plus, ChevronDown } from "lucide-react";

// Mock stock data
const allStocks = [
  {
    symbol: "RGTI",
    name: "Rigetti Computing Inc.",
    logo: " ",
    sector: "Tech",
    growth: -8.361,
    performance1Y: -25.5,
    performance3M: -12.3,
    earnings: "Pending",
    ebitda: -63.88,
    marketCap: 220.51,
    status: "USD",
  },
  {
    symbol: "SANA",
    name: "Sana Biotechnology L.",
    logo: " ",
    sector: "Healthcare",
    growth: -202.344,
    performance1Y: -45.2,
    performance3M: 8.7,
    earnings: "Pending",
    ebitda: -202.34,
    marketCap: null,
    status: "USD",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    logo: " ",
    sector: "Tech",
    growth: 125.852,
    performance1Y: 180.5,
    performance3M: 15.2,
    earnings: "Pending",
    ebitda: 34.44,
    marketCap: 110.32,
    status: "USD",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logo: " ",
    sector: "Tech",
    growth: 15.234,
    performance1Y: 45.8,
    performance3M: 12.4,
    earnings: "Beat",
    ebitda: 42.12,
    marketCap: 2850.45,
    status: "USD",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    logo: " ",
    sector: "Tech",
    growth: 8.456,
    performance1Y: 15.2,
    performance3M: -3.1,
    earnings: "Beat",
    ebitda: 38.91,
    marketCap: 2950.78,
    status: "USD",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    logo: " ",
    sector: "Comm Serv",
    growth: 12.789,
    performance1Y: 25.4,
    performance3M: 8.9,
    earnings: "Beat",
    ebitda: 45.23,
    marketCap: 1750.34,
    status: "USD",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    logo: " ",
    sector: "Tech",
    growth: 10.567,
    performance1Y: 35.7,
    performance3M: 5.8,
    earnings: "Beat",
    ebitda: 28.45,
    marketCap: 1650.23,
    status: "USD",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    logo: " ",
    sector: "Comm Serv",
    growth: 18.234,
    performance1Y: 150.3,
    performance3M: 25.6,
    earnings: "Beat",
    ebitda: 32.56,
    marketCap: 890.45,
    status: "USD",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    logo: " ",
    sector: "Healthcare",
    growth: 5.678,
    performance1Y: -8.4,
    performance3M: -2.3,
    earnings: "Meet",
    ebitda: 25.78,
    marketCap: 450.67,
    status: "USD",
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    logo: " ",
    sector: "Healthcare",
    growth: -12.345,
    performance1Y: -35.6,
    performance3M: -15.2,
    earnings: "Miss",
    ebitda: -5.67,
    marketCap: 280.34,
    status: "USD",
  },
  {
    symbol: "VALE",
    name: "Vale S.A.",
    logo: " ",
    sector: "Basic Mats",
    growth: -5.432,
    performance1Y: -12.5,
    performance3M: -8.9,
    earnings: "Miss",
    ebitda: -2.34,
    marketCap: 75.89,
    status: "USD",
  },
  {
    symbol: "SNAP",
    name: "Snap Inc.",
    logo: " ",
    sector: "Comm Serv",
    growth: -25.678,
    performance1Y: -45.6,
    performance3M: -18.9,
    earnings: "Miss",
    ebitda: -15.67,
    marketCap: 15.45,
    status: "USD",
  },
  {
    symbol: "FCX",
    name: "Freeport-McMoRan Inc.",
    logo: " ",
    sector: "Basic Mats",
    growth: -8.901,
    performance1Y: -15.7,
    performance3M: -5.6,
    earnings: "Miss",
    ebitda: -4.56,
    marketCap: 55.78,
    status: "USD",
  },
];

const filterTypes = {
  sector: {
    label: "Sector",
    options: ["Tech", "Healthcare", "Comm Serv", "Basic Mats"],
  },
  performance1Y: {
    label: "1Y performance",
    options: ["High (> 5%)", "Low (< -5%)"],
  },
  performance3M: {
    label: "3M performance",
    options: ["High (> 5%)", "Low (< -5%)"],
  },
};

interface FilterTagProps {
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterMenuProps {
  onAddFilter: (filter: FilterData) => void;
  onClose: () => void;
}

interface FilterData {
  id: number;
  type: string;
  label: string;
  value: string;
}

const FilterTag = ({ label, value, onRemove }: FilterTagProps) => (
  <div className="flex items-center bg-gray-800 rounded-lg text-sm text-gray-300 mr-2 group">
    <span className="px-3 py-1.5 text-gray-400">{label}</span>
    <div className="border-l border-gray-700 px-3 py-1.5 flex items-center">
      <span className="mr-2">{value}</span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  </div>
);

const FilterMenu = ({ onAddFilter, onClose }: FilterMenuProps) => {
  return (
    <div className="absolute top-full mt-2 bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-2 z-10">
      {Object.entries(filterTypes).map(([key, { label, options }]) => (
        <div key={key} className="py-1">
          <div className="px-3 py-2 text-sm text-gray-400">{label}</div>
          {options.map((option) => (
            <button
              key={option}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded"
              onClick={() => {
                onAddFilter({ type: key, label, value: option });
                onClose();
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

const StockScreener = () => {
  const [filters, setFilters] = useState<FilterData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState(allStocks);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const addFilter = (filter: FilterData) => {
    setFilters([...filters, { id: Date.now(), ...filter }]);
  };

  const removeFilter = (filterId: number) => {
    setFilters(filters.filter((f) => f.id !== filterId));
  };

  useEffect(() => {
    let result = allStocks;

    filters.forEach((filter) => {
      switch (filter.type) {
        case "sector":
          result = result.filter((stock) => stock.sector === filter.value);
          break;
        case "performance1Y":
          if (filter.value === "High (> 5%)") {
            result = result.filter((stock) => stock.performance1Y > 5);
          } else {
            result = result.filter((stock) => stock.performance1Y < -5);
          }
          break;
        case "performance3M":
          if (filter.value === "High (> 5%)") {
            result = result.filter((stock) => stock.performance3M > 5);
          } else {
            result = result.filter((stock) => stock.performance3M < -5);
          }
          break;
        default:
          break;
      }
    });

    setFilteredStocks(result);
  }, [filters]);

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "-";
    return num.toFixed(2);
  };

  return (
    <div className="bg-[#0B0B0F] rounded-2xl border-slate-800 border text-gray-300">
      {/* Header with Filters */}
      <div className="border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Screener</span>
          </div>

          <div className="flex flex-wrap items-center flex-1">
            {filters.map((filter) => (
              <FilterTag
                key={filter.id}
                label={filter.label}
                value={filter.value}
                onRemove={() => removeFilter(filter.id)}
              />
            ))}

            <div className="relative">
              <button
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors flex items-center"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <Plus size={18} className="text-gray-400" />
                <ChevronDown size={14} className="text-gray-400 ml-1" />
              </button>

              {showFilterMenu && (
                <FilterMenu
                  onAddFilter={addFilter}
                  onClose={() => setShowFilterMenu(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 py-3 text-sm text-gray-400 border-b border-gray-800">
          <div>Company</div>
          <div>Ccy</div>
          <div>Sector</div>
          <div>FY1 growth</div>
          <div>Earnings date</div>
          <div>EBITDA</div>
          <div>Market Cap</div>
          <div>Private</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-800">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="grid grid-cols-8 gap-4 py-3 text-sm hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={stock.logo}
                  alt={stock.symbol}
                  className="w-6 h-6 rounded"
                />
                <div>
                  <div className="font-medium text-gray-200">
                    {stock.symbol}
                  </div>
                  <div className="text-xs text-gray-500">{stock.name}</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-0.5 text-xs bg-gray-800 rounded">
                  {stock.status}
                </span>
              </div>
              <div className="flex items-center">{stock.sector}</div>
              <div
                className={`flex items-center ${
                  stock.growth >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatNumber(stock.growth)}%
              </div>
              <div className="flex items-center">{stock.earnings}</div>
              <div className="flex items-center">{stock.ebitda}M</div>
              <div className="flex items-center">
                {formatNumber(stock.marketCap)}
              </div>
              <div className="flex items-center">-</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockScreener;

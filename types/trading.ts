import { LucideIcon } from 'lucide-react';

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'SHORT';
  quantity: number;
  price: string;
  status: 'FILLED' | 'PENDING' | 'CANCELED';
  timestamp: string;
  counterparty: string;
  commission: string;
  stopLoss: string | null;
  takeProfit: string | null;
  unrealizedPnL: string;
  realizedPnL: string;
  exposure: string;
  notes: string;
  tags: string[];
}

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  dayChange: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  exposure: number;
  chartData: { value: number }[];
}

export interface RiskMetrics {
  valueAtRisk: string;
  sharpeRatio: string;
  beta: string;
  alpha: string;
  maxDrawdown: string;
  exposureBySector: {
    [key: string]: number;
  };
}

export interface ReconciliationData {
  matched: number;
  unmatched: number;
  breaks: number;
  totalValue: string;
}

export interface RiskMetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
}

export interface TradeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: TradeFilters) => void;
}

export interface TradeFilters {
  dateRange: string;
  status: string[];
  type: string[];
  minValue: string;
  maxValue: string;
}

export interface NewTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TradeData) => void;
}

export interface TradeData {
  symbol: string;
  type: 'BUY' | 'SELL' | 'SHORT';
  quantity: string;
  price: string;
  stopLoss: string;
  takeProfit: string;
  notes: string;
}

export interface TradeDetailsDrawerProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface MiniChartProps {
  data: { value: number }[];
  positive: boolean;
}

export interface ResolutionDialogProps {
  breakItem: {
    id: string;
    [key: string]: any;
  };
  onClose: () => void;
  onResolve: (resolution: Resolution) => void;
}

export interface Resolution {
  action: string;
  notes: string;
  adjustment: string;
} 
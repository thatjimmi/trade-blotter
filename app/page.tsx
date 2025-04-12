"use client";
import MarketAnalysis from "@/components/analysis";
import FinancialStats from "@/components/keystats";
import StockAnalysis from "@/components/market-analysic";
import StockMetrics from "@/components/metrics";
import NavBar from "@/components/navbar";
import NewsFeed from "@/components/newsfeed";
import PivotTableUI, { ColorTheme } from "@/components/pivottableui";
import StockChart from "@/components/stockchart";
import StockScreener from "@/components/stockscreener";
import StockTable from "@/components/stocktable";
import TradeBlotter from "@/components/tradeblotter";

const whiteTheme: ColorTheme = {
  background: "bg-white",
  backgroundSecondary: "bg-gray-50",
  backgroundTertiary: "bg-white/50",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
  textTertiary: "text-gray-400",
  border: "border-gray-200",
  hover: "hover:bg-gray-100",
  positive: "text-green-600",
  negative: "text-red-600",
  buttonBackground: "bg-gray-100",
  buttonHover: "hover:bg-gray-200",
  buttonText: "text-gray-700",
  divider: "divide-gray-200",
};

const Home = () => {
  return (
    <>
      <div className="flex items-center h-screen">
        <div className="w-4/5 mx-auto flex flex-col gap-2">
          <NavBar />
          <StockChart />

          <StockMetrics />
        </div>
      </div>
      <div className="flex flex-col gap-2 pb-3">
        <div className="flex flex-col w-4/5 mx-auto gap-2">
          <PivotTableUI
            data={[
              {
                region: "Americas",
                sector: "Technology",
                symbol: "AAPL",
                year: 2024,
                quarter: "Q4",
                volume: 1250000,
                price: 185.75,
                amount: 232187500,
              },
              {
                region: "Americas",
                sector: "Technology",
                symbol: "MSFT",
                year: 2023,
                quarter: "Q4",
                volume: 980000,
                price: 375.28,
                amount: 367774400,
              },
              {
                region: "Europe 4",
                sector: "Finance",
                symbol: "HSBA.L",
                year: 2023,
                quarter: "Q4",
                volume: 2100000,
                price: 62.15,
                amount: 130515000,
              },
              {
                region: "Asia",
                sector: "Technology",
                symbol: "9984.T",
                year: 2023,
                quarter: "Q4",
                volume: 1500000,
                price: 6781,
                amount: 10171500000,
              },
              {
                region: "Europe 60",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2023,
                quarter: "Q4",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
              {
                region: "Europe 23",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2023,
                quarter: "Q3",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
              {
                region: "Europe 63",
                sector: "Finance",
                symbol: "HSBA.L",
                year: 2023,
                quarter: "Q4",
                volume: 2100000,
                price: 62.15,
                amount: 130515000,
              },
              {
                region: "Asia 3",
                sector: "Technology",
                symbol: "9984.T",
                year: 2023,
                quarter: "Q4",
                volume: 1500000,
                price: 6781,
                amount: 10171500000,
              },
              {
                region: "Europe 5",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2023,
                quarter: "Q4",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
              {
                region: "Europe 2",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2023,
                quarter: "Q3",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
              {
                region: "Europe 631",
                sector: "Finance",
                symbol: "HSBA.L",
                year: 2023,
                quarter: "Q4",
                volume: 2100000,
                price: 62.15,
                amount: 130515000,
              },
              {
                region: "Asia 333",
                sector: "Technology",
                symbol: "9984.T",
                year: 2030,
                quarter: "Q4",
                volume: 1500000,
                price: 6781,
                amount: 10171500000,
              },
              {
                region: "Europe 5333",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2028,
                quarter: "Q4",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
              {
                region: "Europe 2332",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2029,
                quarter: "Q3",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
              {
                region: "Europe 6333",
                sector: "Finance",
                symbol: "HSBA.L",
                year: 2027,
                quarter: "Q4",
                volume: 2100000,
                price: 62.15,
                amount: 130515000,
              },
              {
                region: "Asia 332",
                sector: "Technology",
                symbol: "9984.T",
                year: 2025,
                quarter: "Q4",
                volume: 1500000,
                price: 6781,
                amount: 10171500000,
              },
              {
                region: "Europe 544",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2026,
                quarter: "Q4",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
              {
                region: "Europe 23112",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2023,
                quarter: "Q3",
                volume: 890000,
                price: 2524.5,
                amount: 2246805000,
              },
            ]}
            initialConfig={{
              showRowTotal: true,
              expandedByDefault: false,
              rowDimensions: ["region", "sector"],
              tableConfigs: [
                {
                  colDimensions: ["year", "quarter"],
                  valueDimension: "amount",
                  formatType: "currency",
                  showColumnTotal: true,
                },
              ],
              filters: {},
            }}
            theme={whiteTheme}
            configureable={false}
          />
        </div>
        <div className="flex flex-col w-4/5 mx-auto gap-2">
          <StockTable />
          <NewsFeed />
        </div>
        <div className="flex flex-col w-4/5 mx-auto gap-2">
          <StockScreener />
          <MarketAnalysis />
          <StockAnalysis />
          <FinancialStats />
          <TradeBlotter />
        </div>
      </div>
    </>
  );
};

export default Home;

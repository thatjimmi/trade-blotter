"use client";
import MarketAnalysis from "@/components/analysis";
import FinancialStats from "@/components/keystats";
import StockAnalysis from "@/components/market-analysic";
import StockMetrics from "@/components/metrics";
import NavBar from "@/components/navbar";
import NewsFeed from "@/components/newsfeed";
import PivotTableUI from "@/components/PivotTableUI";
import StockChart from "@/components/stockchart";
import StockScreener from "@/components/stockscreener";
import StockTable from "@/components/stocktable";
import TradeBlotter from "@/components/tradeblotter";

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
                region: "Europe",
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
                region: "Europe",
                sector: "Energy",
                symbol: "SHEL.L",
                year: 2023,
                quarter: "Q4",
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
                  showColumnTotal: !true,
                },
              ],
              filters: {},
            }}
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

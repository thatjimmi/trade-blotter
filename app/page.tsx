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
                region: "North",
                category: "Electronics",
                product: "Laptop",
                year: 2023,
                quarter: "Q1",
                amount: 1000,
              },
              {
                region: "North",
                category: "Electronics",
                product: "Laptop",
                year: 2024,
                quarter: "Q2",
                amount: 1200,
              },
              {
                region: "North",
                category: "Electronics",
                product: "iPhone",
                year: 2024,
                quarter: "Q2",
                amount: 1200,
              },
              {
                region: "North",
                category: "Electronics",
                product: "iPhone",
                year: 2024,
                quarter: "Q5",
                amount: 1200,
              },
              {
                region: "North",
                category: "Animals",
                product: "Cow",
                year: 2024,
                quarter: "Q5",
                amount: 1200,
              },
            ]}
            initialConfig={{
              showRowTotal: false,
              rowDimensions: ["category", "region"],
              tableConfigs: [
                {
                  id: "sales",
                  colDimensions: ["year", "quarter"],
                  valueDimension: "amount",
                  formatType: "currency",
                  showColumnTotal: false,
                },
              ],
              filters: {},
            }}
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

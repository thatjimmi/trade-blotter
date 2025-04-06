"use client";
import MarketAnalysis from "@/components/analysis";
import FinancialStats from "@/components/keystats";
import StockAnalysis from "@/components/market-analysic";
import StockMetrics from "@/components/metrics";
import NavBar from "@/components/navbar";
import NewsFeed from "@/components/newsfeed";
import PivotTableUI from "@/components/pivottableui";
import StockChart from "@/components/stockchart";
import StockScreener from "@/components/stockscreener";
import StockTable from "@/components/stocktable";
import TradeBlotter from "@/components/tradeblotter";

const generateRandomData = (count: number) => {
  const categories = [
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Growth",
    "Value",
    "Dividend",
    "Momentum",
    "Volatility",
  ];

  const regions = [
    "Americas",
    "Europe",
    "Asia",
    "Africa",
    "Australia",
    "Greenland",
  ];
  const sectors = [
    "Technology",
    "Finance",
    "Healthcare",
    "Energy",
    "Consumer",
    "History",
  ];
  const symbols = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "META",
    "NVDA",
    "HSBA.L",
    "9984.T",
  ];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  return Array.from({ length: count }, () => {
    const price = Math.random() * 1000;
    const volume = Math.floor(Math.random() * 10000000);

    return {
      category:
        categories[Math.floor(Math.floor(Math.random() * categories.length))],
      region: regions[Math.floor(Math.random() * regions.length)],
      sector: sectors[Math.floor(Math.random() * sectors.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      year: Math.floor(Math.random() * (2024 - 2020) + 2020),
      quarter: quarters[Math.floor(Math.random() * quarters.length)],
      volume: volume,
      price: Number(price.toFixed(2)),
      amount: Number((price * volume).toFixed(2)),
    };
  });
};

const sampleData = generateRandomData(1000);

console.log(sampleData);

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
            data={sampleData}
            config={{
              showRowTotal: true,
              rowDimensions: ["region", "sector", "symbol"],
              tableConfigs: [
                {
                  id: "asdsadsa",
                  colDimensions: ["year", "quarter", "category"],
                  valueDimension: "price",
                  formatType: "currency",
                  showColumnTotal: true,
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

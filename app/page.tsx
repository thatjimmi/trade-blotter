"use client"
import MarketAnalysis from "@/components/analysis";
import FinancialStats from "@/components/keystats";
import StockAnalysis from "@/components/market-analysic";
import StockMetrics from "@/components/metrics";
import NavBar from "@/components/navbar";
import NewsFeed from "@/components/newsfeed";
import StockChart from "@/components/stockchart";
import StockScreener from "@/components/stockscreener";
import StockTable from "@/components/stocktable";
import TradeBlotter from "@/components/tradeblotter";

const Home = () => {
    return(
    

        <>
    <div className="flex items-center h-screen" >
        <div className="w-4/5 mx-auto flex flex-col gap-2">
            <NavBar />
            <StockChart />   
            
            <StockMetrics />
        </div>
    </div>
    <div className="flex flex-col gap-2 pb-3">

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
        
    )
}

export default Home;

import React, { useState, useEffect } from 'react';
import { STOCKS } from './constants';
import { Stock, AnalysisResult, MemoryCategory } from './types';
import { analyzeStockCycle } from './services/geminiService';
import { fetchYahooChartData, fetchYahooQuote } from './services/yahooService';
import CycleChart from './components/CycleChart';
import CandleChart from './components/CandleChart';
import StockList from './components/StockList';
import MetricCard from './components/MetricCard';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import MarketSentimentBar from './components/MarketSentimentBar';
import { LayoutDashboard, PieChart, TrendingUp, ShieldCheck, Loader2, Wifi, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  // Initialize stocks from constant, but keep in state to allow additions
  const [stocks, setStocks] = useState<Stock[]>(STOCKS);
  const [selectedStock, setSelectedStock] = useState<Stock>(STOCKS[0]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [isAddingStock, setIsAddingStock] = useState<boolean>(false);
  const [liveQuote, setLiveQuote] = useState<{price: number, pe: number} | null>(null);

  // Fetch Real Data (Yahoo) when stock changes
  useEffect(() => {
    const loadRealData = async () => {
      setLoadingData(true);
      setLiveQuote(null);

      try {
        // 1. Fetch Candles
        const candles = await fetchYahooChartData(selectedStock.id);
        
        // 2. Fetch Live Quote
        const quote = await fetchYahooQuote(selectedStock.id);
        
        // Update local state reference for data consistency
        // In a complex app, use deep clone or reducer. 
        selectedStock.candleData = candles;
        
        if (quote) {
            selectedStock.currentPrice = quote.regularMarketPrice;
            selectedStock.peRatio = quote.trailingPE || 0;
            setLiveQuote({ 
                price: quote.regularMarketPrice, 
                pe: quote.trailingPE || 0 
            });
        }

      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadRealData();
  }, [selectedStock.id]); // Only trigger on ID change

  // Handle adding a new stock
  const handleAddStock = async (ticker: string) => {
    // Check if already exists
    if (stocks.find(s => s.id === ticker)) {
      alert("該股票已在清單中");
      return;
    }

    setIsAddingStock(true);
    try {
      const quote = await fetchYahooQuote(ticker);
      if (!quote) {
        alert("找不到該股票代號，請確認輸入正確 (例如: 6770)");
        return;
      }

      const newStock: Stock = {
        id: ticker,
        name: quote.shortName || quote.longName || ticker,
        fullName: quote.longName || quote.shortName || ticker,
        category: MemoryCategory.FOUNDRY, // Default fallback, or "自選關注"
        description: "使用者自選新增個股。AI 將透過聯網搜尋進行即時分析。",
        currentPrice: quote.regularMarketPrice,
        peRatio: quote.trailingPE || 0,
        data: [], // New stocks won't have the hardcoded historical CSV data
        candleData: [],
        transcriptSummary: {
          date: new Date().toISOString().split('T')[0],
          keyTakeaways: ["AI 將自動搜尋最新新聞與財報數據..."],
          guidance: "請參考右側 AI 分析面板",
          capexPlans: "N/A"
        }
      };

      setStocks(prev => [...prev, newStock]);
      setSelectedStock(newStock); // Auto select the new stock
    } catch (error) {
      console.error("Failed to add stock", error);
      alert("新增失敗，請稍後再試");
    } finally {
      setIsAddingStock(false);
    }
  };

  // Calculate derived metrics safely (Handle cases with no historical data)
  const hasHistoricalData = selectedStock.data && selectedStock.data.length >= 2;
  
  let latestRevenue = "N/A";
  let latestOpMargin = 0; // Numeric for check
  let latestGrossMargin = "N/A";
  let latestEPS = "N/A";
  
  let revGrowthQoQ = 0;
  let opMarginGrowth = 0;

  if (hasHistoricalData) {
      const latest = selectedStock.data[selectedStock.data.length - 1];
      const prev = selectedStock.data[selectedStock.data.length - 2];
      
      latestRevenue = latest.revenue.toString();
      latestOpMargin = latest.operatingMargin;
      latestGrossMargin = latest.grossMargin.toString();
      latestEPS = latest.eps.toString();

      revGrowthQoQ = ((latest.revenue - prev.revenue) / prev.revenue) * 100;
      opMarginGrowth = latest.operatingMargin - prev.operatingMargin;
  } else if (selectedStock.data.length === 1) {
      // Case with only 1 data point (rare, but possible if we added basic data)
      const latest = selectedStock.data[0];
      latestRevenue = latest.revenue.toString();
      latestOpMargin = latest.operatingMargin;
      latestGrossMargin = latest.grossMargin.toString();
      latestEPS = latest.eps.toString();
  }

  // Fetch AI Analysis
  useEffect(() => {
    const fetchAnalysis = async () => {
      setAnalyzing(true);
      setAnalysis(null);
      
      try {
        if (process.env.API_KEY) {
            // Pass the potentially updated price to AI
            const analysisStock = { ...selectedStock };
            if (liveQuote) {
                analysisStock.currentPrice = liveQuote.price;
                analysisStock.peRatio = liveQuote.pe;
            }
            const result = await analyzeStockCycle(analysisStock);
            setAnalysis(result);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setAnalyzing(false);
      }
    };

    if (!loadingData) {
        fetchAnalysis();
    }
  }, [selectedStock.id, liveQuote]); // Wait until data loads

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-6 shrink-0 z-20 shadow-lg justify-between">
        <div className="flex items-center gap-3 text-blue-500">
          <LayoutDashboard size={24} />
          <h1 className="text-lg font-bold tracking-tight text-slate-100">
            Memory<span className="text-blue-500">Cycle</span> Strategy
            <span className="ml-2 text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-800/50 font-normal uppercase tracking-wider flex items-center gap-1 inline-flex">
                <Wifi size={10} /> Connected to Yahoo Finance
            </span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-500">
             <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-500"/>
                <span>No Hallucination Protocol Active</span>
             </div>
        </div>
      </header>
      
      {/* Macro Sentiment Bar */}
      <MarketSentimentBar />

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar - Stock List */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 hidden md:flex flex-col">
          <StockList 
            stocks={stocks} 
            selectedStock={selectedStock} 
            onSelect={setSelectedStock}
            onAddStock={handleAddStock}
            isAdding={isAddingStock}
          />
        </aside>

        {/* Mobile Stock List (Simplified for mobile, no add feature here for brevity, or can add later) */}
        <div className="md:hidden p-4 bg-slate-900 border-b border-slate-800">
            <select 
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 outline-none"
                value={selectedStock.id}
                onChange={(e) => {
                    const stock = stocks.find(s => s.id === e.target.value);
                    if (stock) setSelectedStock(stock);
                }}
            >
                {stocks.map(s => <option key={s.id} value={s.id}>{s.id} {s.name}</option>)}
            </select>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-slate-950">
          <div className="max-w-[1600px] mx-auto space-y-5">
            
            {/* Header Section for Selected Stock */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800/50">
                <div>
                    <div className="flex items-baseline gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-white">{selectedStock.name}</h2>
                        <span className="text-lg text-slate-400 font-mono">{selectedStock.id}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs border border-slate-700">
                            {selectedStock.category === MemoryCategory.FOUNDRY && selectedStock.data.length === 0 
                                ? "自選關注" 
                                : selectedStock.category}
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs max-w-2xl">{selectedStock.description}</p>
                </div>
                <div className="text-right flex items-end gap-6">
                     <div>
                        <div className="text-[10px] text-slate-500 mb-0.5 uppercase">Current Price</div>
                        <div className="text-2xl font-mono font-bold text-white flex items-center justify-end gap-2">
                            {loadingData ? <Loader2 className="animate-spin text-slate-600" size={20}/> : liveQuote?.price || "-"}
                        </div>
                     </div>
                     <div>
                        <div className="text-[10px] text-slate-500 mb-0.5 uppercase">P/E Ratio</div>
                        <div className={`text-xl font-mono font-bold flex items-center justify-end gap-2 ${liveQuote && liveQuote.pe > 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                             {loadingData ? <Loader2 className="animate-spin text-slate-600" size={16}/> : (liveQuote?.pe ? liveQuote.pe.toFixed(2) : '-')}
                        </div>
                     </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard 
                    label="季營收 (十億)" 
                    value={latestRevenue}
                    trend={hasHistoricalData ? (revGrowthQoQ > 0 ? 'up' : 'down') : 'neutral'}
                    subValue={hasHistoricalData ? `QoQ ${revGrowthQoQ > 0 ? '+' : ''}${revGrowthQoQ.toFixed(1)}%` : '歷史數據 N/A'}
                />
                 <MetricCard 
                    label="營業利益率 (%)" 
                    value={hasHistoricalData ? latestOpMargin : "N/A"}
                    trend={hasHistoricalData ? (opMarginGrowth > 0 ? 'up' : opMarginGrowth < 0 ? 'down' : 'neutral') : 'neutral'}
                    subValue={hasHistoricalData ? `QoQ ${opMarginGrowth > 0 ? '+' : ''}${opMarginGrowth.toFixed(1)} pts` : '歷史數據 N/A'}
                    highlight={true}
                />
                 <MetricCard 
                    label="毛利率 (%)" 
                    value={latestGrossMargin}
                    subValue="Gross Margin"
                />
                 <MetricCard 
                    label="每股盈餘 (EPS)" 
                    value={latestEPS}
                    subValue="TWD"
                />
            </div>

            {/* Charts & Analysis Split */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                
                {/* Left Column: Visuals (2/3 width on large screens) */}
                <div className="xl:col-span-2 space-y-5">
                    
                    {/* Main Cycle Chart */}
                    <div className="relative">
                        <CycleChart stock={selectedStock} analysis={analysis} />
                        {!hasHistoricalData && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-xl border border-slate-800/50">
                                <div className="text-center p-6 max-w-md">
                                    <AlertTriangle className="mx-auto text-yellow-500 mb-3" size={32} />
                                    <h3 className="text-lg font-bold text-slate-200 mb-1">無歷史財報數據</h3>
                                    <p className="text-sm text-slate-400">
                                        此為自選新增個股，系統暫無其歷史營收與利潤率資料庫。
                                        <br/>但您仍可查看下方的股價 K 線與右側的 AI 分析。
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* K-Line Chart - Now with loading state */}
                        {loadingData ? (
                             <div className="w-full h-[300px] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center flex-col gap-3">
                                <Loader2 className="animate-spin text-blue-500" size={32}/>
                                <span className="text-slate-500 text-xs">Fetching data from Yahoo Finance...</span>
                             </div>
                        ) : (
                             <CandleChart data={selectedStock.candleData} />
                        )}

                        {/* Historical Data Compact Table */}
                        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden h-[300px] flex flex-col">
                            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2 shrink-0">
                                <PieChart size={16} className="text-slate-400"/>
                                <h3 className="text-sm font-semibold text-slate-200">近期財務明細</h3>
                            </div>
                            <div className="overflow-y-auto flex-1 custom-scrollbar relative">
                                {hasHistoricalData ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2">季度</th>
                                                <th className="px-4 py-2 text-right">營收</th>
                                                <th className="px-4 py-2 text-right">毛利率</th>
                                                <th className="px-4 py-2 text-right">營益率</th>
                                                <th className="px-4 py-2 text-right">EPS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {[...selectedStock.data].reverse().map((row) => (
                                                <tr key={row.quarter} className="hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-4 py-2 font-medium text-slate-300 group-hover:text-white">{row.quarter}</td>
                                                    <td className="px-4 py-2 text-right font-mono text-sky-400">{row.revenue}</td>
                                                    <td className="px-4 py-2 text-right font-mono text-slate-400">{row.grossMargin}%</td>
                                                    <td className={`px-4 py-2 text-right font-mono font-bold ${row.operatingMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {row.operatingMargin}%
                                                    </td>
                                                    <td className="px-4 py-2 text-right font-mono text-slate-400">{row.eps}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs gap-2">
                                        <span>暫無詳細財務數據</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Column: Intelligence (1/3 width) */}
                <div className="xl:col-span-1">
                    <AIAnalysisPanel 
                        analysis={analysis} 
                        loading={analyzing} 
                        transcript={selectedStock.transcriptSummary}
                    />
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

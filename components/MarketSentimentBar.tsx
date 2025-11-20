import React from 'react';
import { MARKET_SENTIMENT } from '../constants';
import { TrendingUp, TrendingDown, Gauge, AlertTriangle, DollarSign } from 'lucide-react';

const MarketSentimentBar: React.FC = () => {
  const { vix, cnnFearGreedIndex, marginLoanBalance, taiexAboveMonthLine } = MARKET_SENTIMENT;

  // Helper for color coding
  const getVixColor = (val: number) => val > 20 ? 'text-red-400' : 'text-green-400';
  const getFearGreedColor = (val: number) => val < 25 ? 'text-red-400' : val > 75 ? 'text-green-400' : 'text-yellow-400';
  const getTaiexColor = (bullish: boolean) => bullish ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center gap-6 text-sm shadow-inner">
      <div className="flex items-center gap-2 text-slate-300 font-semibold tracking-wide text-xs uppercase">
         <Gauge size={14} className="text-blue-400" /> 市場宏觀指標
      </div>
      
      <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>

      <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1 rounded border border-slate-800/50">
        <span className="text-slate-400 text-xs">VIX 恐慌指數</span>
        <span className={`font-mono font-bold ${getVixColor(vix)}`}>{vix}</span>
      </div>

      <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1 rounded border border-slate-800/50">
        <span className="text-slate-400 text-xs">CNN 恐懼與貪婪</span>
        <span className={`font-mono font-bold ${getFearGreedColor(cnnFearGreedIndex)}`}>{cnnFearGreedIndex}</span>
      </div>

      <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1 rounded border border-slate-800/50">
        <span className="text-slate-400 text-xs">融資餘額 (億)</span>
        <div className="flex items-center gap-1">
             <DollarSign size={12} className="text-yellow-500"/>
             <span className="font-mono font-bold text-slate-200">{marginLoanBalance}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1 rounded border border-slate-800/50">
        <span className="text-slate-400 text-xs">大盤月線</span>
        <div className={`flex items-center gap-1 font-bold ${getTaiexColor(taiexAboveMonthLine)}`}>
            {taiexAboveMonthLine ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{taiexAboveMonthLine ? "站上 (偏多)" : "跌破 (偏空)"}</span>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentBar;
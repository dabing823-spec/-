
import React, { useState } from 'react';
import { Stock } from '../types';
import { Activity, Disc, Cpu, Server, Plus, Search, Loader2 } from 'lucide-react';

interface StockListProps {
  stocks: Stock[];
  selectedStock: Stock;
  onSelect: (stock: Stock) => void;
  onAddStock: (ticker: string) => Promise<void>;
  isAdding: boolean;
}

const StockList: React.FC<StockListProps> = ({ stocks, selectedStock, onSelect, onAddStock, isAdding }) => {
  const [inputTicker, setInputTicker] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTicker.trim()) {
      await onAddStock(inputTicker.trim());
      setInputTicker('');
    }
  };

  const getIcon = (category: string) => {
    if (category.includes("DRAM")) return <Disc size={16} />;
    if (category.includes("NAND")) return <Cpu size={16} />;
    if (category.includes("晶圓")) return <Activity size={16} />;
    if (category === "自選關注") return <Search size={16} />;
    return <Server size={16} />;
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 md:h-full pr-2">
      
      {/* Add Stock Form */}
      <form onSubmit={handleAddSubmit} className="mb-4 relative group">
        <input 
          type="text" 
          value={inputTicker}
          onChange={(e) => setInputTicker(e.target.value)}
          placeholder="輸入代號 (如 6770)"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={isAdding || !inputTicker}
          className="absolute right-1 top-1 bottom-1 p-1.5 bg-slate-800 text-slate-400 rounded hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors"
        >
          {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        </button>
      </form>

      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">追蹤個股清單</h2>
      
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {stocks.map((stock) => {
          const isSelected = stock.id === selectedStock.id;
          // Handle missing data for new stocks safely
          const hasData = stock.data && stock.data.length > 0;
          const latestMargin = hasData ? stock.data[stock.data.length - 1].operatingMargin : null;
          const marginColor = latestMargin !== null 
            ? (latestMargin > 0 ? 'text-green-400' : 'text-red-400') 
            : 'text-slate-500';

          return (
            <button
              key={stock.id}
              onClick={() => onSelect(stock)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                isSelected 
                  ? 'bg-slate-800 border-blue-500/50 shadow-lg shadow-blue-900/20' 
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold font-mono ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                  {stock.id}
                </span>
                <span className={`text-xs font-mono font-bold ${marginColor}`}>
                  {latestMargin !== null ? `${latestMargin}%` : 'N/A'}
                </span>
              </div>
              <div className="text-sm text-slate-200 font-medium mb-1 truncate">{stock.name}</div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                {getIcon(stock.category)}
                <span className="truncate">{stock.category}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StockList;

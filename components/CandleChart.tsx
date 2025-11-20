
import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CandleData } from '../types';
import { AlertCircle } from 'lucide-react';

interface CandleChartProps {
  data: CandleData[];
}

const CandleChart: React.FC<CandleChartProps> = ({ data }) => {
  
  if (!data || data.length === 0) {
      return (
        <div className="w-full h-[300px] bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg flex items-center justify-center text-slate-500 flex-col gap-2">
            <AlertCircle size={24} />
            <span className="text-xs">No candle data available. Check proxy or API.</span>
        </div>
      );
  }

  const processedData = data.map(d => ({
    ...d,
    bodyMin: Math.min(d.open, d.close),
    bodyMax: Math.max(d.open, d.close),
    color: d.close > d.open ? '#ef4444' : '#22c55e' // Red Up, Green Down
  }));

  return (
    <div className="w-full h-[300px] bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-sm font-semibold text-slate-100">股價日 K 線 (Daily Candle)</h3>
         <div className="text-xs text-slate-500">紅漲綠跌 (TW Style)</div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                minTickGap={30}
            />
            <YAxis 
                domain={['auto', 'auto']} 
                orientation="right" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '5px' }}
                formatter={(value: any, name: string) => {
                    if (name === 'close') return [value, '收盤'];
                    if (name === 'volume') return [value.toLocaleString(), '成交量'];
                    return [null, null];
                }}
            />
            
            <Bar dataKey="low" dataKey2="high" fill="#fff" barSize={1} xAxisId={0} />
            
             <Bar 
                dataKey="bodyMax" 
                shape={(props: any) => {
                    const { x, y, width, payload, yAxis } = props;
                    if (!yAxis) return null;
                    
                    const openY = yAxis.scale(payload.open);
                    const closeY = yAxis.scale(payload.close);
                    const highY = yAxis.scale(payload.high);
                    const lowY = yAxis.scale(payload.low);
                    
                    const bodyHeight = Math.max(2, Math.abs(openY - closeY));
                    const bodyY = Math.min(openY, closeY);
                    const isUp = payload.close > payload.open;
                    const color = isUp ? '#ef4444' : '#22c55e';

                    return (
                        <g>
                            <line x1={x + width / 2} y1={highY} x2={x + width / 2} y2={lowY} stroke={color} strokeWidth={1} />
                            <rect 
                                x={x} 
                                y={bodyY} 
                                width={width} 
                                height={bodyHeight} 
                                fill={isUp ? 'none' : color} 
                                stroke={color}
                                strokeWidth={1.5}
                            />
                        </g>
                    );
                }}
             >
                {
                    processedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                }
             </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart;

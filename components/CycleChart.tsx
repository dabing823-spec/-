
import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  ReferenceArea
} from 'recharts';
import { Stock, AnalysisResult } from '../types';

interface CycleChartProps {
  stock: Stock;
  analysis: AnalysisResult | null;
}

const CycleChart: React.FC<CycleChartProps> = ({ stock, analysis }) => {
  
  // Prepare data including prediction if available
  const chartData = [...stock.data];
  
  if (analysis && analysis.predictedRevenueNum && analysis.predictedOpMarginNum) {
      chartData.push({
          quarter: "2025 Q4(E)",
          revenue: analysis.predictedRevenueNum,
          operatingMargin: analysis.predictedOpMarginNum,
          grossMargin: 0, // Not focused on chart
          eps: 0,
          avgPrice: 0
      });
  }

  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-100">營收與營益率循環 (含預測)</h3>
        <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
            可拖拉下方滑桿檢視歷史數據
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
            <pattern id="stripe" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                 <rect width="2" height="4" transform="translate(0,0)" fill="#38bdf8" fillOpacity={0.3}></rect>
            </pattern>
          </defs>

          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.5} />
          
          <XAxis 
            dataKey="quarter" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#475569' }}
            minTickGap={30}
          />
          
          {/* Left Y Axis: Revenue */}
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#38bdf8" 
            tick={{ fill: '#38bdf8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{ value: '營收 (十億)', angle: -90, position: 'insideLeft', fill: '#38bdf8', fontSize: 10, offset: 10 }}
          />
          
          {/* Right Y Axis: Margin */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#fb7185" 
            tick={{ fill: '#fb7185', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            unit="%"
          />

          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
            formatter={(value: number, name: string) => {
                if (name === 'operatingMargin') return [`${value}%`, '營業利益率'];
                if (name === 'revenue') return [`${value} 十億`, '營收'];
                return [value, name];
            }}
            labelFormatter={(label) => {
                if (label === "2025 Q4(E)") return `${label} - AI 預測`;
                return label;
            }}
          />
          
          <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}/>
          
          <ReferenceLine y={0} yAxisId="right" stroke="#475569" strokeDasharray="3 3" />

          {/* Highlight Forecast Area if it exists */}
          {analysis && (
              <ReferenceArea 
                x1="2025 Q3" 
                x2="2025 Q4(E)" 
                yAxisId="left"
                fill="#3b82f6" 
                fillOpacity={0.05} 
              />
          )}

          <Bar 
            yAxisId="left" 
            name="營收"
            dataKey="revenue" 
            barSize={20} 
            fill="url(#revenueColor)"
            radius={[4, 4, 0, 0]}
          />
          
          <Line 
            yAxisId="right" 
            name="營業利益率"
            type="monotone" 
            dataKey="operatingMargin" 
            stroke="#f43f5e" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />

          <Brush 
            dataKey="quarter" 
            height={30} 
            stroke="#475569" 
            fill="#0f172a" 
            tickFormatter={() => ""}
            startIndex={Math.max(0, chartData.length - 10)} // Default view last 10 qtrs
            endIndex={chartData.length - 1}
          />

        </ComposedChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CycleChart;

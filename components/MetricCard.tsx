import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, trend, highlight }) => {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-blue-950/30 border-blue-500/30' : 'bg-slate-900 border-slate-800'}`}>
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold text-slate-100 font-mono">{value}</div>
        {trend && (
          <div className={`flex items-center text-xs font-bold ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {trend === 'up' && <ArrowUpRight size={14} />}
            {trend === 'down' && <ArrowDownRight size={14} />}
            {trend === 'neutral' && <Minus size={14} />}
          </div>
        )}
      </div>
      {subValue && <div className="text-slate-500 text-xs mt-1">{subValue}</div>}
    </div>
  );
};

export default MetricCard;
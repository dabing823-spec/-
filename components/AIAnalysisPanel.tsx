import React from 'react';
import { Bot, Sparkles, TrendingUp, Target, FileText, BrainCircuit, DollarSign } from 'lucide-react';
import { AnalysisResult, TranscriptSummary } from '../types';

interface AIAnalysisPanelProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  transcript: TranscriptSummary;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ analysis, loading, transcript }) => {
  if (loading) {
    return (
      <div className="h-full min-h-[600px] bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center animate-pulse">
        <Sparkles className="text-blue-500 mb-3 animate-spin-slow" size={32} />
        <div className="text-slate-400 text-sm font-mono">Gemini AI Analyzing Transcripts & Financials...</div>
        <div className="text-slate-600 text-xs mt-2">Connecting Wall Street Logic...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
        
        {/* AI Prediction Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 relative overflow-hidden shadow-lg flex-1">
             {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Bot size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <BrainCircuit className="text-purple-400" size={20} />
                    <h3 className="text-lg font-bold text-slate-100">Gemini 華爾街預測</h3>
                </div>

                {!analysis ? (
                     <div className="text-slate-500 text-center py-10 text-sm">等待分析數據...</div>
                ) : (
                    <>
                        {/* Prediction Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                <div className="text-xs text-slate-400 mb-1">預估下季毛利率 (GM)</div>
                                <div className="text-lg font-bold text-sky-300 font-mono">{analysis.predictedGrossMargin}</div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                <div className="text-xs text-slate-400 mb-1">預估下季營益率 (OPM)</div>
                                <div className="text-lg font-bold text-rose-300 font-mono">{analysis.predictedOperatingMargin}</div>
                            </div>
                        </div>

                        {/* Logic Section */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Target size={12} /> 判斷邏輯 (Wall Street Logic)
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded border border-slate-800/50">
                                    {analysis.wallStreetLogic}
                                </p>
                            </div>

                             <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <DollarSign size={12} /> 估值分析
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {analysis.valuationAnalysis}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Transcript Insights Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FileText className="text-yellow-500" size={18} />
                    <h3 className="font-bold text-slate-200">法說會重點 (AlphaMemo Source)</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">{transcript.date}</span>
             </div>
             
             <div className="space-y-3">
                <ul className="list-disc list-inside space-y-1">
                    {transcript.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="text-xs text-slate-300 leading-5">
                            {point}
                        </li>
                    ))}
                </ul>
                
                <div className="pt-2 border-t border-slate-800 mt-2">
                    <div className="text-xs font-bold text-slate-400 mb-1">官方展望 (Guidance):</div>
                    <div className="text-xs text-slate-300 italic">"{transcript.guidance}"</div>
                </div>
             </div>
        </div>
    </div>
  );
};

export default AIAnalysisPanel;

export interface QuarterlyData {
  quarter: string; // e.g., "2022 Q1"
  revenue: number; // In Billion TWD
  operatingMargin: number; // Percentage (e.g., 25.5)
  grossMargin: number; // Percentage
  eps: number;
  avgPrice: number; // Average stock price for the quarter
}

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Stock {
  id: string; // Ticker, e.g., "2408"
  name: string; // e.g., "南亞科"
  fullName: string;
  category: MemoryCategory | string; // Modified to allow string for custom adds
  description: string;
  currentPrice: number; // Will be updated by API
  peRatio: number; // Will be updated by API
  data: QuarterlyData[]; // Historical financial data
  candleData: CandleData[]; // Populated by Yahoo API
  transcriptSummary: TranscriptSummary; 
}

export interface TranscriptSummary {
  date: string;
  keyTakeaways: string[];
  guidance: string;
  capexPlans: string;
}

export enum MemoryCategory {
  DRAM_MANUFACTURING = "DRAM 製造",
  NAND_CONTROLLER = "NAND/控制晶片",
  MODULE_MAKER = "模組廠",
  FOUNDRY = "晶圓代工(記憶體)",
  CUSTOM = "自選關注"
}

export interface MarketSentiment {
  vix: number;
  cnnFearGreedIndex: number; // 0-100
  marginLoanBalance: number; // Billion TWD
  taiexAboveMonthLine: boolean; // Is TAIEX above 20MA
}

export interface AnalysisResult {
  summary: string;
  outlook: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  predictedGrossMargin: string; // Text range for display
  predictedOperatingMargin: string; // Text range for display
  predictedRevenueNum: number; // Numeric for chart plotting
  predictedOpMarginNum: number; // Numeric for chart plotting
  cycleStage: string;
  valuationAnalysis: string;
  wallStreetLogic: string; // Explanation of the prediction
  realTimePrice?: number;
  realTimePE?: number;
}

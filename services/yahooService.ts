
import { CandleData } from '../types';

// Yahoo Finance APIs via a CORS Proxy
// NOTE for GitHub: In a production environment, you should use your own backend proxy 
// instead of 'allorigins' to ensure reliability and security.
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const YAHOO_BASE = "https://query1.finance.yahoo.com";

export interface YahooQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketPreviousClose: number;
  trailingPE?: number;
  marketCap?: number;
  longName?: string; // Added for dynamic stock adding
  shortName?: string;
}

/**
 * Fetches historical K-line data (Candles) for a stock.
 * @param ticker Stock symbol (e.g., "2408.TW")
 */
export const fetchYahooChartData = async (ticker: string): Promise<CandleData[]> => {
  try {
    // Fetch 6 months of daily data
    const url = `${YAHOO_BASE}/v8/finance/chart/${ticker}.TW?interval=1d&range=6mo`;
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
    
    if (!response.ok) throw new Error("Network response was not ok");
    
    const json = await response.json();
    const result = json.chart.result?.[0];
    
    if (!result) return [];

    const quote = result.indicators.quote[0];
    const timestamps = result.timestamp;

    if (!timestamps || !quote) return [];

    const candles: CandleData[] = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      open: Number((quote.open[i] || 0).toFixed(2)),
      high: Number((quote.high[i] || 0).toFixed(2)),
      low: Number((quote.low[i] || 0).toFixed(2)),
      close: Number((quote.close[i] || 0).toFixed(2)),
      volume: quote.volume[i] || 0
    })).filter((c: CandleData) => c.open > 0 && c.close > 0); // Filter out null data points

    return candles;
  } catch (error) {
    console.error(`Failed to fetch candle data for ${ticker}:`, error);
    return [];
  }
};

/**
 * Fetches real-time quote data (Price, PE, Name).
 * @param ticker Stock symbol (e.g., "2408")
 */
export const fetchYahooQuote = async (ticker: string): Promise<YahooQuote | null> => {
  try {
    const url = `${YAHOO_BASE}/v7/finance/quote?symbols=${ticker}.TW`;
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
    
    if (!response.ok) throw new Error("Network response was not ok");

    const json = await response.json();
    const result = json.quoteResponse.result?.[0];

    if (!result) return null;

    return {
      symbol: result.symbol,
      regularMarketPrice: result.regularMarketPrice,
      regularMarketPreviousClose: result.regularMarketPreviousClose,
      trailingPE: result.trailingPE,
      marketCap: result.marketCap,
      longName: result.longName,
      shortName: result.shortName
    };
  } catch (error) {
    console.error(`Failed to fetch quote for ${ticker}:`, error);
    return null;
  }
};

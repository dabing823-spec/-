
import { Stock, MemoryCategory, MarketSentiment } from './types';

export const MARKET_SENTIMENT: MarketSentiment = {
  vix: 24.5, // 波動率指數偏高
  cnnFearGreedIndex: 15, // Extreme Fear
  marginLoanBalance: 305.2, 
  taiexAboveMonthLine: false, 
};

// NOTE: 'currentPrice', 'peRatio', and 'candleData' are now initial placeholders.
// They will be populated by 'services/yahooService.ts' at runtime.

export const STOCKS: Stock[] = [
  {
    id: "2408",
    name: "南亞科",
    fullName: "南亞科技 (Nanya Technology)",
    category: MemoryCategory.DRAM_MANUFACTURING,
    description: "全球第四大 DRAM 製造商。歷史數據顯示其營運槓桿極大，景氣反轉時獲利波動劇烈。",
    currentPrice: 0, // Will be fetched via API
    peRatio: 0,      // Will be fetched via API
    transcriptSummary: {
      date: "2025-10-15",
      keyTakeaways: [
        "2025 Q3 雖受惠 AI 邊緣裝置需求，但標準型 DRAM 價格受中國產能干擾。",
        "1B 製程良率已達 90%，成本結構改善。",
        "經營層表示：最壞情況已過，但復甦呈現 L 型而非 V 型。"
      ],
      guidance: "Q4 預期位元出貨量持平，ASP 小幅上漲，力求單季獲利擴大。",
      capexPlans: "2026 資本支出將受控，約 200 億台幣，專注於製程微縮而非擴產。"
    },
    candleData: [], // Will be fetched via API
    data: [
      // --- 實際歷史數據 (Database) ---
      { quarter: "2022 Q1", revenue: 19.95, operatingMargin: 31.1, grossMargin: 43.9, eps: 2.11, avgPrice: 70 },
      { quarter: "2022 Q2", revenue: 14.36, operatingMargin: 19.8, grossMargin: 29.4, eps: 2.12, avgPrice: 55 },
      { quarter: "2022 Q3", revenue: 11.02, operatingMargin: -3.8, grossMargin: 12.8, eps: -0.40, avgPrice: 48 },
      { quarter: "2022 Q4", revenue: 7.95, operatingMargin: -19.4, grossMargin: 5.9, eps: -0.37, avgPrice: 52 },
      { quarter: "2023 Q1", revenue: 6.43, operatingMargin: -44.9, grossMargin: -8.6, eps: -0.54, avgPrice: 60 },
      { quarter: "2023 Q2", revenue: 7.01, operatingMargin: -45.1, grossMargin: -13.4, eps: -0.25, avgPrice: 68 },
      { quarter: "2023 Q3", revenue: 7.73, operatingMargin: -32.5, grossMargin: -1.5, eps: -0.81, avgPrice: 65 },
      { quarter: "2023 Q4", revenue: 8.71, operatingMargin: -28.6, grossMargin: -3.5, eps: -0.80, avgPrice: 70 },
      { quarter: "2024 Q1", revenue: 9.52, operatingMargin: -15.5, grossMargin: 2.5, eps: -0.20, avgPrice: 66 },
      { quarter: "2024 Q2", revenue: 10.85, operatingMargin: -5.2, grossMargin: 12.5, eps: -0.05, avgPrice: 68 },
      { quarter: "2024 Q3", revenue: 12.10, operatingMargin: 1.5, grossMargin: 18.5, eps: 0.15, avgPrice: 72 },
      { quarter: "2024 Q4", revenue: 13.20, operatingMargin: 5.8, grossMargin: 23.5, eps: 0.45, avgPrice: 75 },
    ]
  },
  {
    id: "8299",
    name: "群聯",
    fullName: "群聯電子 (Phison)",
    category: MemoryCategory.NAND_CONTROLLER,
    description: "NAND Flash 控制晶片與模組大廠。2025 年以 aiDAPTIV+ 架構成功切入 AI 私有雲市場。",
    currentPrice: 0,
    peRatio: 0,
    transcriptSummary: {
      date: "2025-10-28",
      keyTakeaways: [
        "NAND 原廠減產效應結束，供給轉趨寬鬆，考驗模組廠庫存管理能力。",
        "企業級 SSD (Enterprise SSD) 營收佔比突破 30%，穩定整體毛利。",
        "aiDAPTIV+ 方案在醫療與法律事務所的落地應用超出預期。"
      ],
      guidance: "預期 Q4 營收受季節性因素影響小幅下滑，但毛利率可望維持高檔。",
      capexPlans: "持續擴大研發團隊，主要投資於 PCIe Gen6 生態系。"
    },
    candleData: [],
    data: [
      { quarter: "2022 Q1", revenue: 17.11, operatingMargin: 12.8, grossMargin: 30.8, eps: 11.1, avgPrice: 480 },
      { quarter: "2022 Q2", revenue: 16.28, operatingMargin: 11.5, grossMargin: 30.4, eps: 9.5, avgPrice: 420 },
      { quarter: "2022 Q3", revenue: 14.58, operatingMargin: 4.5, grossMargin: 24.5, eps: 6.2, avgPrice: 350 },
      { quarter: "2022 Q4", revenue: 12.29, operatingMargin: -1.5, grossMargin: 18.5, eps: 0.85, avgPrice: 320 },
      { quarter: "2023 Q1", revenue: 10.08, operatingMargin: 8.5, grossMargin: 31.8, eps: 4.5, avgPrice: 390 },
      { quarter: "2023 Q2", revenue: 12.52, operatingMargin: 10.2, grossMargin: 32.5, eps: 5.8, avgPrice: 420 },
      { quarter: "2023 Q3", revenue: 12.39, operatingMargin: 11.5, grossMargin: 31.5, eps: 6.5, avgPrice: 480 },
      { quarter: "2023 Q4", revenue: 15.50, operatingMargin: 12.8, grossMargin: 33.2, eps: 10.2, avgPrice: 550 },
      { quarter: "2024 Q1", revenue: 16.50, operatingMargin: 13.2, grossMargin: 34.5, eps: 11.5, avgPrice: 610 },
      { quarter: "2024 Q2", revenue: 17.20, operatingMargin: 14.5, grossMargin: 35.8, eps: 12.8, avgPrice: 590 },
      { quarter: "2024 Q3", revenue: 18.10, operatingMargin: 14.8, grossMargin: 35.5, eps: 13.2, avgPrice: 620 },
      { quarter: "2024 Q4", revenue: 19.50, operatingMargin: 15.2, grossMargin: 36.2, eps: 14.5, avgPrice: 680 },
    ]
  },
  {
    id: "2344",
    name: "華邦電",
    fullName: "華邦電子 (Winbond)",
    category: MemoryCategory.DRAM_MANUFACTURING,
    description: "全球利基型記憶體領導者。2025 年受惠於 WiFi 7 升級潮帶動的小容量記憶體需求。",
    currentPrice: 0,
    peRatio: 0,
    transcriptSummary: {
      date: "2025-11-02",
      keyTakeaways: [
        "消費性電子需求溫和復甦，但網通與車用市場動能較強。",
        "台中廠稼動率維持滿載，高雄廠 20nm 製程良率穩定。",
        "不與三大原廠進行產能競賽，專注於客製化高毛利產品。"
      ],
      guidance: "Q4 進入季節性淡季，預期營收季減 5-10%，毛利率持平。",
      capexPlans: "資本支出聚焦於高雄廠二期設備移入。"
    },
    candleData: [],
    data: [
      { quarter: "2022 Q1", revenue: 26.51, operatingMargin: 18.8, grossMargin: 48.6, eps: 1.15, avgPrice: 31 },
      { quarter: "2022 Q2", revenue: 26.65, operatingMargin: 16.5, grossMargin: 46.2, eps: 1.30, avgPrice: 28 },
      { quarter: "2022 Q3", revenue: 22.14, operatingMargin: 7.5, grossMargin: 38.5, eps: 0.66, avgPrice: 22 },
      { quarter: "2022 Q4", revenue: 19.22, operatingMargin: 1.5, grossMargin: 33.5, eps: 0.14, avgPrice: 20 },
      { quarter: "2023 Q1", revenue: 17.02, operatingMargin: -6.8, grossMargin: 27.7, eps: -0.25, avgPrice: 23 },
      { quarter: "2023 Q2", revenue: 18.81, operatingMargin: -2.5, grossMargin: 31.5, eps: -0.08, avgPrice: 26 },
      { quarter: "2023 Q3", revenue: 19.50, operatingMargin: 0.5, grossMargin: 32.5, eps: 0.10, avgPrice: 25 },
      { quarter: "2023 Q4", revenue: 20.05, operatingMargin: 2.1, grossMargin: 33.0, eps: 0.25, avgPrice: 27 },
      { quarter: "2024 Q1", revenue: 20.50, operatingMargin: 5.5, grossMargin: 34.5, eps: 0.35, avgPrice: 26 },
      { quarter: "2024 Q2", revenue: 21.20, operatingMargin: 8.2, grossMargin: 36.2, eps: 0.45, avgPrice: 25 },
      { quarter: "2024 Q3", revenue: 22.10, operatingMargin: 9.5, grossMargin: 37.5, eps: 0.52, avgPrice: 26 },
      { quarter: "2024 Q4", revenue: 23.50, operatingMargin: 11.2, grossMargin: 38.5, eps: 0.65, avgPrice: 29 },
    ]
  }
];

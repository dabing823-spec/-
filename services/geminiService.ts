
import { GoogleGenAI, Type } from "@google/genai";
import { Stock, AnalysisResult, MarketSentiment } from '../types';
import { MARKET_SENTIMENT } from '../constants';

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeStockCycle = async (stock: Stock): Promise<AnalysisResult> => {
  const ai = getAIClient();

  // Pass entire history for better context, but maybe summarize if too long
  // For this request, we want to emphasize the current situation
  const recentData = stock.data.slice(-8); // Last 2 years context
  const dataString = JSON.stringify(recentData, null, 2);
  const transcriptString = JSON.stringify(stock.transcriptSummary, null, 2);
  const marketString = JSON.stringify(MARKET_SENTIMENT, null, 2);

  const prompt = `
    **角色設定**: 您是嚴謹的戰略儀表板 AI 引擎，專精於台灣記憶體產業。拒絕幻覺，一切基於數據。
    **當前時間**: 2025 年 11 月。
    **語言要求**: 繁體中文 (Traditional Chinese)。

    針對 ${stock.fullName} (${stock.id}) 進行分析。

    ### 輸入數據 ###
    1. **近期財務 (近8季):**
    ${dataString}

    2. **法說會 (2025 Q3):**
    ${transcriptString}

    3. **市場指標:**
    ${marketString}
    (注意: CNN 恐懼指數極低，代表市場極度恐慌)

    ### 任務 ###
    1. **預測數值 (必要)**: 請精確預估 2025 Q4 的「營收(十億)」與「營益率(%)」。請基於營運槓桿與法說會展望進行計算。
    2. **循環位階**: 判斷目前處於循環的哪個精確位置。
    3. **估值分析**: 嚴肅評估目前股價與 PE 的合理性。
    4. **圖表數據**: 我需要將您的預測畫在圖上，所以數值必須合理且具參考性。

    請回傳 JSON。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "戰略摘要" },
            outlook: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"], description: "展望" },
            predictedGrossMargin: { type: Type.STRING, description: "預估毛利率範圍文字" },
            predictedOperatingMargin: { type: Type.STRING, description: "預估營益率範圍文字" },
            predictedRevenueNum: { type: Type.NUMBER, description: "預估 2025 Q4 營收數值 (用於繪圖)" },
            predictedOpMarginNum: { type: Type.NUMBER, description: "預估 2025 Q4 營益率數值 (用於繪圖)" },
            cycleStage: { type: Type.STRING, description: "循環階段" },
            valuationAnalysis: { type: Type.STRING, description: "估值分析" },
            wallStreetLogic: { type: Type.STRING, description: "預測邏輯" }
          },
          required: ["summary", "outlook", "predictedGrossMargin", "predictedOperatingMargin", "predictedRevenueNum", "predictedOpMarginNum", "cycleStage", "valuationAnalysis", "wallStreetLogic"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback with numeric zeros if failed
    return {
      summary: "分析連線失敗，請檢查 API Key。",
      outlook: "NEUTRAL",
      predictedGrossMargin: "N/A",
      predictedOperatingMargin: "N/A",
      predictedRevenueNum: 0,
      predictedOpMarginNum: 0,
      cycleStage: "未知",
      valuationAnalysis: "無法取得數據",
      wallStreetLogic: "API 連線錯誤"
    };
  }
};

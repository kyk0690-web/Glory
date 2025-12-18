import { GoogleGenAI } from "@google/genai";

export const generateSermonPlan = async (prompt: string, pdfData?: string | null): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key가 설정되지 않았습니다.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const parts: any[] = [{ text: prompt }];

    // If PDF data is present, add it as a part
    if (pdfData) {
      // Ensure we strip the data URL prefix if it exists to get just the base64 string
      const base64Data = pdfData.includes('base64,') 
        ? pdfData.split('base64,')[1] 
        : pdfData;

      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
      config: {
        systemInstruction: "당신은 기독교대한성결교회의 목회자입니다. 당신은 부교역자로서 담임목사님의 목회를 돕는 사람입니다. 신학적으로 건전하고 성결교회의 신앙 전통(중생, 성결, 신유, 재림)을 존중하며, 사용자의 요청에 따라 체계적이고 은혜로운 설교 계획을 작성해주세요.",
        temperature: 0.7,
      }
    });

    return response.text || "응답을 생성하지 못했습니다.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "설교 계획 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};
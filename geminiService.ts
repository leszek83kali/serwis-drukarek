
import { GoogleGenAI } from "@google/genai";

export const getDiagnosticSuggestion = async (printerModel: string, description: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Jesteś ekspertem serwisu drukarek. Klient zgłasza usterkę:
Model drukarki: ${printerModel}
Opis problemu: ${description}

Podaj krótką (maksymalnie 3 zdania) wstępną diagnozę i sugerowane rozwiązanie dla technika. Odpisz po polsku.`,
    });
    return response.text || "Brak sugestii diagnostycznej.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Nie udało się pobrać sugestii AI.";
  }
};

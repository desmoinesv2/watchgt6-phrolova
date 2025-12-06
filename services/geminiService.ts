import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCharacterQuote = async (characterName: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a very short, mysterious, and elegant single-line quote (max 6 words) suitable for a smartwatch face display, inspired by a gothic anime character named ${characterName}. It should sound slightly dangerous or alluring. Do not use quotes in the output.`,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate quote:", error);
    return "Chaos awaits within";
  }
};
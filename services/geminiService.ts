
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingChunk, Location } from '../types';

export const getChatResponse = async (
  prompt: string,
  location: Location | null
): Promise<{ text: string; groundingChunks: GroundingChunk[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const tools: any[] = [{ googleSearch: {} }, { googleMaps: {} }];
    const toolConfig: any = {};

    if (location) {
      toolConfig.retrievalConfig = {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      };
    }
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools,
        toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Ensure groundingChunks is always an array
    const filteredChunks = Array.isArray(groundingChunks) ? groundingChunks : [];

    return { text, groundingChunks: filteredChunks as GroundingChunk[] };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI. Please check your connection or API key.");
  }
};

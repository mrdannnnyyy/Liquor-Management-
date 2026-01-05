import { GoogleGenAI } from "@google/genai";
import { DEPARTMENTS, PRODUCT_CATALOG } from '../constants';

// NOTE: In a real production app, never expose API keys in frontend code.
// For this MVP "ready-to-run" demo, we will use a local storage key or prompt.
const getApiKey = () => {
  const key = localStorage.getItem('GEMINI_API_KEY');
  return key || '';
};

export const setApiKey = (key: string) => {
  localStorage.setItem('GEMINI_API_KEY', key);
};

const SYSTEM_INSTRUCTION = `You are an expert Retail Manager AI Assistant for a liquor store. 
You have access to the store's Standard Operating Procedures (SOPs) and Product Catalog.
RULES:
1. Always cite the Department name if you use info from an SOP.
2. If the user asks about a product, check the product catalog.
3. If the answer is NOT in the provided context, say "I don't see that in the handbook. Please ask a manager." Do not guess.
4. Be concise and professional.
`;

export const generateAIResponse = async (userQuery: string, history: { role: string; parts: { text: string }[] }[]) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  // Client-side RAG: Prepare Context
  // In a real app, this would be a Vector DB search. Here we do simple string matching.
  const relevantSops = DEPARTMENTS.filter(d => 
    d.sop.toLowerCase().includes(userQuery.toLowerCase().split(' ')[0]) || // specific match
    d.name.toLowerCase().includes('beer') // generic fallback logic for demo
  ).map(d => `DEPARTMENT: ${d.name}\nSOP: ${d.sop}`).join('\n\n');

  const productContext = JSON.stringify(PRODUCT_CATALOG);

  const contextPrompt = `
  CONTEXT DATA:
  ${relevantSops}
  
  PRODUCT DATA:
  ${productContext}

  USER QUESTION: ${userQuery}
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: contextPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error", error);
    throw error;
  }
};

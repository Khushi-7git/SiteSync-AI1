import { GoogleGenAI, Type, Chat, FunctionDeclaration } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- SECURITY: Input Sanitization ---
const sanitizeInput = (text: string, maxLength: number = 500): string => {
  if (!text) return "";
  const stripped = text.replace(/<[^>]*>?/gm, '');
  return stripped.slice(0, maxLength).trim();
};

// --- SECURITY: Rate Limiting ---
class RateLimiter {
  private lastCall: number = 0;
  private minInterval: number = 2500; // 2.5s throttle to protect API quota

  async throttle() {
    const now = Date.now();
    const elapsed = now - this.lastCall;
    if (elapsed < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - elapsed));
    }
    this.lastCall = Date.now();
  }
}

const limiter = new RateLimiter();

const callWithRetry = async <T>(fn: () => Promise<T>, retries: number = 3): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      await limiter.throttle();
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.message || "";
      if (status.includes("429") || status.includes("exhausted")) {
        const delay = Math.pow(2, i) * 3000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

// --- Blueprint Processing ---
export const processBlueprint = async (base64Image: string): Promise<string> => {
  const ai = getAIClient();
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Act as a BIM Manager. Analyze this blueprint/drawing. Extract a technical summary of key structural and MEP requirements. What elements must be present for 100% completion in this area? Keep it concise (max 200 words)." }
        ]
      },
      config: {
        systemInstruction: "You are SiteSync Blueprint Processor. Extract structural ground truth for site audit comparison."
      }
    });
    return response.text || "Standard architectural requirements detected.";
  });
};

export const dispatchSafetyRFIFunctionDeclaration: FunctionDeclaration = {
  name: 'dispatchSafetyRFI',
  parameters: {
    type: Type.OBJECT,
    description: 'Auto-dispatch a Request For Information (RFI) to the Safety Team with fed site details.',
    properties: {
      issue: { type: Type.STRING, description: 'The safety hazard or structural issue' },
      location: { type: Type.STRING, description: 'Precise site coordinates or room ID' },
      priority: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
      safety_email: { type: Type.STRING, description: 'Target safety officer email' },
      site_details: { type: Type.STRING, description: 'Automated site metadata and blueprint context' }
    },
    required: ['issue', 'location', 'priority', 'safety_email', 'site_details'],
  },
};

export const generateVibeOverlay = async (
  baseImageBase64: string,
  prompt: string,
  options: {
    referenceImageBase64?: string;
    previousIterationBase64?: string;
    isHD?: boolean;
  } = {}
): Promise<string | null> => {
  const { referenceImageBase64, previousIterationBase64, isHD } = options;
  const sanitizedPrompt = sanitizeInput(prompt);
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  return callWithRetry(async () => {
    const parts: any[] = [
      { inlineData: { data: baseImageBase64, mimeType: 'image/jpeg' } }
    ];

    if (previousIterationBase64) {
      const cleanPrev = previousIterationBase64.includes(',') ? previousIterationBase64.split(',')[1] : previousIterationBase64;
      parts.push({ inlineData: { data: cleanPrev, mimeType: 'image/png' } });
    }
    if (referenceImageBase64) {
      parts.push({ inlineData: { data: referenceImageBase64, mimeType: 'image/jpeg' } });
    }

    parts.push({ text: `Task: Render architectural intent: ${sanitizedPrompt}.` });

    const response = await ai.models.generateContent({
      model: isHD ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image',
      contents: { parts },
      config: { 
        imageConfig: { 
          aspectRatio: "16:9",
          ...(isHD ? { imageSize: "2K" } : {})
        } 
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  });
};

export const createChatSession = (instruction: string): Chat => {
  const ai = getAIClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: instruction, temperature: 0.5 }
  });
};

export const analyzeSiteFrame = async (
  base64Image: string,
  prompt: string,
  spatialContext: string = ""
): Promise<{ text: string; functionCalls?: any[]; hazards?: any[]; buildCompletion?: number; missingWork?: any[] }> => {
  const sanitizedPrompt = sanitizeInput(prompt);
  const ai = getAIClient();
  
  const hazardSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        room: { type: Type.STRING },
        description: { type: Type.STRING },
        severity: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
        coordinates: {
          type: Type.OBJECT,
          properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } },
          required: ['x', 'y']
        }
      },
      required: ['id', 'room', 'description', 'severity', 'coordinates']
    }
  };

  const missingWorkSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        task: { type: Type.STRING },
        trade: { type: Type.STRING, enum: ['Structural', 'MEP', 'Finishes', 'Safety'] },
        coordinates: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } }, required: ['x', 'y'] }
      },
      required: ['id', 'task', 'trade', 'coordinates']
    }
  };

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: `${sanitizedPrompt}\n\nBLUEPRINT CONTEXT (THE GROUND TRUTH):\n${spatialContext}\n\nCompare the live site to this blueprint context and identify deviations. Use the dispatchSafetyRFI tool for any HIGH or CRITICAL severity hazards.` }
        ]
      },
      config: {
        systemInstruction: `You are SiteSync AI Auditor. Return JSON exactly.
        Compare visual build state to BLUEPRINT CONTEXT. 
        Calculate BUILD COMPLETION % based on how much work from the context is actually visible.
        IMPORTANT: Always provide the current site details and safety email (safety-ledger@sitesync.io) when dispatching RFIs.`,
        tools: [{ functionDeclarations: [dispatchSafetyRFIFunctionDeclaration] }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            hazards: hazardSchema,
            buildCompletion: { type: Type.NUMBER },
            missingWork: missingWorkSchema
          },
          required: ['analysis', 'buildCompletion']
        }
      }
    });

    try {
      const json = JSON.parse(response.text);
      return { 
        text: json.analysis || "", 
        functionCalls: response.functionCalls, 
        hazards: json.hazards || [],
        buildCompletion: json.buildCompletion,
        missingWork: json.missingWork || []
      };
    } catch (e) {
      return { text: response.text || "", functionCalls: response.functionCalls };
    }
  });
};
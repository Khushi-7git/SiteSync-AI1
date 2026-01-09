
import { GoogleGenAI, Type, Chat, FunctionDeclaration } from "@google/genai";

// Fix: Use process.env.API_KEY directly for initialization as per guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Function declarations for Autonomous Reporting
const rfiTool: FunctionDeclaration = {
  name: 'send_rfi',
  parameters: {
    type: Type.OBJECT,
    description: 'Automatically drafts and sends a Request for Information (RFI) to the project team.',
    properties: {
      subject: { type: Type.STRING, description: 'Subject of the RFI, e.g., "HVAC Clash Sector 4"' },
      details: { type: Type.STRING, description: 'Technical description of the deviation found.' },
      priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
      offset_cm: { type: Type.NUMBER, description: 'The measured discrepancy in centimeters.' }
    },
    required: ['subject', 'details', 'priority']
  }
};

const slackTool: FunctionDeclaration = {
  name: 'notify_team',
  parameters: {
    type: Type.OBJECT,
    description: 'Sends a priority notification to the site Slack/Procore channel.',
    properties: {
      message: { type: Type.STRING },
      channel: { type: Type.STRING, enum: ['site-safety', 'architecture', 'hvac-leads'] }
    },
    required: ['message', 'channel']
  }
};

export const createChatSession = (systemInstruction: string): Chat => {
  const ai = getAIClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview', // Using Pro for complex reasoning
    config: {
      systemInstruction,
      temperature: 0.5,
      tools: [{ functionDeclarations: [rfiTool, slackTool] }]
    },
  });
};

export const analyzeSiteFrame = async (
  base64Image: string,
  prompt: string,
  spatialContext: string[] = []
): Promise<{ text: string; functionCalls?: any[] }> => {
  const ai = getAIClient();
  const contextText = spatialContext.length > 0 
    ? `Previous Spatial Context (Thought Signatures): ${spatialContext.join(' | ')}` 
    : '';

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `${prompt}\n\n${contextText}\n\nAudit strictly against PDF blueprint offsets. Detect HVAC, plumbing, or structural deviations.` }
      ]
    },
    config: {
      systemInstruction: "You are a Structural Audit AI. You identify errors in construction physically compared to blueprints. If you find a critical error (offset > 5cm), you MUST call send_rfi.",
      tools: [{ functionDeclarations: [rfiTool, slackTool] }]
    }
  });

  return {
    text: response.text || "Scanning...",
    functionCalls: response.functionCalls
  };
};

export const generateVibeOverlay = async (
  base64Image: string,
  prompt: string
): Promise<string | null> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `Apply 4K architectural finishes: ${prompt}. Account for detected light sources. High fidelity polished concrete, exposed brick, or marble.` }
      ]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

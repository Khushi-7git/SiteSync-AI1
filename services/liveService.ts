
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

// Manual Base64 Implementation as per requirements
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export type LiveCallbacks = {
  onMessage?: (text?: string, audioBuffer?: AudioBuffer) => void;
  onInterrupted?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export class ConstructorsLiveSession {
  // Fix: Initialize GoogleGenAI using process.env.API_KEY directly as per guidelines
  private ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  private sessionPromise: any = null;
  private inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  private outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  private nextStartTime = 0;
  private activeSources = new Set<AudioBufferSourceNode>();

  async connect(callbacks: LiveCallbacks) {
    const systemInstruction = `
      Act as 'Constructors', the native voice assistant for the Vibe-Construct app.
      Identify the user's language automatically from their voice input and respond in that same language.
      When asked about a feature, explain the logic (e.g., 'I am using High Reasoning to check your plumbing').
      If you see a hazard in the video stream (frames provided), interrupt immediately in their language.
      You are highly technical but friendly. Use current 'Thought Signatures' to maintain context.
    `;

    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          this.startMicStreaming();
          callbacks.onOpen?.();
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.interrupted) {
            this.activeSources.forEach(s => s.stop());
            this.activeSources.clear();
            this.nextStartTime = 0;
            callbacks.onInterrupted?.();
          }

          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            const buffer = await decodeAudioData(decode(base64Audio), this.outputAudioContext, 24000, 1);
            this.playAudio(buffer);
            callbacks.onMessage?.(undefined, buffer);
          }
        },
        onclose: () => callbacks.onClose?.(),
        onerror: (e) => console.error("Live Session Error:", e)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
        },
        systemInstruction
      }
    });

    return this.sessionPromise;
  }

  private async startMicStreaming() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.inputAudioContext.createMediaStreamSource(stream);
      const scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createBlob(inputData);
        // Fix: Use sessionPromise to send data only after connection resolves, avoiding potential race conditions
        this.sessionPromise.then((session: any) => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(this.inputAudioContext.destination);
    } catch (err) {
      console.error("Mic access failed:", err);
    }
  }

  private playAudio(buffer: AudioBuffer) {
    this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
    const source = this.outputAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputAudioContext.destination);
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    this.activeSources.add(source);
    source.onended = () => this.activeSources.delete(source);
  }

  async sendVideoFrame(base64: string) {
    if (!this.sessionPromise) return;
    this.sessionPromise.then((session: any) => {
      session.sendRealtimeInput({
        media: { data: base64, mimeType: 'image/jpeg' }
      });
    });
  }

  disconnect() {
    this.sessionPromise?.then((s: any) => s.close());
    this.activeSources.forEach(s => s.stop());
    this.inputAudioContext.close();
    this.outputAudioContext.close();
  }
}

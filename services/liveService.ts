import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

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
  onMessage?: (text?: string) => void;
  onInterrupted?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onTranscription?: (text: string, role: 'user' | 'model') => void;
};

export class ConstructorsLiveSession {
  private ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources = new Set<AudioBufferSourceNode>();
  private stream: MediaStream | null = null;
  private isClosing = false;

  async connect(callbacks: LiveCallbacks) {
    this.isClosing = false;
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    const systemInstruction = `
      You are 'Constructors', the SiteSync AI voice assistant.
      Role: Real-time Site Supervisor.
      Tone: Professional, direct, technical, but encouraging.
      Capabilities: You receive live video frames of a construction site.
      Instructions: 
      1. Watch for safety hazards or deviations from BIM standards.
      2. If you see something dangerous, interrupt the user immediately.
      3. Use technical terms (MEP, RFI, Stud spacing, Slab thickness) correctly.
      4. Support multiple languages: Detect the user's language and reply in the same.
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
            this.activeSources.forEach(s => { try { s.stop(); } catch(e) {} });
            this.activeSources.clear();
            this.nextStartTime = 0;
            callbacks.onInterrupted?.();
          }

          if (message.serverContent?.inputTranscription) {
            callbacks.onTranscription?.(message.serverContent.inputTranscription.text, 'user');
          }
          if (message.serverContent?.outputTranscription) {
            callbacks.onTranscription?.(message.serverContent.outputTranscription.text, 'model');
          }

          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio && this.outputAudioContext && !this.isClosing) {
            const buffer = await decodeAudioData(decode(base64Audio), this.outputAudioContext, 24000, 1);
            this.playAudio(buffer);
          }
        },
        onclose: () => {
          this.cleanup();
          callbacks.onClose?.();
        },
        onerror: (e) => {
          console.error("Live Session Error:", e);
          this.cleanup();
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
        },
        systemInstruction,
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      }
    });

    return this.sessionPromise;
  }

  private async startMicStreaming() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!this.inputAudioContext || this.isClosing) return;
      const source = this.inputAudioContext.createMediaStreamSource(this.stream);
      const scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e) => {
        if (this.isClosing) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createBlob(inputData);
        this.sessionPromise?.then((session: any) => {
          if (!this.isClosing) session.sendRealtimeInput({ media: pcmBlob });
        });
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(this.inputAudioContext.destination);
    } catch (err) {
      console.error("Mic access failed:", err);
    }
  }

  private playAudio(buffer: AudioBuffer) {
    if (!this.outputAudioContext || this.isClosing || this.outputAudioContext.state === 'closed') return;
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
    if (!this.sessionPromise || this.isClosing) return;
    this.sessionPromise.then((session: any) => {
      if (!this.isClosing) {
        session.sendRealtimeInput({
          media: { data: base64, mimeType: 'image/jpeg' }
        });
      }
    });
  }

  private cleanup() {
    if (this.isClosing) return;
    this.isClosing = true;

    this.activeSources.forEach(s => { try { s.stop(); } catch(e) {} });
    this.activeSources.clear();
    this.stream?.getTracks().forEach(t => t.stop());
    
    if (this.inputAudioContext && this.inputAudioContext.state !== 'closed') {
      this.inputAudioContext.close().catch(e => console.warn("Error closing input context", e));
    }
    if (this.outputAudioContext && this.outputAudioContext.state !== 'closed') {
      this.outputAudioContext.close().catch(e => console.warn("Error closing output context", e));
    }
  }

  disconnect() {
    if (this.isClosing) return;
    this.sessionPromise?.then((s: any) => {
      try { s.close(); } catch(e) {}
    });
    this.cleanup();
  }
}
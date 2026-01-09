import React, { useState } from 'react';
import { MicIcon, SparklesIcon } from './Icons';

interface VibeVisualizerProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  translations: any;
  showGuide?: boolean;
  overlayOpacity: number;
  onOpacityChange: (opacity: number) => void;
}

const VibeVisualizer: React.FC<VibeVisualizerProps> = ({ 
  onGenerate, 
  isGenerating, 
  translations: t, 
  showGuide,
  overlayOpacity,
  onOpacityChange
}) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };
    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) onGenerate(prompt);
  };

  return (
    <div className={`absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-xl px-4 md:px-6 z-50 transition-all duration-500 ${showGuide ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
      <div className="mb-3 md:mb-4 flex flex-col items-center bg-white/40 backdrop-blur-md p-2 md:p-3 rounded-2xl border border-white/50 shadow-sm">
        <div className="flex justify-between w-full px-2 mb-1.5 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-[#8B5E3C]">
          <span>Physical Site</span>
          <span>Architectural Intent</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={overlayOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#2D241E]/10 rounded-full appearance-none cursor-ew-resize accent-[#2D241E] transition-all"
        />
      </div>

      <form 
        onSubmit={handleSubmit}
        className={`glass-morphism p-1 rounded-full shadow-[0_15px_45px_rgba(45,36,30,0.15)] flex items-center space-x-2 border-white/50 transition-all duration-300 ${isListening ? 'ring-2 ring-[#8B5E3C]' : ''}`}
      >
        <button
          type="button"
          onClick={handleMicClick}
          className={`p-2.5 md:p-3 rounded-full transition-all duration-500 ${
            isListening ? 'bg-[#A44A3F] text-white animate-pulse' : 'hover:bg-[#F2EFEA] text-[#8B5E3C]'
          }`}
        >
          <MicIcon />
        </button>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.placeholder}
          className="bg-transparent flex-1 border-none focus:ring-0 text-[#2D241E] placeholder-[#A8998D] text-[11px] md:text-sm font-medium px-1"
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt}
          className={`group flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full transition-all duration-500 ${
            isGenerating 
            ? 'bg-[#F2EFEA] text-[#A8998D]' 
            : 'bg-[#2D241E] text-white hover:bg-[#8B5E3C]'
          }`}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-[#2D241E]/20 border-t-[#2D241E] rounded-full animate-spin" />
          ) : (
            <SparklesIcon />
          )}
        </button>
      </form>
    </div>
  );
};

export default VibeVisualizer;
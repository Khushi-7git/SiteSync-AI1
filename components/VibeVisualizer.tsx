
import React, { useState, useRef, useEffect } from 'react';
import { MicIcon, SparklesIcon, BlueprintIcon, CameraIcon } from './Icons';
import { DESIGN_THEMES } from '../types';

interface VibeVisualizerProps {
  onGenerate: (prompt: string, refImage?: string, isHD?: boolean) => void;
  isGenerating: boolean;
  translations: any;
  overlayOpacity: number;
  onOpacityChange: (opacity: number) => void;
  hasResult: boolean;
  onIterate: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: (val: boolean) => void;
}

const VibeVisualizer: React.FC<VibeVisualizerProps> = ({ 
  onGenerate, 
  isGenerating, 
  translations: t, 
  overlayOpacity,
  onOpacityChange,
  hasResult,
  onIterate,
  isMinimized: controlledMinimized,
  onToggleMinimize
}) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [isHD, setIsHD] = useState(false);
  const [internalMinimized, setInternalMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;
  const toggleMinimize = () => {
    if (onToggleMinimize) onToggleMinimize(!isMinimized);
    else setInternalMinimized(!isMinimized);
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => setPrompt(e.results[0][0].transcript);
    recognition.start();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRefImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, refImage || undefined, isHD);
    }
  };

  return (
    <div className={`fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 md:px-6 z-[90] flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMinimized ? 'translate-y-[calc(100%+20px)]' : 'translate-y-0'}`}>
      
      {/* HUD Floating Trigger (Visible when minimized) */}
      <button 
        onClick={toggleMinimize}
        className={`absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 glass-morphism px-4 md:px-6 py-2.5 md:py-3 rounded-full border border-white/50 shadow-2xl flex items-center space-x-2 md:space-x-3 transition-all duration-500 hover:scale-105 active:scale-95 ${isMinimized ? 'opacity-100' : 'opacity-0 pointer-events-none translate-y-10'}`}
      >
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#FFB800] rounded-full animate-pulse" />
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2D241E]">Open Visual Lab</span>
        <SparklesIcon />
      </button>

      {/* Main Sliding Bar */}
      <div className="w-full glass-morphism p-4 md:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.4)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/60 relative">
        
        {/* Minimize Button */}
        <button 
          onClick={toggleMinimize}
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 md:w-12 h-1 md:h-1.5 bg-black/10 rounded-full hover:bg-black/20 transition-colors"
          title="Dismiss Controls"
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-3">
             <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest ${hasResult ? 'bg-[#FFB800] text-black shadow-[0_0_15px_rgba(255,184,0,0.4)]' : 'bg-black/10 text-black/40'}`}>
               {hasResult ? 'REFINING AUDIT' : 'DESIGN INTENT'}
             </div>
             {isHD && <div className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-blue-600 text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest animate-pulse">PRO ENGINE</div>}
          </div>
          {hasResult && (
            <button 
              onClick={onIterate}
              className="p-1.5 md:p-2 rounded-full hover:bg-red-50 text-red-500 transition-all active:scale-90"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>

        {/* Comparator Tool */}
        <div className="px-2 md:px-4 mb-4 md:mb-8">
          <div className="flex justify-between items-center mb-2 md:mb-4">
            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[#2D241E]/30">Reality</span>
            <div className="flex items-center space-x-1 md:space-x-2">
               <span className="text-[9px] md:text-[11px] font-black text-[#2D241E] tabular-nums">{Math.round(overlayOpacity * 100)}%</span>
               <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[#2D241E]/30">Vibe Overlay</span>
            </div>
          </div>
          <div className="relative h-6 md:h-10 flex items-center group">
            <input 
              type="range" min="0" max="1" step="0.01" value={overlayOpacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full h-1.5 md:h-2.5 bg-[#2D241E]/5 rounded-full appearance-none cursor-ew-resize accent-[#2D241E] z-10"
            />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 md:h-2.5 bg-[#FFB800] rounded-full transition-all duration-300 shadow-[0_0_15px_#FFB800] md:shadow-[0_0_25px_#FFB800]"
              style={{ width: `${overlayOpacity * 100}%` }}
            />
          </div>
        </div>

        {/* Style Presets */}
        <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-4 md:pb-6 mb-4 md:mb-6 no-scrollbar mask-fade-edges">
          {DESIGN_THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setPrompt(theme.prompt)}
              className="flex flex-col items-center p-2.5 md:p-4 bg-white/40 border border-white/50 rounded-[1.5rem] md:rounded-[2.5rem] transition-all hover:scale-105 shrink-0 group hover:shadow-xl active:scale-95"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/80 mb-2 md:mb-3 flex items-center justify-center text-[#2D241E]/40 group-hover:bg-[#2D241E] group-hover:text-white transition-all duration-300 shadow-inner">
                <SparklesIcon />
              </div>
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tight text-[#2D241E] truncate max-w-[60px] md:max-w-none">
                {theme.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Input Control Hub */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[2rem] flex items-center justify-center transition-all shadow-lg md:shadow-xl active:scale-90 shrink-0 ${refImage ? 'bg-[#FFB800] text-black border-2 border-white' : 'bg-white text-[#2D241E] border border-white hover:border-[#FFB800]'}`}
          >
            {refImage ? <img src={refImage} className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-lg md:rounded-xl" /> : <BlueprintIcon />}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </button>

          <form onSubmit={handleSubmit} className="flex-1 bg-white/90 rounded-[1.2rem] md:rounded-[2rem] flex items-center p-1.5 md:p-2.5 border border-white shadow-xl md:shadow-2xl">
            <button
              type="button" onClick={handleMicClick}
              className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl transition-all active:scale-90 shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-[#8B5E3C] hover:bg-black/5'}`}
            >
              <MicIcon />
            </button>
            <input
              type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder={hasResult ? "Modify..." : "Envision..."}
              className="bg-transparent flex-1 border-none focus:ring-0 text-[10px] md:text-sm font-bold px-2 md:px-4 placeholder:text-black/20"
            />
            <div className="flex items-center space-x-1.5 md:space-x-2 shrink-0">
               <button 
                 type="button"
                 onClick={() => setIsHD(!isHD)}
                 className={`hidden sm:flex px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[7px] md:text-[9px] font-black uppercase tracking-widest transition-all ${isHD ? 'bg-blue-600 text-white' : 'bg-black/5 text-black/40'}`}
               >
                 HD
               </button>
               <button
                type="submit" disabled={isGenerating || !prompt}
                className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${isGenerating ? 'bg-[#F2EFEA]' : 'bg-[#2D241E] text-white hover:bg-[#8B5E3C] shadow-lg md:shadow-2xl active:scale-90'}`}
              >
                {isGenerating ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-t-transparent border-black rounded-full animate-spin" /> : <SparklesIcon />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VibeVisualizer;

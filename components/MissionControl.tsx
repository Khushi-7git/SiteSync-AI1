import React, { useRef } from 'react';
import { OnboardingStage } from '../types';
import { BlueprintIcon, CameraIcon, SparklesIcon } from './Icons';

interface MissionControlProps {
  currentStage: OnboardingStage;
  onStageChange: (stage: OnboardingStage) => void;
  progress: number;
  hints: string[];
  translations: any;
  showGuide?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const MissionControl: React.FC<MissionControlProps> = ({
  currentStage,
  onStageChange,
  progress,
  hints,
  translations: t,
  showGuide,
  isOpen = true,
  onToggle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = [
    { id: OnboardingStage.BLUEPRINT_SYNC, icon: <BlueprintIcon />, label: t.calibration },
    { id: OnboardingStage.LIVE_WALKTHROUGH, icon: <CameraIcon />, label: t.audit },
    { id: OnboardingStage.GENERATIVE_VISUALIZATION, icon: <SparklesIcon />, label: t.rendering }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />
      
      <div className={`fixed md:relative top-0 left-0 bottom-0 w-72 md:w-80 border-r border-[#E5E0D8] flex flex-col h-full z-[110] glass-morphism transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${showGuide ? 'brightness-50 grayscale' : ''}`}>
        <div className="p-6 md:p-8 pb-6 bg-[#2D241E]/5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-1.5 bg-[#FFB800] rounded-full" />
              <h1 className="text-lg md:text-xl font-black tracking-tighter text-[#2D241E]">{t.title}</h1>
            </div>
            <button onClick={onToggle} className="md:hidden p-2 text-[#8B5E3C]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p className="text-[#8B5E3C] text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-black opacity-60">{t.subtitle}</p>
        </div>

        <div className="px-5 md:px-6 space-y-6 md:space-y-8 flex-1 overflow-y-auto pt-6">
          {/* Blueprint Ingestion */}
          <section className="px-1 md:px-2">
            <h2 className="px-2 text-[8px] md:text-[9px] font-black text-[#8B5E3C] mb-3 md:mb-4 uppercase tracking-[0.3em] opacity-80">Blueprint Ingestion</h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-[#D4A373]/30 rounded-2xl p-4 md:p-5 hover:border-[#FFB800] hover:bg-white transition-all text-center"
            >
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.bim,.dwg" />
              <div className="text-[#8B5E3C] group-hover:text-[#FFB800] mb-2 flex justify-center">
                <BlueprintIcon />
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-[#2D241E] uppercase tracking-wider">Sync PDF / BIM File</p>
            </div>
          </section>

          <section>
            <h2 className="px-2 text-[8px] md:text-[9px] font-black text-[#8B5E3C] mb-3 md:mb-4 uppercase tracking-[0.3em] opacity-80">{t.operational_workflow}</h2>
            <div className="space-y-1.5 md:space-y-2">
              {stages.map((stage, index) => {
                const isActive = currentStage === stage.id;
                const isPast = stages.findIndex(s => s.id === currentStage) > index;

                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      onStageChange(stage.id);
                      if (window.innerWidth < 768) onToggle?.();
                    }}
                    className={`w-full group relative flex items-center space-x-3 md:space-x-4 p-3.5 md:p-4 rounded-xl transition-all duration-300 border ${
                      isActive
                        ? 'bg-white border-[#FFB800]/40 shadow-lg translate-x-1'
                        : 'hover:bg-white/40 border-transparent text-[#6E5D51]'
                    }`}
                  >
                    <div className={`transition-all ${isActive ? 'text-[#FFB800]' : 'text-[#A8998D]'}`}>
                      {stage.icon}
                    </div>
                    <span className={`text-[11px] md:text-xs font-black tracking-tight ${isActive ? 'text-[#2D241E]' : ''}`}>
                      {stage.label}
                    </span>
                    {isPast && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                        <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between px-2 mb-3 md:mb-4">
              <h2 className="text-[8px] md:text-[9px] font-black text-[#8B5E3C] uppercase tracking-[0.3em] opacity-80">Live Reasoning</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="bg-[#2D241E] rounded-2xl p-4 md:p-5 space-y-3 md:space-y-4 shadow-xl border border-white/5">
              <div className="flex items-center space-x-2 text-[7px] md:text-[8px] font-mono font-bold text-[#FFB800] uppercase tracking-widest">
                <span className="w-1 h-1 rounded-full bg-[#FFB800] animate-pulse" />
                <span>Thought Signatures</span>
              </div>
              <div className="space-y-3 md:space-y-4 max-h-32 md:max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {hints.map((hint, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-500">
                    <p className="text-[10px] md:text-[11px] text-white/70 font-medium leading-relaxed font-mono">
                      <span className="text-white/20 mr-1">[{i}]</span> {hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 md:p-8 mt-auto">
          <div className={`bg-white p-5 md:p-6 rounded-2xl border border-[#E5E0D8] shadow-sm ${progress > 0 && progress < 100 ? 'progress-pulse' : ''}`}>
            <div className="flex justify-between items-end mb-2.5 md:mb-3">
              <span className="text-[7px] md:text-[8px] text-[#8B5E3C] font-black uppercase tracking-[0.4em]">Spatial Sync</span>
              <span className="text-lg md:text-xl font-mono font-black text-[#2D241E]">{progress}%</span>
            </div>
            <div className="w-full bg-[#F2EFEA] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#FFB800] h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MissionControl;
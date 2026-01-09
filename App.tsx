import React, { useState, useCallback, useRef, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MissionControl from './components/MissionControl';
import CameraFeed from './components/CameraFeed';
import VibeVisualizer from './components/VibeVisualizer';
import { Chatbot } from './components/Chatbot';
import { OnboardingStage, SUPPORTED_LANGUAGES, Hazard, SiteReport, TRANSLATIONS } from './types';
import { analyzeSiteFrame, generateVibeOverlay } from './services/geminiService';
import { ConstructorsLiveSession } from './services/liveService';
import { WarningIcon, MicIcon, BlueprintIcon } from './components/Icons';

const App: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState<OnboardingStage>(OnboardingStage.BLUEPRINT_SYNC);
  const [progress, setProgress] = useState(25);
  const [hints, setHints] = useState<string[]>(["SYSTEM: Operational. Standing by for blueprint sync."]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [lastBase64, setLastBase64] = useState<string | null>(null);
  const [reports, setReports] = useState<SiteReport[]>([]);
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [showRfiModal, setShowRfiModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const spatialContextRef = useRef<string[]>([]);
  const liveSessionRef = useRef<ConstructorsLiveSession | null>(null);

  const t = TRANSLATIONS[language.code] || TRANSLATIONS.en;

  useEffect(() => {
    if (!isAppStarted) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAppStarted]);

  const triggerHaptic = (p: number | number[] = 50) => navigator.vibrate?.(p);

  const handleToolCall = useCallback((call: any) => {
    if (call.name === 'send_rfi') {
      triggerHaptic([100, 50, 100]);
      const newReport: SiteReport = {
        id: `RFI-${Math.floor(Math.random()*9000)+1000}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'RFI',
        status: 'Draft',
        summary: `${call.args.subject}: ${call.args.details} (Offset: ${call.args.offset_cm}cm)`
      };
      setReports(prev => [newReport, ...prev]);
      setShowRfiModal(true);
    }
  }, []);

  const processFrame = useCallback(async (base64: string) => {
    setLastBase64(base64);
    if (currentStage === OnboardingStage.LIVE_WALKTHROUGH && Math.random() > 0.7) {
      try {
        const { text, functionCalls } = await analyzeSiteFrame(
          base64, 
          "Perform Structural Audit against synced BIM datum.", 
          spatialContextRef.current
        );
        setHints(prev => [text.slice(0, 80) + "...", ...prev.slice(0, 10)]);
        spatialContextRef.current = [...spatialContextRef.current.slice(-5), text.slice(0, 100)];
        if (functionCalls) functionCalls.forEach(handleToolCall);
      } catch (e) { console.error("Audit cycle skip."); }
    }
  }, [currentStage, handleToolCall]);

  const toggleLiveAssistant = async () => {
    if (isLiveActive) {
      liveSessionRef.current?.disconnect();
      setIsLiveActive(false);
      return;
    }
    const session = new ConstructorsLiveSession();
    liveSessionRef.current = session;
    await session.connect({
      onOpen: () => setIsLiveActive(true),
      onClose: () => setIsLiveActive(false),
      onMessage: (text) => text && setHints(prev => [`VOICE: ${text}`, ...prev])
    });
  };

  const handleStageChange = (stage: OnboardingStage) => {
    setCurrentStage(stage);
    setProgress(stage === OnboardingStage.BLUEPRINT_SYNC ? 25 : stage === OnboardingStage.LIVE_WALKTHROUGH ? 60 : 100);
  };

  if (!isAppStarted) {
    return <LandingPage onStart={() => setIsAppStarted(true)} />;
  }

  return (
    <div className="flex h-[100dvh] bg-[#FAF9F6] text-[#2D241E] overflow-hidden">
      <MissionControl 
        currentStage={currentStage} 
        onStageChange={handleStageChange}
        progress={progress}
        hints={hints}
        translations={t}
        showGuide={showGuide}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 relative flex flex-col bg-black w-full min-w-0">
        <header className="absolute top-0 left-0 right-0 h-10 md:h-12 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-between px-4 md:px-8 border-b border-white/10 font-mono text-[9px] md:text-[10px]">
          <div className="flex items-center space-x-3 md:space-x-8 text-white/60">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white/80 p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-[#FFB800]">LOCK:</span>
              <span className="text-green-500 animate-pulse">ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#FFB800]">T_SIG:</span>
              <span>{spatialContextRef.current.length}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
             <button 
              onClick={toggleLiveAssistant}
              className={`flex items-center space-x-2 px-2 md:px-3 py-1 rounded border transition-all text-[8px] md:text-[10px] ${isLiveActive ? 'bg-[#A44A3F] text-white border-transparent animate-pulse' : 'border-white/20 text-white/40 hover:text-white'}`}
            >
              <MicIcon />
              <span className="uppercase tracking-widest hidden xs:inline">{isLiveActive ? 'Live' : 'Voice'}</span>
            </button>
            <select 
              className="bg-transparent text-[#FFB800] border-none focus:ring-0 p-0 cursor-pointer appearance-none uppercase text-[8px] md:text-[10px]"
              value={language.code}
              onChange={(e) => setLanguage(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value) || language)}
            >
              {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-black">{l.code.toUpperCase()}</option>)}
            </select>
          </div>
        </header>

        <CameraFeed 
          onCapture={processFrame} 
          onLiveFrame={(b) => isLiveActive && liveSessionRef.current?.sendVideoFrame(b)}
          overlayImage={overlayImage} 
          hazards={hazards}
          isCalibrating={currentStage === OnboardingStage.BLUEPRINT_SYNC}
        />

        {currentStage === OnboardingStage.BLUEPRINT_SYNC && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 pointer-events-none">
            <div className="bg-black/70 p-6 md:p-8 rounded-3xl backdrop-blur-md border border-[#FFB800]/20 text-center pointer-events-auto w-full max-w-sm animate-in zoom-in duration-500">
               <h3 className="text-white font-black text-base md:text-lg uppercase tracking-tighter mb-2">Align Site Datum</h3>
               <p className="text-white/60 text-[10px] md:text-[11px] leading-relaxed mb-6">Point camera at a structural junction to sync BIM coordinates.</p>
               <button onClick={() => handleStageChange(OnboardingStage.LIVE_WALKTHROUGH)} className="w-full bg-[#FFB800] text-black py-3.5 md:py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all">
                 {t.lock_btn}
               </button>
            </div>
          </div>
        )}

        <VibeVisualizer 
          onGenerate={async (p) => {
            setIsGenerating(true);
            const img = await generateVibeOverlay(lastBase64 || '', p);
            setOverlayImage(img);
            setIsGenerating(false);
          }} 
          isGenerating={isGenerating} 
          translations={t}
          showGuide={showGuide}
          overlayOpacity={overlayOpacity}
          onOpacityChange={setOverlayOpacity}
        />

        {/* Hazard/RFI Side Log - Desktop only */}
        <aside className="hidden lg:flex absolute right-8 top-20 bottom-32 w-64 pointer-events-none flex-col space-y-4">
          {reports.length > 0 && (
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl pointer-events-auto animate-in slide-in-from-right duration-500">
              <h4 className="text-[9px] font-black text-[#FFB800] uppercase tracking-[0.3em] mb-4">Autonomous Drafts</h4>
              <div className="space-y-4">
                {reports.slice(0, 3).map(r => (
                  <div key={r.id} className="border-l-2 border-[#A44A3F] pl-3 py-1">
                    <p className="text-[10px] text-white/80 font-bold leading-tight line-clamp-2">{r.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      <Chatbot />
      
      {showRfiModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-8">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-8 border-b border-[#F2EFEA] flex justify-between items-center bg-[#FFB800]/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#FFB800] rounded flex items-center justify-center text-black">
                   <WarningIcon />
                </div>
                <h2 className="text-lg md:text-xl font-black text-[#2D241E] tracking-tighter uppercase">RFI Protocol</h2>
              </div>
              <button onClick={() => setShowRfiModal(false)} className="p-2 text-[#A8998D] hover:text-black">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6">
               <div className="bg-[#FAF9F6] border border-[#E5E0D8] p-4 md:p-5 rounded-2xl">
                  <div className="text-[9px] font-black text-[#8B5E3C] uppercase tracking-widest mb-2">Technical Details</div>
                  <p className="text-xs md:text-sm font-bold text-[#2D241E] italic">"{reports[0]?.summary}"</p>
               </div>
               <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button onClick={() => setShowRfiModal(false)} className="py-3.5 md:py-4 border border-[#E5E0D8] rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest">Discard</button>
                  <button onClick={() => { setShowRfiModal(false); triggerHaptic([50, 50]); }} className="py-3.5 md:py-4 bg-[#2D241E] text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black">Dispatch</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
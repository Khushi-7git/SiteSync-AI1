
import React, { useState, useCallback, useRef, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ProjectForm from './components/ProjectForm';
import MissionControl from './components/MissionControl';
import CameraFeed from './components/CameraFeed';
import VibeVisualizer from './components/VibeVisualizer';
import VisualGuide from './components/VisualGuide';
import { Chatbot } from './components/Chatbot';
import { OnboardingStage, SUPPORTED_LANGUAGES, TRANSLATIONS, RFI, Hazard, MissingWorkElement, ProjectDetails } from './types';
import { analyzeSiteFrame, generateVibeOverlay } from './services/geminiService';
import { ConstructorsLiveSession } from './services/liveService';
import { MicIcon, WarningIcon } from './components/Icons';

const App: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  
  const [currentStage, setCurrentStage] = useState<OnboardingStage>(OnboardingStage.BLUEPRINT_SYNC);
  const [progress, setProgress] = useState(25);
  const [buildProgress, setBuildProgress] = useState(0);
  const [blueprintContext, setBlueprintContext] = useState<string>("");
  const [missingWork, setMissingWork] = useState<MissingWorkElement[]>([]);
  const [hints, setHints] = useState<string[]>(["SYSTEM: Initialize spatial datum to begin."]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [rfis, setRfis] = useState<RFI[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [lastBase64, setLastBase64] = useState<string | null>(null);
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isControlsMinimized, setIsControlsMinimized] = useState(false);
  const [activeAlert, setActiveAlert] = useState<{msg: string, type: 'hazard' | 'info'} | null>(null);
  
  const [isLiveAssistantActive, setIsLiveAssistantActive] = useState(false);
  const liveSessionRef = useRef<ConstructorsLiveSession | null>(null);
  const auditIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = TRANSLATIONS[language.code] || TRANSLATIONS.en;

  useEffect(() => {
    if (currentStage === OnboardingStage.LIVE_WALKTHROUGH) {
      setIsControlsMinimized(true);
      setIsSidebarOpen(false);
    } else if (currentStage === OnboardingStage.GENERATIVE_VISUALIZATION) {
      setIsControlsMinimized(false);
    }
  }, [currentStage]);

  const toggleLiveAssistant = async () => {
    if (isLiveAssistantActive) {
      liveSessionRef.current?.disconnect();
      liveSessionRef.current = null;
      setIsLiveAssistantActive(false);
      setHints(prev => ["SYSTEM: Assistant Offline.", ...prev.slice(0, 15)]);
    } else {
      const session = new ConstructorsLiveSession();
      liveSessionRef.current = session;
      try {
        await session.connect({
          onOpen: () => {
            setIsLiveAssistantActive(true);
            setHints(prev => ["SYSTEM: Constructors Online.", ...prev.slice(0, 15)]);
          },
          onClose: () => setIsLiveAssistantActive(false),
          onTranscription: (text, role) => {
            if (role === 'model') {
              setHints(prev => [`CONSTRUCTORS: ${text}`, ...prev.slice(0, 15)]);
            }
          }
        });
      } catch (err) {
        console.error("Failed to connect live session", err);
      }
    }
  };

  useEffect(() => {
    if (isLiveAssistantActive && lastBase64 && liveSessionRef.current) {
      liveSessionRef.current.sendVideoFrame(lastBase64);
    }
  }, [lastBase64, isLiveAssistantActive]);

  useEffect(() => {
    if (currentStage === OnboardingStage.LIVE_WALKTHROUGH && isAppStarted && lastBase64) {
      const runAudit = async () => {
        if (isGenerating || isAnalyzing) return;
        setIsAnalyzing(true);
        try {
          const { text, functionCalls, hazards: detectedHazards, buildCompletion, missingWork: missing } = await analyzeSiteFrame(
            lastBase64, 
            "Audit frame against blueprint.",
            blueprintContext
          );
          
          if (text) setHints(prev => [text.substring(0, 100) + '...', ...prev.slice(0, 15)]);
          if (detectedHazards) setHazards(detectedHazards);
          if (buildCompletion !== undefined) setBuildProgress(buildCompletion);
          if (missing) setMissingWork(missing);

          if (functionCalls) {
            functionCalls.forEach((fc: any) => {
              if (fc.name === 'dispatchSafetyRFI') {
                setRfis(currentRfis => {
                  // Deduplicate: Don't add if a similar RFI was recently caught
                  const duplicate = currentRfis.find(r => 
                    r.issue === fc.args.issue && r.location === fc.args.location
                  );
                  
                  if (duplicate) return currentRfis;

                  const newRfi: RFI = {
                    id: Math.random().toString(36).substr(2, 9),
                    issue: fc.args.issue,
                    location: fc.args.location,
                    priority: fc.args.priority,
                    safetyEmail: fc.args.safety_email,
                    siteDetails: fc.args.site_details,
                    timestamp: Date.now(),
                    status: 'DISPATCHED_TO_SAFETY'
                  };

                  setActiveAlert({ msg: `RFI DISPATCHED: ${newRfi.issue}`, type: 'hazard' });
                  setTimeout(() => setActiveAlert(null), 5000);
                  
                  setHints(prev => [`SAFETY LEDGER: Auto-Caught ${newRfi.issue}`, ...prev.slice(0, 15)]);
                  return [newRfi, ...currentRfis];
                });
              }
            });
          }
        } catch (error: any) {
          console.error("Audit failure", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      runAudit();
      auditIntervalRef.current = setInterval(runAudit, 15000); 
    }
    return () => { if (auditIntervalRef.current) clearInterval(auditIntervalRef.current); };
  }, [currentStage, isAppStarted, lastBase64, isGenerating, isAnalyzing, blueprintContext]);

  const handleDesignGenerate = async (prompt: string, refImage?: string, isHD: boolean = false) => {
    if (!lastBase64) return;

    if (isHD) {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        setHints(prev => ["SYSTEM: Paid API key required for HD Rendering.", ...prev]);
        await (window as any).aistudio?.openSelectKey();
        return; 
      }
    }

    setIsGenerating(true);
    setHints(prev => [isHD ? `LAB: Initializing HD Pro Render...` : `LAB: Rendering Fast Draft...`, ...prev]);
    
    try {
      const result = await generateVibeOverlay(lastBase64, prompt, {
        referenceImageBase64: refImage?.split(',')[1],
        previousIterationBase64: overlayImage || undefined,
        isHD
      });
      
      if (result) {
        setOverlayImage(result);
        setOverlayOpacity(0.5);
        setHints(prev => ["LAB: Iteration complete. Canvas updated.", ...prev]);
      }
    } catch (error: any) {
       console.error("Render error:", error);
       if (error?.message?.includes("Requested entity was not found")) {
         setHints(prev => ["SYSTEM: API Key validation failed.", ...prev]);
         await (window as any).aistudio?.openSelectKey();
       }
       setHints(prev => ["ERROR: Rendering failed.", ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCapture = useCallback((base64: string) => setLastBase64(base64), []);

  const handleProjectSubmit = (details: ProjectDetails) => {
    setProjectDetails(details);
    setShowProjectForm(false);
    setIsAppStarted(true);
  };

  if (!isAppStarted && !showProjectForm) return <LandingPage onStart={() => setShowProjectForm(true)} />;
  if (showProjectForm) return <ProjectForm onSubmit={handleProjectSubmit} onBack={() => setShowProjectForm(false)} />;

  return (
    <div className="flex h-[100dvh] bg-black text-[#2D241E] overflow-hidden flex-col md:flex-row">
      <MissionControl 
        currentStage={currentStage} 
        onStageChange={(s) => { setCurrentStage(s); setIsSidebarOpen(false); }}
        progress={progress}
        buildProgress={buildProgress}
        missingWork={missingWork}
        hints={hints}
        rfis={rfis}
        translations={t}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSync={(ctx) => setBlueprintContext(ctx)}
        projectDetails={projectDetails}
      />

      <main className="flex-1 relative flex flex-col bg-black min-h-0">
        <header className={`absolute top-0 left-0 right-0 h-14 md:h-16 bg-white/90 backdrop-blur-2xl z-[60] flex items-center justify-between px-6 md:px-10 border-b border-[#2D241E]/15 shadow-sm transition-transform duration-500 ${isControlsMinimized && currentStage === OnboardingStage.LIVE_WALKTHROUGH ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className="flex items-center space-x-4">
            <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)] ${currentStage === OnboardingStage.LIVE_WALKTHROUGH ? 'bg-red-500' : 'bg-[#FFB800]'}`} />
            <span className="font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] text-[#2D241E]">
              {currentStage === OnboardingStage.GENERATIVE_VISUALIZATION ? t.rendering : t.audit}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
            <button 
              onClick={toggleLiveAssistant}
              className={`p-2 md:p-3 rounded-full border transition-all active:scale-90 ${isLiveAssistantActive ? 'bg-red-500 text-white border-red-600 shadow-xl' : 'bg-white/50 text-[#2D241E] border-black/5 hover:bg-white'}`}
            >
              <MicIcon />
            </button>
            <button 
              onClick={() => setShowGuide(true)} 
              className="px-3 py-1.5 border border-black/10 rounded-full font-black text-[9px] uppercase tracking-widest bg-white/50 active:scale-95 transition-all"
            >
              Guide
            </button>
          </div>
        </header>

        <div className="relative w-full h-full flex items-center justify-center">
          <CameraFeed 
            onCapture={handleCapture} 
            overlayImage={null} 
            hazards={hazards}
            missingWork={missingWork}
            isCalibrating={currentStage === OnboardingStage.BLUEPRINT_SYNC}
            isAnalyzing={isAnalyzing}
          />

          {/* AI Alert Toast Overlay */}
          {activeAlert && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500 px-6 py-4 bg-red-600/90 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl flex items-center space-x-4">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600">
                  <WarningIcon />
               </div>
               <div>
                 <span className="block text-[8px] font-black text-white/60 uppercase tracking-widest mb-0.5">Autonomous Dispatch</span>
                 <p className="text-[11px] font-black text-white uppercase tracking-tight">{activeAlert.msg}</p>
               </div>
            </div>
          )}
          
          {overlayImage && currentStage === OnboardingStage.GENERATIVE_VISUALIZATION && (
            <>
              <div 
                className="absolute inset-0 z-20 pointer-events-none transition-all duration-75 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${100 - (overlayOpacity * 100)}%)` }}
              >
                <img src={overlayImage} alt="Design" className="w-full h-full object-cover" />
                <div className="absolute top-20 right-6 z-[55] opacity-30">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white bg-black/60 px-2 py-0.5 rounded shadow-sm">BIM INTENT</span>
                </div>
              </div>

              <div 
                className="absolute top-0 bottom-0 z-30 w-[1px] bg-[#FFB800] shadow-[0_0_15px_#FFB800] pointer-events-none transition-all duration-75"
                style={{ left: `${100 - (overlayOpacity * 100)}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-[#FFB800] rounded-full blur-[1px] opacity-40" />
              </div>

              <div className="absolute top-20 left-6 z-[15] opacity-30 pointer-events-none">
                <span className="text-[8px] font-black uppercase tracking-widest text-white bg-black/60 px-2 py-0.5 rounded shadow-sm">FIELD REALITY</span>
              </div>
            </>
          )}
        </div>

        {currentStage === OnboardingStage.GENERATIVE_VISUALIZATION && (
          <VibeVisualizer 
            onGenerate={handleDesignGenerate}
            isGenerating={isGenerating}
            translations={t}
            overlayOpacity={overlayOpacity}
            onOpacityChange={setOverlayOpacity}
            hasResult={!!overlayImage}
            onIterate={() => {
              setOverlayImage(null);
              setHints(prev => ["SYSTEM: Visual proposal cleared.", ...prev]);
            }}
            isMinimized={isControlsMinimized}
            onToggleMinimize={setIsControlsMinimized}
          />
        )}

        {showGuide && <VisualGuide onClose={() => setShowGuide(false)} translations={t} />}
      </main>

      <div className="hide-on-keyboard">
        <Chatbot />
      </div>
    </div>
  );
};

export default App;

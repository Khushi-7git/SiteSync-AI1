import React, { useRef, useState } from 'react';
import { OnboardingStage, RFI, MissingWorkElement, ProjectDetails } from '../types';
import { BlueprintIcon, CameraIcon, SparklesIcon, WarningIcon } from './Icons';
import { processBlueprint } from '../services/geminiService';

interface MissionControlProps {
  currentStage: OnboardingStage;
  onStageChange: (stage: OnboardingStage) => void;
  progress: number;
  buildProgress?: number;
  missingWork?: MissingWorkElement[];
  hints: string[];
  rfis?: RFI[];
  translations: any;
  showGuide?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onSync: (context: string) => void;
  projectDetails?: ProjectDetails | null;
}

const MissionControl: React.FC<MissionControlProps> = ({
  currentStage,
  onStageChange,
  progress,
  buildProgress = 0,
  missingWork = [],
  hints,
  rfis = [],
  translations: t,
  showGuide,
  isOpen = false,
  onToggle,
  onSync,
  projectDetails
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [syncing, setSyncing] = useState(false);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [editingRfi, setEditingRfi] = useState<RFI | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);

  const stages = [
    { id: OnboardingStage.BLUEPRINT_SYNC, icon: <BlueprintIcon />, label: t.calibration },
    { id: OnboardingStage.LIVE_WALKTHROUGH, icon: <CameraIcon />, label: t.audit },
    { id: OnboardingStage.GENERATIVE_VISUALIZATION, icon: <SparklesIcon />, label: t.rendering }
  ];

  const handleFileSync = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || syncing) return;

    setSyncing(true);
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert("Invalid format. Use PDF/JPG/PNG.");
      setSyncing(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const context = await processBlueprint(base64);
        setHasBlueprint(true);
        onSync(context);
        setSyncing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncing(false);
    }
  };

  const handleDraftEmail = (rfi: Partial<RFI>, isConstructor: boolean = true) => {
    const targetEmail = isConstructor ? (projectDetails?.constructorEmail || "ops@vibebuilders.com") : (rfi.safetyEmail || "safety@sitesync.io");
    const targetName = isConstructor ? projectDetails?.constructorName : "Safety Team";
    
    const subject = encodeURIComponent(`URGENT RFI: ${rfi.issue || 'Site Update'} - SiteSync AI Alert`);
    
    const bodyContent = 
      `Attention ${targetName},\n\n` +
      `SiteSync AI has identified a site deviation requiring immediate review.\n\n` +
      `ISSUE/TASK: ${rfi.issue || 'General Site Audit Note'}\n` +
      `LOCATION: ${rfi.location || 'Current Site Area'}\n` +
      `PRIORITY: ${(rfi.priority || 'high').toUpperCase()}\n\n` +
      `SUPERVISOR VERIFICATION & CHANGES:\n${userNotes || "No additional comments provided."}\n\n` +
      `TECHNICAL SITE DATA:\n${rfi.siteDetails || "Derived from live visual intelligence feed."}\n\n` +
      `TIMESTAMP: ${new Date(rfi.timestamp || Date.now()).toLocaleString()}\n\n` +
      `Please acknowledge receipt and confirm expected rectification schedule.\n\n` +
      `Best Regards,\n` +
      `${projectDetails?.userName || "Project Supervisor"}`;

    const body = encodeURIComponent(bodyContent);
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    
    setEditingRfi(null);
    setUserNotes("");
    setIsManualMode(false);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />
      
      <div className={`fixed z-[110] transition-all duration-700 ease-in-out bg-white/95 backdrop-blur-xl border-[#2D241E]/10
        md:relative md:w-85 md:h-full md:border-r md:translate-x-0 md:translate-y-0
        inset-x-0 bottom-0 top-[12%] md:top-0 rounded-t-[3rem] md:rounded-none shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.4)] md:shadow-none
        ${isOpen ? 'translate-y-0' : 'translate-y-[93%] md:translate-y-0'}
      `}>
        <div className="md:hidden pt-3 pb-2" onClick={onToggle}>
          <div className="bottom-sheet-handle" />
          <div className="flex justify-center items-center space-x-2 pb-3">
             <div className="w-1.5 h-1.5 bg-[#FFB800] rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D241E]">{isOpen ? 'Dismiss Ledger' : 'View Project Ledger'}</span>
          </div>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="px-6 md:px-8 py-5 md:py-8 border-b border-[#2D241E]/5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-2 bg-[#FFB800] rounded-full" />
                <h1 className="text-xl md:text-2xl font-black tracking-tighter text-[#2D241E]">{t.title}</h1>
              </div>
            </div>
            <p className="text-[#8B5E3C] text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-black opacity-30">{t.subtitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 md:space-y-10 custom-scrollbar">
            
            {/* PERMANENT MANUAL DRAFTING UI */}
            <section className="animate-in fade-in duration-700">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-[9px] font-black text-[#2D241E]/30 uppercase tracking-[0.4em]">Manual RFI Dispatch</h2>
                 <div className="h-[1px] flex-1 bg-black/5 mx-4" />
               </div>
               
               <div className="bg-white border border-black/10 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all group">
                  {!isManualMode ? (
                    <button 
                      onClick={() => setIsManualMode(true)}
                      className="w-full flex items-center justify-between group-hover:px-2 transition-all"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black text-[#2D241E] uppercase">New Manual Report</span>
                        <span className="text-[8px] font-bold text-[#8B5E3C]/60 uppercase tracking-widest">Target: {projectDetails?.constructorName || 'Constructor'}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                      </div>
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                       <div>
                         <label className="text-[7px] font-black text-[#2D241E]/40 uppercase mb-2 block">Issue / Observation</label>
                         <input 
                           type="text" 
                           className="w-full bg-[#F2EFEA]/50 border border-black/5 rounded-xl px-4 py-2 text-[11px] font-bold focus:outline-none"
                           placeholder="What is the deviation?"
                           onChange={(e) => setUserNotes(e.target.value)}
                         />
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => handleDraftEmail({ issue: userNotes, siteDetails: 'Manually logged observation.' }, true)}
                            className="flex-1 py-3 bg-black text-white rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                          >
                            Draft to Constructor
                          </button>
                          <button 
                            onClick={() => setIsManualMode(false)}
                            className="px-4 py-3 bg-black/5 text-black rounded-2xl text-[8px] font-black uppercase active:scale-95 transition-all"
                          >
                            Cancel
                          </button>
                       </div>
                    </div>
                  )}
               </div>
            </section>

            {/* AI AUTO-AUDITED LEDGER */}
            {currentStage === OnboardingStage.LIVE_WALKTHROUGH && rfis.length > 0 && (
              <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-[9px] font-black text-[#2D241E]/30 uppercase tracking-[0.4em]">{t.safety_ledger}</h2>
                   <div className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full animate-ping" />
                      <span className="text-[7px] font-mono font-bold text-red-600 uppercase">Live Intelligence</span>
                   </div>
                 </div>
                 <div className="space-y-4">
                   {rfis.filter(r => r.status === 'DISPATCHED_TO_SAFETY').map((rfi, idx) => (
                     <div key={idx} className="p-5 bg-red-50/40 border border-red-100 rounded-[2rem] relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                          <WarningIcon />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[7px] font-black px-2 py-0.5 rounded uppercase ${rfi.priority === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white shadow-sm'}`}>
                              {rfi.priority}
                            </span>
                            <span className="text-[8px] font-mono font-bold text-red-900/40">{new Date(rfi.timestamp).toLocaleTimeString()}</span>
                          </div>
                          {editingRfi?.id === rfi.id && (
                            <button onClick={() => setEditingRfi(null)} className="text-[8px] font-black text-red-800/40 uppercase hover:text-red-900">Cancel</button>
                          )}
                        </div>
                        
                        <p className="text-[11px] font-black text-red-950 mb-3 leading-tight">{rfi.issue}</p>
                        
                        {editingRfi?.id === rfi.id ? (
                          <div className="space-y-3 pt-2 animate-in slide-in-from-bottom-2">
                            <textarea 
                              className="w-full bg-white border border-red-200 rounded-2xl p-4 text-[10px] font-medium text-red-950 focus:outline-none focus:ring-1 focus:ring-red-400 shadow-inner"
                              placeholder="Add specific site instructions or verification notes..."
                              rows={4}
                              value={userNotes}
                              onChange={(e) => setUserNotes(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleDraftEmail(rfi, true)}
                                className="flex-1 py-4 bg-black text-white rounded-[1.5rem] text-[8px] font-black uppercase tracking-widest hover:bg-[#2D241E] shadow-xl transition-all active:scale-95"
                              >
                                Dispatch to Constructor
                              </button>
                              <button 
                                onClick={() => handleDraftEmail(rfi, false)}
                                className="flex-1 py-4 bg-red-600 text-white rounded-[1.5rem] text-[8px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl transition-all active:scale-95"
                              >
                                Dispatch to Safety
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1.5 border-t border-red-100 mt-2 pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[7px] font-black text-red-900/40 uppercase">Constructor:</span>
                                <span className="text-[9px] font-black text-red-950">{projectDetails?.constructorName || "Pending Assignee"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[7px] font-black text-red-900/40 uppercase">Room/Zone:</span>
                                <span className="text-[9px] font-black text-red-950">{rfi.location}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setEditingRfi(rfi);
                                setUserNotes("");
                              }}
                              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-lg active:scale-95 transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Review & Email Draft</span>
                            </button>
                          </div>
                        )}
                     </div>
                   ))}
                 </div>
              </section>
            )}

            {/* Workflow Progression */}
            <section>
              <h2 className="text-[9px] font-black text-[#2D241E]/30 mb-4 md:mb-6 uppercase tracking-[0.4em]">{t.operational_workflow}</h2>
              <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-3 no-scrollbar">
                {stages.map((stage) => {
                  const isActive = currentStage === stage.id;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => onStageChange(stage.id)}
                      className={`min-w-[150px] md:min-w-0 md:w-full group flex items-center space-x-4 md:space-x-5 p-5 md:p-6 rounded-[2rem] transition-all border shrink-0 ${
                        isActive ? 'bg-white border-white shadow-2xl scale-[1.03] z-10' : 'bg-[#F2EFEA]/40 border-transparent text-[#6E5D51] hover:bg-white/50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all duration-500 ${isActive ? 'bg-[#FFB800] text-black shadow-[0_0_20px_#FFB800]' : 'bg-[#2D241E]/5'}`}>
                        {stage.icon}
                      </div>
                      <span className={`text-[11px] md:text-sm font-black tracking-tight whitespace-nowrap ${isActive ? 'text-[#2D241E]' : 'opacity-60'}`}>
                        {stage.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Blueprint Section */}
            {currentStage === OnboardingStage.BLUEPRINT_SYNC && (
              <section className="animate-in fade-in">
                 <h2 className="text-[9px] font-black text-[#2D241E]/30 mb-4 uppercase tracking-[0.4em]">{t.blueprint_sync}</h2>
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-10 md:p-14 border-2 border-dashed rounded-[3rem] text-center cursor-pointer transition-all ${
                      hasBlueprint ? 'bg-green-50/50 border-green-300' : 'border-black/10 hover:border-[#FFB800] hover:bg-white shadow-inner'
                    }`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSync} accept="image/*,application/pdf" />
                    <div className={`mb-4 flex justify-center transform transition-transform ${syncing ? 'animate-spin text-[#FFB800]' : hasBlueprint ? 'text-green-600 scale-110' : 'text-[#8B5E3C] group-hover:scale-110'}`}>
                      {syncing ? <svg className="w-10 h-10" viewBox="0 0 24 24"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> : <BlueprintIcon />}
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em]">{syncing ? "Ingesting BIM..." : hasBlueprint ? "Ledger Active" : "Upload Blueprint"}</p>
                 </div>
              </section>
            )}

            {/* AI Thought signatures */}
            <section className="pb-16 md:pb-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[9px] font-black text-[#2D241E]/30 uppercase tracking-[0.4em]">{t.thought_signatures}</h2>
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                  <span className="text-[8px] font-mono text-green-600 font-black">UPLINK_STABLE</span>
                </div>
              </div>
              <div className="bg-[#18181B] rounded-[2rem] p-6 shadow-2xl border border-white/5">
                <div className="space-y-4 max-h-48 md:max-h-64 overflow-y-auto pr-1 no-scrollbar custom-scrollbar">
                  {hints.map((hint, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                      <p className="text-[10px] text-white/40 leading-relaxed font-mono group">
                        <span className="text-[#FFB800]/40 mr-3">[{i.toString().padStart(2, '0')}]</span>
                        <span className="text-white/90 group-hover:text-[#FFB800] transition-colors">{hint}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Progress Bar */}
          <div className="p-8 md:p-10 bg-white border-t border-[#2D241E]/5 mt-auto shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#2D241E]/40 font-black uppercase tracking-[0.4em] mb-1.5">Session Integrity</span>
                <span className="text-xs md:text-sm font-black text-[#2D241E]">{currentStage === OnboardingStage.LIVE_WALKTHROUGH ? t.build_progress : 'Project Calibration'}</span>
              </div>
              <span className="text-2xl md:text-3xl font-mono font-black text-[#2D241E]">
                {currentStage === OnboardingStage.LIVE_WALKTHROUGH ? buildProgress : progress}%
              </span>
            </div>
            <div className="w-full bg-[#F2EFEA] h-3 rounded-full overflow-hidden flex items-center px-1 shadow-inner">
              <div 
                className={`h-1.5 md:h-2 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full ${currentStage === OnboardingStage.LIVE_WALKTHROUGH ? 'bg-green-600 shadow-[0_0_15px_#16a34a]' : 'bg-[#2D241E]'}`} 
                style={{ width: `${currentStage === OnboardingStage.LIVE_WALKTHROUGH ? buildProgress : progress}%` }} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MissionControl;
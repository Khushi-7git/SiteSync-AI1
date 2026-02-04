import React from 'react';

interface VisualGuideProps {
  onClose: () => void;
  translations: any;
}

const VisualGuide: React.FC<VisualGuideProps> = ({ onClose, translations: t }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#2D241E]/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500 overflow-y-auto">
      <div className="w-full max-w-5xl arch-card p-5 sm:p-8 md:p-12 relative overflow-hidden my-auto max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-[#FFB800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 md:mb-12 sticky top-0 bg-white/50 backdrop-blur-md z-10 py-2 -mx-2 px-2 rounded-xl">
           <div className="pr-4">
             <h2 className="text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#2D241E] mb-1 leading-none">Operation Ledger</h2>
             <p className="text-[#8B5E3C] text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">SiteSync AI / System Guide v4.2</p>
           </div>
           <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl shrink-0">
             <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg>
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Step 1 */}
          <div className="space-y-3 md:space-y-6 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-black text-white flex items-center justify-center rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-2xl transition-transform group-hover:rotate-12">1</div>
            <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-[#2D241E]">{t.calibration}</h3>
            <p className="text-[#2D241E]/60 text-[10px] sm:text-[11px] md:text-xs leading-relaxed">{t.guide_calibration}</p>
            <div className="aspect-video bg-black/5 rounded-xl md:rounded-2xl border border-dashed border-[#2D241E]/20 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-2 md:inset-4 border border-[#FFB800]/40 rounded-lg" />
               <div className="w-4 h-4 md:w-8 md:h-8 border-2 border-[#FFB800] rounded animate-pulse" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 md:space-y-6 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-black text-white flex items-center justify-center rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-2xl transition-transform group-hover:rotate-12">2</div>
            <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-[#2D241E]">{t.audit}</h3>
            <p className="text-[#2D241E]/60 text-[10px] sm:text-[11px] md:text-xs leading-relaxed">{t.guide_audit}</p>
            <div className="aspect-video bg-black/5 rounded-xl md:rounded-2xl border border-dashed border-[#2D241E]/20 p-3 md:p-4 space-y-1 md:space-y-2">
               <div className="h-1.5 md:h-2 w-full bg-[#A44A3F]/20 rounded-full overflow-hidden">
                 <div className="h-full w-2/3 bg-[#A44A3F] animate-[shimmer_2s_infinite]" />
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500 animate-ping" />
                 <span className="text-[6px] sm:text-[7px] md:text-[8px] font-mono font-bold uppercase tracking-widest text-red-600">Site_Anom_Detect</span>
               </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 md:space-y-6 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-black text-white flex items-center justify-center rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-2xl transition-transform group-hover:rotate-12">3</div>
            <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-[#2D241E]">{t.design_lab}</h3>
            <p className="text-[#2D241E]/60 text-[10px] sm:text-[11px] md:text-xs leading-relaxed">{t.guide_design}</p>
            <div className="aspect-video bg-black/5 rounded-xl md:rounded-2xl border border-dashed border-[#2D241E]/20 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_3s_infinite]" />
               <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 h-1 md:h-1.5 bg-black/10 rounded-full">
                 <div className="h-full w-1/2 bg-[#FFB800] rounded-full" />
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-[#2D241E]/5 flex justify-center">
          <button 
            onClick={onClose}
            className="w-full md:w-auto px-10 sm:px-12 md:px-20 py-3 sm:py-4 md:py-5 bg-[#2D241E] text-white font-black uppercase tracking-[0.4em] text-[9px] sm:text-[10px] md:text-xs rounded-xl md:rounded-2xl hover:bg-[#8B5E3C] transition-all shadow-2xl hover:-translate-y-1"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualGuide;
import React, { useState } from 'react';
import { ProjectDetails } from '../types';

interface ProjectFormProps {
  onSubmit: (details: ProjectDetails) => void;
  onBack: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onBack }) => {
  const [details, setDetails] = useState<ProjectDetails>({
    userName: '',
    userEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    constructorName: '',
    constructorEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  const inputClass = "w-full bg-white border border-black/10 rounded-xl py-3 px-4 text-sm font-bold text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent transition-all placeholder:text-black/20 shadow-sm sm:py-3.5";
  const labelClass = "text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#2D241E]/50 mb-1.5 block";
  const sectionClass = "p-4 sm:p-6 md:p-8 bg-[#F2EFEA]/30 border border-black/5 rounded-[1.5rem] sm:rounded-[2rem] shadow-inner space-y-4";

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF9F6] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(45,36,30,0.15)] border border-black/5 p-5 sm:p-10 md:p-12 my-4 sm:my-8 animate-in fade-in zoom-in-98 duration-700">
        
        {/* Form Header */}
        <div className="flex justify-between items-start mb-6 sm:mb-10">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-1.5 sm:mb-2">
              <div className="w-8 sm:w-10 h-1.5 sm:h-2 bg-[#FFB800] rounded-full" />
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tighter text-[#2D241E] uppercase leading-none">Site Protocol</h2>
            </div>
            <p className="text-[#8B5E3C] text-[8px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-60">Initialize Project Ledger</p>
          </div>
          <button 
            onClick={onBack} 
            className="p-2 sm:p-3 hover:bg-black/5 rounded-full transition-colors group"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black/20 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Supervisor Identity Box */}
            <div className={sectionClass}>
              <div className="flex items-center space-x-2 pb-2 border-b border-black/5 mb-2">
                <div className="w-1.5 h-1.5 bg-[#FFB800] rounded-full" />
                <h3 className="text-[9px] sm:text-[10px] font-black text-[#2D241E] uppercase tracking-widest">Supervisor Identity</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input 
                    type="text" required placeholder="Enter Lead Name"
                    className={inputClass}
                    value={details.userName}
                    onChange={e => setDetails({...details, userName: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelClass}>Official Email</label>
                  <input 
                    type="email" required placeholder="lead@sitesync.io"
                    className={inputClass}
                    value={details.userEmail}
                    onChange={e => setDetails({...details, userEmail: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Time Datum Box */}
            <div className={sectionClass}>
              <div className="flex items-center space-x-2 pb-2 border-b border-black/5 mb-2">
                <div className="w-1.5 h-1.5 bg-[#FFB800] rounded-full" />
                <h3 className="text-[9px] sm:text-[10px] font-black text-[#2D241E] uppercase tracking-widest">Time Datum</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className={labelClass}>Activation Date</label>
                  <input 
                    type="date" required
                    className={inputClass}
                    value={details.startDate}
                    onChange={e => setDetails({...details, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelClass}>Project Deadline</label>
                  <input 
                    type="date" required
                    className={inputClass}
                    value={details.endDate}
                    onChange={e => setDetails({...details, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Constructor Information Box */}
          <div className={sectionClass}>
             <div className="flex items-center space-x-2 pb-2 border-b border-black/5 mb-2">
                <div className="w-1.5 h-1.5 bg-[#FFB800] rounded-full" />
                <h3 className="text-[9px] sm:text-[10px] font-black text-[#2D241E] uppercase tracking-widest">Constructor Protocol</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
               <div>
                  <label className={labelClass}>Organization Name</label>
                  <input 
                    type="text" required placeholder="Assigned Entity"
                    className={inputClass}
                    value={details.constructorName}
                    onChange={e => setDetails({...details, constructorName: e.target.value})}
                  />
               </div>
               <div>
                  <label className={labelClass}>Operations Email</label>
                  <input 
                    type="email" required placeholder="rfi@constructor.com"
                    className={inputClass}
                    value={details.constructorEmail}
                    onChange={e => setDetails({...details, constructorEmail: e.target.value})}
                  />
               </div>
             </div>
          </div>

          {/* Submission Action */}
          <div className="pt-2 sm:pt-4">
            <button 
              type="submit"
              className="w-full bg-[#2D241E] text-white font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs py-5 sm:py-7 rounded-xl sm:rounded-[2rem] hover:bg-[#FFB800] hover:text-black transition-all shadow-xl active:scale-[0.97] transform"
            >
              Launch Site Intelligence
            </button>
          </div>
        </form>

        {/* Footer Security Tag */}
        <div className="mt-8 sm:mt-12 flex items-center justify-center space-x-3 sm:space-x-4 opacity-10">
          <span className="h-[1px] flex-1 bg-black" />
          <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap">V4.2 SECURITY ENFORCED</span>
          <span className="h-[1px] flex-1 bg-black" />
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
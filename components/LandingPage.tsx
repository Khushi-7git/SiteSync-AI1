
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [email, setEmail] = useState('');
  const [selectedDemo, setSelectedDemo] = useState<number | null>(null);
  const [liveStats, setLiveStats] = useState({
    deviations: 12,
    reworkSavings: 42100,
    activeAudits: 156
  });

  // Live stat simulation for the Vision section
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        deviations: prev.deviations + (Math.random() > 0.7 ? 1 : 0),
        reworkSavings: prev.reworkSavings + Math.floor(Math.random() * 50),
        activeAudits: 150 + Math.floor(Math.random() * 20)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Blueprint Ingestion",
      desc: "Native support for PDF and BIM ledgers. Sync your 2D plans with 3D physical reality in seconds using high-precision datum alignment.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Spatial Intelligence",
      desc: "Our 'Constructors' AI uses Thought Signatures to persist context across camera pans, remembering hazards in Room A while you audit Room B.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Vibe.System Renders",
      desc: "Instantly project high-fidelity 4K architectural finishes over raw studs or concrete slabs using Gemini-powered generative texturing.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Autonomous RFI",
      desc: "Automatically detect MEP clashes and structural deviations. One-click RFI generation for Slack, Procore, or project ledgers.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  ];

  const galleryItems = [
    {
      title: "Structural Audit",
      subtitle: "Beam Alignment Check",
      img: "https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&q=80&w=800",
      report: "Analysis: 12mm deviation detected in Sector 4. BIM overlay confirms alignment required on Y-axis."
    },
    {
      title: "Vibe Rendering",
      subtitle: "Material Simulation",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      report: "Generative Texturing: High-fidelity marble application simulation completed. Light bounce accurate to 98.4%."
    },
    {
      title: "Spatial Mapping",
      subtitle: "HVAC Ducting Persistence",
      img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800",
      report: "Persistence: Sector 9 ductwork tracked. Anchor point validated against structural ledger."
    },
    {
      title: "Safety Analysis",
      subtitle: "Real-time Hazard Detection",
      img: "https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=1200",
      report: "Alert: Unsecured edge detected at Floor 12. Auto-dispatching RFI to Safety Team."
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for joining the ledger, ${email}!`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#966F33]/20 overflow-x-hidden">
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-10 py-6 md:py-8 mix-blend-difference">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white flex items-center justify-center text-black font-black text-xs md:text-sm border-2 border-black">S</div>
          <span className="font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] text-white">SiteSync AI</span>
        </div>
        <div className="hidden md:flex items-center space-x-10 text-white font-black uppercase tracking-widest text-[9px]">
          <a href="#vision" className="hover:text-[#966F33] transition-colors">Vision</a>
          <a href="#features" className="hover:text-[#966F33] transition-colors">Features</a>
          <a href="#demos" className="hover:text-[#966F33] transition-colors">Demos</a>
          <button onClick={onStart} className="px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-all">Launch Audit</button>
        </div>
        <button onClick={onStart} className="md:hidden text-[9px] font-black uppercase tracking-widest text-white border border-white px-3 py-1.5">Launch</button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
        <div className="max-w-5xl space-y-6 md:space-y-10 animate-fade-up">
          <h1 className="text-5xl sm:text-7xl md:text-[11rem] font-black text-black tracking-tighter leading-[0.9] md:leading-[0.85] uppercase">
            Bridge <br className="hidden md:block" /> The <span className="text-[#966F33]">Gap</span>.
          </h1>
          <p className="text-base md:text-2xl font-medium text-black/50 max-w-3xl mx-auto leading-relaxed px-4">
            SiteSync AI is the state-of-the-art site supervisor bridging the gap between architectural intent and physical execution using multimodal reasoning.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-6">
            <button 
              onClick={onStart}
              className="w-full md:w-auto px-10 md:px-16 py-6 md:py-8 bg-black text-[#FAF9F6] font-black uppercase tracking-[0.4em] text-[10px] md:text-xs transition-all hover:bg-[#966F33] shadow-2xl hover:-translate-y-1 active:translate-y-0"
            >
              Start Live Audit
            </button>
            <a href="#vision" className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-black/30 hover:text-black transition-colors py-2">The Mission</a>
          </div>
        </div>

        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 opacity-20 animate-bounce">
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-black/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">The Mission</span>
              <div className="flex-1 h-[1px] bg-[#966F33]/20" />
            </div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Intelligence Layer For The Physical World.</h2>
            <p className="text-base md:text-lg text-black/60 leading-relaxed">
              Construction "rework" accounts for nearly $31 billion in annual losses in the US alone. Verifying that a physical build matches a 3D blueprint is currently manual and error-prone.
            </p>
            
            {/* Dynamic Ledger Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Deviations Logged</p>
                <p className="text-2xl font-mono font-black text-[#A44A3F]">{liveStats.deviations.toLocaleString()}</p>
              </div>
              <div className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Estimated Savings</p>
                <p className="text-2xl font-mono font-black text-green-600">${liveStats.reworkSavings.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-base md:text-lg text-black/60 leading-relaxed">
              SiteSync AI eliminates this friction by leveraging Gemini-powered reasoning to audit construction progress against digital ledgers, ensuring 99.9% design fidelity from skeleton to finish.
            </p>
          </div>
          <div className="aspect-square bg-[#1A1A1A] rounded-[3rem] p-1 border-black/10 shadow-2xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
            <img src="https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" alt="Construction Site Architecture" />
            <div className="absolute bottom-10 left-10 z-20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-2 h-2 bg-[#FFB800] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE_FEED_UPLINK</span>
              </div>
              <p className="text-white/60 text-[11px] font-mono leading-tight">LAT: 37.7749 // LON: -122.4194<br />DATUM_STABILITY: 99.8%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-[#1A1A1A] py-24 md:py-40 text-white relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="mb-12 md:mb-20 space-y-4 text-center md:text-left">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">Operational Suite</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">Precision Field Intelligence.</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative bg-white/5 p-8 md:p-10 border border-white/10 rounded-[2.5rem] flex flex-col justify-between min-h-[250px] md:h-80 hover:bg-[#966F33] transition-all duration-500 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[#966F33] group-hover:text-white transition-colors mb-6 relative z-10">
                  {f.icon}
                </div>
                <div className="space-y-3 md:space-y-4 relative z-10">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-white">{f.title}</h3>
                  <p className="text-white/40 text-[13px] md:text-sm leading-relaxed group-hover:text-white/80">{f.desc}</p>
                </div>
                {/* AI HUD Decoration */}
                <div className="absolute top-4 right-4 text-[7px] font-mono text-white/10 group-hover:text-white/40 transition-colors uppercase tracking-widest">
                  SYS_MOD_0{i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe Slider (Demo Interactivity) */}
      <section className="py-24 md:py-40 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-20 gap-6">
            <div className="space-y-4 max-w-xl">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">Vibe System</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">See The Future.</h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-black/40 font-black uppercase tracking-widest text-[8px] md:text-[10px] mb-2">Interactive Comparison</span>
              <div className="flex space-x-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#966F33] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto aspect-[4/3] md:aspect-video rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden cursor-ew-resize group">
            <div className="absolute inset-0 grayscale contrast-125">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Raw Site Condition" />
            </div>
            <div className="absolute inset-0 z-10" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
              <img src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Architectural Intent Render" />
            </div>
            <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(parseInt(e.target.value))} className="absolute inset-0 z-30 opacity-0 cursor-ew-resize" />
            
            {/* Visual Divider */}
            <div className="absolute top-0 bottom-0 z-20 w-1 bg-[#966F33] shadow-[0_0_30px_#966F33]" style={{ left: `${sliderPos}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-[#966F33] border-4 border-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-active:scale-110">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M8 7l-5 5 5 5m8-10l5 5-5 5" /></svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
              <span className="bg-black/80 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">Reality_Input</span>
            </div>
            <div className="absolute bottom-8 right-8 z-20 pointer-events-none">
              <span className="bg-[#966F33] text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">Intent_Output</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demos Section (Interactive Gallery) */}
      <section id="demos" className="py-24 md:py-40 px-6 md:px-10 border-t border-black/5 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-4">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">Field Operations</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight">Intelligence In Action.</h2>
            <p className="text-black/30 font-black uppercase tracking-widest text-[10px]">Select a channel to review audit results</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryItems.map((item, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedDemo(i)}
                className="group bg-[#FAF9F6] border border-black/5 rounded-[2.5rem] flex flex-col h-[350px] md:h-[480px] overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" alt={item.title} />
                  <div className="absolute top-6 right-6 px-3 py-1 bg-black/80 text-white text-[8px] font-black uppercase tracking-widest backdrop-blur-md z-20 rounded-full border border-white/10">
                    CH_{i+1}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                     <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl">
                        <svg className="w-6 h-6 text-[#966F33]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2}/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2}/></svg>
                     </div>
                  </div>
                </div>
                <div className="p-8 space-y-2 relative">
                  <h4 className="text-lg md:text-xl font-black uppercase tracking-tight text-black">{item.title}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#966F33]">{item.subtitle}</p>
                  <div className="absolute bottom-6 right-8 w-8 h-[1px] bg-black/10 group-hover:w-16 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Lightbox Modal */}
        {selectedDemo !== null && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="max-w-4xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <div className="flex-1 h-[300px] md:h-auto relative bg-black">
                <img src={galleryItems[selectedDemo].img} className="w-full h-full object-cover opacity-80" alt="Audit" />
                <div className="scanning-line" />
                {/* Simulated AR Markers */}
                <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full border-2 border-red-500 animate-ping" />
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_#ef4444] z-10" />
              </div>
              <div className="md:w-[350px] p-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-black text-[#966F33] uppercase tracking-[0.3em]">Operational Review</span>
                      <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mt-1">{galleryItems[selectedDemo].title}</h3>
                    </div>
                    <button onClick={() => setSelectedDemo(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/20 hover:text-black">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg>
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="p-5 bg-[#FAF9F6] rounded-2xl border border-black/5 font-mono text-[11px] leading-relaxed text-black/70">
                      {galleryItems[selectedDemo].report}
                    </div>
                    <div className="flex items-center space-x-3">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Datum Alignment: Nominal</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedDemo(null); onStart(); }}
                  className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[#966F33] transition-all mt-10 shadow-xl"
                >
                  Enter Site Session
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-48 bg-black text-white text-center px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#966F33]/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 relative z-10">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">Establish The <span className="text-[#966F33]">Datum</span>.</h2>
          <p className="text-white/40 font-medium text-base md:text-xl leading-relaxed italic px-4 max-w-2xl mx-auto">
            "By aligning the physical site with our digital ledgers in real-time, SiteSync AI has transformed our audit cycle from days to minutes."
          </p>
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-16 md:px-24 py-8 md:py-10 bg-[#966F33] text-white font-black uppercase tracking-[0.5em] text-xs md:text-sm hover:bg-white hover:text-black transition-all shadow-2xl hover:-translate-y-2"
          >
            Launch Site Intelligence
          </button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-[#FAF9F6] border-t border-black/5 py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 mb-16 md:mb-24">
            <div className="lg:col-span-5 space-y-8 md:space-y-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black flex items-center justify-center text-white font-black text-xs md:text-sm border-2 border-black">S</div>
                <span className="font-black uppercase tracking-[0.4em] text-xs md:text-sm">SiteSync AI</span>
              </div>
              <p className="text-black/50 text-[13px] md:text-base max-w-sm font-medium leading-relaxed">
                SiteSync AI is re-imagining the construction workflow. We bridge the gap between architectural intent and physical execution with state-of-the-art multimodal reasoning.
              </p>
              
              {/* Newsletter Subscription */}
              <div className="space-y-4 pt-4">
                <h4 className="font-black uppercase text-[10px] tracking-[0.5em] text-black/40">The Ledger // Newsletter</h4>
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input 
                    type="email" 
                    placeholder="architect@studio.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white border border-black/10 px-4 py-3 text-xs md:text-sm font-medium placeholder-black/20 focus:outline-none focus:border-[#966F33] transition-colors"
                    required
                  />
                  <button type="submit" className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-[#966F33] transition-colors">Join</button>
                </form>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
              <div className="space-y-6 md:space-y-10">
                <h4 className="font-black uppercase text-[10px] tracking-[0.5em] text-black/20">Operational</h4>
                <ul className="space-y-3 md:space-y-4 text-[11px] md:text-xs font-black uppercase tracking-widest">
                  <li><button onClick={onStart} className="hover:text-[#966F33] transition-colors">Launch Dashboard</button></li>
                  <li><a href="#vision" className="hover:text-[#966F33] transition-colors">The Vision</a></li>
                  <li><a href="#features" className="hover:text-[#966F33] transition-colors">Intelligence Suite</a></li>
                  <li><a href="#demos" className="hover:text-[#966F33] transition-colors">Case Ledger</a></li>
                </ul>
              </div>
              <div className="space-y-6 md:space-y-10">
                <h4 className="font-black uppercase text-[10px] tracking-[0.5em] text-black/20">Corporate</h4>
                <ul className="space-y-3 md:space-y-4 text-[11px] md:text-xs font-black uppercase tracking-widest">
                  <li><a href="#" className="hover:text-[#966F33]">Press Archive</a></li>
                  <li><a href="#" className="hover:text-[#966F33]">Partnerships</a></li>
                  <li><a href="#" className="hover:text-[#966F33]">Safety Protocols</a></li>
                  <li><a href="#" className="hover:text-[#966F33]">Contact Sales</a></li>
                </ul>
              </div>
              <div className="space-y-6 md:space-y-10 col-span-2 md:col-span-1">
                <h4 className="font-black uppercase text-[10px] tracking-[0.5em] text-black/20">Infrastructure</h4>
                <ul className="space-y-3 md:space-y-4 text-[11px] md:text-xs font-black uppercase tracking-widest text-black/40">
                  <li><a href="#" className="hover:text-black">Privacy Protocol</a></li>
                  <li><a href="#" className="hover:text-black">Terms of Ledger</a></li>
                  <li><a href="#" className="hover:text-black">API Integration</a></li>
                  <li><a href="#" className="hover:text-black">System Status</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Footer: Social & Copyright */}
          <div className="pt-10 md:pt-16 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/40 hover:text-white group">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              {/* X */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/40 hover:text-white group">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/40 hover:text-white group">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
            
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-black/15 text-center md:text-right">
              SiteSync AI // Designed for Industrial Fidelity &copy; 2025 // v4.2.1-LE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

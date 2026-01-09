import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [email, setEmail] = useState('');

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
      img: "https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Vibe Rendering",
      subtitle: "Marble Countertop Simulation",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Spatial Mapping",
      subtitle: "HVAC Ducting Persistence",
      img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Safety Analysis",
      subtitle: "Real-time Hazard Detection",
      img: "https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing, ${email}!`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#966F33]/20 overflow-x-hidden">
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 mix-blend-difference">
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
      <section id="vision" className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-32 border-t border-black/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6 md:space-y-8">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">The Mission</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Intelligence Layer For The Physical World.</h2>
            <p className="text-base md:text-lg text-black/60 leading-relaxed">
              Construction "rework" accounts for nearly $31 billion in annual losses in the US alone. Verifying that a physical build matches a 3D blueprint is currently manual and error-prone.
            </p>
            <p className="text-base md:text-lg text-black/60 leading-relaxed">
              SiteSync AI eliminates this friction by leveraging high-reasoning LLMs to audit construction progress against digital ledgers, ensuring 99.9% design fidelity from skeleton to finish.
            </p>
          </div>
          <div className="bento-card aspect-square bg-[#1A1A1A] p-1 border-black/10 shadow-2xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" alt="Construction Site Architecture" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-[#1A1A1A] py-20 md:py-32 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-12 md:mb-20 space-y-4 text-center md:text-left">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">Operational Suite</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">Precision Field Intelligence.</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bento-card bg-white/5 p-8 md:p-10 border-white/10 flex flex-col justify-between min-h-[250px] md:h-80 hover:bg-[#966F33] transition-all group cursor-default">
                <div className="text-[#966F33] group-hover:text-white transition-colors mb-6">
                  {f.icon}
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-white">{f.title}</h3>
                  <p className="text-white/40 text-[13px] md:text-sm leading-relaxed group-hover:text-white/80">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slider Section */}
      <section className="py-20 md:py-32 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-20 gap-6">
            <div className="space-y-4 max-w-xl">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">Vibe System</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">See The Future.</h2>
            </div>
            <p className="text-black/40 font-black uppercase tracking-widest text-[8px] md:text-[10px]">Interactive "X-Ray" Overlays</p>
          </div>

          <div className="relative max-w-5xl mx-auto aspect-[4/3] md:aspect-video bento-card border-black/10 overflow-hidden cursor-ew-resize">
            <div className="absolute inset-0 grayscale contrast-125">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Raw Site Condition" />
            </div>
            <div className="absolute inset-0 z-10" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
              <img src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Architectural Intent Render" />
            </div>
            <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(parseInt(e.target.value))} className="absolute inset-0 z-20 opacity-0 cursor-ew-resize" />
            <div className="absolute top-0 bottom-0 z-20 w-0.5 bg-[#966F33] shadow-[0_0_20px_#966F33]" style={{ left: `${sliderPos}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-[#966F33] border-2 border-white rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7l-5 5 5 5m8-10l5 5-5 5" strokeWidth={3}/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="demos" className="py-20 md:py-32 px-6 md:px-10 border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-4">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#966F33]">Field Operations</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">Intelligence In Action.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryItems.map((item, i) => (
              <div key={i} className="bento-card border-black/5 flex flex-col group h-[350px] md:h-[450px]">
                <div className="flex-1 overflow-hidden relative">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0" alt={item.title} />
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-black/80 text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">CHANNEL_{i+1}</div>
                </div>
                <div className="p-6 md:p-8 space-y-2">
                  <h4 className="text-base md:text-lg font-black uppercase tracking-tight">{item.title}</h4>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-black/30">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 bg-black text-white text-center px-6 md:px-10">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">Establish The <span className="text-[#966F33]">Datum</span>.</h2>
          <p className="text-white/40 font-medium text-sm md:text-lg leading-relaxed italic px-4 max-w-xl mx-auto">
            "By aligning the physical site with our digital ledgers in real-time, SiteSync AI has transformed our audit cycle from days to minutes."
          </p>
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-12 md:px-20 py-6 md:py-8 bg-[#966F33] text-white font-black uppercase tracking-[0.5em] text-xs md:text-sm hover:bg-white hover:text-black transition-all shadow-2xl"
          >
            Launch Main App
          </button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-[#FAF9F6] border-t border-black/5 py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Top Footer: Brand & Newsletter */}
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
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/40 hover:text-white group">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/40 hover:text-white group">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              {/* Discord */}
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/40 hover:text-white group">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6524-.2475-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9459 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
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
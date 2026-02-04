import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WarningIcon, BlueprintIcon } from './Icons';
import { Hazard, MissingWorkElement } from '../types';

interface CameraFeedProps {
  onCapture: (base64: string) => void;
  onLiveFrame?: (base64: string) => void;
  overlayImage?: string | null;
  hazards?: Hazard[];
  missingWork?: MissingWorkElement[];
  isCalibrating?: boolean;
  isAnalyzing?: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  onCapture,
  onLiveFrame,
  overlayImage,
  hazards = [],
  missingWork = [],
  isCalibrating = false,
  isAnalyzing = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access failed:", err);
        setError("Camera blocked or unavailable. Check permissions.");
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureFrame = useCallback((isLive = false) => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    if (isLive) {
      onLiveFrame?.(base64);
    } else {
      onCapture(base64);
    }
  }, [onCapture, onLiveFrame]);

  useEffect(() => {
    const interval = setInterval(() => captureFrame(false), 12000); 
    return () => clearInterval(interval);
  }, [captureFrame]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {error ? (
        <div className="text-white text-center p-10 z-50 arch-card">
          <WarningIcon />
          <p className="mt-4 font-bold text-black">{error}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover grayscale-[0.05] contrast-[1.05]"
        />
      )}
      
      <div className="scanning-line" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Analysis Shimmer */}
      {isAnalyzing && (
        <div className="absolute top-20 right-8 z-[55] flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 animate-in fade-in">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-widest text-white">Delta Analysis in Progress</span>
        </div>
      )}

      {/* Design Overlay */}
      {overlayImage && (
        <div className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000">
          <img src={overlayImage} alt="Vibe Overlay" className="w-full h-full object-cover opacity-90 mix-blend-normal" />
        </div>
      )}

      {/* Calibration Visuals */}
      {isCalibrating && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="w-[80%] aspect-square md:w-96 md:h-96 relative border-2 border-dashed border-[#FFB800]/20 animate-pulse">
            <div className="absolute top-0 left-0 border-t-4 border-l-4 border-[#FFB800] w-16 h-16 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 border-t-4 border-r-4 border-[#FFB800] w-16 h-16 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 border-b-4 border-l-4 border-[#FFB800] w-16 h-16 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 border-b-4 border-r-4 border-[#FFB800] w-16 h-16 rounded-br-3xl" />
          </div>
          <div className="absolute bottom-32 text-center">
            <p className="text-[#FFB800] font-black uppercase tracking-[0.4em] text-[11px] bg-black/60 px-8 py-3 rounded-full backdrop-blur-md border border-[#FFB800]/20">Awaiting Datum Lock</p>
          </div>
        </div>
      )}

      {/* Hazard & Missing Work AR Markers */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {hazards.map((h) => (
          <div 
            key={h.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ left: `${h.coordinates.x}%`, top: `${h.coordinates.y}%` }}
          >
            <div className="relative flex items-center justify-center group">
               <div className={`absolute w-12 h-12 md:w-16 md:h-16 rounded-full border-2 animate-ping opacity-50 ${
                 h.severity === 'critical' ? 'border-red-500' : 'border-[#FFB800]'
               }`} />
               <div className={`relative z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white shadow-2xl border-2 border-white transition-transform hover:scale-125 cursor-help ${
                 h.severity === 'critical' ? 'bg-red-600' : 'bg-[#FFB800]'
               }`}>
                  <WarningIcon />
               </div>
               <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-40 md:w-48 glass-morphism p-3 rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                  <span className="text-[7px] font-black uppercase tracking-widest opacity-40">{h.room}</span>
                  <p className="text-[9px] md:text-[10px] font-bold text-black leading-tight">{h.description}</p>
               </div>
            </div>
          </div>
        ))}

        {missingWork.map((m) => (
          <div 
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ left: `${m.coordinates.x}%`, top: `${m.coordinates.y}%` }}
          >
            <div className="relative flex items-center justify-center group">
               <div className="absolute w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-400/30 animate-pulse" />
               <div className="relative z-10 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 backdrop-blur-sm border border-blue-400/50 transition-transform hover:scale-125 cursor-help">
                  <BlueprintIcon />
               </div>
               <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-40 md:w-48 glass-morphism p-3 rounded-2xl border border-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[7px] font-black uppercase tracking-widest text-blue-600">Pending {m.trade}</span>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-bold text-black leading-tight">{m.task}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraFeed;
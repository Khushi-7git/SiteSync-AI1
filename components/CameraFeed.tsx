
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WarningIcon } from './Icons';

interface CameraFeedProps {
  onCapture: (base64: string) => void;
  onLiveFrame?: (base64: string) => void;
  overlayImage?: string | null;
  hazards?: any[];
  isCalibrating?: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  onCapture,
  onLiveFrame,
  overlayImage,
  hazards = [],
  isCalibrating = false
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
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
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
    
    // Scale for AI processing
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
    
    if (isLive) {
      onLiveFrame?.(base64);
    } else {
      onCapture(base64);
    }
  }, [onCapture, onLiveFrame]);

  useEffect(() => {
    const interval = setInterval(() => captureFrame(false), 5000); 
    const liveInterval = setInterval(() => captureFrame(true), 2000); // Higher frequency for Live AI
    return () => {
      clearInterval(interval);
      clearInterval(liveInterval);
    };
  }, [captureFrame]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group border-l border-[#E5E0D8] flex items-center justify-center">
      {error ? (
        <div className="text-white text-center p-10 z-50">
          <WarningIcon />
          <p className="mt-4 font-bold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#8B5E3C] rounded-full text-xs uppercase font-black"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1]"
        />
      )}
      
      <div className="scanning-line" />
      <canvas ref={canvasRef} className="hidden" />

      {overlayImage && (
        <div className="absolute inset-0 z-10 pointer-events-none animate-in fade-in duration-1000">
          <img src={overlayImage} alt="Vibe Overlay" className="w-full h-full object-cover opacity-80 mix-blend-screen" />
        </div>
      )}

      {isCalibrating && (
        <div className="calibration-reticle">
          <div className="reticle-corner top-0 left-0 border-r-0 border-b-0" />
          <div className="reticle-corner top-0 right-0 border-l-0 border-b-0" />
          <div className="reticle-corner bottom-0 left-0 border-r-0 border-t-0" />
          <div className="reticle-corner bottom-0 right-0 border-l-0 border-t-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/40 rounded-full" />
        </div>
      )}

      <div className="absolute inset-0 z-20 pointer-events-none">
        {hazards.map((h, i) => (
          <div 
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-help"
            style={{ left: `${h.coordinates.x}%`, top: `${h.coordinates.y}%` }}
          >
            <div className="relative flex items-center justify-center w-12 h-12">
               <div className="ar-ring" />
               <div className="relative z-10 w-8 h-8 bg-[#A44A3F] flex items-center justify-center rounded-full text-white shadow-lg border-2 border-white">
                  <WarningIcon />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraFeed;

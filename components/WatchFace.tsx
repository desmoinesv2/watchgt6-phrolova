
import React, { useMemo } from 'react';
import { WatchState, ThemeConfig } from '../types';
import { 
  SpiderLilyIcon, 
  CircularProgress, 
  WeatherIcon,
  MessageIcon,
  HeartRateIcon,
  StepsIcon
} from './Icons';

interface WatchFaceProps {
  state: WatchState;
  theme: ThemeConfig;
}

// Helper component for sliding animation
const SlidingNumber = ({ value, className }: { value: string | number; className?: string }) => (
  <div className="relative overflow-hidden inline-block">
    <div key={value} className={`animate-slide-up ${className}`}>
      {value}
    </div>
  </div>
);

const WatchFace: React.FC<WatchFaceProps> = ({ state, theme }) => {
  const { isAOD, date, batteryLevel, steps, weatherTemp, notificationCount, heartRate } = state;

  // Time Values
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // Date Formatting
  const dayName = useMemo(() => date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(), [date]);
  const dayNumber = date.getDate();
  const monthName = useMemo(() => date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), [date]);

  // Unified Theme Constants
  const TEXT_COLOR = "text-phrolova-silver";
  const ACCENT_COLOR = "#880015"; // Phrolova Red

  // Unified Font for Time (Artistic Look)
  const TIME_FONT = "font-cinzel"; 

  // ---------------------------------------------------------------------------
  // AOD (Always On Display) Mode - Spider Lily Focus
  // ---------------------------------------------------------------------------
  if (isAOD) {
    return (
      <div className="w-[466px] h-[466px] rounded-full bg-black relative overflow-hidden flex flex-col items-center justify-between py-12 text-gray-400 select-none border border-[#111]">
        
        {/* Top: Minimal Time - Unified Font */}
        <div className="z-20 flex flex-col items-center absolute top-12 left-0 right-0">
             <span className={`text-3xl ${TIME_FONT} font-semibold text-phrolova-silver/50 tracking-wider`}>
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
             </span>
        </div>

        {/* Center: Artistic Element */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
             {/* Glowing Spider Lily - Rotated to lean Top-Right */}
            <div className="relative w-[380px] h-[380px] flex items-center justify-center pointer-events-none">
                {/* Glow behind */}
                <div className="absolute w-[200px] h-[200px] bg-phrolova-red/10 blur-[90px] rounded-full animate-pulse"></div>
                
                {/* The Flower Icon - Rotated 45deg */}
                <div className="w-full h-full transform rotate-45 translate-x-6 translate-y-6">
                  <SpiderLilyIcon className="w-full h-full text-[#880015] drop-shadow-[0_0_10px_rgba(136,0,21,0.5)]" />
                </div>
            </div>
        </div>
        
        {/* Name under flower (Bottom) */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20">
            <h1 className="text-4xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-phrolova-gold to-phrolova-red/50 tracking-[0.2em] font-bold" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                PHROLOVA
            </h1>
        </div>
        
        {/* Bottom: Battery Indicator (Minimal) */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 text-xs font-cinzel text-gray-600">
            {batteryLevel}%
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Active Mode - Character Bg + Digital Layout + Circular Complications
  // ---------------------------------------------------------------------------
  return (
    <div className="w-[466px] h-[466px] rounded-full relative overflow-hidden select-none shadow-2xl bg-black group">
      
      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 bg-gray-900 z-0">
         <img 
            src={theme.bgImage} 
            alt="Watch Background" 
            className="w-full h-full object-cover object-[center_20%] opacity-90 scale-110"
         />
         {/* Vignette for legibility */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
         <div className="absolute inset-0 shadow-inner-vignette"></div>
      </div>

      {/* 2. Outer Decorative Ring (Phrolova Magic Circle Theme) */}
      <div className="absolute inset-2 rounded-full border border-phrolova-red/40 z-10"></div>
      <div className="absolute inset-[14px] rounded-full border border-phrolova-gold/20 border-dashed z-10 opacity-70"></div>
      
      {/* 3. Main Digital Time Layout */}
      <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* Big Hour - Centered - Unified Artistic Font */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {/* Hour doesn't need slide animation every second, static render is better for stability, or we can animate on hour change */}
            <span className={`text-[9rem] leading-none ${TIME_FONT} font-normal text-white tracking-tight drop-shadow-2xl`} style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}>
                {hours.toString().padStart(2, '0')}
            </span>
          </div>
            
          {/* Minute/Second Pill - Right Aligned (3 o'clock) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[-20px] flex items-center border border-phrolova-silver/50 rounded-l-full pl-6 pr-8 py-2 h-[80px] gap-3 shadow-[0_0_20px_rgba(0,0,0,0.4)] z-30 bg-transparent backdrop-blur-[1px]">
              
              {/* Minutes - Sliding Animation */}
              <div className="h-[50px] overflow-hidden flex items-center">
                 <SlidingNumber 
                    value={minutes.toString().padStart(2, '0')} 
                    className={`text-5xl ${TIME_FONT} font-semibold text-white tracking-tight drop-shadow-md`} 
                 />
              </div>

              {/* Seconds - Sliding Animation & Vertical Stack Divider */}
              <div className="flex flex-col justify-center h-full border-l border-white/30 pl-3 overflow-hidden">
                  <SlidingNumber 
                    value={seconds.toString().padStart(2, '0')} 
                    className={`text-2xl ${TIME_FONT} text-phrolova-red leading-none font-bold drop-shadow-sm`}
                  />
              </div>
          </div>
      </div>

      {/* 4. Complications Layout (Scattered Circles) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* Top Center - Steps */}
          <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="relative w-[70px] h-[70px] rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                  <CircularProgress 
                      percentage={Math.min(steps / 100, 100)} 
                      color={ACCENT_COLOR}
                      size={60}
                      strokeWidth={3}
                      icon={null} 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <StepsIcon className={`w-4 h-4 ${TEXT_COLOR} mb-0.5`} />
                      <span className={`text-xs ${TIME_FONT} font-bold ${TEXT_COLOR} leading-none`}>{steps}</span>
                  </div>
              </div>
          </div>

          {/* Bottom Center - Heart Rate / BPM */}
          <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col items-center">
               <div className="relative w-[70px] h-[70px] rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                  <CircularProgress 
                      percentage={Math.min((heartRate / 200) * 100, 100)} 
                      color={ACCENT_COLOR}
                      size={60}
                      strokeWidth={3}
                      icon={null}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <HeartRateIcon className={`w-4 h-4 text-phrolova-red mb-0.5 animate-pulse`} />
                      <span className={`text-xs ${TIME_FONT} font-bold ${TEXT_COLOR} leading-none`}>{heartRate}</span>
                  </div>
              </div>
          </div>

          {/* Left Center - Date */}
          <div className="absolute left-[12%] top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-[60px] h-[60px] rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center text-white shadow-lg ring-1 ring-white/5">
                  <span className={`text-[9px] ${TIME_FONT} text-phrolova-red font-bold uppercase tracking-wider`}>{monthName}</span>
                  <span className={`text-xl ${TIME_FONT} font-bold leading-none ${TEXT_COLOR}`}>{dayNumber}</span>
                  <span className={`text-[9px] ${TIME_FONT} text-gray-400 uppercase tracking-wider`}>{dayName}</span>
              </div>
          </div>

          {/* Top Left (Diagonal) - Weather */}
          <div className="absolute top-[22%] left-[22%] flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                   <WeatherIcon className={`w-5 h-5 ${TEXT_COLOR}`} />
              </div>
              <span className={`text-xs font-bold ${TIME_FONT} ${TEXT_COLOR} mt-1 shadow-black drop-shadow-md`}>{weatherTemp}°</span>
          </div>

          {/* Bottom Left (Diagonal) - Battery */}
           <div className="absolute bottom-[22%] left-[22%] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center relative">
                    <CircularProgress 
                      percentage={batteryLevel} 
                      color={ACCENT_COLOR}
                      size={40}
                      strokeWidth={3}
                      icon={null}
                    />
                   <div className={`absolute inset-0 flex items-center justify-center text-[10px] ${TIME_FONT} font-bold ${TEXT_COLOR}`}>
                     {batteryLevel}
                   </div>
                </div>
           </div>

          {/* Message Notification (Bottom Center) */}
          {notificationCount > 0 && (
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 animate-bounce duration-[2000ms] z-30">
                <div className="flex items-center gap-1 bg-phrolova-red/90 backdrop-blur-md rounded-full px-3 py-1 border border-white/20 shadow-glow">
                    <MessageIcon className="w-4 h-4 text-white" />
                    <span className={`text-xs font-bold ${TIME_FONT} text-white`}>{notificationCount}</span>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default WatchFace;

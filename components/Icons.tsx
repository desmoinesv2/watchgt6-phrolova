
import React from 'react';

interface IconProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

// Redesigned to closely match the organic, chaotic, "anime-style" Red Spider Lily (Lycoris radiata)
export const SpiderLilyIcon = ({ className, id, style }: IconProps) => (
  <svg id={id} style={style} viewBox="0 0 512 512" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    {/* STEM: Curved, organic */}
    <path 
      d="M256 512 Q 260 400 256 320" 
      strokeWidth="10" 
      className="text-phrolova-red opacity-90"
      style={{ stroke: '#880015' }} 
    />

    <g transform="translate(256, 260) scale(1.1)">
      
      {/* Central Flower Mass - A mix of curling petals */}
      <g strokeWidth="8" className="text-phrolova-red" fill="rgba(136, 0, 21, 0.2)" style={{ stroke: '#880015', fill: 'rgba(136, 0, 21, 0.2)' }}>
        <path d="M0 0 C -30 -20 -50 10 -60 40" /> 
        <path d="M0 0 C 30 -20 50 10 60 40" />
        <path d="M0 0 C -20 -40 -60 -60 -80 -40" />
        <path d="M0 0 C 20 -40 60 -60 80 -40" />
        <path d="M0 0 C -10 -50 -30 -90 -60 -100" />
        <path d="M0 0 C 10 -50 30 -90 60 -100" />
        
        {/* Detailed "Petal" texture strokes */}
        <path d="M-10 10 Q -40 20 -50 60" strokeWidth="6" opacity="0.8"/>
        <path d="M10 10 Q 40 20 50 60" strokeWidth="6" opacity="0.8"/>
        <path d="M0 -10 Q -30 -50 -70 -30" strokeWidth="6" opacity="0.8"/>
        <path d="M0 -10 Q 30 -50 70 -30" strokeWidth="6" opacity="0.8"/>
      </g>

      {/* Stamens */}
      <g strokeWidth="2.5" className="text-phrolova-red" opacity="0.9" style={{ stroke: '#880015' }}>
        <path d="M0 0 C -40 -80 -100 -100 -140 -120" />
        <path d="M5 -5 C -30 -100 -80 -150 -120 -180" />
        <path d="M-5 -5 C -60 -60 -120 -80 -160 -80" />
        <path d="M0 0 C 40 -80 100 -100 140 -120" />
        <path d="M-5 -5 C 30 -100 80 -150 120 -180" />
        <path d="M5 -5 C 60 -60 120 -80 160 -80" />
        <path d="M0 0 C -20 -100 0 -180 -20 -220" />
        <path d="M0 0 C 20 -100 0 -180 20 -220" />
      </g>
      
      {/* Anthers */}
      <g fill="currentColor" stroke="none" className="text-phrolova-gold opacity-80" style={{ fill: '#d4af37' }}>
         <circle cx="-140" cy="-120" r="4" />
         <circle cx="-120" cy="-180" r="4" />
         <circle cx="-160" cy="-80" r="4" />
         <circle cx="140" cy="-120" r="4" />
         <circle cx="120" cy="-180" r="4" />
         <circle cx="160" cy="-80" r="4" />
         <circle cx="-20" cy="-220" r="4" />
         <circle cx="20" cy="-220" r="4" />
      </g>
    </g>
  </svg>
);

// New Component: Outer Bezel/Decoration Ring for Export with Spider Lily Elements
export const WatchBezelIcon = ({ className, id, style }: IconProps) => (
  <svg id={id} style={style} viewBox="0 0 466 466" className={className} fill="none">
    <defs>
       <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
       </filter>
    </defs>
    
    {/* Base Ring - Slightly smaller than 466 to avoid clipping */}
    <circle cx="233" cy="233" r="220" stroke="#880015" strokeWidth="2" strokeOpacity="0.8" />
    <circle cx="233" cy="233" r="215" stroke="#000000" strokeWidth="8" strokeOpacity="0.3" />
    <circle cx="233" cy="233" r="228" stroke="#880015" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 4" />

    {/* Spider Lily Petal Motifs at Cardinal Directions */}
    {[0, 90, 180, 270].map((rotation, i) => (
      <g key={i} transform={`rotate(${rotation} 233 233)`}>
        {/* Decorative Curve - Stylized Petal */}
        <path 
          d="M233 13 Q 248 30 233 50 Q 218 30 233 13" 
          stroke="#880015" 
          fill="#1a0505" 
          strokeWidth="1.5"
        />
        {/* Stamen Lines */}
        <path d="M233 13 Q 255 25 260 40" stroke="#d4af37" strokeWidth="1" opacity="0.6" fill="none" />
        <path d="M233 13 Q 211 25 206 40" stroke="#d4af37" strokeWidth="1" opacity="0.6" fill="none" />
        
        {/* Small Dot */}
        <circle cx="233" cy="45" r="2" fill="#d4af37" />
      </g>
    ))}

    {/* Inner dashed ring */}
    <circle cx="233" cy="233" r="200" stroke="#d4af37" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="4 8" />
  </svg>
);

export const CircularProgress = ({ 
  percentage, 
  color, 
  icon: Icon, 
  size = 40, 
  strokeWidth = 3 
}: { 
  percentage: number; 
  color: string; 
  icon?: any; 
  size?: number; 
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out drop-shadow-[0_0_2px_rgba(136,0,21,0.5)]"
        />
      </svg>
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center text-white/90">
          <Icon className="w-1/2 h-1/2" />
        </div>
      )}
    </div>
  );
};

export const BatteryIcon = ({ className, id, style }: IconProps) => (
  <svg id={id} style={style} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="7" width="16" height="10" rx="2" />
    <path d="M22 11v2" />
    <path d="M6 10h8" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const HeartRateIcon = ({ className, id, style }: IconProps) => (
  <svg id={id} style={style} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const StepsIcon = ({ className, id, style }: IconProps) => (
  <svg id={id} style={style} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
  </svg>
);

export const WeatherIcon = ({ className, id, style }: IconProps) => (
  <svg id={id} style={style} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

export const MessageIcon = ({ className, id, style }: IconProps) => (
  <svg id={id} style={style} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

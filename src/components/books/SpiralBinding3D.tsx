'use client';

import React from 'react';

export type SpiralTheme = 'chrome' | 'emerald' | 'gold' | 'obsidian';

interface SpiralBinding3DProps {
  ringsCount?: number;
  theme?: SpiralTheme;
  isSinglePage?: boolean;
  className?: string;
}

export const SpiralBinding3D: React.FC<SpiralBinding3DProps> = ({
  ringsCount = 26,
  theme = 'emerald',
  isSinglePage = false,
  className = ''
}) => {
  const rings = Array.from({ length: ringsCount }, (_, i) => i);

  // Gradient & Shadow definitions for spiral metal types
  const getThemeGradients = () => {
    switch (theme) {
      case 'emerald':
        return {
          wireGradStart: '#A7F3D0',
          wireGradMid1: '#34D399',
          wireGradHighlight: '#ECFDF5',
          wireGradMid2: '#059669',
          wireGradEnd: '#064E3B',
          glow: 'rgba(16, 185, 129, 0.45)',
          shadowColor: 'rgba(2, 44, 34, 0.7)',
        };
      case 'gold':
        return {
          wireGradStart: '#FEF08A',
          wireGradMid1: '#EAB308',
          wireGradHighlight: '#FFFFFF',
          wireGradMid2: '#CA8A04',
          wireGradEnd: '#713F12',
          glow: 'rgba(234, 179, 8, 0.45)',
          shadowColor: 'rgba(66, 32, 6, 0.65)',
        };
      case 'obsidian':
        return {
          wireGradStart: '#94A3B8',
          wireGradMid1: '#475569',
          wireGradHighlight: '#CBD5E1',
          wireGradMid2: '#1E293B',
          wireGradEnd: '#0F172A',
          glow: 'rgba(30, 41, 59, 0.4)',
          shadowColor: 'rgba(0, 0, 0, 0.8)',
        };
      case 'chrome':
      default:
        return {
          wireGradStart: '#F8FAFC',
          wireGradMid1: '#94A3B8',
          wireGradHighlight: '#FFFFFF',
          wireGradMid2: '#64748B',
          wireGradEnd: '#334155',
          glow: 'rgba(148, 163, 184, 0.4)',
          shadowColor: 'rgba(15, 23, 42, 0.7)',
        };
    }
  };

  const colors = getThemeGradients();

  if (isSinglePage) {
    // Single page spiral binding along the left spine
    return (
      <div 
        className={`absolute left-0 top-0 bottom-0 w-8 z-30 pointer-events-none flex flex-col justify-around py-4 ${className}`}
        style={{ transform: 'translateX(-50%)' }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`single-wire-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.wireGradStart} />
              <stop offset="25%" stopColor={colors.wireGradMid1} />
              <stop offset="45%" stopColor={colors.wireGradHighlight} />
              <stop offset="70%" stopColor={colors.wireGradMid2} />
              <stop offset="100%" stopColor={colors.wireGradEnd} />
            </linearGradient>
            <filter id={`spiral-shadow-${theme}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor={colors.shadowColor} floodOpacity="0.8" />
            </filter>
          </defs>

          {rings.map((_, i) => {
            const yPercent = (i / (ringsCount - 1)) * 94 + 3;
            return (
              <g key={i}>
                {/* Paper hole */}
                <ellipse
                  cx="22"
                  cy={`${yPercent}%`}
                  rx="3.5"
                  ry="5.5"
                  fill="#0B130E"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1"
                />
                {/* Outer Coil Arc looping through hole */}
                <path
                  d={`M 6 ${yPercent - 1.2}% C -4 ${yPercent - 0.5}%, -4 ${yPercent + 2.5}%, 22 ${yPercent}%`}
                  fill="none"
                  stroke={`url(#single-wire-${theme})`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter={`url(#spiral-shadow-${theme})`}
                />
                {/* Specular Glint */}
                <path
                  d={`M 3 ${yPercent - 0.8}% C -1 ${yPercent - 0.2}%, 2 ${yPercent + 1}%, 14 ${yPercent}%`}
                  fill="none"
                  stroke={colors.wireGradHighlight}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // Dual-page spread spiral spine down the center gutter
  return (
    <div 
      className={`absolute left-1/2 top-0 bottom-0 w-16 -translate-x-1/2 z-30 pointer-events-none flex flex-col justify-around py-3 ${className}`}
      style={{
        perspective: '1200px',
      }}
    >
      <svg className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`spread-wire-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.wireGradEnd} />
            <stop offset="18%" stopColor={colors.wireGradMid2} />
            <stop offset="42%" stopColor={colors.wireGradHighlight} />
            <stop offset="68%" stopColor={colors.wireGradMid1} />
            <stop offset="100%" stopColor={colors.wireGradEnd} />
          </linearGradient>

          <linearGradient id={`hole-grad-left`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08100C" />
            <stop offset="70%" stopColor="#132219" />
            <stop offset="100%" stopColor="#1E3628" />
          </linearGradient>

          <linearGradient id={`hole-grad-right`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3628" />
            <stop offset="30%" stopColor="#132219" />
            <stop offset="100%" stopColor="#08100C" />
          </linearGradient>

          <filter id={`coil-drop-shadow-${theme}`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="1" dy="3.5" stdDeviation="2.5" floodColor={colors.shadowColor} floodOpacity="0.85" />
          </filter>

          <radialGradient id={`coil-highlight-${theme}`} cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {rings.map((_, i) => {
          const yPercent = (i / (ringsCount - 1)) * 95 + 2.5;

          return (
            <g key={i} className="transition-transform duration-300">
              {/* Left page punched hole */}
              <rect
                x="8"
                y={`calc(${yPercent}% - 5.5px)`}
                width="7"
                height="11"
                rx="3.5"
                fill="url(#hole-grad-left)"
                stroke="rgba(0,0,0,0.6)"
                strokeWidth="1.2"
              />

              {/* Right page punched hole */}
              <rect
                x="49"
                y={`calc(${yPercent}% - 5.5px)`}
                width="7"
                height="11"
                rx="3.5"
                fill="url(#hole-grad-right)"
                stroke="rgba(0,0,0,0.6)"
                strokeWidth="1.2"
              />

              {/* Behind-the-page ring segment (in hole depth) */}
              <path
                d={`M 11.5 ${yPercent}% Q 32 ${yPercent - 2.5}%, 52.5 ${yPercent}%`}
                fill="none"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="4"
              />

              {/* 3D Wire-O Front Ring Loop bridging left hole to right hole */}
              <path
                d={`M 11.5 ${yPercent}% C 11.5 ${yPercent - 5.5}%, 52.5 ${yPercent - 5.5}%, 52.5 ${yPercent}%`}
                fill="none"
                stroke={`url(#spread-wire-${theme})`}
                strokeWidth="4.2"
                strokeLinecap="round"
                filter={`url(#coil-drop-shadow-${theme})`}
              />

              {/* 3D Cylindrical Highlight line on the top curve of wire */}
              <path
                d={`M 14 ${yPercent - 1.2}% C 20 ${yPercent - 4.5}%, 44 ${yPercent - 4.5}%, 50 ${yPercent - 1.2}%`}
                fill="none"
                stroke={colors.wireGradHighlight}
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Lower return loop connecting spiral pitch */}
              <path
                d={`M 11.5 ${yPercent}% C 13 ${yPercent + 3}%, 51 ${yPercent + 3.5}%, 52.5 ${yPercent + 0.8}%`}
                fill="none"
                stroke={`url(#spread-wire-${theme})`}
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

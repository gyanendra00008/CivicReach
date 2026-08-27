import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3.5">
      <div className="w-[62px] h-[62px] rounded-full bg-[#061022] flex items-center justify-center border-2 border-cyan-300/60 shadow-[0_0_30px_rgba(34,211,238,0.9),0_0_60px_rgba(34,211,238,0.4)]">

        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          {/* Glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* BADI PIN */}
          <path
            d="M12 1.5C6.5 1.5 3 5.5 3 10C3 16 12 22.5 12 22.5C12 22.5 21 16 21 10C21 5.5 17.5 1.5 12 1.5Z"
            stroke="#22d3ee"
            strokeWidth="1.8"
            fill="rgba(34,211,238,0.12)"
            filter="url(#glow)"
          />

          {/* Top shining dots */}
          <circle cx="12" cy="2.8" r="1.3" fill="#7dd3fc" filter="url(#glow)"/>
          <circle cx="18" cy="5.5" r="1.1" fill="#22d3ee" />

          {/* CHAMAKTI HUI BUILDING */}
          <g transform="translate(12, 11.8)" filter="url(#glow)">
            <g transform="scale(0.48) translate(-12, -10)">
              {/* Roof - chamkega */}
              <path d="M12 1 L1 8.5 L23 8.5 Z" fill="#22d3ee"/>
              {/* Pillars - moti aur bright */}
              <rect x="3.5" y="8.5" width="2.8" height="6" fill="#6ee7b7" rx="0.3"/>
              <rect x="9" y="8.5" width="2.8" height="6" fill="#22d3ee" rx="0.3"/>
              <rect x="13.2" y="8.5" width="2.8" height="6" fill="#22d3ee" rx="0.3"/>
              <rect x="18" y="8.5" width="2.8" height="6" fill="#6ee7b7" rx="0.3"/>
              {/* Base */}
              <rect x="2" y="14.5" width="20" height="1.8" fill="#22d3ee"/>
              <rect x="4.5" y="16.8" width="15" height="1.5" fill="#7dd3fc"/>
              {/* Door - glow */}
              <rect x="10" y="11" width="4" height="3.5" fill="#061022" stroke="#7dd3fc" strokeWidth="0.6"/>
            </g>
          </g>
        </svg>
      </div>

      <h1 className="text-[30px] font-extrabold tracking-tight text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
        CivicReach
      </h1>
    </div>
  );
};

export default Logo;
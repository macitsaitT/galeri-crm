import React, { useState } from 'react';

const statusConfig = {
  orijinal: { label: 'ORJ', bg: '#22c55e', text: '#fff', name: 'Orijinal' },
  boyali: { label: 'BOY', bg: '#eab308', text: '#000', name: 'Boyalı' },
  degisen: { label: 'DEĞ', bg: '#ef4444', text: '#fff', name: 'Değişen' },
  lokal: { label: 'LOK', bg: '#3b82f6', text: '#fff', name: 'Lokal Boyalı' },
};

const statusOrder = ['orijinal', 'boyali', 'degisen', 'lokal'];

// Parts positioned as percentage of container (320x480 virtual space)
const carParts = [
  { id: 'on_tampon', name: 'Ön Tampon', top: 1, left: 28, w: 44, h: 5 },
  { id: 'kaput', name: 'Kaput', top: 7, left: 22, w: 56, h: 13 },
  { id: 'sol_on_camurluk', name: 'Sol Ön Çam.', top: 7, left: 8, w: 12, h: 13 },
  { id: 'sag_on_camurluk', name: 'Sağ Ön Çam.', top: 7, left: 80, w: 12, h: 13 },
  { id: 'sol_on_kapi', name: 'Sol Ön Kapı', top: 22, left: 8, w: 12, h: 18 },
  { id: 'sag_on_kapi', name: 'Sağ Ön Kapı', top: 22, left: 80, w: 12, h: 18 },
  { id: 'tavan', name: 'Tavan', top: 22, left: 22, w: 56, h: 36 },
  { id: 'sol_arka_kapi', name: 'Sol Arka Kapı', top: 42, left: 8, w: 12, h: 18 },
  { id: 'sag_arka_kapi', name: 'Sağ Arka Kapı', top: 42, left: 80, w: 12, h: 18 },
  { id: 'sol_arka_camurluk', name: 'Sol Arka Çam.', top: 62, left: 8, w: 12, h: 13 },
  { id: 'sag_arka_camurluk', name: 'Sağ Arka Çam.', top: 62, left: 80, w: 12, h: 13 },
  { id: 'bagaj', name: 'Bagaj', top: 62, left: 22, w: 56, h: 13 },
  { id: 'arka_tampon', name: 'Arka Tampon', top: 76, left: 28, w: 44, h: 5 },
];

const CarExpertiseDiagram = ({ expertiseParts = {}, onChange }) => {
  const [hoveredPart, setHoveredPart] = useState(null);

  const getStatus = (partId) => expertiseParts[partId] || 'orijinal';

  const handleClick = (partId) => {
    const current = getStatus(partId);
    const idx = statusOrder.indexOf(current);
    const next = statusOrder[(idx + 1) % statusOrder.length];
    onChange(partId, next);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center gap-3 mb-5 w-full">
        <div className="h-px flex-1 bg-border" />
        <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Kaporta Ekspertizi
        </h4>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Car Container */}
      <div className="relative" style={{ width: 280, height: 240 }}>
        {/* Car outline SVG background */}
        <svg viewBox="0 0 100 85" className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* Shadow */}
          <ellipse cx="50" cy="83" rx="35" ry="2" fill="rgba(255,255,255,0.03)" />
          {/* Body outline */}
          <path
            d="M30,5 Q30,2 33,2 L67,2 Q70,2 70,5 L72,10 Q92,12 92,16 L92,70 Q92,74 88,76 L72,80 Q70,82 67,82 L33,82 Q30,82 28,80 L12,76 Q8,74 8,70 L8,16 Q8,12 28,10 Z"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />
          {/* Mirrors */}
          <rect x="4" y="25" width="3" height="5" rx="0.5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
          <rect x="93" y="25" width="3" height="5" rx="0.5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
          {/* Wheels */}
          <rect x="5" y="14" width="3" height="8" rx="1" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <rect x="92" y="14" width="3" height="8" rx="1" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <rect x="5" y="62" width="3" height="8" rx="1" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <rect x="92" y="62" width="3" height="8" rx="1" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          {/* Headlights */}
          <circle cx="38" cy="4" r="2" fill="rgba(212,160,48,0.2)" />
          <circle cx="62" cy="4" r="2" fill="rgba(212,160,48,0.2)" />
          {/* Taillights */}
          <circle cx="38" cy="80" r="2" fill="rgba(239,68,68,0.2)" />
          <circle cx="62" cy="80" r="2" fill="rgba(239,68,68,0.2)" />
          {/* Windshield */}
          <line x1="22" y1="21" x2="78" y2="21" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2 1" />
          <line x1="22" y1="60" x2="78" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2 1" />
        </svg>

        {/* Clickable parts overlay */}
        {carParts.map((part) => {
          const status = getStatus(part.id);
          const config = statusConfig[status];
          const isHovered = hoveredPart === part.id;

          return (
            <button
              key={part.id}
              type="button"
              onClick={() => handleClick(part.id)}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
              className="absolute flex items-center justify-center font-bold rounded-[3px] transition-all duration-150"
              style={{
                top: `${part.top}%`,
                left: `${part.left}%`,
                width: `${part.w}%`,
                height: `${part.h}%`,
                backgroundColor: config.bg,
                color: config.text,
                fontSize: part.id === 'tavan' ? 13 : 10,
                fontWeight: 800,
                border: isHovered ? '2px solid #fff' : '1px solid rgba(0,0,0,0.25)',
                transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                zIndex: isHovered ? 10 : 1,
                boxShadow: isHovered ? '0 0 12px rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.3)',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
              data-testid={`diagram-${part.id}`}
              title={`${part.name}: ${config.name}`}
            >
              {config.label}
              {isHovered && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black border border-white/20 rounded px-2 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-xl z-20 text-white">
                  {part.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-5">
        {statusOrder.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-sm"
              style={{ backgroundColor: statusConfig[key].bg, boxShadow: `0 0 6px ${statusConfig[key].bg}40` }}
            />
            <span className="text-xs font-medium text-muted-foreground">{statusConfig[key].name}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
        Durumunu değiştirmek için ilgili parçaya tıklayın
      </p>
    </div>
  );
};

export default CarExpertiseDiagram;

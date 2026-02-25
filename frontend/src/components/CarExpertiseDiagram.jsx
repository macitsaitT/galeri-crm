import React, { useState } from 'react';

const statusConfig = {
  orijinal: { label: 'ORJ', bg: '#22c55e', text: '#fff', name: 'Orijinal' },
  boyali: { label: 'BOY', bg: '#eab308', text: '#000', name: 'Boyalı' },
  degisen: { label: 'DEĞ', bg: '#ef4444', text: '#fff', name: 'Değişen' },
  lokal: { label: 'LOK', bg: '#3b82f6', text: '#fff', name: 'Lokal Boyalı' },
};

const statusOrder = ['orijinal', 'boyali', 'degisen', 'lokal'];

// Realistic top-down car SVG paths for each body part
const carParts = [
  {
    id: 'on_tampon',
    name: 'Ön Tampon',
    path: 'M120,18 L180,18 Q185,18 185,23 L185,38 L115,38 L115,23 Q115,18 120,18 Z',
    labelX: 150, labelY: 30,
  },
  {
    id: 'kaput',
    name: 'Kaput',
    path: 'M110,40 L190,40 L195,95 L105,95 Z',
    labelX: 150, labelY: 70,
  },
  {
    id: 'sol_on_camurluk',
    name: 'Sol Ön Çamurluk',
    path: 'M68,42 L108,40 L103,95 L68,95 Z',
    labelX: 86, labelY: 70,
  },
  {
    id: 'sag_on_camurluk',
    name: 'Sağ Ön Çamurluk',
    path: 'M192,40 L232,42 L232,95 L197,95 Z',
    labelX: 214, labelY: 70,
  },
  {
    id: 'sol_on_kapi',
    name: 'Sol Ön Kapı',
    path: 'M66,98 L100,98 L100,175 L66,175 Z',
    labelX: 83, labelY: 138,
  },
  {
    id: 'sag_on_kapi',
    name: 'Sağ Ön Kapı',
    path: 'M200,98 L234,98 L234,175 L200,175 Z',
    labelX: 217, labelY: 138,
  },
  {
    id: 'tavan',
    name: 'Tavan',
    path: 'M103,98 L197,98 L197,260 L103,260 Z',
    labelX: 150, labelY: 180,
  },
  {
    id: 'sol_arka_kapi',
    name: 'Sol Arka Kapı',
    path: 'M66,178 L100,178 L100,258 L66,258 Z',
    labelX: 83, labelY: 220,
  },
  {
    id: 'sag_arka_kapi',
    name: 'Sağ Arka Kapı',
    path: 'M200,178 L234,178 L234,258 L200,258 Z',
    labelX: 217, labelY: 220,
  },
  {
    id: 'sol_arka_camurluk',
    name: 'Sol Arka Çamurluk',
    path: 'M66,262 L100,262 L105,320 L68,318 Z',
    labelX: 85, labelY: 292,
  },
  {
    id: 'sag_arka_camurluk',
    name: 'Sağ Arka Çamurluk',
    path: 'M200,262 L234,262 L232,318 L195,320 Z',
    labelX: 216, labelY: 292,
  },
  {
    id: 'bagaj',
    name: 'Bagaj',
    path: 'M107,262 L193,262 L190,320 L110,320 Z',
    labelX: 150, labelY: 292,
  },
  {
    id: 'arka_tampon',
    name: 'Arka Tampon',
    path: 'M112,323 L188,323 L185,342 Q185,347 180,347 L120,347 Q115,347 115,342 Z',
    labelX: 150, labelY: 337,
  },
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
      <div className="flex items-center gap-2 mb-5">
        <div className="h-px flex-1 bg-border" />
        <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground px-3">
          Kaporta Ekspertizi
        </h4>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="relative">
        <svg viewBox="0 0 300 365" width="300" height="365">
          {/* Car body shadow */}
          <ellipse cx="150" cy="358" rx="95" ry="6" fill="hsl(0 0% 4%)" opacity="0.5" />

          {/* Car body outline */}
          <path
            d="M120,15 Q120,10 125,10 L175,10 Q180,10 180,15 L185,38 Q240,40 240,48 L240,90 Q242,90 242,95 L242,100 Q242,105 240,105 L240,265 Q242,265 242,270 L242,275 Q242,280 240,280 L240,316 Q240,325 235,330 L190,348 Q185,350 180,350 L120,350 Q115,350 110,348 L65,330 Q60,325 60,316 L60,280 Q58,280 58,275 L58,270 Q58,265 60,265 L60,105 Q58,105 58,100 L58,95 Q58,90 60,90 L60,48 Q60,40 115,38 Z"
            fill="none"
            stroke="hsl(0 0% 25%)"
            strokeWidth="2"
          />

          {/* Side mirrors */}
          <path d="M55,105 L48,108 L48,118 L55,121 Z" fill="hsl(0 0% 12%)" stroke="hsl(0 0% 25%)" strokeWidth="1" />
          <path d="M245,105 L252,108 L252,118 L245,121 Z" fill="hsl(0 0% 12%)" stroke="hsl(0 0% 25%)" strokeWidth="1" />

          {/* Wheels */}
          <rect x="52" y="58" width="10" height="28" rx="3" fill="hsl(0 0% 15%)" stroke="hsl(0 0% 30%)" strokeWidth="1" />
          <rect x="238" y="58" width="10" height="28" rx="3" fill="hsl(0 0% 15%)" stroke="hsl(0 0% 30%)" strokeWidth="1" />
          <rect x="52" y="270" width="10" height="28" rx="3" fill="hsl(0 0% 15%)" stroke="hsl(0 0% 30%)" strokeWidth="1" />
          <rect x="238" y="270" width="10" height="28" rx="3" fill="hsl(0 0% 15%)" stroke="hsl(0 0% 30%)" strokeWidth="1" />

          {/* Headlights */}
          <ellipse cx="125" cy="22" rx="8" ry="3" fill="hsl(46 65% 52%)" opacity="0.3" />
          <ellipse cx="175" cy="22" rx="8" ry="3" fill="hsl(46 65% 52%)" opacity="0.3" />

          {/* Taillights */}
          <ellipse cx="125" cy="345" rx="8" ry="3" fill="#ef4444" opacity="0.3" />
          <ellipse cx="175" cy="345" rx="8" ry="3" fill="#ef4444" opacity="0.3" />

          {/* Clickable body parts */}
          {carParts.map((part) => {
            const status = getStatus(part.id);
            const config = statusConfig[status];
            const isHovered = hoveredPart === part.id;

            return (
              <g
                key={part.id}
                onClick={() => handleClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                style={{ cursor: 'pointer' }}
                data-testid={`diagram-${part.id}`}
              >
                <path
                  d={part.path}
                  fill={config.bg}
                  stroke={isHovered ? '#fff' : 'rgba(0,0,0,0.3)'}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 1 : 0.85}
                />
                <text
                  x={part.labelX}
                  y={part.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={part.id === 'tavan' ? 13 : 10}
                  fontWeight="800"
                  fill={config.text}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)', pointerEvents: 'none' }}
                >
                  {config.label}
                </text>
                {/* Part name on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={part.labelX - 45}
                      y={part.labelY - 28}
                      width={90}
                      height={18}
                      rx={4}
                      fill="hsl(0 0% 8%)"
                      stroke="hsl(0 0% 25%)"
                      strokeWidth="1"
                    />
                    <text
                      x={part.labelX}
                      y={part.labelY - 17}
                      textAnchor="middle"
                      fontSize={9}
                      fill="hsl(0 0% 90%)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {part.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Windshield line */}
          <line x1="108" y1="96" x2="192" y2="96" stroke="hsl(0 0% 35%)" strokeWidth="1" strokeDasharray="4 2" />
          {/* Rear windshield line */}
          <line x1="108" y1="260" x2="192" y2="260" stroke="hsl(0 0% 35%)" strokeWidth="1" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-5">
        {statusOrder.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border border-white/10"
              style={{ backgroundColor: statusConfig[key].bg }}
            />
            <span className="text-xs font-medium text-muted-foreground">{statusConfig[key].name}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground/60 mt-2 text-center">
        Durumunu değiştirmek için ilgili parçaya tıklayın
      </p>
    </div>
  );
};

export default CarExpertiseDiagram;

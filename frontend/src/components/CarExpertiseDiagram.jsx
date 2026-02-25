import React, { useState } from 'react';

const statusMap = {
  orijinal: { label: 'ORJ', color: '#4ade80', border: '#16a34a', name: 'Orijinal' },
  boyali: { label: 'BOY', color: '#fbbf24', border: '#d97706', name: 'Boyalı' },
  degisen: { label: 'DEĞ', color: '#f87171', border: '#dc2626', name: 'Değişen' },
  lokal: { label: 'LOK', color: '#60a5fa', border: '#2563eb', name: 'Lokal Boyalı' },
};

const statusOrder = ['orijinal', 'boyali', 'degisen', 'lokal'];

const parts = [
  { id: 'on_tampon', name: 'Ön Tampon', x: 105, y: 5, w: 90, h: 28 },
  { id: 'kaput', name: 'Kaput', x: 105, y: 37, w: 90, h: 55 },
  { id: 'sol_on_camurluk', name: 'Sol Ön Çamurluk', x: 60, y: 37, w: 40, h: 55 },
  { id: 'sag_on_camurluk', name: 'Sağ Ön Çamurluk', x: 200, y: 37, w: 40, h: 55 },
  { id: 'sol_on_kapi', name: 'Sol Ön Kapı', x: 60, y: 97, w: 40, h: 60 },
  { id: 'sag_on_kapi', name: 'Sağ Ön Kapı', x: 200, y: 97, w: 40, h: 60 },
  { id: 'tavan', name: 'Tavan', x: 105, y: 97, w: 90, h: 120 },
  { id: 'sol_arka_kapi', name: 'Sol Arka Kapı', x: 60, y: 162, w: 40, h: 55 },
  { id: 'sag_arka_kapi', name: 'Sağ Arka Kapı', x: 200, y: 162, w: 40, h: 55 },
  { id: 'sol_arka_camurluk', name: 'Sol Arka Çamurluk', x: 60, y: 222, w: 40, h: 55 },
  { id: 'sag_arka_camurluk', name: 'Sağ Arka Çamurluk', x: 200, y: 222, w: 40, h: 55 },
  { id: 'bagaj', name: 'Bagaj', x: 105, y: 222, w: 90, h: 55 },
  { id: 'arka_tampon', name: 'Arka Tampon', x: 105, y: 282, w: 90, h: 28 },
];

const CarExpertiseDiagram = ({ expertiseParts = {}, onChange }) => {
  const [tooltip, setTooltip] = useState(null);

  const getStatus = (partId) => expertiseParts[partId] || 'orijinal';

  const handleClick = (partId) => {
    const current = getStatus(partId);
    const idx = statusOrder.indexOf(current);
    const next = statusOrder[(idx + 1) % statusOrder.length];
    onChange(partId, next);
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="font-bold text-base uppercase tracking-wide mb-4 text-center">Kaporta Ekspertizi</h4>
      <div className="relative">
        <svg viewBox="0 0 300 320" width="300" height="320" className="mx-auto">
          {/* Car body outline */}
          <path
            d="M100,10 Q100,0 110,0 L190,0 Q200,0 200,10 L200,30 Q240,30 245,40 L245,90 Q245,95 240,95 L240,280 Q240,285 245,285 L245,300 Q245,310 240,315 L60,315 Q55,310 55,300 L55,285 Q60,285 60,280 L60,95 Q55,95 55,90 L55,40 Q60,30 100,30 Z"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          />
          {/* Wheel arcs */}
          <rect x="48" y="50" width="10" height="30" rx="3" fill="#1a1a2e" stroke="#333" strokeWidth="1" />
          <rect x="242" y="50" width="10" height="30" rx="3" fill="#1a1a2e" stroke="#333" strokeWidth="1" />
          <rect x="48" y="235" width="10" height="30" rx="3" fill="#1a1a2e" stroke="#333" strokeWidth="1" />
          <rect x="242" y="235" width="10" height="30" rx="3" fill="#1a1a2e" stroke="#333" strokeWidth="1" />

          {/* Parts */}
          {parts.map((part) => {
            const status = getStatus(part.id);
            const info = statusMap[status];
            return (
              <g
                key={part.id}
                onClick={() => handleClick(part.id)}
                onMouseEnter={() => setTooltip({ ...part, status: info.name })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: 'pointer' }}
                data-testid={`diagram-${part.id}`}
              >
                <rect
                  x={part.x}
                  y={part.y}
                  width={part.w}
                  height={part.h}
                  rx={3}
                  fill={info.color}
                  stroke={info.border}
                  strokeWidth={1.5}
                />
                <text
                  x={part.x + part.w / 2}
                  y={part.y + part.h / 2 + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#1a1a2e"
                >
                  {info.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute bg-card border border-border rounded px-3 py-1.5 text-xs font-medium shadow-lg pointer-events-none z-10"
            style={{ left: tooltip.x + tooltip.w / 2 - 40, top: tooltip.y - 8 }}
          >
            {tooltip.name}: {tooltip.status}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap justify-center">
        {statusOrder.map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: statusMap[key].color, borderColor: statusMap[key].border }}
            />
            <span className="text-xs font-medium">{statusMap[key].name}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        * Durumunu değiştirmek istediğiniz parçanın üzerine tıklayın.
      </p>
    </div>
  );
};

export default CarExpertiseDiagram;

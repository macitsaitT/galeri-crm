import React, { useState } from 'react';

const statusConfig = {
  orijinal: { label: 'ORJ', bg: '#22c55e', text: '#fff', name: 'Orijinal' },
  boyali: { label: 'BOY', bg: '#eab308', text: '#000', name: 'Boyalı' },
  degisen: { label: 'DEĞ', bg: '#ef4444', text: '#fff', name: 'Değişen' },
  lokal: { label: 'LOK', bg: '#3b82f6', text: '#fff', name: 'Lokal Boyalı' },
};

const statusOrder = ['orijinal', 'boyali', 'degisen', 'lokal'];

const carParts = [
  { id: 'on_tampon', name: 'Ön Tampon', row: 0, col: 1, colSpan: 1 },
  { id: 'sol_on_camurluk', name: 'Sol Ön Çamurluk', row: 1, col: 0 },
  { id: 'kaput', name: 'Kaput', row: 1, col: 1 },
  { id: 'sag_on_camurluk', name: 'Sağ Ön Çamurluk', row: 1, col: 2 },
  { id: 'sol_on_kapi', name: 'Sol Ön Kapı', row: 2, col: 0 },
  { id: 'tavan', name: 'Tavan', row: 2, col: 1, rowSpan: 2 },
  { id: 'sag_on_kapi', name: 'Sağ Ön Kapı', row: 2, col: 2 },
  { id: 'sol_arka_kapi', name: 'Sol Arka Kapı', row: 3, col: 0 },
  { id: 'sag_arka_kapi', name: 'Sağ Arka Kapı', row: 3, col: 2 },
  { id: 'sol_arka_camurluk', name: 'Sol Arka Çamurluk', row: 4, col: 0 },
  { id: 'bagaj', name: 'Bagaj', row: 4, col: 1 },
  { id: 'sag_arka_camurluk', name: 'Sağ Arka Çamurluk', row: 4, col: 2 },
  { id: 'arka_tampon', name: 'Arka Tampon', row: 5, col: 1 },
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

  const renderPart = (part) => {
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
        className="flex items-center justify-center font-bold text-xs rounded transition-all duration-150 border-2 relative"
        style={{
          backgroundColor: config.bg,
          color: config.text,
          borderColor: isHovered ? '#fff' : 'rgba(0,0,0,0.2)',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          zIndex: isHovered ? 10 : 1,
          gridRow: part.rowSpan ? `span ${part.rowSpan}` : undefined,
          gridColumn: part.colSpan ? `span ${part.colSpan}` : undefined,
          minHeight: part.rowSpan === 2 ? '100%' : '48px',
        }}
        data-testid={`diagram-${part.id}`}
        title={`${part.name}: ${config.name}`}
      >
        <span className="text-[11px] font-extrabold drop-shadow-sm">{config.label}</span>
        {isHovered && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-lg z-20 text-foreground">
            {part.name}: {config.name}
          </span>
        )}
      </button>
    );
  };

  // Build grid manually
  const rows = [
    [null, carParts.find(p => p.id === 'on_tampon'), null],
    [carParts.find(p => p.id === 'sol_on_camurluk'), carParts.find(p => p.id === 'kaput'), carParts.find(p => p.id === 'sag_on_camurluk')],
    [carParts.find(p => p.id === 'sol_on_kapi'), carParts.find(p => p.id === 'tavan'), carParts.find(p => p.id === 'sag_on_kapi')],
    [carParts.find(p => p.id === 'sol_arka_kapi'), null, carParts.find(p => p.id === 'sag_arka_kapi')],
    [carParts.find(p => p.id === 'sol_arka_camurluk'), carParts.find(p => p.id === 'bagaj'), carParts.find(p => p.id === 'sag_arka_camurluk')],
    [null, carParts.find(p => p.id === 'arka_tampon'), null],
  ];

  return (
    <div className="flex flex-col items-center">
      <h4 className="font-bold text-base uppercase tracking-wide mb-4 text-center">Kaporta Ekspertizi</h4>
      
      {/* Car-shaped grid */}
      <div className="relative p-6 rounded-2xl border-2 border-muted-foreground/20 bg-muted/10" style={{ width: '280px' }}>
        {/* Top curve hint */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-24 h-3 rounded-t-full border-t-2 border-x-2 border-muted-foreground/20 bg-background" />
        {/* Bottom curve hint */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-24 h-3 rounded-b-full border-b-2 border-x-2 border-muted-foreground/20 bg-background" />
        {/* Wheels */}
        <div className="absolute left-0 top-[80px] -translate-x-1/2 w-3 h-10 bg-muted-foreground/40 rounded-sm" />
        <div className="absolute right-0 top-[80px] translate-x-1/2 w-3 h-10 bg-muted-foreground/40 rounded-sm" />
        <div className="absolute left-0 bottom-[80px] -translate-x-1/2 w-3 h-10 bg-muted-foreground/40 rounded-sm" />
        <div className="absolute right-0 bottom-[80px] translate-x-1/2 w-3 h-10 bg-muted-foreground/40 rounded-sm" />

        <div className="space-y-1">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-3 gap-1" style={{ minHeight: '48px' }}>
              {row.map((part, colIdx) => {
                if (!part) {
                  // Skip cell if tavan spans here (row 3, col 1)
                  if (rowIdx === 3 && colIdx === 1) return null;
                  return <div key={colIdx} />;
                }
                if (part.id === 'tavan') {
                  return (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => handleClick(part.id)}
                      onMouseEnter={() => setHoveredPart(part.id)}
                      onMouseLeave={() => setHoveredPart(null)}
                      className="flex items-center justify-center font-bold text-xs rounded transition-all duration-150 border-2 relative row-span-2"
                      style={{
                        backgroundColor: statusConfig[getStatus(part.id)].bg,
                        color: statusConfig[getStatus(part.id)].text,
                        borderColor: hoveredPart === part.id ? '#fff' : 'rgba(0,0,0,0.2)',
                        transform: hoveredPart === part.id ? 'scale(1.03)' : 'scale(1)',
                        gridRow: 'span 2',
                        zIndex: hoveredPart === part.id ? 10 : 1,
                      }}
                      data-testid={`diagram-${part.id}`}
                      title={`${part.name}: ${statusConfig[getStatus(part.id)].name}`}
                    >
                      <span className="text-[11px] font-extrabold drop-shadow-sm">{statusConfig[getStatus(part.id)].label}</span>
                      {hoveredPart === part.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-lg z-20 text-foreground">
                          {part.name}: {statusConfig[getStatus(part.id)].name}
                        </span>
                      )}
                    </button>
                  );
                }
                return renderPart(part);
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap justify-center">
        {statusOrder.map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border border-black/20" style={{ backgroundColor: statusConfig[key].bg }} />
            <span className="text-xs font-medium">{statusConfig[key].name}</span>
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

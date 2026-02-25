import React, { useState, useRef } from 'react';
import { FileText, Download, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

// Car body diagram SVG component
const CarBodyDiagram = ({ expertise }) => {
  const getPartColor = (partId) => {
    const status = expertise?.parts?.[partId] || 'orijinal';
    switch (status) {
      case 'orijinal': return '#22c55e'; // green
      case 'boyali': return '#eab308'; // yellow
      case 'lokal': return '#3b82f6'; // blue
      case 'degisen': return '#ef4444'; // red
      default: return '#22c55e';
    }
  };

  const getPartLabel = (partId) => {
    const status = expertise?.parts?.[partId] || 'orijinal';
    switch (status) {
      case 'orijinal': return 'ORJ';
      case 'boyali': return 'BOY';
      case 'lokal': return 'LOK';
      case 'degisen': return 'DEĞ';
      default: return 'ORJ';
    }
  };

  return (
    <svg viewBox="0 0 200 350" className="w-full h-auto max-w-[180px]">
      {/* Car outline */}
      <rect x="40" y="30" width="120" height="290" rx="20" fill="none" stroke="#666" strokeWidth="2" />
      
      {/* Front (Kaput) */}
      <rect x="50" y="40" width="100" height="50" rx="5" fill={getPartColor('kaput')} opacity="0.5" stroke="#666" />
      <text x="100" y="70" textAnchor="middle" fontSize="10" fill="#333">{getPartLabel('kaput')}</text>
      
      {/* Windshield */}
      <rect x="55" y="95" width="90" height="25" rx="3" fill="#87CEEB" opacity="0.5" stroke="#666" />
      
      {/* Roof (Tavan) */}
      <rect x="50" y="125" width="100" height="60" rx="3" fill={getPartColor('tavan')} opacity="0.5" stroke="#666" />
      <text x="100" y="160" textAnchor="middle" fontSize="10" fill="#333">{getPartLabel('tavan')}</text>
      
      {/* Rear windshield */}
      <rect x="55" y="190" width="90" height="25" rx="3" fill="#87CEEB" opacity="0.5" stroke="#666" />
      
      {/* Trunk (Bagaj) */}
      <rect x="50" y="220" width="100" height="50" rx="5" fill={getPartColor('bagaj')} opacity="0.5" stroke="#666" />
      <text x="100" y="250" textAnchor="middle" fontSize="10" fill="#333">{getPartLabel('bagaj')}</text>
      
      {/* Left side panels */}
      <rect x="25" y="50" width="15" height="40" rx="3" fill={getPartColor('sol_on_camurluk')} opacity="0.5" stroke="#666" />
      <text x="32" y="75" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_on_camurluk')}</text>
      
      <rect x="25" y="95" width="15" height="45" rx="3" fill={getPartColor('sol_on_kapi')} opacity="0.5" stroke="#666" />
      <text x="32" y="122" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_on_kapi')}</text>
      
      <rect x="25" y="145" width="15" height="45" rx="3" fill={getPartColor('sol_arka_kapi')} opacity="0.5" stroke="#666" />
      <text x="32" y="172" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_arka_kapi')}</text>
      
      <rect x="25" y="195" width="15" height="55" rx="3" fill={getPartColor('sol_arka_camurluk')} opacity="0.5" stroke="#666" />
      <text x="32" y="227" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_arka_camurluk')}</text>
      
      {/* Right side panels */}
      <rect x="160" y="50" width="15" height="40" rx="3" fill={getPartColor('sag_on_camurluk')} opacity="0.5" stroke="#666" />
      <text x="167" y="75" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_on_camurluk')}</text>
      
      <rect x="160" y="95" width="15" height="45" rx="3" fill={getPartColor('sag_on_kapi')} opacity="0.5" stroke="#666" />
      <text x="167" y="122" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_on_kapi')}</text>
      
      <rect x="160" y="145" width="15" height="45" rx="3" fill={getPartColor('sag_arka_kapi')} opacity="0.5" stroke="#666" />
      <text x="167" y="172" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_arka_kapi')}</text>
      
      <rect x="160" y="195" width="15" height="55" rx="3" fill={getPartColor('sag_arka_camurluk')} opacity="0.5" stroke="#666" />
      <text x="167" y="227" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_arka_camurluk')}</text>
      
      {/* Front bumper */}
      <rect x="45" y="275" width="110" height="20" rx="5" fill={getPartColor('on_tampon')} opacity="0.5" stroke="#666" />
      <text x="100" y="290" textAnchor="middle" fontSize="8" fill="#333">{getPartLabel('on_tampon')}</text>
      
      {/* Rear bumper */}
      <rect x="45" y="5" width="110" height="20" rx="5" fill={getPartColor('arka_tampon')} opacity="0.5" stroke="#666" />
      <text x="100" y="20" textAnchor="middle" fontSize="8" fill="#333">{getPartLabel('arka_tampon')}</text>
    </svg>
  );
};

const PromoCardModal = ({ isOpen, onClose }) => {
  const { user, cars } = useApp();
  const cardRef = useRef(null);
  
  const activeCars = cars.filter(c => !c.deleted && c.status !== 'Satıldı');
  const [selectedCarId, setSelectedCarId] = useState('');
  
  const selectedCar = activeCars.find(c => c.id === selectedCarId);

  const handleDownloadPDF = () => {
    if (!cardRef.current) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Tanıtım Kartı - ${selectedCar?.plate || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
            .card { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0; color: #d4a00a; }
            .car-info { background: #d4a00a; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
            .car-info h2 { margin: 0; font-size: 28px; }
            .car-info .year { font-size: 18px; }
            .car-info .price { text-align: right; }
            .car-info .price-label { font-size: 12px; }
            .car-info .price-value { font-size: 28px; font-weight: bold; }
            .specs { display: flex; justify-content: space-around; padding: 20px; background: #f5f5f5; border-bottom: 1px solid #ddd; }
            .spec { text-align: center; }
            .spec-label { font-size: 10px; color: #666; }
            .spec-value { font-size: 14px; font-weight: bold; }
            .content { display: flex; padding: 20px; }
            .description { flex: 1; padding-right: 20px; }
            .diagram { width: 200px; }
            .mechanical { margin-top: 15px; }
            .mechanical-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
            .contact { background: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          ${cardRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <FileText size={24} className="text-primary" />
            Tanıtım Kartı Oluştur
          </DialogTitle>
          <button
            onClick={handleDownloadPDF}
            disabled={!selectedCar}
            className="px-4 py-2 bg-card border border-border rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            data-testid="download-promo-pdf-btn"
          >
            <Download size={16} />
            PDF İndir
          </button>
        </DialogHeader>

        {/* Car Selector */}
        <div className="py-4 border-b border-border">
          <label className="block text-sm font-medium text-muted-foreground mb-2">ARAÇ SEÇİN</label>
          <select
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            className="w-full h-12 px-4 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary"
            data-testid="promo-car-select"
          >
            <option value="">Araç seçiniz...</option>
            {activeCars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.plate?.toUpperCase()} - {car.brand} {car.model} ({car.year})
              </option>
            ))}
          </select>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto py-4">
          {selectedCar ? (
            <div ref={cardRef} className="bg-white rounded-xl overflow-hidden border border-border shadow-lg max-w-lg mx-auto">
              {/* Header */}
              <div className="bg-[#1a1a1a] text-white py-4 px-6 text-center">
                <h1 className="text-xl font-bold tracking-wider">{user?.company_name || 'ASLANBAŞ OTO A.Ş.'}</h1>
                <p className="text-primary text-sm mt-1">GALERİ SAHİBİ</p>
              </div>

              {/* Car Info */}
              <div className="bg-primary py-5 px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-primary-foreground">{selectedCar.brand?.toUpperCase()}</h2>
                  <p className="text-lg font-medium text-primary-foreground/80">{selectedCar.model?.toUpperCase()} {selectedCar.vehicle_type?.toUpperCase()}</p>
                  <p className="text-primary-foreground/70">{selectedCar.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary-foreground/70 uppercase">Fiyat</p>
                  <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(selectedCar.sale_price)}</p>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-muted/30 border-b border-border text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Kilometre</p>
                  <p className="text-sm font-bold">{selectedCar.km || '0'} KM</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Yakıt</p>
                  <p className="text-sm font-bold">{selectedCar.fuel_type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Vites</p>
                  <p className="text-sm font-bold">{selectedCar.gear}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Kasa Tipi</p>
                  <p className="text-sm font-bold">{selectedCar.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Muayene</p>
                  <p className="text-sm font-bold">{selectedCar.inspection_date ? new Date(selectedCar.inspection_date).toLocaleDateString('tr-TR', { month: '2-digit', year: '2-digit' }) : '-'}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex p-4 gap-4">
                {/* Description & Mechanical */}
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Araç Açıklaması</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedCar.description || 'Araç hakkında detaylı bilgi için lütfen satış temsilcimiz ile iletişime geçiniz. Araçlarımız ekspertiz garantilidir.'}
                  </p>

                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Mekanik Durum</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">MOTOR DURUMU</span>
                      <span className="font-medium">{selectedCar.expertise?.mechanical?.motor || 'Orijinal'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ŞANZIMAN DURUMU</span>
                      <span className="font-medium">{selectedCar.expertise?.mechanical?.sanziman || 'Orijinal'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">YÜRÜYEN DURUMU</span>
                      <span className="font-medium">{selectedCar.expertise?.mechanical?.yuruyen || 'Orijinal'}</span>
                    </div>
                  </div>
                </div>

                {/* Body Diagram */}
                <div className="w-44">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2 text-center">Kaporta Durum Özeti</h3>
                  <CarBodyDiagram expertise={selectedCar.expertise} />
                </div>
              </div>

              {/* Contact */}
              <div className="bg-muted/30 py-4 px-6 text-center border-t border-border">
                <p className="text-xs text-muted-foreground uppercase mb-1">İletişim</p>
                <p className="text-lg font-bold flex items-center justify-center gap-2">
                  <Phone size={18} className="text-primary" />
                  {user?.phone || '05401250404'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Tanıtım kartı oluşturmak için bir araç seçin</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoCardModal;

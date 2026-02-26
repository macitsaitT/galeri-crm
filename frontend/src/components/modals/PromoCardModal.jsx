import React, { useState, useRef } from 'react';
import { FileText, Download, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { fileAPI } from '../../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const CarBodyDiagram = ({ expertise }) => {
  const getPartColor = (partId) => {
    const status = expertise?.parts?.[partId] || 'orijinal';
    switch (status) {
      case 'orijinal': return '#22c55e';
      case 'boyali': return '#eab308';
      case 'lokal': return '#3b82f6';
      case 'degisen': return '#ef4444';
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
      <rect x="40" y="30" width="120" height="290" rx="20" fill="none" stroke="#666" strokeWidth="2" />
      <rect x="50" y="40" width="100" height="50" rx="5" fill={getPartColor('kaput')} opacity="0.5" stroke="#666" />
      <text x="100" y="70" textAnchor="middle" fontSize="10" fill="#333">{getPartLabel('kaput')}</text>
      <rect x="55" y="95" width="90" height="25" rx="3" fill="#87CEEB" opacity="0.5" stroke="#666" />
      <rect x="50" y="125" width="100" height="60" rx="3" fill={getPartColor('tavan')} opacity="0.5" stroke="#666" />
      <text x="100" y="160" textAnchor="middle" fontSize="10" fill="#333">{getPartLabel('tavan')}</text>
      <rect x="55" y="190" width="90" height="25" rx="3" fill="#87CEEB" opacity="0.5" stroke="#666" />
      <rect x="50" y="220" width="100" height="50" rx="5" fill={getPartColor('bagaj')} opacity="0.5" stroke="#666" />
      <text x="100" y="250" textAnchor="middle" fontSize="10" fill="#333">{getPartLabel('bagaj')}</text>
      <rect x="25" y="50" width="15" height="40" rx="3" fill={getPartColor('sol_on_camurluk')} opacity="0.5" stroke="#666" />
      <text x="32" y="75" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_on_camurluk')}</text>
      <rect x="25" y="95" width="15" height="45" rx="3" fill={getPartColor('sol_on_kapi')} opacity="0.5" stroke="#666" />
      <text x="32" y="122" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_on_kapi')}</text>
      <rect x="25" y="145" width="15" height="45" rx="3" fill={getPartColor('sol_arka_kapi')} opacity="0.5" stroke="#666" />
      <text x="32" y="172" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_arka_kapi')}</text>
      <rect x="25" y="195" width="15" height="55" rx="3" fill={getPartColor('sol_arka_camurluk')} opacity="0.5" stroke="#666" />
      <text x="32" y="227" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sol_arka_camurluk')}</text>
      <rect x="160" y="50" width="15" height="40" rx="3" fill={getPartColor('sag_on_camurluk')} opacity="0.5" stroke="#666" />
      <text x="167" y="75" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_on_camurluk')}</text>
      <rect x="160" y="95" width="15" height="45" rx="3" fill={getPartColor('sag_on_kapi')} opacity="0.5" stroke="#666" />
      <text x="167" y="122" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_on_kapi')}</text>
      <rect x="160" y="145" width="15" height="45" rx="3" fill={getPartColor('sag_arka_kapi')} opacity="0.5" stroke="#666" />
      <text x="167" y="172" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_arka_kapi')}</text>
      <rect x="160" y="195" width="15" height="55" rx="3" fill={getPartColor('sag_arka_camurluk')} opacity="0.5" stroke="#666" />
      <text x="167" y="227" textAnchor="middle" fontSize="7" fill="#333">{getPartLabel('sag_arka_camurluk')}</text>
      <rect x="45" y="275" width="110" height="20" rx="5" fill={getPartColor('on_tampon')} opacity="0.5" stroke="#666" />
      <text x="100" y="290" textAnchor="middle" fontSize="8" fill="#333">{getPartLabel('on_tampon')}</text>
      <rect x="45" y="5" width="110" height="20" rx="5" fill={getPartColor('arka_tampon')} opacity="0.5" stroke="#666" />
      <text x="100" y="20" textAnchor="middle" fontSize="8" fill="#333">{getPartLabel('arka_tampon')}</text>
    </svg>
  );
};

const getLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith('http')) return logoPath;
  return fileAPI.getUrl(logoPath);
};

const PromoCardModal = ({ isOpen, onClose }) => {
  const { user, cars } = useApp();
  const cardRef = useRef(null);

  const activeCars = cars.filter(c => !c.deleted && c.status !== 'Satıldı');
  const [selectedCarId, setSelectedCarId] = useState('');
  const selectedCar = activeCars.find(c => c.id === selectedCarId);

  const companyName = user?.company_name || 'ASLANBAŞ OTO A.Ş.';
  const companyPhone = user?.phone || '05401250404';
  const logoPath = user?.logo_url || '';

  const fetchLogoAsDataUrl = () => {
    return new Promise((resolve) => {
      const url = getLogoUrl(logoPath);
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleDownloadPDF = async () => {
    if (!selectedCar) return;
    const logoDataUrl = await fetchLogoAsDataUrl();

    const watermarkCSS = logoDataUrl ? `
      .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.06; z-index: 0; pointer-events: none; }
      .watermark img { width: 350px; height: auto; }
    ` : '';
    const watermarkHTML = logoDataUrl ? `<div class="watermark"><img src="${logoDataUrl}" /></div>` : '';
    const logoImg = logoDataUrl ? `<img src="${logoDataUrl}" style="height:40px;width:auto;margin-left:10px;vertical-align:middle;" />` : '';

    const mechMotor = selectedCar.expertise?.mechanical?.motor || 'Orijinal';
    const mechSanziman = selectedCar.expertise?.mechanical?.sanziman || 'Orijinal';
    const mechYuruyen = selectedCar.expertise?.mechanical?.yuruyen || 'Orijinal';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tanıtım Kartı - ${selectedCar.plate}</title>
  <style>
    @page { margin: 15mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #222; }
    ${watermarkCSS}
    .content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; border: 1.5px solid #ddd; border-radius: 12px; overflow: hidden; }
    .page-header { text-align: center; font-size: 11px; color: #666; padding: 10px 0; display: flex; justify-content: space-between; max-width: 600px; margin: 0 auto 10px; }
    .card-header { background: #1a1a1a; color: white; padding: 18px 24px; text-align: center; }
    .card-header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 10px; }
    .card-header p { margin: 4px 0 0; color: #d4a030; font-size: 12px; letter-spacing: 2px; }
    .car-info { background: #d4a030; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; }
    .car-info h2 { margin: 0; font-size: 26px; font-weight: 800; }
    .car-info .sub { font-size: 16px; margin-top: 2px; }
    .car-info .year { font-size: 14px; color: #333; }
    .car-info .price-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .car-info .price-value { font-size: 26px; font-weight: 800; }
    .specs { display: flex; justify-content: space-around; padding: 14px 20px; background: #f7f7f7; border-bottom: 1px solid #eee; }
    .spec { text-align: center; }
    .spec-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; }
    .spec-value { font-size: 13px; font-weight: 700; }
    .body-section { padding: 20px 24px; }
    .body-section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin: 0 0 8px; }
    .body-section p { font-size: 13px; color: #555; line-height: 1.5; }
    .mech-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    .mech-row .label { color: #888; }
    .mech-row .val { font-weight: 600; }
    .contact { background: #f7f7f7; padding: 14px 24px; text-align: center; border-top: 1px solid #eee; }
    .contact .phone { font-size: 18px; font-weight: 700; }
  </style>
</head>
<body>
  ${watermarkHTML}
  <div class="page-header">
    <span>${new Date().toLocaleDateString('tr-TR')}</span>
    <span style="font-weight:600;">Tanıtım Kartı - ${companyName}</span>
    <span></span>
  </div>
  <div class="content">
    <div class="card-header">
      <h1>${companyName} ${logoImg}</h1>
      <p>GALERİ SAHİBİ</p>
    </div>
    <div class="car-info">
      <div>
        <h2>${selectedCar.brand?.toUpperCase()}</h2>
        <div class="sub">${selectedCar.model?.toUpperCase()} ${selectedCar.vehicle_type?.toUpperCase() || ''}</div>
        <div class="year">${selectedCar.year}</div>
      </div>
      <div style="text-align:right">
        <div class="price-label">Fiyat</div>
        <div class="price-value">${formatCurrency(selectedCar.sale_price)}</div>
      </div>
    </div>
    <div class="specs">
      <div class="spec"><div class="spec-label">Kilometre</div><div class="spec-value">${selectedCar.km || '0'} KM</div></div>
      <div class="spec"><div class="spec-label">Yakıt</div><div class="spec-value">${selectedCar.fuel_type}</div></div>
      <div class="spec"><div class="spec-label">Vites</div><div class="spec-value">${selectedCar.gear}</div></div>
      <div class="spec"><div class="spec-label">Kasa Tipi</div><div class="spec-value">${selectedCar.vehicle_type}</div></div>
      <div class="spec"><div class="spec-label">Muayene</div><div class="spec-value">${selectedCar.inspection_date ? new Date(selectedCar.inspection_date).toLocaleDateString('tr-TR', {month:'2-digit',year:'2-digit'}) : '-'}</div></div>
    </div>
    <div class="body-section">
      <h3>Araç Açıklaması</h3>
      <p>${selectedCar.description || 'Araç hakkında detaylı bilgi için lütfen satış temsilcimiz ile iletişime geçiniz.'}</p>
      <h3 style="margin-top:16px">Mekanik Durum</h3>
      <div class="mech-row"><span class="label">Motor Durumu</span><span class="val">${mechMotor}</span></div>
      <div class="mech-row"><span class="label">Şanzıman Durumu</span><span class="val">${mechSanziman}</span></div>
      <div class="mech-row"><span class="label">Yürüyen Durumu</span><span class="val">${mechYuruyen}</span></div>
    </div>
    <div class="contact">
      <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">İletişim</div>
      <div class="phone">${companyPhone}</div>
    </div>
  </div>
</body>
</html>`);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-row items-center justify-between pr-10">
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

        <div className="flex-1 overflow-y-auto py-4">
          {selectedCar ? (
            <div ref={cardRef} className="bg-white rounded-xl overflow-hidden border border-border shadow-lg max-w-lg mx-auto">
              <div className="bg-[#1a1a1a] text-white py-4 px-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <h1 className="text-xl font-bold tracking-wider">{companyName}</h1>
                  {logoPath && <img src={getLogoUrl(logoPath)} alt="Logo" className="h-8 w-auto object-contain" crossOrigin="anonymous" />}
                </div>
                <p className="text-primary text-sm mt-1">GALERİ SAHİBİ</p>
              </div>
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
              <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-muted/30 border-b border-border text-center">
                <div><p className="text-[10px] text-muted-foreground uppercase">Kilometre</p><p className="text-sm font-bold">{selectedCar.km || '0'} KM</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase">Yakıt</p><p className="text-sm font-bold">{selectedCar.fuel_type}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase">Vites</p><p className="text-sm font-bold">{selectedCar.gear}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase">Kasa Tipi</p><p className="text-sm font-bold">{selectedCar.vehicle_type}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase">Muayene</p><p className="text-sm font-bold">{selectedCar.inspection_date ? new Date(selectedCar.inspection_date).toLocaleDateString('tr-TR', {month:'2-digit',year:'2-digit'}) : '-'}</p></div>
              </div>
              <div className="flex p-4 gap-4">
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Araç Açıklaması</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedCar.description || 'Araç hakkında detaylı bilgi için lütfen satış temsilcimiz ile iletişime geçiniz.'}</p>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Mekanik Durum</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">MOTOR DURUMU</span><span className="font-medium">{selectedCar.expertise?.mechanical?.motor || 'Orijinal'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">ŞANZIMAN DURUMU</span><span className="font-medium">{selectedCar.expertise?.mechanical?.sanziman || 'Orijinal'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">YÜRÜYEN DURUMU</span><span className="font-medium">{selectedCar.expertise?.mechanical?.yuruyen || 'Orijinal'}</span></div>
                  </div>
                </div>
                <div className="w-44">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2 text-center">Kaporta Durum Özeti</h3>
                  <CarBodyDiagram expertise={selectedCar.expertise} />
                </div>
              </div>
              <div className="bg-muted/30 py-4 px-6 text-center border-t border-border">
                <p className="text-xs text-muted-foreground uppercase mb-1">İletişim</p>
                <p className="text-lg font-bold flex items-center justify-center gap-2"><Phone size={18} className="text-primary" />{companyPhone}</p>
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

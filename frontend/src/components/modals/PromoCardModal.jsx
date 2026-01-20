import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  Phone
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { ExpertiseVisualMap } from './AddCarModal';
import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  Phone
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { ExpertiseVisualMap } from './AddCarModal';

export default function PromoCardModal({ 
  isOpen, 
  onClose, 
  inventory, 
  userProfile,
  showToast 
}) {
  const [selectedCarId, setSelectedCarId] = useState('');
  const cardRef = useRef(null);

  const selectedCar = inventory.find(c => c.id === selectedCarId);
  const availableCars = inventory.filter(c => !c.deleted && c.status !== 'Satıldı');

  const getFileName = () => {
    if (!selectedCar) return 'tanitim_karti';
    const plate = selectedCar.plate?.replace(/\s/g, '_') || 'arac';
    return `Tanitim_Karti_${plate}_${selectedCar.brand}_${selectedCar.model}`;
  };

  const handleDownloadPDF = async () => {
    if (!selectedCar) {
      showToast('Lütfen bir araç seçin.', 'error');
      return;
    }

    if (typeof window.html2pdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => generatePDF();
      document.head.appendChild(script);
    } else {
      generatePDF();
    }
  };

  const generatePDF = () => {
    const element = cardRef.current;
    const opt = {
      margin: 5,
      filename: `${getFileName()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(element).save();
    showToast('PDF oluşturuldu!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-100 flex justify-between items-center bg-neutral-900">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileText size={18}/> Tanıtım Kartı Oluştur
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="bg-amber-500 text-black px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1"
            >
              <Download size={14}/> PDF İndir
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-white ml-2">
              <X size={20}/>
            </button>
          </div>
        </div>
        
        {/* Car Selector */}
        <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Araç Seçin</label>
          <select
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
            className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          >
            <option value="">-- Araç Seçiniz --</option>
            {availableCars.map(car => (
              <option key={car.id} value={car.id}>
                {car.plate?.toLocaleUpperCase('tr-TR')} - {car.brand} {car.model} ({car.year})
              </option>
            ))}
          </select>
        </div>
        
        {/* Card Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-100">
          {selectedCar ? (
            <div 
              ref={cardRef}
              className="bg-white shadow-xl overflow-hidden max-w-xl mx-auto"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {/* Header - Black */}
              <div className="bg-black text-white py-4 px-6 text-center">
                <h1 className="text-xl font-black tracking-wide">
                  {userProfile?.name?.toLocaleUpperCase('tr-TR') || 'GALERİ ADI'}
                </h1>
                <p className="text-[10px] text-amber-400 tracking-widest mt-1">
                  {userProfile?.title?.toLocaleUpperCase('tr-TR') || 'GÜVENİLİR 2. EL ARAÇ MERKEZİ'}
                </p>
              </div>
              
              {/* Car Info - Yellow Band */}
              <div className="bg-amber-400 py-4 px-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-black leading-tight">
                    {selectedCar.brand?.toLocaleUpperCase('tr-TR')}
                  </h2>
                  <p className="text-lg font-bold text-black">
                    {selectedCar.model?.toLocaleUpperCase('tr-TR')}
                  </p>
                  <p className="text-sm font-bold text-black">{selectedCar.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-black/70 font-bold">FİYAT</p>
                  <p className="text-2xl font-black text-black">₺{Number(selectedCar.salePrice).toLocaleString('tr-TR')}</p>
                </div>
              </div>
              
              {/* Specs Row */}
              <div className="grid grid-cols-5 border-b border-neutral-200">
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Kilometre</p>
                  <p className="text-sm font-black">{selectedCar.km || '0'} KM</p>
                </div>
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Yakıt</p>
                  <p className="text-sm font-black">{selectedCar.fuelType || 'Benzin'}</p>
                </div>
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Vites</p>
                  <p className="text-sm font-black">{selectedCar.gear || 'Manuel'}</p>
                </div>
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Kasa Tipi</p>
                  <p className="text-sm font-black">{selectedCar.bodyType || 'Sedan'}</p>
                </div>
                <div className="py-3 px-2 text-center">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Muayene</p>
                  <p className="text-sm font-black">{selectedCar.inspectionDate || '-'}</p>
                </div>
              </div>
              
              {/* Tramer Info - if exists */}
              {selectedCar.tramerAmount && parseInt(selectedCar.tramerAmount.toString().replace(/\./g, '')) > 0 && (
                <div className="bg-orange-50 py-2 px-6 border-b border-orange-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-orange-700">TRAMER KAYDI</span>
                    <span className="text-sm font-black text-orange-600">₺{Number(selectedCar.tramerAmount.toString().replace(/\./g, '')).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              )}
              
              {/* Two Column Section */}
              <div className="grid grid-cols-2 border-b border-neutral-200">
                {/* Left - Description & Mechanical */}
                <div className="border-r border-neutral-200 p-4">
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-[9px] text-neutral-500 font-bold uppercase mb-2 border-b border-neutral-200 pb-1">
                      Araç Açıklaması
                    </p>
                    <p className="text-[10px] text-neutral-600 leading-relaxed">
                      {selectedCar.description || 'Araç hakkında detaylı bilgi için lütfen satış temsilcimiz ile iletişime geçiniz. Araçlarımız ekspertiz garantilidir.'}
                    </p>
                  </div>
                  
                  {/* Mechanical Status */}
                  <div>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase mb-2 border-b border-neutral-200 pb-1">
                      Mekanik Durum
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                        <span className="text-[10px] text-neutral-600">MOTOR DURUMU</span>
                        <span className="text-[10px] font-bold">{selectedCar.expertise?.mechanical?.motor || 'Orijinal'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                        <span className="text-[10px] text-neutral-600">ŞANZIMAN DURUMU</span>
                        <span className="text-[10px] font-bold">{selectedCar.expertise?.mechanical?.transmission || 'Orijinal'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-[10px] text-neutral-600">YÜRÜYEN DURUMU</span>
                        <span className="text-[10px] font-bold">{selectedCar.expertise?.mechanical?.suspension || 'Orijinal'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right - Expertise Map */}
                <div className="p-4">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mb-2 border-b border-neutral-200 pb-1">
                    Kaporta Durum Özeti
                  </p>
                  <div className="flex justify-center items-center">
                    {selectedCar.expertise?.body && Object.keys(selectedCar.expertise.body).some(key => selectedCar.expertise.body[key] !== 'original') ? (
                      <div className="transform scale-[0.65] origin-top">
                        <ExpertiseVisualMap value={selectedCar.expertise.body} readonly={true} />
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <div className="transform scale-[0.65] origin-top">
                          <ExpertiseVisualMap value={{}} readonly={true} />
                        </div>
                        <p className="text-green-600 font-bold text-xs mt-2">✓ TAMAMI ORİJİNAL</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer - Contact */}
              <div className="py-4 px-6 text-center border-t border-neutral-200">
                <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">İletişim</p>
                <p className="text-base font-black flex items-center justify-center gap-2">
                  <Phone size={14} className="text-amber-500"/>
                  {userProfile?.phone || '0555 555 55 55'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
              <FileText size={40} className="mb-3"/>
              <p className="font-bold text-sm">Tanıtım kartı önizlemesi için araç seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PromoCardModal({ 
  isOpen, 
  onClose, 
  inventory, 
  userProfile,
  showToast 
}) {
  const [selectedCarId, setSelectedCarId] = useState('');
  const cardRef = useRef(null);

  const selectedCar = inventory.find(c => c.id === selectedCarId);
  const availableCars = inventory.filter(c => !c.deleted && c.status !== 'Satıldı');

  const getFileName = () => {
    if (!selectedCar) return 'tanitim_karti';
    const plate = selectedCar.plate?.replace(/\s/g, '_') || 'arac';
    return `Tanitim_Karti_${plate}_${selectedCar.brand}_${selectedCar.model}`;
  };

  const handleDownloadPDF = async () => {
    if (!selectedCar) {
      showToast('Lütfen bir araç seçin.', 'error');
      return;
    }

    if (typeof window.html2pdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => generatePDF();
      document.head.appendChild(script);
    } else {
      generatePDF();
    }
  };

  const generatePDF = () => {
    const element = cardRef.current;
    const opt = {
      margin: 5,
      filename: `${getFileName()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(element).save();
    showToast('PDF oluşturuldu!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-100 flex justify-between items-center bg-neutral-900">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileText size={18}/> Tanıtım Kartı Oluştur
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="bg-amber-500 text-black px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1"
            >
              <Download size={14}/> PDF İndir
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-white ml-2">
              <X size={20}/>
            </button>
          </div>
        </div>
        
        {/* Car Selector */}
        <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Araç Seçin</label>
          <select
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
            className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          >
            <option value="">-- Araç Seçiniz --</option>
            {availableCars.map(car => (
              <option key={car.id} value={car.id}>
                {car.plate?.toLocaleUpperCase('tr-TR')} - {car.brand} {car.model} ({car.year})
              </option>
            ))}
          </select>
        </div>
        
        {/* Card Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-100">
          {selectedCar ? (
            <div 
              ref={cardRef}
              className="bg-white shadow-xl overflow-hidden max-w-xl mx-auto"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {/* Header - Black */}
              <div className="bg-black text-white py-4 px-6 text-center">
                <h1 className="text-xl font-black tracking-wide">
                  {userProfile?.name?.toLocaleUpperCase('tr-TR') || 'GALERİ ADI'}
                </h1>
                <p className="text-[10px] text-amber-400 tracking-widest mt-1">
                  {userProfile?.title?.toLocaleUpperCase('tr-TR') || 'GÜVENİLİR 2. EL ARAÇ MERKEZİ'}
                </p>
              </div>
              
              {/* Car Info - Yellow Band */}
              <div className="bg-amber-400 py-4 px-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-black leading-tight">
                    {selectedCar.brand?.toLocaleUpperCase('tr-TR')}
                  </h2>
                  <p className="text-lg font-bold text-black">
                    {selectedCar.model?.toLocaleUpperCase('tr-TR')}
                  </p>
                  <p className="text-sm font-bold text-black">{selectedCar.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-black/70 font-bold">FİYAT</p>
                  <p className="text-2xl font-black text-black">₺{Number(selectedCar.salePrice).toLocaleString('tr-TR')}</p>
                </div>
              </div>
              
              {/* Specs Row */}
              <div className="grid grid-cols-5 border-b border-neutral-200">
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Kilometre</p>
                  <p className="text-sm font-black">{selectedCar.km || '0'} KM</p>
                </div>
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Yakıt</p>
                  <p className="text-sm font-black">{selectedCar.fuelType || 'Benzin'}</p>
                </div>
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Vites</p>
                  <p className="text-sm font-black">{selectedCar.gear || 'Manuel'}</p>
                </div>
                <div className="py-3 px-2 text-center border-r border-neutral-200">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Kasa Tipi</p>
                  <p className="text-sm font-black">{selectedCar.bodyType || 'Sedan'}</p>
                </div>
                <div className="py-3 px-2 text-center">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Muayene</p>
                  <p className="text-sm font-black">{selectedCar.inspectionDate || '-'}</p>
                </div>
              </div>
              
              {/* Two Column Section */}
              <div className="grid grid-cols-2 border-b border-neutral-200">
                {/* Left - Description & Mechanical */}
                <div className="border-r border-neutral-200 p-4">
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-[9px] text-neutral-500 font-bold uppercase mb-2 border-b border-neutral-200 pb-1">
                      Araç Açıklaması
                    </p>
                    <p className="text-[10px] text-neutral-600 leading-relaxed">
                      {selectedCar.description || 'Araç hakkında detaylı bilgi için lütfen satış temsilcimiz ile iletişime geçiniz. Araçlarımız ekspertiz garantilidir.'}
                    </p>
                  </div>
                  
                  {/* Mechanical Status */}
                  <div>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase mb-2 border-b border-neutral-200 pb-1">
                      Mekanik Durum
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                        <span className="text-[10px] text-neutral-600">MOTOR DURUMU</span>
                        <span className="text-[10px] font-bold">{selectedCar.expertise?.mechanical?.motor || 'Orijinal'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                        <span className="text-[10px] text-neutral-600">ŞANZIMAN DURUMU</span>
                        <span className="text-[10px] font-bold">{selectedCar.expertise?.mechanical?.transmission || 'Orijinal'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-[10px] text-neutral-600">YÜRÜYEN DURUMU</span>
                        <span className="text-[10px] font-bold">{selectedCar.expertise?.mechanical?.suspension || 'Orijinal'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right - Expertise Map */}
                <div className="p-4">
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mb-2 border-b border-neutral-200 pb-1">
                    Kaporta Durum Özeti
                  </p>
                  <div className="flex justify-center items-center">
                    {selectedCar.expertise?.body && Object.keys(selectedCar.expertise.body).some(key => selectedCar.expertise.body[key] !== 'original') ? (
                      <div className="transform scale-[0.65] origin-top">
                        <ExpertiseVisualMap value={selectedCar.expertise.body} readonly={true} />
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <div className="transform scale-[0.65] origin-top">
                          <ExpertiseVisualMap value={{}} readonly={true} />
                        </div>
                        <p className="text-green-600 font-bold text-xs mt-2">✓ TAMAMI ORİJİNAL</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer - Contact */}
              <div className="py-4 px-6 text-center border-t border-neutral-200">
                <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">İletişim</p>
                <p className="text-base font-black flex items-center justify-center gap-2">
                  <Phone size={14} className="text-amber-500"/>
                  {userProfile?.phone || '0555 555 55 55'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
              <FileText size={40} className="mb-3"/>
              <p className="font-bold text-sm">Tanıtım kartı önizlemesi için araç seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

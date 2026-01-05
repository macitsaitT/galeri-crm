import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  Phone,
  Car,
  Fuel,
  Settings,
  Calendar,
  ClipboardCheck
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
              className="bg-white rounded-xl shadow-xl overflow-hidden max-w-xl mx-auto"
            >
              {/* Header */}
              <div className="bg-black text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {userProfile?.logo && (
                      <img 
                        src={userProfile.logo} 
                        alt="Logo" 
                        className="h-10 w-auto object-contain bg-white rounded p-0.5" 
                      />
                    )}
                    <div>
                      <h1 className="text-base font-black">
                        {userProfile?.name?.toLocaleUpperCase('tr-TR') || 'GALERİ ADI'}
                      </h1>
                      <p className="text-[10px] text-neutral-400">{userProfile?.title || 'Oto Galeri'}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px]">
                    <p className="flex items-center gap-1 justify-end">
                      <Phone size={10}/> {userProfile?.phone || '0555 555 55 55'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Price Badge - moved to top */}
              <div className="bg-amber-500 text-black px-4 py-2 text-center">
                <p className="text-xl font-black">{formatCurrency(selectedCar.salePrice)}</p>
              </div>
              
              {/* Car Info */}
              <div className="p-4">
                <h2 className="text-xl font-black text-black mb-0.5">
                  {selectedCar.brand} {selectedCar.model}
                </h2>
                <p className="text-neutral-500 text-xs mb-3">
                  {selectedCar.plate?.toLocaleUpperCase('tr-TR')} • {selectedCar.packageInfo || 'Standart'}
                </p>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded">
                    <Calendar size={14} className="text-neutral-400"/>
                    <div>
                      <p className="text-[8px] text-neutral-400 uppercase">Yıl</p>
                      <p className="font-bold text-xs">{selectedCar.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded">
                    <Car size={14} className="text-neutral-400"/>
                    <div>
                      <p className="text-[8px] text-neutral-400 uppercase">KM</p>
                      <p className="font-bold text-xs">{selectedCar.km || '0'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded">
                    <Fuel size={14} className="text-neutral-400"/>
                    <div>
                      <p className="text-[8px] text-neutral-400 uppercase">Yakıt</p>
                      <p className="font-bold text-xs">{selectedCar.fuelType || 'Dizel'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded">
                    <Settings size={14} className="text-neutral-400"/>
                    <div>
                      <p className="text-[8px] text-neutral-400 uppercase">Vites</p>
                      <p className="font-bold text-xs">{selectedCar.gear || 'Otomatik'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Expertise Section */}
                {selectedCar.expertise && (
                  <div className="mb-3 border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="bg-neutral-100 px-3 py-1.5 flex items-center gap-2">
                      <ClipboardCheck size={14} className="text-green-600"/>
                      <span className="font-bold text-xs">Ekspertiz Raporu</span>
                      {selectedCar.expertise.score && (
                        <span className="ml-auto bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          Puan: {selectedCar.expertise.score}/100
                        </span>
                      )}
                    </div>
                    {/* Expertise Visual Map */}
                    {selectedCar.expertise.body && Object.keys(selectedCar.expertise.body).length > 0 && (
                      <div className="p-3 flex justify-center bg-white">
                        <div className="transform scale-75 origin-top">
                          <ExpertiseVisualMap value={selectedCar.expertise.body} readonly={true} />
                        </div>
                      </div>
                    )}
                    {/* Expertise Notes */}
                    {selectedCar.expertise.notes && (
                      <div className="px-3 pb-2 text-[10px] text-neutral-600">
                        <span className="font-bold">Not:</span> {selectedCar.expertise.notes}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Description */}
                {selectedCar.description && (
                  <div className="bg-neutral-50 p-3 rounded-lg mb-3">
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {selectedCar.description}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="bg-neutral-100 p-3 border-t border-neutral-200">
                <div className="flex items-center justify-center gap-2">
                  {userProfile?.logo && (
                    <img 
                      src={userProfile.logo} 
                      alt="Logo" 
                      className="h-6 w-auto object-contain opacity-50" 
                    />
                  )}
                  <p className="text-[10px] text-neutral-500">
                    {userProfile?.name || 'Galeri Adı'} • {userProfile?.phone || '0555 555 55 55'}
                  </p>
                </div>
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

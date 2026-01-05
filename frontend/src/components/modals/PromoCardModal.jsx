import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  Camera,
  Phone,
  MapPin,
  Car,
  Fuel,
  Settings,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

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

  const handlePrint = () => {
    if (!selectedCar) {
      showToast('Lütfen bir araç seçin.', 'error');
      return;
    }
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!selectedCar) {
      showToast('Lütfen bir araç seçin.', 'error');
      return;
    }

    // Using html2pdf.js via CDN
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
      margin: 10,
      filename: `${selectedCar.brand}_${selectedCar.model}_${selectedCar.plate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
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
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-lg text-black flex items-center gap-2">
            <FileText size={20} className="text-blue-600"/> Tanıtım Kartı Oluştur
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Download size={16}/> PDF İndir
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-black">
              <X size={24}/>
            </button>
          </div>
        </div>
        
        {/* Car Selector */}
        <div className="px-6 py-4 border-b border-neutral-100">
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Araç Seçin</label>
          <select
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
            className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          >
            <option value="">-- Araç Seçiniz --</option>
            {availableCars.map(car => (
              <option key={car.id} value={car.id}>
                {car.brand} {car.model} - {car.plate?.toLocaleUpperCase('tr-TR')} ({car.year})
              </option>
            ))}
          </select>
        </div>
        
        {/* Card Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-100">
          {selectedCar ? (
            <div 
              ref={cardRef}
              className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Logo & Header */}
              <div className="bg-black text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    {userProfile.logo ? (
                      <img src={userProfile.logo} alt="Logo" className="h-12 object-contain" />
                    ) : (
                      <h1 className="text-2xl font-black">ASLANBAŞ OTO</h1>
                    )}
                    <p className="text-xs text-neutral-400 mt-1">YÖNETİM PANELİ</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="flex items-center gap-1 justify-end">
                      <Phone size={12}/> {userProfile.phone || '0555 555 55 55'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Car Image */}
              <div className="aspect-video bg-neutral-100 relative">
                {selectedCar.photos && selectedCar.photos.length > 0 ? (
                  <img 
                    src={selectedCar.photos[0]} 
                    alt="Car" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <Camera size={64}/>
                  </div>
                )}
                {/* Price Badge */}
                <div className="absolute bottom-4 right-4 bg-amber-500 text-black px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-2xl font-black">{formatCurrency(selectedCar.salePrice)}</p>
                </div>
              </div>
              
              {/* Car Info */}
              <div className="p-6">
                <h2 className="text-2xl font-black text-black mb-1">
                  {selectedCar.brand} {selectedCar.model}
                </h2>
                <p className="text-neutral-500 text-sm mb-4">
                  {selectedCar.plate?.toLocaleUpperCase('tr-TR')} • {selectedCar.packageInfo || 'Standart'}
                </p>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg">
                    <Calendar size={18} className="text-neutral-400"/>
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase">Model Yılı</p>
                      <p className="font-bold">{selectedCar.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg">
                    <Car size={18} className="text-neutral-400"/>
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase">Kilometre</p>
                      <p className="font-bold">{selectedCar.km || '0'} KM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg">
                    <Fuel size={18} className="text-neutral-400"/>
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase">Yakıt</p>
                      <p className="font-bold">{selectedCar.fuelType || 'Dizel'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg">
                    <Settings size={18} className="text-neutral-400"/>
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase">Vites</p>
                      <p className="font-bold">{selectedCar.gear || 'Otomatik'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                {selectedCar.description && (
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {selectedCar.description}
                    </p>
                  </div>
                )}
                
                {/* Expertise Score */}
                {selectedCar.expertise?.score && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                      Ekspertiz Puanı: {selectedCar.expertise.score}/100
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="bg-neutral-50 p-4 border-t border-neutral-200 text-center">
                <p className="text-xs text-neutral-500">
                  {userProfile.name || 'Galeri Adı'} • {userProfile.phone || '0555 555 55 55'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
              <FileText size={48} className="mb-4"/>
              <p className="font-bold">Tanıtım kartı önizlemesi için araç seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

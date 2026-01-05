import React from 'react';
import {
  X,
  Car,
  Download,
  Camera
} from 'lucide-react';
import { formatCurrency, formatDate, getMechanicalStatusColors } from '../../utils/helpers';
import { ExpertiseVisualMap } from './AddCarModal';

export default function CarDetailModal({ car, isOpen, onClose, showToast }) {
  if (!isOpen || !car) return null;

  const MechanicalStatusPill = ({ title, status }) => {
    const { bg, text, border } = getMechanicalStatusColors(status);
    return (
      <div className={`p-2 rounded-lg ${bg} ${text} font-bold border ${border} flex justify-between items-center text-xs`}>
        <span className="uppercase text-neutral-600 text-[9px]">{title}</span>
        <span className="text-sm font-black">{status}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex justify-between items-start bg-neutral-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                car.ownership === 'consignment' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {car.ownership === 'consignment' ? 'Konsinye' : 'Stok'}
              </span>
              <span className="text-neutral-400 text-xs">{formatDate(car.entryDate)}</span>
            </div>
            <h2 className="text-2xl font-bold text-black">{car.brand} {car.model}</h2>
            <p className="text-neutral-500">{car.year} • {car.km} KM • {car.plate?.toLocaleUpperCase('tr-TR')}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="bg-neutral-100 p-2 rounded-lg hover:bg-neutral-200"
            >
              <X size={20}/>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol: Fotoğraflar */}
            <div className="space-y-4">
              <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-neutral-200">
                {car.photos && car.photos.length > 0 ? (
                  <img src={car.photos[0]} alt="Car Main" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-neutral-300 flex flex-col items-center">
                    <Camera size={48}/>
                    <span className="text-sm font-bold mt-2">Görsel Yok</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {car.photos?.slice(1, 5).map((src, i) => (
                  <div key={i} className="aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                    <img src={src} alt="Car Thumb" className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sağ: Detaylar */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Marka / Model</p>
                  <p className="font-bold">{car.brand} {car.model}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Yıl / KM</p>
                  <p className="font-bold">{car.year} / {car.km}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Motor</p>
                  <p className="font-bold">{car.engineType || '-'}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Yakıt</p>
                  <p className="font-bold">{car.fuelType || 'Dizel'}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Vites</p>
                  <p className="font-bold">{car.gear || 'Otomatik'}</p>
                </div>
                {car.packageInfo && (
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Paket</p>
                    <p className="font-bold">{car.packageInfo}</p>
                  </div>
                )}
              </div>
              
              {/* Fiyat */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">Satış Fiyatı</p>
                <p className="text-3xl font-black text-amber-700">{formatCurrency(car.salePrice)}</p>
              </div>
              
              {/* Açıklama */}
              <div className="border-t border-neutral-100 pt-4">
                <p className="text-[10px] text-neutral-400 font-bold uppercase mb-2">Açıklama</p>
                <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  {car.description || 'Açıklama girilmemiş.'}
                </p>
              </div>
              
              {/* Ekspertiz */}
              {car.expertise?.body && (
                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase mb-2">Ekspertiz Özeti</p>
                  <div className="flex gap-2 text-xs mb-4">
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-bold border border-green-200">
                      Motor: {car.expertise?.Motor || '-'}
                    </span>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold border border-blue-200">
                      Şanzıman: {car.expertise?.['Şanzıman'] || '-'}
                    </span>
                    <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 font-bold border border-orange-200">
                      Puan: {car.expertise?.score || '-'}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <ExpertiseVisualMap value={car.expertise.body} readonly={true} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

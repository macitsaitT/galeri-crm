import React from 'react';
import {
  X,
  CheckCircle
} from 'lucide-react';
import { formatNumberInput, parseFormattedNumber, formatCurrency } from '../../utils/helpers';

export default function SaleModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  price, 
  setPrice, 
  employeeShare, 
  setEmployeeShare, 
  car, 
  customers, 
  selectedCustomerId, 
  setSelectedCustomerId 
}) {
  if (!isOpen) return null;
  
  const isConsignment = car?.ownership === 'consignment';
  const salePrice = parseFormattedNumber(price) || 0;
  const ownerAmount = car?.purchasePrice || 0;
  const employeeAmount = parseFormattedNumber(employeeShare) || 0;
  const galleryProfit = isConsignment 
    ? (salePrice - ownerAmount - employeeAmount) 
    : (salePrice - (car?.purchasePrice || 0) - employeeAmount);
  const activeCustomers = customers?.filter(c => !c.deleted) || [];
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 bg-green-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
            <CheckCircle size={20}/> Satışı Tamamla
          </h3>
          <button onClick={onClose}>
            <X size={20}/>
          </button>
        </div>
        <form onSubmit={onConfirm} className="p-6 space-y-4">
          {/* Müşteri Seçimi */}
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Alıcı Müşteri</label>
            <select
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">-- Müşteri Seç (Opsiyonel) --</option>
              {activeCustomers.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
              ))}
            </select>
            <p className="text-xs text-neutral-400 mt-1">Aracı satın alan müşteriyi seçin</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Gerçekleşen Satış Fiyatı (TL)</label>
            <input
              autoFocus
              type="text"
              inputMode='numeric'
              className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none text-xl font-bold text-green-700"
              value={price}
              onChange={(e) => setPrice(formatNumberInput(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Çalışan Payı (TL)</label>
            <input
              type="text"
              inputMode='numeric'
              className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:border-amber-500 focus:ring-0 outline-none text-lg font-bold text-amber-700"
              value={employeeShare}
              onChange={(e) => setEmployeeShare(formatNumberInput(e.target.value))}
              placeholder="0"
            />
            <p className="text-xs text-neutral-400 mt-1">Satışı yapan çalışana verilecek pay</p>
          </div>
          
          {/* Özet Hesaplama */}
          <div className="bg-neutral-50 rounded-xl p-4 space-y-2 border border-neutral-200">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Satış Fiyatı:</span>
              <span className="font-bold">{formatCurrency(salePrice)}</span>
            </div>
            {isConsignment && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Araç Sahibine:</span>
                <span className="font-bold text-purple-600">-{formatCurrency(ownerAmount)}</span>
              </div>
            )}
            {!isConsignment && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Araç Maliyeti:</span>
                <span className="font-bold text-red-600">-{formatCurrency(car?.purchasePrice || 0)}</span>
              </div>
            )}
            {employeeAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Çalışan Payı:</span>
                <span className="font-bold text-amber-600">-{formatCurrency(employeeAmount)}</span>
              </div>
            )}
            <div className="border-t border-neutral-300 pt-2 flex justify-between">
              <span className="font-bold text-neutral-700">Kasaya Kalan:</span>
              <span className={`font-bold text-lg ${galleryProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(galleryProfit)}
              </span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg"
          >
            Satışı Onayla & Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}

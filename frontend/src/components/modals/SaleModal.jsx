import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  UserPlus,
  Calendar
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
  setSelectedCustomerId,
  onAddCustomer,
  saleDate,
  setSaleDate
}) {
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  
  if (!isOpen) return null;
  
  const isConsignment = car?.ownership === 'consignment';
  const salePrice = parseFormattedNumber(price) || 0;
  const ownerAmount = car?.purchasePrice || 0;
  const employeeAmount = parseFormattedNumber(employeeShare) || 0;
  const galleryProfit = isConsignment 
    ? (salePrice - ownerAmount - employeeAmount) 
    : (salePrice - (car?.purchasePrice || 0) - employeeAmount);
  const activeCustomers = customers?.filter(c => !c.deleted) || [];

  const handleAddNewCustomer = async () => {
    if (!newCustomerName.trim()) return;
    
    const newCustomer = {
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      type: 'Alıcı',
      notes: `${car?.plate || ''} ${car?.brand || ''} ${car?.model || ''} satışı`
    };
    
    if (onAddCustomer) {
      const newId = await onAddCustomer(newCustomer);
      if (newId) {
        setSelectedCustomerId(newId);
        setShowNewCustomer(false);
        setNewCustomerName('');
        setNewCustomerPhone('');
      }
    }
  };
  
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
            
            {!showNewCustomer ? (
              <>
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
                <button
                  type="button"
                  onClick={() => setShowNewCustomer(true)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <UserPlus size={14}/> Yeni Müşteri Ekle
                </button>
              </>
            ) : (
              <div className="space-y-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <input
                  type="text"
                  placeholder="Müşteri Adı *"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Telefon (Opsiyonel)"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddNewCustomer}
                    disabled={!newCustomerName.trim()}
                    className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
                  >
                    Müşteri Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCustomer(false);
                      setNewCustomerName('');
                      setNewCustomerPhone('');
                    }}
                    className="px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
            <p className="text-xs text-neutral-400 mt-1">Aracı satın alan müşteriyi seçin</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1 flex items-center gap-1">
              <Calendar size={14}/> Satış Tarihi
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-0 outline-none text-sm font-medium"
              value={saleDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setSaleDate(e.target.value)}
            />
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

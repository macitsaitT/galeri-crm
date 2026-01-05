import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Users,
  Phone,
  Car
} from 'lucide-react';
import { handlePhoneInput } from '../../utils/helpers';

export default function AddCustomerModal({ 
  isOpen, 
  onClose, 
  newCustomer, 
  setNewCustomer, 
  onSave, 
  inventory, 
  isEditing 
}) {
  if (!isOpen) return null;
  
  const availableCars = inventory?.filter(c => !c.deleted && c.status !== 'Satıldı') || [];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-lg text-black flex items-center gap-2">
            <Users size={20} className={isEditing ? 'text-amber-500' : 'text-blue-500'}/> 
            {isEditing ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Ad Soyad</label>
            <input 
              required 
              type="text" 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
              value={newCustomer.name} 
              onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} 
              placeholder="Örn: Ali Veli" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Telefon</label>
            <input 
              required 
              type="tel" 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
              value={newCustomer.phone} 
              onChange={e => setNewCustomer({...newCustomer, phone: handlePhoneInput(e.target.value)})} 
              placeholder="05301234567" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Müşteri Tipi</label>
            <select 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
              value={newCustomer.type} 
              onChange={e => setNewCustomer({...newCustomer, type: e.target.value})}
            >
              <option value="Potansiyel">Potansiyel</option>
              <option value="Alıcı">Alıcı</option>
              <option value="Satıcı">Satıcı</option>
            </select>
          </div>
          {(newCustomer.type === 'Alıcı' || newCustomer.type === 'Potansiyel') && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">İlgilendiği Araç</label>
              <select 
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                value={newCustomer.interestedCarId || ''} 
                onChange={e => setNewCustomer({...newCustomer, interestedCarId: e.target.value})}
              >
                <option value="">-- Araç Seçiniz (Opsiyonel) --</option>
                {availableCars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model} - {car.plate?.toLocaleUpperCase('tr-TR')}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Notlar</label>
            <textarea 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none h-24 resize-none" 
              value={newCustomer.notes} 
              onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})} 
              placeholder="Müşteri hakkında notlar..." 
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 font-medium"
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 rounded-lg font-bold flex items-center bg-amber-500 text-black hover:bg-amber-600"
            >
              <Save size={18} className="mr-2" /> {isEditing ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

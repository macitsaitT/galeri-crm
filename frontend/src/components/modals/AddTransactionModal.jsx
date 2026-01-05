import React from 'react';
import {
  X,
  Save,
  Wallet
} from 'lucide-react';
import { formatNumberInput } from '../../utils/helpers';

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  newTransaction, 
  setNewTransaction, 
  onSave 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-lg text-black flex items-center gap-2">
            <Wallet size={20} className='text-green-500'/> Manuel İşlem Ekle
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">İşlem Türü</label>
              <select 
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                value={newTransaction.type} 
                onChange={e => setNewTransaction({...newTransaction, type: e.target.value})}
              >
                <option value="expense">Gider (-)</option>
                <option value="income">Gelir (+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Kategori</label>
              <input 
                required 
                type="text" 
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                value={newTransaction.category} 
                onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} 
                placeholder="Örn: Sermaye Girişi" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Açıklama</label>
            <input 
              required 
              type="text" 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
              value={newTransaction.description} 
              onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} 
              placeholder="Örn: Eylül ayı elektrik faturası" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tutar (TL)</label>
            <input 
              required 
              type="text" 
              inputMode='numeric' 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
              value={newTransaction.amount} 
              onChange={e => setNewTransaction({...newTransaction, amount: formatNumberInput(e.target.value)})} 
              placeholder="0" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tarih</label>
            <input 
              required 
              type="date" 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
              value={newTransaction.date} 
              onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} 
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
              className="px-6 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-600 flex items-center"
            >
              <Save size={18} className="mr-2" /> Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

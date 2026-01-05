import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Building2
} from 'lucide-react';
import { formatNumberInput } from '../../utils/helpers';
import { GENERAL_EXPENSE_CATEGORIES } from '../../data/mock';

export default function AddGeneralExpenseModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({ 
    category: 'Dükkan Kirası', 
    description: '', 
    amount: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  
  useEffect(() => { 
    if(isOpen) {
      setFormData({ 
        category: 'Dükkan Kirası', 
        description: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0] 
      }); 
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-red-50">
          <h3 className="font-bold text-lg text-black flex items-center gap-2">
            <Building2 size={20} className='text-red-600'/> Genel Gider Ekle
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={24}/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500">Kategori</label>
            <select 
              className="w-full p-2 border rounded-lg" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {GENERAL_EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500">Tutar</label>
            <input 
              type="text" 
              required 
              inputMode='numeric' 
              className="w-full p-2 border rounded-lg" 
              value={formData.amount} 
              onChange={e => setFormData({...formData, amount: formatNumberInput(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500">Açıklama</label>
            <input 
              type="text" 
              required 
              className="w-full p-2 border rounded-lg" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500">Tarih</label>
            <input 
              type="date" 
              required 
              className="w-full p-2 border rounded-lg" 
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-neutral-800 transition"
          >
            <Save size={18} className="inline mr-1"/> Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}

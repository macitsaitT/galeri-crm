import React from 'react';
import {
  X,
  CreditCard,
  RotateCcw
} from 'lucide-react';
import { formatNumberInput } from '../../utils/helpers';

export default function DepositModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onCancel, 
  amount, 
  setAmount, 
  existingAmount 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 bg-amber-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-black flex items-center gap-2">
            <CreditCard size={20} className='text-amber-600'/> Kapora İşlemleri
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={20}/>
          </button>
        </div>
        <form onSubmit={onSave} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {existingAmount > 0 ? "Kapora Tutarı Düzenle (TL)" : "Kapora Tutarı (TL)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-neutral-500 font-bold">₺</span>
              <input 
                required 
                type="text" 
                inputMode='numeric' 
                autoFocus 
                className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-lg font-bold" 
                value={amount} 
                onChange={(e) => setAmount(formatNumberInput(e.target.value))} 
                placeholder="0" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-600 shadow-md"
            >
              {existingAmount > 0 ? "Güncelle" : "Kaporayı Onayla"}
            </button>
            {existingAmount > 0 && (
              <button 
                type="button" 
                onClick={onCancel} 
                className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 border border-red-100 flex items-center justify-center"
              >
                <RotateCcw size={18} className="mr-2"/> Kaporayı İptal Et / İade Yap
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-800"
            >
              Vazgeç
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

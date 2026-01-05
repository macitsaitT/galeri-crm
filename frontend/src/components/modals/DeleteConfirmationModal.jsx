import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center border border-neutral-100">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
          <AlertTriangle size={24} />
        </div>
        <h3 className="font-bold text-lg text-black mb-2">Emin misiniz?</h3>
        <p className="text-neutral-500 mb-6 text-sm">
          Bu kaydı silmek üzeresiniz. Bu işlem geri alınamaz.
        </p>
        <div className="flex space-x-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 font-medium"
          >
            İptal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
}

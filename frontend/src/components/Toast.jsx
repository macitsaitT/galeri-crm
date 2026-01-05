import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose, message]);

  if (!message) return null;
  
  const bgClass = type === 'success' 
    ? 'bg-green-600' 
    : type === 'error' 
    ? 'bg-red-600' 
    : 'bg-black';
    
  return (
    <div className={`fixed bottom-6 right-6 ${bgClass} text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3 animate-bounce`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
      <span className="font-medium">{typeof message === 'object' ? 'İşlem Başarılı' : message}</span>
    </div>
  );
}

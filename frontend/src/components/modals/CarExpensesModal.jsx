import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Receipt,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatDate, formatNumberInput, parseFormattedNumber } from '../../utils/helpers';
import { EXPENSE_CATEGORIES } from '../../data/mock';

export default function CarExpensesModal({ 
  isOpen, 
  onClose, 
  car, 
  carTransactions, 
  onAddExpense, 
  onDeleteTransaction 
}) {
  const [expenseForm, setExpenseForm] = useState({ 
    category: 'Yol / Yakıt', 
    amount: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  
  useEffect(() => {
    if (isOpen) {
      setExpenseForm({ 
        category: 'Yol / Yakıt', 
        amount: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
  }, [isOpen]);

  if (!isOpen || !car) return null;
  
  const totalExpense = carTransactions
    .filter(t => t.type === 'expense' && t.category !== 'Araç Alımı' && t.category !== 'Kapora İadesi')
    .reduce((a, c) => a + c.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.amount || parseFormattedNumber(expenseForm.amount) <= 0) {
      return;
    }
    onAddExpense({ ...expenseForm, amount: parseFormattedNumber(expenseForm.amount) });
    setExpenseForm(prev => ({ ...prev, amount: '', description: '' }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-black flex items-center gap-2">
              <Receipt size={20} className="text-amber-600"/> Araç Masraf Yönetimi
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {car.brand} {car.model} - {car.plate?.toLocaleUpperCase('tr-TR')}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={24}/>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {/* Toplam Masraf */}
          <div className="bg-black text-white p-4 rounded-xl mb-6 flex justify-between items-center shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Masraf (Alış Hariç):</span>
            <span className="text-xl font-black">{formatCurrency(totalExpense)}</span>
          </div>
          
          {/* Yeni Masraf Formu */}
          <h4 className="font-bold text-sm text-neutral-700 mb-3">Yeni Masraf Ekle</h4>
          <form onSubmit={handleSubmit} className="mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">Kategori</label>
                <select 
                  className="w-full p-2 border border-neutral-300 rounded text-sm bg-white" 
                  value={expenseForm.category} 
                  onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                >
                  {EXPENSE_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tutar (TL)</label>
                <input 
                  type="text" 
                  required 
                  inputMode='numeric' 
                  className="w-full p-2 border border-neutral-300 rounded text-sm" 
                  value={expenseForm.amount} 
                  onChange={e => setExpenseForm({...expenseForm, amount: formatNumberInput(e.target.value)})} 
                  placeholder='0'
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tarih</label>
                <input 
                  type="date" 
                  required 
                  className="w-full p-2 border border-neutral-300 rounded text-sm" 
                  value={expenseForm.date} 
                  onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-neutral-700 mb-1">Açıklama (Opsiyonel)</label>
              <input 
                type="text" 
                className="w-full p-2 border border-neutral-300 rounded text-sm" 
                value={expenseForm.description} 
                onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} 
                placeholder='Detaylı açıklama'
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-neutral-800 transition"
            >
              <Plus size={16} className="inline mr-1"/> Masrafı Kaydet
            </button>
          </form>
          
          {/* Mevcut İşlemler */}
          <h4 className="font-bold text-sm text-neutral-700 mb-3 border-t pt-4">Mevcut İşlemler</h4>
          <div className="space-y-2">
            {carTransactions.length > 0 ? carTransactions
              .filter(t => t.category !== 'Araç Alımı')
              .map(t => (
                <div 
                  key={t.id} 
                  className={`flex justify-between items-center p-3 rounded-xl border ${
                    t.type === 'expense' ? 'bg-red-50' : 'bg-green-50'
                  }`}
                >
                  <div className='flex-1 min-w-0'>
                    <span className={`font-bold text-sm ${
                      t.type === 'expense' ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {t.category}
                    </span>
                    <p className='text-xs text-neutral-500 truncate'>{t.description}</p>
                  </div>
                  <div className='text-right ml-4'>
                    <span className={`font-black text-sm block ${
                      t.type === 'expense' ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <span className='text-[10px] text-neutral-400'>{formatDate(t.date)}</span>
                  </div>
                  <div className='ml-4 flex gap-1 shrink-0'>
                    <button 
                      onClick={() => onDeleteTransaction(t.id)} 
                      className='text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-white'
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-center text-neutral-400 text-sm py-4 bg-white rounded-xl">
                  Bu araç için henüz masraf/gelir yok.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

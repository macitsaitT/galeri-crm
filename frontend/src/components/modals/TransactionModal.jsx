import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { formatNumberInput, parseNumber } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const transactionCategories = {
  income: [
    'Araç Satışı',
    'Kapora',
    'Komisyon',
    'Diğer Gelir'
  ],
  expense: [
    'Araç Alımı',
    'Çalışan Payı',
    'Komisyon',
    'Araç Masrafı',
    'Kapora İadesi',
    'Genel Gider',
    'Diğer Gider'
  ]
};

const TransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction, cars } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    category: 'Araç Satışı',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    car_id: ''
  });

  const activeCars = cars.filter(c => !c.deleted);

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      category: transactionCategories[type][0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseNumber(formData.amount) <= 0) return;

    setLoading(true);
    try {
      await addTransaction({
        type: formData.type,
        category: formData.category,
        amount: parseNumber(formData.amount),
        description: formData.description,
        date: formData.date,
        car_id: formData.car_id || null
      });
      
      setFormData({
        type: 'income',
        category: 'Araç Satışı',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        car_id: ''
      });
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList size={24} className="text-primary" />
            İşlem Ekle
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type Selection */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData.type === 'income'
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              data-testid="type-income-btn"
            >
              Gelir
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData.type === 'expense'
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              data-testid="type-expense-btn"
            >
              Gider
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary"
              data-testid="transaction-category-select"
            >
              {transactionCategories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tutar (₺)</label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: formatNumberInput(e.target.value) })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary"
              placeholder="0"
              data-testid="transaction-amount-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tarih</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary"
              data-testid="transaction-date-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">İlişkili Araç (Opsiyonel)</label>
            <select
              value={formData.car_id}
              onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary"
              data-testid="transaction-car-select"
            >
              <option value="">Araç seçilmedi</option>
              {activeCars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.plate?.toUpperCase()} - {car.brand} {car.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-20 p-3 bg-background border border-border rounded-lg outline-none focus:border-primary resize-none"
              placeholder="İşlem açıklaması..."
              data-testid="transaction-description-input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !formData.amount}
              className={`px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 ${
                formData.type === 'income'
                  ? 'bg-success text-success-foreground hover:bg-success/90'
                  : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              }`}
              data-testid="save-transaction-btn"
            >
              {loading ? 'Kaydediliyor...' : 'İşlem Ekle'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;

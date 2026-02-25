import React, { useState } from 'react';
import { Receipt } from 'lucide-react';
import { formatNumberInput, parseNumber } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const expenseCategories = [
  'Genel Gider',
  'Ofis Gideri',
  'Kira',
  'Personel Maaşı',
  'Elektrik/Su/Doğalgaz',
  'İnternet/Telefon',
  'Sigorta',
  'Vergi',
  'Reklam/Pazarlama',
  'Bakım/Onarım',
  'Temizlik',
  'Kırtasiye',
  'Yemek/İkram',
  'Ulaşım',
  'Diğer'
];

const ExpenseModal = ({ isOpen, onClose }) => {
  const { addTransaction, cars } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Genel Gider',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    car_id: ''
  });

  const activeCars = cars.filter(c => !c.deleted && c.status !== 'Satıldı');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseNumber(formData.amount) <= 0) return;

    setLoading(true);
    try {
      await addTransaction({
        type: 'expense',
        category: formData.category,
        amount: parseNumber(formData.amount),
        description: formData.description,
        date: formData.date,
        car_id: formData.car_id || null
      });
      
      setFormData({
        category: 'Genel Gider',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        car_id: ''
      });
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt size={24} className="text-warning" />
            Gider Ekle
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary"
              data-testid="expense-category-select"
            >
              {expenseCategories.map(cat => (
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
              data-testid="expense-amount-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tarih</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary"
              data-testid="expense-date-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">İlişkili Araç (Opsiyonel)</label>
            <select
              value={formData.car_id}
              onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
              className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary"
              data-testid="expense-car-select"
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
              placeholder="Gider açıklaması..."
              data-testid="expense-description-input"
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
              className="px-6 py-3 rounded-lg bg-warning text-warning-foreground font-semibold hover:bg-warning/90 transition-all active:scale-95 disabled:opacity-50"
              data-testid="save-expense-btn"
            >
              {loading ? 'Kaydediliyor...' : 'Gider Ekle'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;

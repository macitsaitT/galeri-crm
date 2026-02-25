import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { formatNumberInput, parseNumber, formatCurrency } from '../../utils/helpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const DepositModal = ({ isOpen, onClose, car, onConfirmDeposit, onCancelDeposit }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (car && isOpen) {
      setAmount(car.deposit_amount > 0 ? formatNumberInput(car.deposit_amount) : '');
    }
  }, [car, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!car) return;

    setLoading(true);
    try {
      await onConfirmDeposit({
        carId: car.id,
        amount: parseNumber(amount),
        existingAmount: car.deposit_amount || 0
      });
      onClose();
    } catch (error) {
      console.error('Error confirming deposit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!car || !window.confirm('Kaporayı iade etmek istediğinize emin misiniz?')) return;

    setLoading(true);
    try {
      await onCancelDeposit(car.id);
      onClose();
    } catch (error) {
      console.error('Error canceling deposit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!car) return null;

  const existingDeposit = car.deposit_amount || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={24} className="text-warning" />
            {existingDeposit > 0 ? 'Kapora Düzenle' : 'Kapora Al'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Car Info */}
          <div className="p-4 bg-muted/50 rounded-lg mb-6">
            <p className="font-semibold">{car.brand} {car.model}</p>
            <p className="text-sm text-muted-foreground">{car.plate?.toUpperCase()}</p>
            <p className="text-sm text-primary font-medium mt-1">
              Satış Fiyatı: {formatCurrency(car.sale_price)}
            </p>
          </div>

          {existingDeposit > 0 && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
              <p className="text-sm text-warning">
                Mevcut Kapora: <strong>{formatCurrency(existingDeposit)}</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {existingDeposit > 0 ? 'Yeni Kapora Tutarı (₺)' : 'Kapora Tutarı (₺)'}
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(formatNumberInput(e.target.value))}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                placeholder="0"
                data-testid="deposit-amount-input"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading || parseNumber(amount) <= 0}
                className="w-full py-3 rounded-lg gradient-gold text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
                data-testid="confirm-deposit-btn"
              >
                {loading ? 'İşleniyor...' : 'Kaporayı Kaydet'}
              </button>

              {existingDeposit > 0 && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full py-3 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  data-testid="cancel-deposit-btn"
                >
                  Kaporayı İade Et
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                data-testid="close-deposit-btn"
              >
                Kapat
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;

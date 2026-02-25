import React, { useState, useEffect } from 'react';
import { X, Car, Upload, Plus, Trash2 } from 'lucide-react';
import { formatNumberInput, parseNumber } from '../../utils/helpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const carBrands = [
  'Audi', 'BMW', 'Chevrolet', 'Citroen', 'Dacia', 'Fiat', 'Ford', 'Honda', 
  'Hyundai', 'Kia', 'Mercedes', 'Nissan', 'Opel', 'Peugeot', 'Renault', 
  'Seat', 'Skoda', 'Toyota', 'Volkswagen', 'Volvo', 'Diğer'
];

const vehicleTypes = ['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Station Wagon', 'Coupe', 'Cabrio', 'Pick-up', 'Minivan', 'Panelvan'];
const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik', 'Benzin + LPG'];
const gearTypes = ['Manuel', 'Otomatik', 'Yarı Otomatik'];

const defaultFormData = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  km: '',
  vehicle_type: 'Sedan',
  purchase_price: '',
  sale_price: '',
  description: '',
  status: 'Stokta',
  entry_date: new Date().toISOString().split('T')[0],
  inspection_date: '',
  fuel_type: 'Dizel',
  gear: 'Otomatik',
  ownership: 'stock',
  owner_name: '',
  owner_phone: '',
  commission_rate: '',
  photos: [],
  expertise: {},
  package_info: '',
  engine_type: ''
};

const AddCarModal = ({ isOpen, onClose, onSave, editingCar = null }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCar) {
      setFormData({
        ...editingCar,
        km: formatNumberInput(editingCar.km),
        purchase_price: formatNumberInput(editingCar.purchase_price),
        sale_price: formatNumberInput(editingCar.sale_price),
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [editingCar, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNumberChange = (field, value) => {
    const formatted = formatNumberInput(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.brand) newErrors.brand = 'Marka seçiniz';
    if (!formData.model) newErrors.model = 'Model giriniz';
    if (!formData.plate) newErrors.plate = 'Plaka giriniz';
    if (!formData.sale_price || parseNumber(formData.sale_price) <= 0) {
      newErrors.sale_price = 'Satış fiyatı giriniz';
    }
    if (formData.ownership === 'stock' && (!formData.purchase_price || parseNumber(formData.purchase_price) <= 0)) {
      newErrors.purchase_price = 'Stok araç için alış fiyatı gerekli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        km: formData.km?.replace(/[^\d]/g, '') || '0',
        purchase_price: parseNumber(formData.purchase_price),
        sale_price: parseNumber(formData.sale_price),
        commission_rate: parseInt(formData.commission_rate) || (formData.ownership === 'consignment' ? 5 : 0),
        year: parseInt(formData.year) || new Date().getFullYear(),
      };
      
      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error saving car:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car size={24} className="text-primary" />
            {editingCar ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Ownership Type */}
          <div className="flex gap-4">
            <label className="flex-1">
              <input
                type="radio"
                name="ownership"
                value="stock"
                checked={formData.ownership === 'stock'}
                onChange={() => handleChange('ownership', 'stock')}
                className="sr-only peer"
              />
              <div className="p-4 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 cursor-pointer transition-all text-center">
                <p className="font-semibold">Stok Araç</p>
                <p className="text-xs text-muted-foreground">Galeriye ait</p>
              </div>
            </label>
            <label className="flex-1">
              <input
                type="radio"
                name="ownership"
                value="consignment"
                checked={formData.ownership === 'consignment'}
                onChange={() => handleChange('ownership', 'consignment')}
                className="sr-only peer"
              />
              <div className="p-4 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 cursor-pointer transition-all text-center">
                <p className="font-semibold">Konsinye</p>
                <p className="text-xs text-muted-foreground">Araç sahibine ait</p>
              </div>
            </label>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Marka *</label>
              <select
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className={`w-full h-12 px-4 bg-background border rounded-lg outline-none transition-colors ${errors.brand ? 'border-destructive' : 'border-border focus:border-primary'}`}
                data-testid="car-brand-select"
              >
                <option value="">Seçiniz</option>
                {carBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && <p className="text-destructive text-xs mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className={`w-full h-12 px-4 bg-background border rounded-lg outline-none transition-colors ${errors.model ? 'border-destructive' : 'border-border focus:border-primary'}`}
                placeholder="Model adı"
                data-testid="car-model-input"
              />
              {errors.model && <p className="text-destructive text-xs mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Yıl</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                min="1990"
                max={new Date().getFullYear() + 1}
                data-testid="car-year-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Plaka *</label>
              <input
                type="text"
                value={formData.plate}
                onChange={(e) => handleChange('plate', e.target.value.toUpperCase())}
                className={`w-full h-12 px-4 bg-background border rounded-lg outline-none transition-colors uppercase ${errors.plate ? 'border-destructive' : 'border-border focus:border-primary'}`}
                placeholder="34 ABC 123"
                data-testid="car-plate-input"
              />
              {errors.plate && <p className="text-destructive text-xs mt-1">{errors.plate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kilometre</label>
              <input
                type="text"
                value={formData.km}
                onChange={(e) => handleNumberChange('km', e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                placeholder="0"
                data-testid="car-km-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Araç Tipi</label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => handleChange('vehicle_type', e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                data-testid="car-type-select"
              >
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Yakıt</label>
              <select
                value={formData.fuel_type}
                onChange={(e) => handleChange('fuel_type', e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                data-testid="car-fuel-select"
              >
                {fuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vites</label>
              <select
                value={formData.gear}
                onChange={(e) => handleChange('gear', e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                data-testid="car-gear-select"
              >
                {gearTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            {formData.ownership === 'stock' && (
              <div>
                <label className="block text-sm font-medium mb-2">Alış Fiyatı (₺) *</label>
                <input
                  type="text"
                  value={formData.purchase_price}
                  onChange={(e) => handleNumberChange('purchase_price', e.target.value)}
                  className={`w-full h-12 px-4 bg-background border rounded-lg outline-none transition-colors ${errors.purchase_price ? 'border-destructive' : 'border-border focus:border-primary'}`}
                  placeholder="0"
                  data-testid="car-purchase-price-input"
                />
                {errors.purchase_price && <p className="text-destructive text-xs mt-1">{errors.purchase_price}</p>}
              </div>
            )}

            <div className={formData.ownership === 'stock' ? '' : 'col-span-2'}>
              <label className="block text-sm font-medium mb-2">Satış Fiyatı (₺) *</label>
              <input
                type="text"
                value={formData.sale_price}
                onChange={(e) => handleNumberChange('sale_price', e.target.value)}
                className={`w-full h-12 px-4 bg-background border rounded-lg outline-none transition-colors ${errors.sale_price ? 'border-destructive' : 'border-border focus:border-primary'}`}
                placeholder="0"
                data-testid="car-sale-price-input"
              />
              {errors.sale_price && <p className="text-destructive text-xs mt-1">{errors.sale_price}</p>}
            </div>
          </div>

          {/* Consignment Owner Info */}
          {formData.ownership === 'consignment' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Araç Sahibi Adı</label>
                <input
                  type="text"
                  value={formData.owner_name}
                  onChange={(e) => handleChange('owner_name', e.target.value)}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  placeholder="Sahibi adı"
                  data-testid="car-owner-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sahibi Telefon</label>
                <input
                  type="tel"
                  value={formData.owner_phone}
                  onChange={(e) => handleChange('owner_phone', e.target.value)}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  placeholder="0532 XXX XX XX"
                  data-testid="car-owner-phone-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Araç Sahibine Ödenecek (₺)</label>
                <input
                  type="text"
                  value={formData.purchase_price}
                  onChange={(e) => handleNumberChange('purchase_price', e.target.value)}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  placeholder="0"
                  data-testid="car-owner-payment-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Komisyon Oranı (%)</label>
                <input
                  type="number"
                  value={formData.commission_rate}
                  onChange={(e) => handleChange('commission_rate', e.target.value)}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  placeholder="5"
                  min="0"
                  max="100"
                  data-testid="car-commission-input"
                />
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Giriş Tarihi</label>
              <input
                type="date"
                value={formData.entry_date}
                onChange={(e) => handleChange('entry_date', e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                data-testid="car-entry-date-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Muayene Tarihi</label>
              <input
                type="date"
                value={formData.inspection_date}
                onChange={(e) => handleChange('inspection_date', e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                data-testid="car-inspection-date-input"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Açıklama / Notlar</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full h-24 p-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors resize-none"
              placeholder="Araç hakkında notlar..."
              data-testid="car-description-input"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
              data-testid="cancel-car-btn"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
              data-testid="save-car-btn"
            >
              {loading ? 'Kaydediliyor...' : (editingCar ? 'Güncelle' : 'Kaydet')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarModal;

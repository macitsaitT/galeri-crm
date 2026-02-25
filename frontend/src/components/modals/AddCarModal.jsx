import React, { useState, useEffect } from 'react';
import { X, Car, FileText, Camera, Users, CheckCircle } from 'lucide-react';
import { formatNumberInput, parseNumber } from '../../utils/helpers';
import { carBrands, carModels, engineTypes, packageTypes, gearTypes, fuelTypes, vehicleTypes, modelYears } from '../../data/carData';
import { provinceList, getDistrictsByProvince } from '../../data/turkeyData';
import CarExpertiseDiagram from '../CarExpertiseDiagram';

const getPackagesForBrand = (brand) => {
  if (brand && packageTypes[brand]) return packageTypes[brand];
  return packageTypes['Genel'] || [];
};
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

// Expertise sections
const expertiseParts = [
  { id: 'kaput', name: 'Kaput', position: 'top-center' },
  { id: 'tavan', name: 'Tavan', position: 'top-center-2' },
  { id: 'bagaj', name: 'Bagaj', position: 'bottom-center' },
  { id: 'on_tampon', name: 'Ön Tampon', position: 'front' },
  { id: 'arka_tampon', name: 'Arka Tampon', position: 'back' },
  { id: 'sol_on_camurluk', name: 'Sol Ön Çamurluk', position: 'left-front' },
  { id: 'sol_on_kapi', name: 'Sol Ön Kapı', position: 'left-front-door' },
  { id: 'sol_arka_kapi', name: 'Sol Arka Kapı', position: 'left-back-door' },
  { id: 'sol_arka_camurluk', name: 'Sol Arka Çamurluk', position: 'left-back' },
  { id: 'sag_on_camurluk', name: 'Sağ Ön Çamurluk', position: 'right-front' },
  { id: 'sag_on_kapi', name: 'Sağ Ön Kapı', position: 'right-front-door' },
  { id: 'sag_arka_kapi', name: 'Sağ Arka Kapı', position: 'right-back-door' },
  { id: 'sag_arka_camurluk', name: 'Sağ Arka Çamurluk', position: 'right-back' },
];

const expertiseStatuses = [
  { value: 'orijinal', label: 'Orijinal', color: 'bg-success/20 text-success border-success/30' },
  { value: 'boyali', label: 'Boyalı', color: 'bg-warning/20 text-warning border-warning/30' },
  { value: 'lokal', label: 'Lokal Boyalı', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'degisen', label: 'Değişen', color: 'bg-destructive/20 text-destructive border-destructive/30' },
];

const mechanicalParts = [
  { id: 'motor', name: 'Motor Durumu' },
  { id: 'sanziman', name: 'Şanzıman Durumu' },
  { id: 'yuruyen', name: 'Yürüyen Durumu' },
];

const mechanicalStatuses = ['Orijinal', 'Bakımlı', 'Değişmiş', 'Sorunlu'];

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
  expertise: {
    parts: {},
    mechanical: {
      motor: 'Orijinal',
      sanziman: 'Orijinal',
      yuruyen: 'Orijinal'
    }
  },
  package_info: '',
  engine_type: '',
  insurance_start: '',
  insurance_end: '',
  province: '',
  district: ''
};

const AddCarModal = ({ isOpen, onClose, onSave, editingCar = null }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (editingCar) {
      setFormData({
        ...defaultFormData,
        ...editingCar,
        km: formatNumberInput(editingCar.km),
        purchase_price: formatNumberInput(editingCar.purchase_price),
        sale_price: formatNumberInput(editingCar.sale_price),
        expertise: editingCar.expertise || defaultFormData.expertise,
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
    setActiveTab('general');
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

  const handleExpertiseChange = (partId, value) => {
    setFormData(prev => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        parts: {
          ...prev.expertise.parts,
          [partId]: value
        }
      }
    }));
  };

  const handleMechanicalChange = (partId, value) => {
    setFormData(prev => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        mechanical: {
          ...prev.expertise.mechanical,
          [partId]: value
        }
      }
    }));
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
    if (!validate()) {
      setActiveTab('general');
      return;
    }

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

  const availableModels = carModels[formData.brand] || [];
  const availablePackages = getPackagesForBrand(formData.brand);
  const availableDistricts = getDistrictsByProvince(formData.province);

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: FileText },
    { id: 'expertise', label: 'Ekspertiz', icon: CheckCircle },
    { id: 'photos', label: 'Fotoğraflar', icon: Camera },
    { id: 'ownership', label: 'Sahiplik / Konsinye', icon: Users },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Car size={24} className="text-primary" />
            {editingCar ? 'Araç Düzenle' : 'Yeni Araç Girişi'}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-1">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4 py-4">
              {/* Basic Info Row 1 */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Plaka</label>
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={(e) => handleChange('plate', e.target.value.toUpperCase())}
                    className={`w-full h-11 px-3 bg-background border rounded-lg outline-none transition-colors uppercase text-sm ${errors.plate ? 'border-destructive' : 'border-border focus:border-primary'}`}
                    placeholder="34 AB 123"
                    data-testid="car-plate-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model Yılı</label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-year-select"
                  >
                    {modelYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Marka</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => {
                      handleChange('brand', e.target.value);
                      handleChange('model', '');
                      handleChange('package_info', '');
                    }}
                    className={`w-full h-11 px-3 bg-background border rounded-lg outline-none text-sm ${errors.brand ? 'border-destructive' : 'border-border focus:border-primary'}`}
                    data-testid="car-brand-select"
                  >
                    <option value="">Seçiniz</option>
                    {carBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <select
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    className={`w-full h-11 px-3 bg-background border rounded-lg outline-none text-sm ${errors.model ? 'border-destructive' : 'border-border focus:border-primary'}`}
                    data-testid="car-model-select"
                  >
                    <option value="">Seçiniz</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Basic Info Row 2 */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">KM</label>
                  <input
                    type="text"
                    value={formData.km}
                    onChange={(e) => handleNumberChange('km', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    placeholder="0"
                    data-testid="car-km-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Yakıt</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => handleChange('fuel_type', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
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
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-gear-select"
                  >
                    {gearTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Giriş Tarihi</label>
                  <input
                    type="date"
                    value={formData.entry_date}
                    onChange={(e) => handleChange('entry_date', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-entry-date-input"
                  />
                </div>
              </div>

              {/* Basic Info Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Motor</label>
                  <select
                    value={formData.engine_type}
                    onChange={(e) => handleChange('engine_type', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-engine-select"
                  >
                    <option value="">Seçiniz</option>
                    {engineTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Araç Paketi/Versiyonu</label>
                  <select
                    value={formData.package_info}
                    onChange={(e) => handleChange('package_info', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-package-select"
                  >
                    <option value="">Seçiniz</option>
                    {availablePackages.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Muayene Tarihi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Muayene Tarihi</label>
                  <input
                    type="date"
                    value={formData.inspection_date}
                    onChange={(e) => handleChange('inspection_date', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-inspection-date-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kasa Tipi</label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => handleChange('vehicle_type', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-type-select"
                  >
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* İl / İlçe */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">İl</label>
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      handleChange('province', e.target.value);
                      handleChange('district', '');
                    }}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    data-testid="car-province-select"
                  >
                    <option value="">Seçiniz</option>
                    {provinceList.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">İlçe</label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                    disabled={!formData.province}
                    data-testid="car-district-select"
                  >
                    <option value="">Seçiniz</option>
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Insurance Dates */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-400">Sigorta Başlangıç Tarihi</label>
                    <input
                      type="date"
                      value={formData.insurance_start}
                      onChange={(e) => handleChange('insurance_start', e.target.value)}
                      className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                      data-testid="car-insurance-start-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-400">Sigorta Bitiş Tarihi</label>
                    <input
                      type="date"
                      value={formData.insurance_end}
                      onChange={(e) => handleChange('insurance_end', e.target.value)}
                      className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                      data-testid="car-insurance-end-input"
                    />
                  </div>
                </div>
              </div>

              {/* Prices */}
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-destructive">Alış Fiyatı *</label>
                    <input
                      type="text"
                      value={formData.purchase_price}
                      onChange={(e) => handleNumberChange('purchase_price', e.target.value)}
                      className={`w-full h-11 px-3 bg-background border rounded-lg outline-none text-sm ${errors.purchase_price ? 'border-destructive' : 'border-border focus:border-primary'}`}
                      placeholder="0"
                      data-testid="car-purchase-price-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-destructive">Satış Fiyatı *</label>
                    <input
                      type="text"
                      value={formData.sale_price}
                      onChange={(e) => handleNumberChange('sale_price', e.target.value)}
                      className={`w-full h-11 px-3 bg-background border rounded-lg outline-none text-sm ${errors.sale_price ? 'border-destructive' : 'border-border focus:border-primary'}`}
                      placeholder="0"
                      data-testid="car-sale-price-input"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full h-24 p-3 bg-background border border-border rounded-lg outline-none focus:border-primary resize-none text-sm"
                  placeholder="Araç hakkında..."
                  data-testid="car-description-input"
                />
              </div>
            </div>
          )}

          {/* Expertise Tab */}
          {activeTab === 'expertise' && (
            <div className="space-y-6 py-4">
              {/* Body Parts */}
              <div>
                <h4 className="font-semibold mb-4">Kaporta Durumu</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {expertiseParts.map((part) => (
                    <div key={part.id} className="p-3 bg-muted/30 rounded-lg">
                      <label className="block text-xs font-medium mb-2 text-muted-foreground">{part.name}</label>
                      <select
                        value={formData.expertise?.parts?.[part.id] || 'orijinal'}
                        onChange={(e) => handleExpertiseChange(part.id, e.target.value)}
                        className="w-full h-9 px-2 bg-background border border-border rounded text-xs outline-none focus:border-primary"
                        data-testid={`expertise-${part.id}`}
                      >
                        {expertiseStatuses.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mechanical Parts */}
              <div>
                <h4 className="font-semibold mb-4">Mekanik Durum</h4>
                <div className="grid grid-cols-3 gap-4">
                  {mechanicalParts.map((part) => (
                    <div key={part.id} className="p-4 bg-muted/30 rounded-lg">
                      <label className="block text-sm font-medium mb-2">{part.name}</label>
                      <select
                        value={formData.expertise?.mechanical?.[part.id] || 'Orijinal'}
                        onChange={(e) => handleMechanicalChange(part.id, e.target.value)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary"
                        data-testid={`mechanical-${part.id}`}
                      >
                        {mechanicalStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="space-y-4 py-4">
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <Camera size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Fotoğraf yüklemek için tıklayın veya sürükleyin</p>
                <p className="text-xs text-muted-foreground">PNG, JPG (max. 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="photo-upload"
                  data-testid="photo-upload-input"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  Fotoğraf Seç
                </label>
              </div>

              {formData.photos && formData.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img src={photo} alt={`Araç ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const newPhotos = formData.photos.filter((_, i) => i !== index);
                          handleChange('photos', newPhotos);
                        }}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ownership Tab */}
          {activeTab === 'ownership' && (
            <div className="space-y-6 py-4">
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
                  <div className="p-6 rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 cursor-pointer transition-all text-center">
                    <Car size={32} className="mx-auto mb-2" />
                    <p className="font-semibold">Stok Araç</p>
                    <p className="text-xs text-muted-foreground mt-1">Galeriye ait araç</p>
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
                  <div className="p-6 rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 cursor-pointer transition-all text-center">
                    <Users size={32} className="mx-auto mb-2" />
                    <p className="font-semibold">Konsinye</p>
                    <p className="text-xs text-muted-foreground mt-1">Araç sahibine ait</p>
                  </div>
                </label>
              </div>

              {/* Consignment Owner Info */}
              {formData.ownership === 'consignment' && (
                <div className="p-4 bg-muted/50 rounded-xl space-y-4">
                  <h4 className="font-semibold">Araç Sahibi Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Araç Sahibi Adı</label>
                      <input
                        type="text"
                        value={formData.owner_name}
                        onChange={(e) => handleChange('owner_name', e.target.value)}
                        className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
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
                        className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
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
                        className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
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
                        className="w-full h-11 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary text-sm"
                        placeholder="5"
                        min="0"
                        max="100"
                        data-testid="car-commission-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
            data-testid="cancel-car-btn"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            data-testid="save-car-btn"
          >
            <FileText size={18} />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarModal;

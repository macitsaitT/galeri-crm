import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Save,
  Car,
  FileText,
  CheckCircle,
  Handshake,
  Upload,
  Camera
} from 'lucide-react';
import { CAR_DATA, VEHICLE_DATA, CAR_SVG_PATHS, EXPERTISE_STATUSES } from '../../data/mock';
import { formatNumberInput, resizeImage } from '../../utils/helpers';

// Ekspertiz Görsel Haritası
const ExpertiseVisualMap = ({ value = {}, onChange, readonly = false }) => {
  const handlePartClick = (partId) => {
    if (readonly) return;
    const currentStatus = value[partId] || 'Orijinal';
    const nextStatus = EXPERTISE_STATUSES[currentStatus]?.next || 'Orijinal';
    onChange(partId, nextStatus);
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${readonly ? '' : 'drop-shadow-xl my-4'}`}>
        <svg width={readonly ? "160" : "200"} height={readonly ? "320" : "400"} viewBox="0 0 200 400" className="overflow-visible">
          {/* Tekerlekler */}
          <rect x="5" y="60" width="10" height="40" rx="2" fill="#333" />
          <rect x="185" y="60" width="10" height="40" rx="2" fill="#333" />
          <rect x="5" y="270" width="10" height="40" rx="2" fill="#333" />
          <rect x="185" y="270" width="10" height="40" rx="2" fill="#333" />
          
          {CAR_SVG_PATHS.map(part => {
            const status = value[part.id] || 'Orijinal';
            const config = EXPERTISE_STATUSES[status] || EXPERTISE_STATUSES['Orijinal'];
            return (
              <g 
                key={part.id} 
                onClick={() => handlePartClick(part.id)} 
                className={readonly ? '' : 'cursor-pointer hover:opacity-90'}
              >
                <path 
                  d={part.d} 
                  fill={config.fill} 
                  stroke={config.stroke} 
                  strokeWidth="2" 
                  className="transition-colors duration-200" 
                />
                <text 
                  x={part.cx} 
                  y={part.cy} 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-[10px] font-extrabold pointer-events-none select-none" 
                  style={{ fill: '#374151' }}
                >
                  {config.text}
                </text>
                <title>{part.name}: {status}</title>
              </g>
            );
          })}
          {/* Camlar */}
          <path d="M55,113 L145,113 L145,137 L55,137 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
          <path d="M55,243 L145,243 L145,267 L55,267 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
        </svg>
      </div>
      {!readonly && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(EXPERTISE_STATUSES)
            .filter(([key]) => key !== 'İşlemli' && key !== 'Sorunlu')
            .map(([status, config]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div 
                  className="w-4 h-4 rounded border shadow-sm" 
                  style={{ backgroundColor: config.fill, borderColor: config.stroke }}
                />
                <span className="text-xs font-bold text-neutral-600">{config.label}</span>
              </div>
            ))}
        </div>
      )}
      {!readonly && (
        <p className="text-xs text-neutral-400 mt-2 text-center">
          * Durumunu değiştirmek istediğiniz parçanın üzerine tıklayın.
        </p>
      )}
    </div>
  );
};

export default function AddCarModal({ 
  isOpen, 
  onClose, 
  newCar, 
  setNewCar, 
  onSave, 
  isEditing,
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('general');
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    if (isOpen) {
      setActiveTab('general');
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const handleBrandChange = (e) => {
    setNewCar({ ...newCar, brand: e.target.value, model: '', packageInfo: '', engineType: '' });
  };
  
  const handleModelChange = (e) => {
    setNewCar({ ...newCar, model: e.target.value, packageInfo: '', engineType: '' });
  };

  const handleEngineChange = (e) => {
    setNewCar({ ...newCar, engineType: e.target.value, packageInfo: '' });
  };

  const handleNumberChange = (e, field) => {
    setNewCar({ ...newCar, [field]: formatNumberInput(e.target.value) });
  };
  
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + (newCar.photos?.length || 0) > 6) { 
      showToast("En fazla 6 fotoğraf yükleyebilirsiniz.", "error"); 
      return; 
    }
    const processedPhotos = await Promise.all(files.map(file => resizeImage(file)));
    setNewCar(prev => ({ ...prev, photos: [...(prev.photos || []), ...processedPhotos] }));
  };
  
  const removePhoto = (index) => {
    setNewCar(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };
  
  const handleExpertiseChange = (partId, status) => {
    setNewCar(prev => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        body: {
          ...(prev.expertise?.body || {}),
          [partId]: status
        }
      }
    }));
  };

  // Motor seçenekleri
  const getAvailableEngines = () => {
    if (newCar.brand && newCar.model && VEHICLE_DATA[newCar.brand]?.[newCar.model]) {
      return Object.keys(VEHICLE_DATA[newCar.brand][newCar.model]);
    }
    return Object.keys(VEHICLE_DATA.default?.default || {});
  };

  // Paket seçenekleri
  const getAvailablePackages = () => {
    if (newCar.brand && newCar.model && newCar.engineType) {
      return VEHICLE_DATA[newCar.brand]?.[newCar.model]?.[newCar.engineType] || 
             VEHICLE_DATA.default?.default?.default || ["Standart"];
    }
    if (newCar.brand && newCar.model) {
      const allPackages = new Set();
      const modelData = VEHICLE_DATA[newCar.brand]?.[newCar.model];
      if (modelData) {
        Object.values(modelData).forEach(packages => packages.forEach(p => allPackages.add(p)));
      }
      return allPackages.size > 0 ? Array.from(allPackages) : VEHICLE_DATA.default?.default?.default || ["Standart"];
    }
    return VEHICLE_DATA.default?.default?.default || ["Standart"];
  };

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: FileText },
    { id: 'expertise', label: 'Ekspertiz', icon: CheckCircle },
    { id: 'photos', label: 'Fotoğraflar', icon: Camera },
    { id: 'consignment', label: 'Sahiplik / Konsinye', icon: Handshake }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-start bg-neutral-50 shrink-0">
          <div>
            <h3 className="font-bold text-lg text-black flex items-center gap-2">
              <Car size={20} className="text-amber-600"/> 
              {isEditing ? 'Araç Düzenle' : 'Yeni Araç Girişi'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {newCar.brand} {newCar.model} - {newCar.plate?.toLocaleUpperCase('tr-TR')}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={24} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-neutral-100 px-6 bg-white shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-amber-500 text-black' 
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <tab.icon size={16}/> {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Plaka</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none uppercase" 
                    value={newCar.plate} 
                    onChange={e => setNewCar({...newCar, plate: e.target.value.toLocaleUpperCase('tr-TR')})} 
                    placeholder="34 AB 123" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Model Yılı</label>
                  <input 
                    required 
                    type="number" 
                    min="1900" 
                    max="2100" 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={newCar.year || ''} 
                    onChange={e => setNewCar({...newCar, year: e.target.value})} 
                    placeholder={currentYear}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Marka</label>
                  <select 
                    required 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                    value={newCar.brand} 
                    onChange={handleBrandChange}
                  >
                    <option value="">Seçiniz</option>
                    {Object.keys(CAR_DATA).sort().map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Model</label>
                  <select 
                    required 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                    value={newCar.model} 
                    onChange={handleModelChange} 
                    disabled={!newCar.brand}
                  >
                    <option value="">Seçiniz</option>
                    {newCar.brand && CAR_DATA[newCar.brand]?.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">KM</label>
                  <input 
                    required 
                    type="text" 
                    inputMode='numeric' 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={newCar.km} 
                    onChange={e => handleNumberChange(e, 'km')} 
                    placeholder="0" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Yakıt</label>
                  <select 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                    value={newCar.fuelType || 'Dizel'} 
                    onChange={e => setNewCar({...newCar, fuelType: e.target.value})}
                  >
                    {['Dizel', 'Benzin', 'Benzin & LPG', 'Hibrit', 'Elektrik'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Vites</label>
                  <select 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                    value={newCar.gear || 'Otomatik'} 
                    onChange={e => setNewCar({...newCar, gear: e.target.value})}
                  >
                    <option value="Otomatik">Otomatik</option>
                    <option value="Manuel">Manuel</option>
                    <option value="Yarı Otomatik">Yarı Otomatik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Giriş Tarihi</label>
                  <input 
                    required 
                    type="date" 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={newCar.entryDate} 
                    onChange={e => setNewCar({...newCar, entryDate: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">Motor</label>
                <select
                  className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  value={newCar.engineType || ''}
                  onChange={handleEngineChange}
                  disabled={!newCar.brand || !newCar.model}
                >
                  <option value="">Seçiniz</option>
                  {getAvailableEngines().map(eng => (
                    <option key={eng} value={eng}>{eng}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">Araç Paketi/Versiyonu</label>
                <select
                  required
                  className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  value={newCar.packageInfo}
                  onChange={e => setNewCar({...newCar, packageInfo: e.target.value})}
                  disabled={!newCar.brand || !newCar.model}
                >
                  <option value="">Seçiniz</option>
                  {getAvailablePackages().map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">Muayene Tarihi</label>
                <input 
                  type="date" 
                  className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                  value={newCar.inspectionDate || ''} 
                  onChange={e => setNewCar({...newCar, inspectionDate: e.target.value})} 
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <label className="block text-xs font-bold text-blue-700 mb-1">Sigorta Başlangıç Tarihi</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                    value={newCar.insuranceStartDate || ''} 
                    onChange={e => setNewCar({...newCar, insuranceStartDate: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-700 mb-1">Sigorta Bitiş Tarihi</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                    value={newCar.insuranceEndDate || ''} 
                    onChange={e => setNewCar({...newCar, insuranceEndDate: e.target.value})} 
                  />
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">
                    Alış Fiyatı {newCar.ownership === 'consignment' ? '(Sahibine Ödenecek)' : ''} 
                    <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    inputMode='numeric' 
                    className={`w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none ${
                      (!newCar.purchasePrice || newCar.purchasePrice === '0') ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                    }`} 
                    value={newCar.purchasePrice} 
                    onChange={e => handleNumberChange(e, 'purchasePrice')} 
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">
                    Satış Fiyatı <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    inputMode='numeric' 
                    className={`w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none ${
                      (!newCar.salePrice || newCar.salePrice === '0') ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                    }`} 
                    value={newCar.salePrice} 
                    onChange={e => handleNumberChange(e, 'salePrice')} 
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-500 mb-1">Açıklama</label>
                <textarea 
                  className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none h-20 resize-none" 
                  value={newCar.description} 
                  onChange={e => setNewCar({...newCar, description: e.target.value})} 
                  placeholder="Araç hakkında..." 
                />
              </div>
            </div>
          )}
          
          {activeTab === 'expertise' && (
            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-700 mb-4 text-center uppercase tracking-wide">Kaporta Ekspertizi</h4>
                <ExpertiseVisualMap value={newCar.expertise?.body} onChange={handleExpertiseChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Motor', 'Şanzıman', 'Yürüyen'].map(field => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">{field} Durumu</label>
                    <select 
                      className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                      value={newCar.expertise?.[field] || 'Orijinal'} 
                      onChange={e => setNewCar({...newCar, expertise: {...newCar.expertise, [field]: e.target.value}})}
                    >
                      <option value="Orijinal">Orijinal</option>
                      <option value="İşlemli">İşlemli</option>
                      <option value="Sorunlu">Sorunlu</option>
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">Ekspertiz Puanı (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={newCar.expertise?.score || ''} 
                    onChange={e => setNewCar({...newCar, expertise: {...newCar.expertise, score: e.target.value}})} 
                    placeholder="95" 
                  />
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <label className="block text-xs font-bold text-orange-700 mb-1">Tramer Kayıt Tutarı (TL)</label>
                <input 
                  type="text"
                  inputMode="numeric"
                  className="w-full p-2 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white" 
                  value={newCar.tramerAmount || ''} 
                  onChange={e => setNewCar({...newCar, tramerAmount: formatNumberInput(e.target.value)})} 
                  placeholder="0" 
                />
                <p className="text-xs text-orange-600 mt-1">Araç tramer kaydı varsa tutarını girin</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">Ekspertiz Notları</label>
                <textarea 
                  className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none h-20 resize-none" 
                  value={newCar.expertise?.notes || ''} 
                  onChange={e => setNewCar({...newCar, expertise: {...newCar.expertise, notes: e.target.value}})} 
                  placeholder="Ek notlar..." 
                />
              </div>
            </div>
          )}
          
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current.click()} 
                className="border-2 border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition"
              >
                <Upload size={32} className="text-neutral-400 mb-2"/>
                <p className="text-sm font-bold text-neutral-600">Fotoğraf Yükle</p>
                <p className="text-xs text-neutral-400">Cihazdan seçmek için tıklayın (Max 6)</p>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {newCar.photos?.map((photo, index) => (
                  <div key={index} className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden group">
                    <img src={photo} alt={`Car ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(index)} 
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'consignment' && (
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="ownership" 
                    checked={newCar.ownership === 'stock'} 
                    onChange={() => setNewCar({...newCar, ownership: 'stock'})} 
                    className="accent-black" 
                  />
                  <span className="text-sm font-bold">Stok Araç (Satın Alma)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="ownership" 
                    checked={newCar.ownership === 'consignment'} 
                    onChange={() => setNewCar({...newCar, ownership: 'consignment'})} 
                    className="accent-amber-500" 
                  />
                  <span className="text-sm font-bold">Konsinye (Emanet)</span>
                </label>
              </div>
              {newCar.ownership === 'consignment' ? (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Araç Sahibi Adı</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                      value={newCar.ownerName || ''} 
                      onChange={e => setNewCar({...newCar, ownerName: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Sahibi Telefon</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                      value={newCar.ownerPhone || ''} 
                      onChange={e => setNewCar({...newCar, ownerPhone: e.target.value})} 
                      placeholder="05301234567" 
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-neutral-100 rounded text-sm text-gray-500 text-center">
                  Stok araç seçili. Alış fiyatı bilgileri "Genel Bilgiler" sekmesindedir.
                </div>
              )}
            </div>
          )}
        </form>
        
        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 flex justify-end gap-3 bg-white shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2 rounded-lg text-neutral-600 hover:bg-neutral-50 font-medium text-sm"
          >
            İptal
          </button>
          <button 
            onClick={onSave} 
            className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-neutral-800 transition flex items-center"
          >
            <Save size={18} className="mr-2" /> Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export { ExpertiseVisualMap };

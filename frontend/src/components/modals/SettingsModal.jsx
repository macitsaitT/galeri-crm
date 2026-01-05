import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  User,
  Phone,
  Save,
  LogOut,
  Upload,
  Loader2,
  Camera
} from 'lucide-react';
import { handlePhoneInput, resizeImage } from '../../utils/helpers';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  profile, 
  setProfile, 
  onLogout 
}) {
  const [formData, setFormData] = useState(profile);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  useEffect(() => setFormData(profile), [profile]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploadingLogo(true);
    try {
      const base64 = await resizeImage(file);
      setFormData({...formData, logo: base64});
    } catch (err) {
      console.error("Logo upload error:", err);
    } finally {
      setIsUploadingLogo(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-black flex items-center">
            <Settings size={20} className="mr-2 text-neutral-500"/> Hesap Ayarları
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={24}/>
          </button>
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); setProfile(formData); onClose(); }} 
          className="p-6 space-y-4"
        >
          {/* Logo Yükleme */}
          <div className="border-b border-neutral-100 pb-4">
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Şirket Logosu</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain"/>
                ) : (
                  <Camera size={32} className="text-neutral-300"/>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer">
                  <span className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition inline-flex items-center gap-2">
                    {isUploadingLogo ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>}
                    {isUploadingLogo ? 'Yükleniyor...' : 'Logo Yükle'}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoUpload} 
                    disabled={isUploadingLogo}
                  />
                </label>
                {formData.logo && (
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, logo: null})} 
                    className="text-xs text-red-500 hover:text-red-700 ml-2"
                  >
                    Kaldır
                  </button>
                )}
                <p className="text-[10px] text-neutral-400 mt-1">Logo raporlarda ve tanıtım kartlarında görünecektir.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Ad Soyad</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-neutral-400" size={18}/>
              <input 
                type="text" 
                className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Ünvan</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Telefon</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-neutral-400">
                <Phone size={18}/>
              </span>
              <input 
                type="text" 
                className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                placeholder="05301234567" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: handlePhoneInput(e.target.value)})}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-100">
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1 text-red-600">Şifre</label>
            <div className="flex gap-2">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="text-xs text-neutral-500 underline"
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <button 
              type="submit" 
              className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition flex items-center justify-center"
            >
              <Save size={18} className="mr-2"/> Kaydet
            </button>
            <button 
              type="button" 
              onClick={onLogout} 
              className="w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition flex items-center justify-center border border-red-200"
            >
              <LogOut size={18} className="mr-2"/> Çıkış
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

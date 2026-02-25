import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  User, 
  Building, 
  Phone, 
  MapPin, 
  Lock, 
  Sun, 
  Moon,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile, theme, toggleTheme } = useApp();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    company_name: user?.company_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateProfile(updateData);
      setSuccess('Ayarlar kaydedildi!');
      setFormData(prev => ({ ...prev, password: '' }));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-primary/10">
          <Settings size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl">Ayarlar</h1>
          <p className="text-sm text-muted-foreground">Profil ve uygulama ayarları</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-success/10 border border-success/20 text-success rounded-lg">
          {success}
        </div>
      )}

      {/* Theme Toggle */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Tema</h3>
        <div className="flex gap-4">
          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
            }`}
            data-testid="light-theme-btn"
          >
            <Sun size={24} className="mx-auto mb-2" />
            <p className="font-medium text-sm">Açık</p>
          </button>
          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
            }`}
            data-testid="dark-theme-btn"
          >
            <Moon size={24} className="mx-auto mb-2" />
            <p className="font-medium text-sm">Koyu</p>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold mb-4">Profil Bilgileri</h3>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <User size={16} className="text-muted-foreground" />
            E-posta
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full h-12 px-4 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Building size={16} className="text-muted-foreground" />
            Şirket Adı
          </label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
            placeholder="Şirket adı"
            data-testid="settings-company-input"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Phone size={16} className="text-muted-foreground" />
            Telefon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full h-12 px-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
            placeholder="0532 XXX XX XX"
            data-testid="settings-phone-input"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} className="text-muted-foreground" />
            Adres
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full h-24 p-4 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors resize-none"
            placeholder="Galeri adresi"
            data-testid="settings-address-input"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Lock size={16} className="text-muted-foreground" />
            Yeni Şifre
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full h-12 px-4 pr-12 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
              placeholder="Değiştirmek için yeni şifre girin"
              data-testid="settings-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Boş bırakırsanız şifre değişmez</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg gradient-gold text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          data-testid="save-settings-btn"
        >
          <Save size={20} />
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>

      {/* App Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Aslanbaş Oto CRM v1.0.0</p>
        <p className="mt-1">© 2024 Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
};

export default SettingsPage;

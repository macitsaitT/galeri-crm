import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: 'Aslanbaş Oto'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.companyName);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-asphalt flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full gradient-gold flex items-center justify-center mb-4 shadow-lg">
            <Car size={40} className="text-primary-foreground" />
          </div>
          <h1 className="font-heading font-bold text-3xl tracking-tight uppercase text-foreground">
            Aslanbaş Oto
          </h1>
          <p className="text-muted-foreground mt-2">Galeri CRM Sistemi</p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl animate-slide-up">
          <h2 className="font-heading font-semibold text-xl text-center mb-6">
            {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
          </h2>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4" data-testid="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Şirket adınız"
                  data-testid="company-name-input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="ornek@email.com"
                required
                data-testid="email-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 px-4 pr-12 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="toggle-password-btn"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 gradient-gold rounded-full font-heading font-bold uppercase tracking-wider text-primary-foreground shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Bekleyin...</span>
                </>
              ) : (
                <span>{isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              data-testid="toggle-auth-mode"
            >
              {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Hesabınız var mı? Giriş yapın'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-8">
          © 2024 Aslanbaş Oto. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

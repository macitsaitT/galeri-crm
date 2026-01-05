import React, { useState } from 'react';
import { X, Key, LogIn } from 'lucide-react';

export default function LoginScreen({ onLogin, onReset, error }) {
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [resetCode, setResetCode] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const success = await onReset(resetCode);
    if (success) {
      setResetMessage('Şifre başarıyla "admin" olarak sıfırlandı.');
      setTimeout(() => { setMode('login'); setResetMessage(''); setResetCode(''); }, 2000);
    } else {
      setResetMessage('Hatalı sıfırlama kodu.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-800 p-8 text-center transition-all duration-300">
        {/* Logo */}
        <div className="w-20 h-20 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-black">
            <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17v2M19 17v2M7 10h.01M17 10h.01"/>
            <path d="M14 7l-2-3-2 3"/>
          </svg>
        </div>
        <h1 className="text-2xl font-black text-black mb-2">ASLANBAŞ OTO A.Ş.</h1>
        <p className="text-neutral-500 mb-8 font-medium">
          {mode === 'login' ? 'Yönetim Paneli Girişi' : 'Şifre Sıfırlama'}
        </p>
        
        {mode === 'login' ? (
          <form onSubmit={(e) => { e.preventDefault(); onLogin(password); }} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-3.5 text-neutral-400" size={20} />
              <input 
                type="password" 
                placeholder="Şifre" 
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button 
              type="submit" 
              className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-600 transition shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn size={18}/> Giriş Yap
            </button>
            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => setMode('reset')} 
                className="text-sm text-neutral-400 hover:text-neutral-800 underline"
              >
                Şifremi Unuttum
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-3.5 text-neutral-400" size={20} />
              <input 
                type="text" 
                placeholder="Sıfırlama Kodu (123456)" 
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" 
                value={resetCode} 
                onChange={(e) => setResetCode(e.target.value)} 
              />
            </div>
            {resetMessage && (
              <p className={`text-sm font-medium ${resetMessage.includes('başarı') ? 'text-green-600' : 'text-red-500'}`}>
                {resetMessage}
              </p>
            )}
            <button 
              type="submit" 
              className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition shadow-lg"
            >
              Şifreyi Sıfırla
            </button>
            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => { setMode('login'); setResetMessage(''); }} 
                className="text-sm text-neutral-400 hover:text-neutral-800 underline"
              >
                Giriş Ekranına Dön
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

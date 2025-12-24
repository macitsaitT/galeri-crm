import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  Wallet,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  FileText,
  CheckCircle,
  Menu,
  X,
  Save,
  Trash2,
  Check,
  CreditCard,
  AlertTriangle,
  Settings,
  LogOut,
  User,
  Loader2,
  Printer,
  Phone,
  Upload,
  Edit,
  ChevronUp,
  ChevronDown,
  Download,
  KeyRound,
  RotateCcw,
  ImageIcon,
  Handshake,
  Coins,
  Building2,
  Receipt
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBLHWzRA3YCKnqPY-azW2rk6YBF6RW8rVQ",
  authDomain: "galericrm.firebaseapp.com",
  projectId: "galericrm",
  storageBucket: "galericrm.firebasestorage.app",
  messagingSenderId: "817592744736",
  appId: "1:817592744736:web:ecc3a201c030a3737c7545",
  measurementId: "G-R9TG832BDD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// App ID for Firestore paths
const appId = 'galeri-crm-app';

// --- STATIC DATA & CONSTANTS ---
const CAR_DATA = {
  "Mercedes-Benz": ["C 200", "E 200", "A 180", "CLA 200", "S 400", "Vito", "GLA 200", "GLC 250"],
  "BMW": ["320i", "520i", "118i", "X1", "X3", "X5", "418i", "iX", "i4"],
  "Audi": ["A3", "A4", "A6", "Q3", "Q5", "Q7", "A5", "Q2"],
  "Volkswagen": ["Passat", "Golf", "Polo", "Tiguan", "T-Roc", "Caddy", "Transporter", "Amarok", "Taigo"],
  "Fiat": ["Egea", "Doblo", "Fiorino", "500", "Panda", "Ducato"],
  "Renault": ["Clio", "Megane", "Taliant", "Austral", "Captur", "Kangoo", "Kadjar"],
  "Toyota": ["Corolla", "Yaris", "C-HR", "RAV4", "Hilux", "Proace", "Corolla Cross"],
  "Ford": ["Focus", "Fiesta", "Puma", "Kuga", "Ranger", "Tourneo Courier", "Transit"],
  "Honda": ["Civic", "City", "Jazz", "HR-V", "CR-V"],
  "Hyundai": ["i20", "i10", "Elantra", "Bayon", "Tucson", "Santa Fe", "Kona"],
  "Peugeot": ["208", "308", "2008", "3008", "408", "5008", "Rifter"],
  "Opel": ["Corsa", "Astra", "Mokka", "Crossland", "Grandland", "Insignia"],
  "Citroen": ["C3", "C4", "C5 Aircross", "C-Elysee", "Berlingo"],
  "Skoda": ["Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Scala"],
  "Nissan": ["Qashqai", "Juke", "X-Trail", "Micra"],
  "Dacia": ["Duster", "Sandero", "Jogger", "Spring", "Lodgy"],
  "Kia": ["Sportage", "Picanto", "Rio", "Ceed", "Stonic", "Sorento"],
  "Volvo": ["XC90", "XC60", "XC40", "S60", "S90", "V40"]
};

const PACKAGE_DATA = {
  "Mercedes-Benz": {
    "C 200": ["AMG", "Exclusive", "Avantgarde"],
    "E 200": ["AMG", "Exclusive", "Standart"],
    "A 180": ["Style", "Progressive", "AMG Line"],
  },
  "BMW": {
    "320i": ["Sport Line", "Luxury Line", "M Sport"],
    "520i": ["Executive", "M Sport"],
    "X5": ["xLine", "M Sport"],
  },
  "Volkswagen": {
      "Passat": ["Trendline", "Comfortline", "Highline"],
      "Golf": ["Comfortline", "Highline", "R-Line"],
  },
  "Renault": {
      "Clio": ["Joy", "Touch", "Icon"],
      "Megane": ["Touch", "Icon", "GT Line"],
  },
  "default": ["Standart", "Dolu Paket", "Boş Paket", "Diğer/Belirtilmemiş"]
};

const EXPENSE_CATEGORIES = ["Yol / Yakıt", "Ekspertiz", "Noter", "Bakım / Onarım", "Yıkama / Kuaför", "Komisyon", "Vergi / Sigorta", "Diğer"];
const GENERAL_EXPENSE_CATEGORIES = ["Dükkan Kirası", "Personel Maaşı", "Elektrik Faturası", "Su Faturası", "İnternet/Telefon", "Yemek Giderleri", "Ofis Malzemeleri", "Vergi Ödemesi", "Diğer"];
const DEFAULT_PROFILE = { name: 'Admin', title: 'Galeri Sahibi', phone: '0555 555 55 55', password: '1' };

const EXPERTISE_STATUSES = {
    'Orijinal': { fill: '#dcfce7', stroke: '#166534', label: 'Orijinal', text: 'ORJ', next: 'Boyalı' },
    'Boyalı': { fill: '#fef9c3', stroke: '#854d0e', label: 'Boyalı', text: 'BOY', next: 'Değişen' },
    'Değişen': { fill: '#fee2e2', stroke: '#991b1b', label: 'Değişen', text: 'DEĞ', next: 'Lokal Boyalı' },
    'Lokal Boyalı': { fill: '#dbeafe', stroke: '#1e40af', label: 'Lokal', text: 'LOK', next: 'Orijinal' },
    'İşlemli': { fill: '#fef3c7', stroke: '#b45309', text: 'İŞL' },
    'Sorunlu': { fill: '#fecaca', stroke: '#dc2626', text: 'SRN' },
};

const CAR_SVG_PATHS = [
    { id: 'on_tampon', name: 'Ön Tampon', d: 'M50,30 Q100,5 150,30 L150,45 Q100,25 50,45 Z', cx: 100, cy: 35 },
    { id: 'kaput', name: 'Kaput', d: 'M50,48 L150,48 L145,110 L55,110 Z', cx: 100, cy: 80 },
    { id: 'tavan', name: 'Tavan', d: 'M55,140 L145,140 L145,240 L55,240 Z', cx: 100, cy: 190 },
    { id: 'bagaj', name: 'Bagaj', d: 'M55,270 L145,270 L150,330 L50,330 Z', cx: 100, cy: 300 },
    { id: 'arka_tampon', name: 'Arka Tampon', d: 'M50,333 L150,333 Q100,360 50,333 Z', cx: 100, cy: 345 },
    { id: 'sol_on_camurluk', name: 'Sol Ön Çamurluk', d: 'M48,48 L15,55 L15,110 L48,110 Z', cx: 32, cy: 80 },
    { id: 'sol_on_kapi', name: 'Sol Ön Kapı', d: 'M48,113 L15,113 L15,190 L48,190 Z', cx: 32, cy: 152 },
    { id: 'sol_arka_kapi', name: 'Sol Arka Kapı', d: 'M48,193 L15,193 L15,260 L48,260 Z', cx: 32, cy: 227 },
    { id: 'sol_arka_camurluk', name: 'Sol Arka Çamurluk', d: 'M48,263 L15,263 L15,310 L50,330 L48,270 Z', cx: 32, cy: 295 },
    { id: 'sag_on_camurluk', name: 'Sağ Ön Çamurluk', d: 'M152,48 L185,55 L185,110 L152,110 Z', cx: 168, cy: 80 },
    { id: 'sag_on_kapi', name: 'Sağ Ön Kapı', d: 'M152,113 L185,113 L185,190 L152,190 Z', cx: 168, cy: 152 },
    { id: 'sag_arka_kapi', name: 'Sağ Arka Kapı', d: 'M152,193 L185,193 L185,260 L152,260 Z', cx: 168, cy: 227 },
    { id: 'sag_arka_camurluk', name: 'Sağ Arka Çamurluk', d: 'M152,263 L185,263 L185,310 L150,330 L152,270 Z', cx: 168, cy: 295 },
];

// --- HELPER FUNCTIONS ---

const formatNumberInput = (value) => {
  if (!value) return '';
  const rawValue = value.toString().replace(/\D/g, '');
  if (!rawValue) return '';
  return new Intl.NumberFormat('tr-TR').format(rawValue);
};

const parseFormattedNumber = (value) => {
  if (!value) return 0;
  const cleanValue = value.toString().replace(/\./g, '');
  return parseInt(cleanValue, 10) || 0;
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(val || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateString;
};

const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const calculateDaysDifference = (dateString) => {
  if (!dateString) return 0;
  const entryDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - entryDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getMechanicalStatusColors = (status) => {
    if (status === 'Orijinal') return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
    if (status === 'İşlemli' || status === 'Boyalı') return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
    if (status === 'Sorunlu' || status === 'Değişen') return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
    return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
};

// --- UI COMPONENTS ---

const ExpertiseVisualMap = ({ value = {}, onChange, readonly = false }) => {
    const handlePartClick = (partId) => {
        if (readonly) return;
        const currentStatus = value[partId] || 'Orijinal';
        const nextStatus = EXPERTISE_STATUSES[currentStatus].next;
        onChange(partId, nextStatus);
    };

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${readonly ? '' : 'drop-shadow-xl my-4'}`}>
                <svg width={readonly ? "160" : "200"} height={readonly ? "320" : "400"} viewBox="0 0 200 400" className="overflow-visible">
                    <rect x="5" y="60" width="10" height="40" rx="2" fill="#333" />
                    <rect x="185" y="60" width="10" height="40" rx="2" fill="#333" />
                    <rect x="5" y="270" width="10" height="40" rx="2" fill="#333" />
                    <rect x="185" y="270" width="10" height="40" rx="2" fill="#333" />
                   
                    {CAR_SVG_PATHS.map(part => {
                        const status = value[part.id] || 'Orijinal';
                        const config = EXPERTISE_STATUSES[status];
                        return (
                            <g key={part.id} onClick={() => handlePartClick(part.id)} className={readonly ? '' : 'cursor-pointer hover:opacity-90'}>
                                <path d={part.d} fill={config.fill} stroke={config.stroke} strokeWidth="2" className="transition-colors duration-200" />
                                <text x={part.cx} y={part.cy} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-extrabold pointer-events-none select-none" style={{ fill: '#374151' }}>
                                    {config.text}
                                </text>
                                <title>{part.name}: {status}</title>
                            </g>
                        );
                    })}
                    <path d="M55,113 L145,113 L145,137 L55,137 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                    <path d="M55,243 L145,243 L145,267 L55,267 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                </svg>
            </div>
            {!readonly && (
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    {Object.entries(EXPERTISE_STATUSES).filter(([key]) => key !== 'İşlemli' && key !== 'Sorunlu').map(([status, config]) => (
                        <div key={status} className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded border shadow-sm" style={{ backgroundColor: config.fill, borderColor: config.stroke }}></div>
                            <span className="text-xs font-bold text-neutral-600">{config.label}</span>
                        </div>
                    ))}
                </div>
            )}
            {!readonly && <p className="text-xs text-neutral-400 mt-2 text-center">* Durumunu değiştirmek istediğiniz parçanın üzerine tıklayın.</p>}
        </div>
    );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
  }, [onClose, message]);

  if (!message) return null;
 
  const bgClass = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-black';
  return (
    <div className={`fixed bottom-6 right-6 ${bgClass} text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3 animate-bounce-in`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
      <span className="font-medium">{typeof message === 'object' ? 'İşlem Başarılı' : message}</span>
    </div>
  );
};

const SidebarItem = ({ id, icon: Icon, label, activeView, setActiveView, onClick }) => (
  <button
    onClick={() => { setActiveView(id); if(onClick) onClick(); }}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeView === id ? 'bg-yellow-500 text-black shadow-md font-bold' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
  >
    <Icon size={18} /> <span className="font-medium text-sm">{label}</span>
  </button>
);

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-200 flex items-start justify-between h-full">
    <div className="flex-1">
      <p className="text-neutral-500 text-xs font-bold uppercase mb-2 tracking-wide">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-black break-words leading-tight">{value}</h3>
      {subtext && <p className={`text-xs mt-2 font-medium ${subtext.includes('+') ? 'text-green-600' : 'text-neutral-400'}`}>{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 shrink-0 ml-4`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
    </div>
  </div>
);

const FinanceGroupRow = ({ title, subtext, amount, percentage, children, defaultExpanded = false, type = 'neutral' }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white mb-3 shadow-sm">
      <div className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-neutral-50' : 'bg-white hover:bg-neutral-50'}`} onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${type === 'car' ? 'bg-yellow-100 text-yellow-700' : type === 'capital' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
            {type === 'car' ? <Car size={20} /> : type === 'capital' ? <Coins size={20}/> : <Building2 size={20} />}
          </div>
          <div><h4 className="font-bold text-black">{title}</h4><p className="text-xs text-neutral-500">{subtext}</p></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`font-bold ${amount > 0 ? 'text-green-600' : amount < 0 ? 'text-red-600' : 'text-neutral-400'}`}>{amount > 0 ? '+' : ''}{formatCurrency(amount)}</p>
            {percentage && <p className={`text-[10px] font-bold ${parseFloat(percentage) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{parseFloat(percentage) > 0 ? '+' : ''}%{percentage}</p>}
            <p className="text-[10px] text-neutral-400 uppercase font-bold">NET DURUM</p>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-neutral-400" /> : <ChevronDown size={20} className="text-neutral-400" />}
        </div>
      </div>
      {isExpanded && <div className="border-t border-neutral-100 bg-neutral-50/50">{children}</div>}
    </div>
  );
};

// I'll continue with modals and other components in the next part due to character limits
// ... (continuing with all the modal components)

const LoginScreen = ({ onLogin, onReset, error }) => {
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
        <div className="w-20 h-20 bg-yellow-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg"><Car size={40} className="text-black" /></div>
        <h1 className="text-2xl font-black text-black mb-2">ASLANBAŞ OTO A.Ş.</h1>
        <p className="text-neutral-500 mb-8 font-medium">{mode === 'login' ? 'Yönetim Paneli Girişi' : 'Şifre Sıfırlama'}</p>
        {mode === 'login' ? (
            <form onSubmit={(e) => {e.preventDefault(); onLogin(password)}} className="space-y-4 animate-in fade-in">
                <div className="relative"><KeyRound className="absolute left-3 top-3.5 text-neutral-400" size={20} /><input type="password" placeholder="Şifre" className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 transition shadow-lg">Giriş Yap</button>
                <div className="pt-2"><button type="button" onClick={() => setMode('reset')} className="text-sm text-neutral-400 hover:text-neutral-800 underline">Şifremi Unuttum</button></div>
            </form>
        ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4 animate-in fade-in">
                <div className="relative"><KeyRound className="absolute left-3 top-3.5 text-neutral-400" size={20} /><input type="text" placeholder="Sıfırlama Kodu (123456)" className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" value={resetCode} onChange={(e) => setResetCode(e.target.value)} /></div>
                {resetMessage && <p className={`text-sm font-medium ${resetMessage.includes('başarı') ? 'text-green-600' : 'text-red-500'}`}>{resetMessage}</p>}
                <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition shadow-lg">Şifreyi Sıfırla</button>
                <div className="pt-2"><button type="button" onClick={() => {setMode('login'); setResetMessage('');}} className="text-sm text-neutral-400 hover:text-neutral-800 underline">Giriş Ekranına Dön</button></div>
            </form>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
 
  const [activeView, setActiveView] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });

  // Load html2pdf script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // --- FIREBASE AUTHENTICATION ---
  useEffect(() => {
    const initAuth = async () => {
        try {
            await signInAnonymously(auth);
            console.log("Firebase Auth initialized");
        } catch (e) {
            console.error("Firebase Auth Error:", e);
            // Fallback: set a dummy user to proceed
            setUser({ uid: 'local-user-' + Date.now() });
            setIsAuthLoading(false);
        }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        console.log("Auth state changed:", u);
        setUser(u);
        if(u) {
            setIsAuthLoading(false);
        }
    });
    
    // Timeout fallback - if auth takes too long, proceed anyway
    const timeout = setTimeout(() => {
        if (!user) {
            console.log("Auth timeout - proceeding with local user");
            setUser({ uid: 'local-user-' + Date.now() });
            setIsAuthLoading(false);
        }
    }, 3000);
    
    return () => {
        unsubscribe();
        clearTimeout(timeout);
    };
  }, []);

  // --- FIREBASE DATA SUBSCRIPTIONS (Firestore) ---
  useEffect(() => {
    if (!user || isAuthLoading) return;
    const path = `artifacts/${appId}/users/${user.uid}`;
   
    const unsubInv = onSnapshot(collection(db, path, 'inventory'), s => {
        setInventory(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>new Date(b.entryDate)-new Date(a.entryDate)));
    }, (error) => console.error("Inventory Snapshot Error:", error));
   
    const unsubTrans = onSnapshot(collection(db, path, 'transactions'), s => {
        setTransactions(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>new Date(b.date) - new Date(a.date)));
    }, (error) => console.error("Transactions Snapshot Error:", error));
   
    const unsubProf = onSnapshot(doc(db, path, 'settings', 'profile'), d => {
        if(d.exists()) setUserProfile(d.data());
        else setDoc(doc(db, path, 'settings', 'profile'), DEFAULT_PROFILE);
    }, (error) => console.error("Profile Snapshot Error:", error));

    return () => { unsubInv(); unsubTrans(); unsubProf(); };
  }, [user, isAuthLoading]);

  const showToast = (message, type = 'success') => setToast({ message, type });
 
  // --- AUTHENTICATION LOGIC ---
  const handleLocalLogin = (pw) => {
      if (pw === userProfile.password) {
          setIsAuthenticated(true);
          setLoginError('');
      } else {
          setLoginError('Hatalı şifre.');
      }
  };
 
  const handleLocalLogout = () => { setIsAuthenticated(false); };
 
  const handlePasswordReset = async (code) => {
      if (code === '123456' && user) {
          try {
              const path = `artifacts/${appId}/users/${user.uid}`;
              await setDoc(doc(db, path, 'settings', 'profile'), { ...userProfile, password: 'admin' }, { merge: true });
              setUserProfile(prev => ({ ...prev, password: 'admin' }));
              return true;
          } catch (e) {
              console.error("Reset error:", e);
              return false;
          }
      }
      return false;
  };

  if (isAuthLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2"/> Uygulama Yükleniyor...</div>;
  if (!isAuthenticated) return <LoginScreen onLogin={handleLocalLogin} onReset={handlePasswordReset} error={loginError} />;

  return (
    <div className="flex h-screen bg-white font-sans text-neutral-900 overflow-hidden">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
     
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
     
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">ASLANBAŞ</h1>
            <span className="text-[10px] text-neutral-400 tracking-widest">YÖNETİM PANELİ</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-neutral-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
            <SidebarItem id="dashboard" icon={LayoutDashboard} label="Genel Bakış" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="inventory" icon={Car} label="Stok Araçlar" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="finance" icon={Wallet} label="Gelir & Gider" activeView={activeView} setActiveView={setActiveView} />
        </div>
        <div className="p-4 border-t border-neutral-800">
            <div className="flex items-center gap-3 w-full p-2 rounded transition">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">{userProfile.name?.[0]}</div>
                <div className="text-left">
                    <p className="text-sm font-bold">{userProfile.name}</p>
                    <p className="text-xs text-neutral-400">{userProfile.title}</p>
                </div>
                <button onClick={handleLocalLogout} className="ml-auto text-neutral-500 hover:text-white"><LogOut size={16}/></button>
            </div>
        </div>
      </aside>
     
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-neutral-600"><Menu size={24} /></button>
            <h2 className="font-bold text-xl text-black capitalize">
              {activeView === 'dashboard' ? 'Genel Bakış' : activeView === 'inventory' ? 'Stok Araçlar' : 'Finans Yönetimi'}
            </h2>
          </div>
        </header>
       
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            {activeView === 'dashboard' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <StatCard title="Stok Araç Sayısı" value={inventory.filter(c => c.ownership === 'stock' && c.status !== 'Satıldı').length} icon={Car} colorClass="bg-black text-white"/>
                        <StatCard title="Konsinye Araç Sayısı" value={inventory.filter(c => c.ownership === 'consignment' && c.status !== 'Satıldı').length} icon={Handshake} colorClass="bg-purple-600 text-white"/>
                        <StatCard title="Kaporası Alınan" value={inventory.filter(c => c.status === 'Kapora Alındı').length} icon={CreditCard} colorClass="bg-orange-500 text-white"/>
                        <StatCard title="Bu Ay Satış" value={transactions.filter(t => t.type === 'income' && t.category === 'Araç Satışı' && t.date.startsWith(new Date().toISOString().substring(0, 7))).length} icon={TrendingUp} colorClass="bg-green-600 text-white"/>
                        <StatCard title="Kasa Durumu" value={formatCurrency(transactions.reduce((acc, t) => acc + (t.type === 'income' ? (Number(t.amount) || 0) : -(Number(t.amount) || 0)), 0))} icon={Wallet} colorClass="bg-yellow-500 text-black"/>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <h3 className="font-bold text-lg mb-4">Hoş Geldiniz!</h3>
                        <p className="text-neutral-600">ASLANBAŞ OTO A.Ş. Yönetim Paneline hoş geldiniz. Sol menüden istediğiniz bölüme geçebilirsiniz.</p>
                    </div>
                </div>
            )}
            {activeView === 'inventory' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
                        {inventory.length > 0 ? (
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-4">Araç Listesi</h3>
                                <div className="space-y-2">
                                    {inventory.map(car => (
                                        <div key={car.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold">{car.brand} {car.model} ({car.year})</p>
                                                    <p className="text-sm text-neutral-500">{car.plate?.toUpperCase()} • {car.km} KM</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600">{formatCurrency(car.salePrice)}</p>
                                                    <span className={`text-xs px-2 py-1 rounded ${car.status === 'Satıldı' ? 'bg-neutral-100' : car.status === 'Kapora Alındı' ? 'bg-orange-100' : 'bg-green-100'}`}>
                                                        {car.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center text-neutral-400">Henüz araç kaydı yok.</div>
                        )}
                    </div>
                </div>
            )}
            {activeView === 'finance' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-black">Gelir & Gider Yönetimi</h2>
                    <FinanceGroupRow 
                        title="Genel İşletme (Net)" 
                        subtext="Tüm İşlemler" 
                        amount={transactions.reduce((acc,t)=>acc+(t.type==='income'?t.amount:-t.amount),0)} 
                        type='capital'
                    >
                        <div className="space-y-2 p-4">
                            {transactions.map(t=>(
                                <div key={t.id} className="flex justify-between text-sm p-2 border-b">
                                    <span className="text-neutral-500">{formatDate(t.date)} - {t.category} ({t.description})</span>
                                    <span className={t.type==='income'?'text-green-600':'text-red-600'}>
                                        {t.type==='income'?'+':'-'}{formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </FinanceGroupRow>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}

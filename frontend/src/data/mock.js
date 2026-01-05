// Mock data for Galeri CRM

// Araba markaları ve modelleri
export const CAR_DATA = {
  "Mercedes-Benz": ["C 180", "C 200", "C 220", "C 300", "E 180", "E 200", "E 220", "E 300", "A 160", "A 180", "A 200", "CLA 180", "CLA 200", "GLA 180", "GLA 200", "GLC 200", "GLC 220", "GLC 250"],
  "BMW": ["116i", "118i", "120i", "218i", "220i", "316i", "318i", "320i", "330i", "420i", "430i", "520i", "530i", "X1", "X2", "X3", "X4", "X5"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "Q2", "Q3", "Q5", "Q7", "TT"],
  "Volkswagen": ["Polo", "Golf", "Jetta", "Passat", "Arteon", "T-Cross", "T-Roc", "Tiguan", "Touareg"],
  "Fiat": ["500", "500X", "Panda", "Tipo", "Egea", "Doblo"],
  "Renault": ["Clio", "Megane", "Taliant", "Talisman", "Captur", "Kadjar", "Koleos"],
  "Toyota": ["Yaris", "Corolla", "Camry", "C-HR", "RAV4", "Highlander"],
  "Ford": ["Fiesta", "Focus", "Mondeo", "Puma", "Kuga", "Explorer"],
  "Honda": ["Jazz", "Civic", "Accord", "HR-V", "CR-V"],
  "Hyundai": ["i10", "i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona"]
};

// Motor ve Paket verileri
export const VEHICLE_DATA = {
  "Toyota": {
    "Corolla": {
      "1.2 T": ["Dream", "Flame", "Vision", "Standart"],
      "1.6": ["Terra", "Comfort", "Elegant", "Standart"],
      "1.8 Hybrid": ["Dream", "Flame", "Passion", "Vision", "Standart"]
    }
  },
  "Volkswagen": {
    "Passat": {
      "1.4 TSI": ["Trendline", "Comfortline", "Highline", "R-Line", "Standart"],
      "1.6 TDI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "2.0 TDI": ["Comfortline", "Highline", "R-Line", "Standart"]
    }
  },
  "default": {
    "default": {
      "default": ["Standart", "Comfort", "Premium", "Sport", "Full", "Diğer"]
    }
  }
};

export const EXPENSE_CATEGORIES = ["Yol / Yakıt", "Ekspertiz", "Noter", "Bakım / Onarım", "Yıkama / Kuaför", "Komisyon", "Vergi / Sigorta", "Araç Sahibine Ödeme", "Çalışan Payı", "Diğer"];

export const GENERAL_EXPENSE_CATEGORIES = ["Dükkan Kirası", "Personel Maaşı", "Elektrik Faturası", "Su Faturası", "İnternet/Telefon", "Yemek Giderleri", "Ofis Malzemeleri", "Vergi Ödemesi", "Diğer"];

export const DEFAULT_PROFILE = { 
  name: 'Admin', 
  title: 'Galeri Sahibi', 
  phone: '0555 555 55 55', 
  password: '1',
  logo: null
};

// Ekspertiz durumları
export const EXPERTISE_STATUSES = {
  'Orijinal': { fill: '#dcfce7', stroke: '#166534', label: 'Orijinal', text: 'ORJ', next: 'Boyalı' },
  'Boyalı': { fill: '#fef9c3', stroke: '#854d0e', label: 'Boyalı', text: 'BOY', next: 'Değişen' },
  'Değişen': { fill: '#fee2e2', stroke: '#991b1b', label: 'Değişen', text: 'DEĞ', next: 'Lokal Boyalı' },
  'Lokal Boyalı': { fill: '#dbeafe', stroke: '#1e40af', label: 'Lokal', text: 'LOK', next: 'Orijinal' },
  'İşlemli': { fill: '#fef3c7', stroke: '#b45309', text: 'İŞL' },
  'Sorunlu': { fill: '#fecaca', stroke: '#dc2626', text: 'SRN' }
};

// SVG araç parçaları
export const CAR_SVG_PATHS = [
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
  { id: 'sag_arka_camurluk', name: 'Sağ Arka Çamurluk', d: 'M152,263 L185,263 L185,310 L150,330 L152,270 Z', cx: 168, cy: 295 }
];

// Demo envanter verileri
export const mockInventory = [
  {
    id: '1',
    brand: 'Mercedes-Benz',
    model: 'C 200',
    year: 2021,
    plate: '34 ABC 123',
    km: '45.000',
    vehicleType: 'Sedan',
    purchasePrice: 1850000,
    salePrice: 2150000,
    description: 'Tek elden kullanılmış, garaj aracı. Servis bakımlı, hasar kaydı yoktur.',
    status: 'Stokta',
    entryDate: '2025-06-15',
    inspectionDate: '2026-06-15',
    fuelType: 'Benzin',
    gear: 'Otomatik',
    ownership: 'stock',
    ownerName: '',
    ownerPhone: '',
    photos: [],
    expertise: {
      body: { kaput: 'Orijinal', tavan: 'Orijinal', bagaj: 'Boyalı' },
      Motor: 'Orijinal',
      Şanzıman: 'Orijinal',
      Yürüyen: 'Orijinal',
      score: 92
    },
    packageInfo: 'AMG Line',
    engineType: '1.5'
  },
  {
    id: '2',
    brand: 'BMW',
    model: '320i',
    year: 2020,
    plate: '06 DEF 456',
    km: '68.000',
    vehicleType: 'Sedan',
    purchasePrice: 1650000,
    salePrice: 1950000,
    description: 'M Sport paketli, sunroof, hafıza koltuk.',
    status: 'Kapora Alındı',
    depositAmount: 50000,
    entryDate: '2025-06-01',
    inspectionDate: '2025-12-01',
    fuelType: 'Benzin',
    gear: 'Otomatik',
    ownership: 'stock',
    photos: [],
    expertise: {
      body: { kaput: 'Orijinal', sol_on_camurluk: 'Boyalı' },
      Motor: 'Orijinal',
      Şanzıman: 'Orijinal',
      Yürüyen: 'Orijinal',
      score: 88
    },
    packageInfo: 'M Sport',
    engineType: '2.0'
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Passat',
    year: 2019,
    plate: '35 GHI 789',
    km: '95.000',
    vehicleType: 'Sedan',
    purchasePrice: 1100000,
    salePrice: 1350000,
    description: 'Highline paket, panoramik cam tavan, LED far.',
    status: 'Stokta',
    entryDate: '2025-05-20',
    inspectionDate: '2025-08-20',
    fuelType: 'Dizel',
    gear: 'Otomatik',
    ownership: 'consignment',
    ownerName: 'Ahmet Yılmaz',
    ownerPhone: '05321234567',
    commissionRate: 5,
    photos: [],
    expertise: {
      body: { kaput: 'Orijinal', tavan: 'Orijinal' },
      Motor: 'Orijinal',
      Şanzıman: 'Orijinal',
      Yürüyen: 'Orijinal',
      score: 95
    },
    packageInfo: 'Highline',
    engineType: '2.0 TDI'
  },
  {
    id: '4',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    plate: '34 JKL 012',
    km: '32.000',
    vehicleType: 'Sedan',
    purchasePrice: 1400000,
    salePrice: 1650000,
    description: 'Hybrid motor, yakıt tasarrufu. Servis bakımlı.',
    status: 'Satıldı',
    soldDate: '2025-07-01',
    entryDate: '2025-04-10',
    fuelType: 'Hibrit',
    gear: 'Otomatik',
    ownership: 'stock',
    photos: [],
    expertise: {
      body: {},
      Motor: 'Orijinal',
      Şanzıman: 'Orijinal',
      Yürüyen: 'Orijinal',
      score: 98
    },
    packageInfo: 'Flame',
    engineType: '1.8 Hybrid',
    customerName: 'Mehmet Öztürk',
    customerId: '1'
  }
];

// Demo müşteri verileri
export const mockCustomers = [
  {
    id: '1',
    name: 'Mehmet Öztürk',
    phone: '05301234567',
    type: 'Alıcı',
    notes: 'Toyota Corolla satın aldı.',
    interestedCarId: '',
    createdAt: '2025-06-01'
  },
  {
    id: '2',
    name: 'Ayşe Kaya',
    phone: '05429876543',
    type: 'Potansiyel',
    notes: 'Mercedes C serisi arıyor, bütçesi 2M civarı.',
    interestedCarId: '1',
    createdAt: '2025-06-10'
  },
  {
    id: '3',
    name: 'Ali Demir',
    phone: '05551112233',
    type: 'Satıcı',
    notes: 'Audi A4 satmak istiyor.',
    interestedCarId: '',
    createdAt: '2025-06-15'
  }
];

// Demo işlem/hareket verileri
export const mockTransactions = [
  {
    id: '1',
    type: 'expense',
    category: 'Araç Alımı',
    description: '34 ABC 123 - Mercedes-Benz Alışı',
    amount: 1850000,
    carId: '1',
    date: '2025-06-15',
    createdAt: '2025-06-15'
  },
  {
    id: '2',
    type: 'expense',
    category: 'Araç Alımı',
    description: '06 DEF 456 - BMW Alışı',
    amount: 1650000,
    carId: '2',
    date: '2025-06-01',
    createdAt: '2025-06-01'
  },
  {
    id: '3',
    type: 'expense',
    category: 'Araç Alımı',
    description: '34 JKL 012 - Toyota Alışı',
    amount: 1400000,
    carId: '4',
    date: '2025-04-10',
    createdAt: '2025-04-10'
  },
  {
    id: '4',
    type: 'income',
    category: 'Araç Satışı',
    description: 'Satış - 34 JKL 012 Toyota Corolla',
    amount: 1650000,
    carId: '4',
    date: '2025-07-01',
    createdAt: '2025-07-01'
  },
  {
    id: '5',
    type: 'income',
    category: 'Kapora',
    description: 'Kapora - 06 DEF 456',
    amount: 50000,
    carId: '2',
    date: '2025-06-20',
    createdAt: '2025-06-20'
  },
  {
    id: '6',
    type: 'expense',
    category: 'Bakım / Onarım',
    description: 'Bakım / Onarım - 34 ABC 123 (Fren balatası değişimi)',
    amount: 8500,
    carId: '1',
    date: '2025-06-18',
    createdAt: '2025-06-18'
  },
  {
    id: '7',
    type: 'expense',
    category: 'Dükkan Kirası',
    description: 'Temmuz ayı kira ödemesi',
    amount: 45000,
    carId: null,
    date: '2025-07-01',
    createdAt: '2025-07-01'
  },
  {
    id: '8',
    type: 'expense',
    category: 'Personel Maaşı',
    description: 'Haziran ayı maaş ödemeleri',
    amount: 85000,
    carId: null,
    date: '2025-07-05',
    createdAt: '2025-07-05'
  },
  {
    id: '9',
    type: 'expense',
    category: 'Elektrik Faturası',
    description: 'Haziran ayı elektrik faturası',
    amount: 3500,
    carId: null,
    date: '2025-07-03',
    createdAt: '2025-07-03'
  }
];

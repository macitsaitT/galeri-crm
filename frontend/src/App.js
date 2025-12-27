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
  AlertCircle,
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
  // İsim eşleşmeleri için alias kullanımı
  Key as KeyRound,
  RefreshCw as RotateCcw,
  Camera as ImageIcon,
  Briefcase as Handshake,
  DollarSign as Coins,
  Building as Building2,
  Scroll as Receipt
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

const appId = 'galeri-crm-app';

// --- STATIC DATA & CONSTANTS ---
const CAR_DATA = {
  "Mercedes-Benz": ["C 180", "C 200", "C 220", "C 300", "E 180", "E 200", "E 220", "E 300", "A 160", "A 180", "A 200", "A 250", "CLA 180", "CLA 200", "CLA 220", "CLA 250", "S 350", "S 400", "S 500", "Vito", "V-Class", "GLA 180", "GLA 200", "GLA 220", "GLC 200", "GLC 220", "GLC 250", "GLC 300", "GLE 300", "GLE 350", "GLE 450", "GLS 350", "GLS 400", "GLS 450"],
  "BMW": ["116i", "118i", "120i", "218i", "220i", "316i", "318i", "320i", "330i", "420i", "430i", "520i", "530i", "540i", "730i", "740i", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX", "iX3"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "e-tron", "e-tron GT"],
  "Volkswagen": ["Polo", "Golf", "Jetta", "Passat", "Arteon", "T-Cross", "T-Roc", "Tiguan", "Touareg", "Caddy", "Transporter", "Caravelle", "Amarok", "Taigo", "ID.3", "ID.4", "ID.5"],
  "Fiat": ["500", "500X", "500L", "Panda", "Tipo", "Egea", "Doblo", "Fiorino", "Ducato", "Fullback"],
  "Renault": ["Clio", "Megane", "Fluence", "Taliant", "Talisman", "Captur", "Kadjar", "Koleos", "Austral", "Arkana", "Kangoo", "Trafic", "Master", "Zoe"],
  "Toyota": ["Yaris", "Corolla", "Camry", "Avensis", "C-HR", "RAV4", "Highlander", "Land Cruiser", "Hilux", "Proace", "Proace City", "Corolla Cross", "bZ4X"],
  "Ford": ["Fiesta", "Focus", "Mondeo", "Mustang", "EcoSport", "Puma", "Kuga", "Explorer", "Edge", "Ranger", "Transit", "Transit Custom", "Transit Courier", "Tourneo", "Tourneo Custom", "Tourneo Courier"],
  "Honda": ["Jazz", "Civic", "Accord", "City", "HR-V", "CR-V", "e"],
  "Hyundai": ["i10", "i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona", "Bayon", "Ioniq", "Ioniq 5", "Ioniq 6", "Staria"],
  "Peugeot": ["108", "208", "308", "508", "2008", "3008", "5008", "Rifter", "Traveller", "Partner", "Expert", "Boxer"],
  "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Movano", "Zafira"],
  "Citroen": ["C1", "C3", "C4", "C5 X", "C5 Aircross", "C-Elysee", "Berlingo", "Spacetourer", "Jumpy", "Jumper"],
  "Skoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
  "Nissan": ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Navara", "Leaf"],
  "Dacia": ["Sandero", "Logan", "Duster", "Jogger", "Spring", "Lodgy", "Dokker"],
  "Kia": ["Picanto", "Rio", "Ceed", "Proceed", "Stinger", "Stonic", "Niro", "Sportage", "Sorento", "EV6", "EV9"],
  "Volvo": ["V40", "V60", "V90", "S60", "S90", "XC40", "XC60", "XC90", "C40", "EX30", "EX90"],
  "Seat": ["Ibiza", "Leon", "Ateca", "Arona", "Tarraco"],
  "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5"],
  "Suzuki": ["Swift", "Baleno", "Vitara", "S-Cross", "Jimny", "Ignis"],
  "Mitsubishi": ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover Evoque", "Range Rover Velar", "Range Rover Sport", "Range Rover"],
  "Mini": ["Mini 3 Door", "Mini 5 Door", "Mini Clubman", "Mini Countryman", "Mini Cabrio"],
  "Alfa Romeo": ["Giulietta", "Giulia", "Stelvio", "Tonale"],
  "Porsche": ["718", "911", "Panamera", "Macan", "Cayenne", "Taycan"]
};

// Motor Tipleri ve Paketleri - Sahibinden.com formatında
// Yapı: VEHICLE_DATA[marka][model][motor] = [paketler]
const VEHICLE_DATA = {
  "Toyota": {
    "Corolla": {
      "1.2 T": ["Dream", "Flame", "Vision", "Standart"],
      "1.3": ["Terra", "Comfort", "Elegant", "Standart"],
      "1.33": ["Life", "Fun", "Elegant", "Standart"],
      "1.4": ["Terra", "Comfort", "Elegant", "Standart"],
      "1.4 D-4D": ["Terra", "Comfort", "Elegant", "Active", "Standart"],
      "1.5": ["Dream", "Flame", "Vision", "Standart"],
      "1.6": ["Terra", "Comfort", "Elegant", "Executive", "Standart"],
      "1.8": ["Dream", "Dream X-Pack", "Flame", "Flame X-Pack", "Passion", "Passion X-Pack", "Vision", "Vision Plus", "Standart"],
      "1.8 Hybrid": ["Dream", "Dream X-Pack", "Flame", "Flame X-Pack", "Passion", "Passion X-Pack", "Vision", "Vision Plus", "Standart"],
      "2.0": ["Dream", "Flame", "Passion", "Standart"],
      "2.0 D-4D": ["Terra", "Comfort", "Elegant", "Executive", "Standart"],
      "2.2 D-4D": ["Elegant", "Executive", "Standart"]
    },
    "Yaris": {
      "1.0": ["Active", "Fun", "Standart"],
      "1.0 VVT-i": ["Active", "Fun", "Cool", "Standart"],
      "1.3": ["Active", "Fun", "Cool", "Sol", "Standart"],
      "1.33": ["Active", "Fun", "Cool", "Sol", "Life", "Standart"],
      "1.4 D-4D": ["Active", "Sol", "Executive", "Standart"],
      "1.5": ["Dream", "Flame", "Vision", "Standart"],
      "1.5 Hybrid": ["Dream", "Flame", "Vision", "Style", "Standart"]
    },
    "C-HR": {
      "1.2 T": ["Dream", "Flame", "Passion", "Standart"],
      "1.8 Hybrid": ["Dream", "Dream X-Pack", "Flame", "Flame X-Pack", "Passion", "Passion X-Pack", "Standart"],
      "2.0 Hybrid": ["Dream", "Flame", "Passion", "Passion X-Pack", "Standart"]
    },
    "RAV4": {
      "2.0": ["Dream", "Flame", "Passion", "Adventure", "Standart"],
      "2.0 D-4D": ["Active", "Elegant", "Executive", "Standart"],
      "2.2 D-4D": ["Active", "Elegant", "Executive", "Standart"],
      "2.5 Hybrid": ["Dream", "Flame", "Passion", "Adventure", "Standart"]
    },
    "Corolla Cross": {
      "1.8 Hybrid": ["Dream", "Flame", "Passion", "Adventure", "Standart"],
      "2.0 Hybrid": ["Dream", "Flame", "Passion", "Adventure", "Standart"]
    },
    "Camry": {
      "2.0": ["Passion", "Executive", "Standart"],
      "2.5": ["Passion", "Executive", "Standart"],
      "2.5 Hybrid": ["Passion", "Passion Advanced", "Executive", "Standart"]
    },
    "Hilux": {
      "2.4 D-4D": ["Life", "Style", "Adventure", "Standart"],
      "2.8 D-4D": ["Style", "Adventure", "Invincible", "Standart"]
    }
  },
  "Volkswagen": {
    "Passat": {
      "1.4 TSI": ["Trendline", "Comfortline", "Highline", "R-Line", "Standart"],
      "1.5 TSI": ["Business", "Elegance", "R-Line", "Standart"],
      "1.6 TDI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "2.0 TDI": ["Comfortline", "Highline", "R-Line", "Elegance", "Standart"]
    },
    "Golf": {
      "1.0 TSI": ["Trendline", "Comfortline", "Standart"],
      "1.2 TSI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "1.4 TSI": ["Comfortline", "Highline", "R-Line", "Standart"],
      "1.5 TSI": ["Life", "Style", "R-Line", "Standart"],
      "1.6 TDI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "2.0 TDI": ["Comfortline", "Highline", "R-Line", "Standart"],
      "2.0 TSI GTI": ["GTI", "GTI Performance", "Clubsport", "Standart"]
    },
    "Polo": {
      "1.0": ["Trendline", "Comfortline", "Standart"],
      "1.0 TSI": ["Life", "Style", "R-Line", "Standart"],
      "1.2 TSI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "1.4 TDI": ["Trendline", "Comfortline", "Standart"],
      "1.6 TDI": ["Comfortline", "Highline", "Standart"]
    },
    "Tiguan": {
      "1.4 TSI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "1.5 TSI": ["Life", "Elegance", "R-Line", "Standart"],
      "2.0 TDI": ["Comfortline", "Highline", "R-Line", "Elegance", "Standart"],
      "2.0 TSI": ["R-Line", "R", "Standart"]
    },
    "T-Roc": {
      "1.0 TSI": ["Life", "Style", "Standart"],
      "1.5 TSI": ["Life", "Style", "R-Line", "Standart"],
      "2.0 TDI": ["Style", "R-Line", "Standart"]
    }
  },
  "Fiat": {
    "Egea": {
      "1.3 MultiJet": ["Easy", "Urban", "Lounge", "Cross", "Standart"],
      "1.4": ["Easy", "Urban", "Urban Plus", "Lounge", "Standart"],
      "1.4 T-Jet": ["Urban Plus", "Lounge", "Cross Plus", "Standart"],
      "1.6 MultiJet": ["Urban", "Urban Plus", "Lounge", "Cross", "Cross Plus", "Standart"]
    },
    "500": {
      "0.9 TwinAir": ["Pop", "Lounge", "Sport", "Standart"],
      "1.0 Hybrid": ["Pop", "Lounge", "La Prima", "Standart"],
      "1.2": ["Pop", "Lounge", "Sport", "Standart"],
      "1.4": ["Sport", "Abarth", "Standart"]
    },
    "Doblo": {
      "1.3 MultiJet": ["Easy", "Safeline", "Premio", "Standart"],
      "1.6 MultiJet": ["Easy", "Safeline", "Premio", "Trekking", "Standart"]
    },
    "Tipo": {
      "1.3 MultiJet": ["Easy", "City Life", "Standart"],
      "1.4": ["Easy", "City Life", "Life", "Standart"],
      "1.6": ["Life", "Cross", "Standart"],
      "1.6 MultiJet": ["City Life", "Life", "Cross", "Sport", "Standart"]
    }
  },
  "Renault": {
    "Clio": {
      "0.9 TCe": ["Joy", "Touch", "Icon", "Standart"],
      "1.0 TCe": ["Joy", "Touch", "Icon", "RS Line", "Standart"],
      "1.2": ["Authentique", "Expression", "Standart"],
      "1.3 TCe": ["Touch", "Icon", "Techno", "RS Line", "Standart"],
      "1.5 dCi": ["Joy", "Touch", "Icon", "Standart"]
    },
    "Megane": {
      "1.2 TCe": ["Joy", "Touch", "Icon", "Standart"],
      "1.3 TCe": ["Joy", "Touch", "Icon", "RS Line", "Standart"],
      "1.5 dCi": ["Joy", "Touch", "Icon", "Standart"],
      "1.6": ["Expression", "Privilege", "Dynamique", "Standart"]
    },
    "Captur": {
      "0.9 TCe": ["Joy", "Touch", "Standart"],
      "1.0 TCe": ["Joy", "Touch", "Icon", "Standart"],
      "1.3 TCe": ["Touch", "Icon", "Techno", "RS Line", "Standart"],
      "1.5 dCi": ["Joy", "Touch", "Icon", "Standart"]
    },
    "Taliant": {
      "1.0 TCe": ["Joy", "Touch", "Techno", "Standart"],
      "1.0 SCe": ["Joy", "Touch", "Standart"]
    }
  },
  "Hyundai": {
    "i10": {
      "1.0": ["Jump", "Style", "Standart"],
      "1.2": ["Style", "Elite", "Standart"]
    },
    "i20": {
      "1.0 T-GDI": ["Style", "Elite", "Elite Plus", "N Line", "Standart"],
      "1.2": ["Jump", "Style", "Standart"],
      "1.4": ["Style", "Elite", "Elite Plus", "Standart"],
      "1.4 CRDi": ["Style", "Elite", "Elite Plus", "Standart"]
    },
    "i30": {
      "1.0 T-GDI": ["Style", "Elite", "Standart"],
      "1.4": ["Style", "Elite", "Standart"],
      "1.5": ["Style", "Elite", "Elite Plus", "N Line", "Standart"],
      "1.6": ["Style", "Elite", "Elite Plus", "Standart"],
      "1.6 CRDi": ["Style", "Elite", "Elite Plus", "Standart"],
      "2.0 N": ["N", "N Performance", "Standart"]
    },
    "Tucson": {
      "1.6": ["Style", "Elite", "Standart"],
      "1.6 CRDi": ["Style", "Elite", "Elite Plus", "Standart"],
      "1.6 T-GDI": ["Style", "Elite", "Elite Plus", "N Line", "Standart"],
      "2.0": ["Style", "Elite", "Standart"],
      "2.0 CRDi": ["Style", "Elite", "Elite Plus", "Standart"]
    },
    "Kona": {
      "1.0 T-GDI": ["Style", "Elite", "Standart"],
      "1.6 CRDi": ["Style", "Elite", "Elite Plus", "Standart"],
      "1.6 T-GDI": ["Style", "Elite", "Elite Plus", "N Line", "Standart"],
      "Elektrik": ["Style", "Elite", "Elite Plus", "Standart"]
    }
  },
  "Mercedes-Benz": {
    "C 180": {
      "1.6": ["Avantgarde", "AMG Line", "Exclusive", "Standart"]
    },
    "C 200": {
      "1.5": ["Avantgarde", "AMG Line", "Exclusive", "Standart"],
      "2.0": ["Avantgarde", "AMG Line", "Exclusive", "Standart"]
    },
    "C 220": {
      "2.0 d": ["Avantgarde", "AMG Line", "Exclusive", "Standart"],
      "2.1 CDI": ["Avantgarde", "AMG Line", "Standart"]
    },
    "E 200": {
      "2.0": ["Avantgarde", "AMG Line", "Exclusive", "Standart"]
    },
    "E 220": {
      "2.0 d": ["Avantgarde", "AMG Line", "Exclusive", "Standart"],
      "2.1 CDI": ["Avantgarde", "AMG Line", "Standart"]
    },
    "A 180": {
      "1.3": ["Style", "Progressive", "AMG Line", "Standart"],
      "1.5 d": ["Style", "Progressive", "AMG Line", "Standart"]
    },
    "A 200": {
      "1.3": ["Style", "Progressive", "AMG Line", "Standart"],
      "2.0": ["AMG Line", "Edition 1", "Standart"]
    },
    "GLC 200": {
      "2.0": ["Avantgarde", "AMG Line", "Exclusive", "Standart"]
    },
    "GLC 250": {
      "2.0": ["Avantgarde", "AMG Line", "Exclusive", "Standart"],
      "2.0 d": ["Avantgarde", "AMG Line", "Exclusive", "Standart"]
    }
  },
  "BMW": {
    "320i": {
      "2.0": ["Sport Line", "Luxury Line", "M Sport", "Standart"]
    },
    "320d": {
      "2.0 d": ["Sport Line", "Luxury Line", "M Sport", "Standart"]
    },
    "520i": {
      "2.0": ["Executive", "Luxury Line", "M Sport", "Standart"]
    },
    "520d": {
      "2.0 d": ["Executive", "Luxury Line", "M Sport", "Standart"]
    },
    "X1": {
      "1.5": ["sDrive16i", "sDrive18i", "Standart"],
      "2.0": ["sDrive20i", "xDrive20i", "M Sport", "Standart"],
      "2.0 d": ["sDrive18d", "xDrive20d", "M Sport", "Standart"]
    },
    "X3": {
      "2.0": ["xDrive20i", "M Sport", "Standart"],
      "2.0 d": ["xDrive20d", "M Sport", "Standart"],
      "3.0": ["xDrive30i", "M40i", "Standart"]
    }
  },
  "Ford": {
    "Focus": {
      "1.0 EcoBoost": ["Trend", "Titanium", "ST-Line", "Standart"],
      "1.5 EcoBoost": ["Titanium", "ST-Line", "Vignale", "Standart"],
      "1.5 TDCi": ["Trend", "Titanium", "ST-Line", "Standart"],
      "2.0 TDCi": ["Titanium", "ST-Line", "Vignale", "Standart"]
    },
    "Fiesta": {
      "1.0 EcoBoost": ["Trend", "Titanium", "ST-Line", "Standart"],
      "1.1": ["Trend", "Titanium", "Standart"],
      "1.4 TDCi": ["Trend", "Titanium", "Standart"],
      "1.5 TDCi": ["Titanium", "ST-Line", "Standart"]
    },
    "Puma": {
      "1.0 EcoBoost": ["Titanium", "ST-Line", "Standart"],
      "1.0 EcoBoost Hybrid": ["Titanium", "ST-Line", "Vignale", "Standart"],
      "1.5 EcoBoost": ["ST-Line", "ST", "Standart"]
    },
    "Kuga": {
      "1.5 EcoBoost": ["Titanium", "ST-Line", "Standart"],
      "1.5 TDCi": ["Trend", "Titanium", "Standart"],
      "2.0 TDCi": ["Titanium", "ST-Line", "Vignale", "Standart"],
      "2.5 Hybrid": ["Titanium", "ST-Line", "Vignale", "Standart"]
    }
  },
  "Honda": {
    "Civic": {
      "1.0 VTEC Turbo": ["Comfort", "Elegance", "Executive", "Standart"],
      "1.5 VTEC Turbo": ["Elegance", "Executive", "Sport", "Standart"],
      "1.6 i-DTEC": ["Comfort", "Elegance", "Executive", "Standart"],
      "2.0 Type R": ["Type R", "Type R GT", "Standart"]
    },
    "Jazz": {
      "1.3": ["Comfort", "Elegance", "Standart"],
      "1.5 Hybrid": ["Elegance", "Executive", "Crosstar", "Standart"]
    },
    "CR-V": {
      "1.5 VTEC Turbo": ["Comfort", "Elegance", "Executive", "Lifestyle", "Standart"],
      "2.0 Hybrid": ["Elegance", "Executive", "Lifestyle", "Standart"],
      "2.2 i-DTEC": ["Elegance", "Executive", "Lifestyle", "Standart"]
    }
  },
  "Peugeot": {
    "208": {
      "1.0 VTi": ["Access", "Active", "Standart"],
      "1.2 PureTech": ["Active", "Allure", "GT Line", "GT", "Standart"],
      "1.5 BlueHDi": ["Active", "Allure", "GT Line", "Standart"],
      "e-208 Elektrik": ["Active", "Allure", "GT", "Standart"]
    },
    "308": {
      "1.2 PureTech": ["Active", "Allure", "GT Line", "GT", "Standart"],
      "1.5 BlueHDi": ["Active", "Allure", "GT Line", "Standart"],
      "1.6 THP": ["GT Line", "GT", "Standart"]
    },
    "3008": {
      "1.2 PureTech": ["Active", "Allure", "GT Line", "Standart"],
      "1.5 BlueHDi": ["Active", "Allure", "GT Line", "GT", "Standart"],
      "1.6 THP": ["Allure", "GT Line", "GT", "Standart"],
      "2.0 BlueHDi": ["Allure", "GT Line", "GT", "Standart"],
      "Hybrid": ["Allure", "GT Line", "GT", "Standart"]
    }
  },
  "Opel": {
    "Corsa": {
      "1.0": ["Essentia", "Edition", "Standart"],
      "1.2": ["Edition", "Elegance", "GS Line", "Standart"],
      "1.2 Turbo": ["Edition", "Elegance", "GS Line", "Ultimate", "Standart"],
      "1.4": ["Essentia", "Enjoy", "Standart"],
      "1.5 D": ["Edition", "Elegance", "GS Line", "Standart"],
      "e-Corsa Elektrik": ["Edition", "Elegance", "GS Line", "Ultimate", "Standart"]
    },
    "Astra": {
      "1.2 Turbo": ["Edition", "Elegance", "GS Line", "Standart"],
      "1.4": ["Essentia", "Enjoy", "Standart"],
      "1.4 Turbo": ["Enjoy", "Excellence", "Standart"],
      "1.5 D": ["Edition", "Elegance", "GS Line", "Standart"],
      "1.6 CDTI": ["Essentia", "Enjoy", "Excellence", "Standart"]
    }
  },
  "Skoda": {
    "Octavia": {
      "1.0 TSI": ["Active", "Ambition", "Standart"],
      "1.4 TSI": ["Ambition", "Style", "Standart"],
      "1.5 TSI": ["Ambition", "Style", "Sportline", "Standart"],
      "1.6 TDI": ["Active", "Ambition", "Style", "Standart"],
      "2.0 TDI": ["Ambition", "Style", "Sportline", "Scout", "Standart"],
      "2.0 TSI RS": ["RS", "RS Challenge", "Standart"]
    },
    "Superb": {
      "1.4 TSI": ["Active", "Ambition", "Style", "Standart"],
      "1.5 TSI": ["Ambition", "Style", "Sportline", "Standart"],
      "2.0 TDI": ["Ambition", "Style", "Sportline", "L&K", "Standart"],
      "2.0 TSI": ["Sportline", "L&K", "Standart"]
    }
  },
  "Audi": {
    "A3": {
      "1.0 TFSI": ["Sport", "S Line", "Standart"],
      "1.4 TFSI": ["Sport", "S Line", "Black Edition", "Standart"],
      "1.5 TFSI": ["Sport", "S Line", "Black Edition", "Standart"],
      "2.0 TDI": ["Sport", "S Line", "Black Edition", "Standart"],
      "2.0 TFSI": ["S Line", "S3", "RS3", "Standart"]
    },
    "A4": {
      "1.4 TFSI": ["Sport", "Design", "Standart"],
      "2.0 TDI": ["Sport", "S Line", "Design", "Standart"],
      "2.0 TFSI": ["Sport", "S Line", "Black Edition", "S4", "Standart"],
      "3.0 TDI": ["S Line", "Black Edition", "Standart"]
    },
    "Q3": {
      "1.4 TFSI": ["Sport", "S Line", "Standart"],
      "2.0 TDI": ["Sport", "S Line", "Edition One", "Standart"],
      "2.0 TFSI": ["S Line", "Edition One", "Standart"]
    }
  },
  "Nissan": {
    "Qashqai": {
      "1.2 DIG-T": ["Visia", "Acenta", "N-Connecta", "Standart"],
      "1.3 DIG-T": ["Visia", "Acenta", "N-Connecta", "Tekna", "Standart"],
      "1.5 dCi": ["Visia", "Acenta", "N-Connecta", "Standart"],
      "1.6 DIG-T": ["N-Connecta", "Tekna", "Standart"],
      "1.7 dCi": ["Acenta", "N-Connecta", "Tekna", "Tekna+", "Standart"]
    },
    "Juke": {
      "1.0 DIG-T": ["Visia", "Acenta", "N-Connecta", "Tekna", "N-Design", "Standart"],
      "1.5 dCi": ["Visia", "Acenta", "Standart"],
      "1.6": ["Visia", "Acenta", "Tekna", "Nismo", "Standart"]
    }
  },
  "Dacia": {
    "Duster": {
      "1.0 TCe": ["Essential", "Expression", "Extreme", "Standart"],
      "1.3 TCe": ["Expression", "Extreme", "Journey", "Standart"],
      "1.5 dCi": ["Essential", "Expression", "Extreme", "Journey", "Standart"],
      "1.6": ["Ambiance", "Laureate", "Prestige", "Standart"]
    },
    "Sandero": {
      "0.9 TCe": ["Ambiance", "Stepway", "Standart"],
      "1.0 TCe": ["Essential", "Expression", "Extreme", "Stepway", "Standart"],
      "1.0 SCe": ["Essential", "Expression", "Standart"],
      "1.5 dCi": ["Ambiance", "Stepway", "Laureate", "Standart"]
    },
    "Jogger": {
      "1.0 TCe": ["Essential", "Expression", "Extreme", "Standart"],
      "1.0 TCe Hybrid": ["Expression", "Extreme", "Standart"]
    }
  },
  "Kia": {
    "Sportage": {
      "1.6": ["Concept", "Cool", "Standart"],
      "1.6 CRDi": ["Cool", "Prestige", "GT-Line", "Standart"],
      "1.6 T-GDI": ["Cool", "Prestige", "GT-Line", "Standart"],
      "2.0": ["Concept", "Cool", "Standart"],
      "2.0 CRDi": ["Cool", "Prestige", "GT-Line", "Standart"]
    },
    "Ceed": {
      "1.0 T-GDI": ["Concept", "Cool", "Standart"],
      "1.4": ["Concept", "Cool", "Standart"],
      "1.5 T-GDI": ["Cool", "Prestige", "GT-Line", "Standart"],
      "1.6 CRDi": ["Cool", "Prestige", "GT-Line", "Standart"]
    },
    "Picanto": {
      "1.0": ["Concept", "Cool", "Standart"],
      "1.2": ["Cool", "Prestige", "GT-Line", "Standart"]
    }
  },
  "Volvo": {
    "XC40": {
      "1.5 T3": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 D3": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 D4": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 T4": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 T5": ["R-Design", "Inscription", "Standart"],
      "Recharge Elektrik": ["Core", "Plus", "Ultimate", "Standart"]
    },
    "XC60": {
      "2.0 B4": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 B5": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 D4": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 T5": ["Momentum", "Inscription", "R-Design", "Standart"],
      "2.0 T8 Hybrid": ["Inscription", "R-Design", "Polestar", "Standart"]
    }
  },
  "default": {
    "default": {
      "default": ["Standart", "Comfort", "Premium", "Sport", "Full", "Diğer"]
    }
  }
};



const EXPENSE_CATEGORIES = ["Yol / Yakıt", "Ekspertiz", "Noter", "Bakım / Onarım", "Yıkama / Kuaför", "Komisyon", "Vergi / Sigorta", "Araç Sahibine Ödeme", "Diğer"];
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

// Telefon numarası formatlama: 0(530)8487836
const formatPhoneNumber = (value) => {
    if (!value) return '';
    // Sadece rakamları al
    const digits = value.toString().replace(/\D/g, '');
    if (!digits) return '';
    
    // Sadece gösterim için format (11 haneli tam numara)
    if (digits.length === 11 && digits.startsWith('0')) {
        return `0(${digits.slice(1, 4)})${digits.slice(4, 11)}`;
    } else if (digits.length === 10 && digits.startsWith('5')) {
        return `0(${digits.slice(0, 3)})${digits.slice(3, 10)}`;
    }
    return value; // Tam değilse olduğu gibi döndür
};

// Telefon input için - kullanıcı yazarken sadece rakam kabul et
const handlePhoneInput = (value) => {
    // Sadece rakamları kabul et, maksimum 11 karakter
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 11);
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

// --- MODALS ---

const PromoCardModal = ({ isOpen, onClose, inventory, userProfile, showToast }) => {
    const [selectedCarId, setSelectedCarId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCars, setFilteredCars] = useState(inventory);
    const [isGenerating, setIsGenerating] = useState(false);
    const selectedCar = inventory.find(c => c.id === selectedCarId);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCars(inventory.filter(car => car.plate?.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredCars(inventory);
        }
    }, [searchTerm, inventory]);

    const handlePrint = async (isPdf = false) => {
        if (!selectedCar) {
            showToast("Lütfen önce bir araç seçiniz.", "error");
            return;
        }
       
        const element = document.getElementById('printable-promo-card');
        if (!element) {
            showToast("Yazdırılacak içerik bulunamadı.", "error");
            return;
        }
        
        const safePlate = selectedCar.plate ? selectedCar.plate.replace(/\s+/g, '') : 'Arac';
       
        if (isPdf && window.html2pdf) {
            setIsGenerating(true);
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `Tanitim_Karti_${safePlate}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    scrollY: 0,
                    logging: false,
                    windowWidth: element.scrollWidth,
                    windowHeight: element.scrollHeight
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
           
            try {
                await window.html2pdf().set(opt).from(element).save();
                showToast("PDF başarıyla indirildi.");
            } catch (error) {
                console.error("PDF generation failed", error);
                showToast("PDF oluşturulamadı. Lütfen Yazdır'ı deneyin.", "error");
            } finally {
                setIsGenerating(false);
            }
        } else {
            // Yazdırma için element'i hazırla
            const originalTitle = document.title;
            document.title = `Tanitim_Karti_${safePlate}`;
            
            // Kısa bir bekleme süresi ekle
            await new Promise(resolve => setTimeout(resolve, 300));
            
            try {
                window.print();
            } catch (error) {
                console.error("Print failed", error);
                showToast("Yazdırma başarısız oldu.", "error");
            } finally {
                document.title = originalTitle;
            }
        }
    };
   
    const MechanicalStatusPill = ({ title, status }) => {
        const { bg, text, border } = getMechanicalStatusColors(status);
        return (
            <div className={`p-2 rounded-lg ${bg} ${text} font-bold border ${border} flex justify-between items-center text-xs print:bg-white print:border-neutral-300 print:text-black/80`} style={{WebkitPrintColorAdjust: 'exact'}}>
                <span className="uppercase text-neutral-600 text-[9px]">{title}</span>
                <span className="text-sm font-black">{status}</span>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl h-[95vh] overflow-hidden flex flex-col shadow-2xl rounded-2xl border border-neutral-200">
                <div className="bg-neutral-900 text-white p-4 flex flex-col gap-4 print:hidden shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20} className="text-yellow-500"/> Araç Tanıtım Kartı</h3>
                        <div className="flex gap-2">
                             <button onClick={() => handlePrint(true)} disabled={isGenerating || !selectedCar} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                                 {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />} PDF İndir
                            </button>
                            <button onClick={() => handlePrint(false)} disabled={!selectedCar} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm disabled:opacity-50"><Printer size={16} /> Yazdır</button>
                            <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white p-2 rounded-lg"><X size={20} /></button>
                        </div>
                    </div>
                    <div className="bg-neutral-800 p-3 rounded-xl flex flex-col gap-3">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">Kart Oluşturulacak Araç</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Plaka ile Ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-neutral-700 text-white text-sm py-2 px-3 rounded-lg outline-none border border-neutral-600 focus:ring-1 focus:ring-yellow-500 uppercase"
                            />
                            <button
                                onClick={() => setSearchTerm(searchTerm.trim().toLocaleUpperCase('tr-TR'))}
                                className="bg-neutral-600 text-white p-2 rounded-lg hover:bg-neutral-500 transition shrink-0"
                                title="Plaka ile Ara"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                        <select
                            value={selectedCarId}
                            onChange={(e) => setSelectedCarId(e.target.value)}
                            className="w-full bg-neutral-700 text-white text-sm font-bold py-2 px-3 rounded-lg outline-none border border-neutral-600 focus:ring-1 focus:ring-yellow-500"
                        >
                            <option value="">-- Araç Seçiniz --</option>
                            {filteredCars.map(car => (
                                <option key={car.id} value={car.id}>{car.brand} {car.model} ({car.year}) - {car.plate?.toLocaleUpperCase('tr-TR')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-neutral-100 p-8 flex justify-center print:p-0 print:overflow-visible" id="printable-area">
                    {selectedCar ? (
                        <div id="printable-promo-card" className="bg-white w-[190mm] h-[275mm] shadow-2xl relative flex flex-col print:shadow-none print:w-[190mm] print:h-[275mm] print:m-0 overflow-hidden box-border bg-white text-black mx-auto">
                            <div className="h-[40mm] bg-black text-white flex flex-col justify-center items-center relative overflow-hidden shrink-0 print:bg-black print:text-white" style={{WebkitPrintColorAdjust: 'exact'}}>
                                <div className="relative z-10 text-center flex items-center gap-4">
                                    {userProfile.logo && (
                                        <img src={userProfile.logo} alt="Logo" className="h-16 w-16 object-contain rounded-lg"/>
                                    )}
                                    <div>
                                        <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase">ASLANBAŞ OTO A.Ş.</h1>
                                        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-bold">GÜVENİLİR 2. EL ARAÇ MERKEZİ</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 transform rotate-45 translate-x-12 -translate-y-12 opacity-30"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-yellow-500 transform rotate-45 -translate-x-8 translate-y-8 opacity-30"></div>
                            </div>
                            <div className="h-[40mm] w-full bg-yellow-500 text-black flex justify-between items-center px-8 py-4 shrink-0 shadow-lg print:bg-yellow-500" style={{WebkitPrintColorAdjust: 'exact'}}>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-6xl font-black leading-none uppercase truncate">{selectedCar.brand}</h2>
                                    <h3 className="text-3xl font-bold uppercase truncate">{selectedCar.model}</h3>
                                    <p className="text-lg font-black uppercase tracking-widest text-black/70 mt-1">{selectedCar.year}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="block text-sm font-bold uppercase tracking-widest text-black/70 mb-1">Fiyat</span>
                                    <span className="block text-5xl font-black tracking-tighter">{formatCurrency(selectedCar.salePrice)}</span>
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                                <div className="grid grid-cols-5 gap-4 shrink-0 border-b pb-4 border-neutral-200">
                                    <div className="text-center"><span className="text-xs text-neutral-500 font-bold uppercase block mb-1">KİLOMETRE</span><span className="text-xl font-black">{selectedCar.km} KM</span></div>
                                    <div className="text-center"><span className="text-xs text-neutral-500 font-bold uppercase block mb-1">YAKIT</span><span className="text-xl font-black">{selectedCar.fuelType || 'Dizel'}</span></div>
                                    <div className="text-center"><span className="text-xs text-neutral-500 font-bold uppercase block mb-1">VİTES</span><span className="text-xl font-black">{selectedCar.gear || 'Otomatik'}</span></div>
                                    <div className="text-center"><span className="text-xs text-neutral-500 font-bold uppercase block mb-1">KASA TİPİ</span><span className="text-xl font-black">{selectedCar.vehicleType || 'Binek'}</span></div>
                                    <div className="text-center"><span className="text-xs text-neutral-500 font-bold uppercase block mb-1">MUAYENE</span><span className="text-xl font-black">{formatDate(selectedCar.inspectionDate) || '-'}</span></div>
                                </div>
                                <div className="flex flex-1 gap-6 overflow-hidden">
                                    <div className="w-[40%] flex flex-col border border-neutral-200 p-4 rounded-xl bg-neutral-50">
                                        <div className="shrink-0 mb-4">
                                            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 border-b pb-1 w-full shrink-0">ARAÇ AÇIKLAMASI</h4>
                                            <div className="h-[120px] overflow-y-auto text-sm text-neutral-700 leading-relaxed text-justify">
                                                <p>{selectedCar.description || 'Araç hakkında detaylı bilgi için lütfen satış temsilcimiz ile iletişime geçiniz. Araçlarımız ekspertiz garantilidir.'}</p>
                                            </div>
                                        </div>
                                        <div className="w-full space-y-1 shrink-0 pt-2 border-t border-neutral-300 mt-auto">
                                            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 border-b pb-1 w-full shrink-0">MEKANİK DURUM</h4>
                                            <MechanicalStatusPill title="MOTOR DURUMU" status={selectedCar.expertise?.Motor || 'Orijinal'} />
                                            <MechanicalStatusPill title="ŞANZIMAN DURUMU" status={selectedCar.expertise?.Şanzıman || 'Orijinal'} />
                                            <MechanicalStatusPill title="YÜRÜYEN DURUMU" status={selectedCar.expertise?.Yürüyen || 'Orijinal'} />
                                        </div>
                                    </div>
                                    <div className="w-[60%] flex flex-col border border-neutral-200 p-4 rounded-xl bg-neutral-50 shrink-0">
                                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 border-b pb-1 w-full text-center shrink-0">KAPORTA DURUM ÖZETİ</h4>
                                        <div className="flex flex-col items-center flex-1 w-full min-h-0 space-y-3">
                                            <div className="flex flex-col items-center w-full shrink-0 h-[260px] overflow-visible pt-4">
                                                <div className="w-full flex-1 flex items-center justify-center relative overflow-visible">
                                                   <div className="transform scale-[1.35] origin-top">
                                                     <ExpertiseVisualMap value={selectedCar.expertise?.body || {}} readonly={true} />
                                                   </div>
                                                </div>
                                            </div>
                                            <div className="w-full text-center mt-auto shrink-0 pt-2">
                                                {selectedCar.expertise?.score && (
                                                     <div className="flex justify-between items-center bg-black p-2 rounded border border-black text-white print:bg-black print:text-white mb-2" style={{WebkitPrintColorAdjust: 'exact'}}>
                                                         <span className="font-bold text-yellow-500 uppercase text-[9px]">EKSPERTİZ PUANI</span>
                                                         <span className="text-xs font-black uppercase text-white">%{selectedCar.expertise.score}</span>
                                                     </div>
                                                )}
                                                <p className="text-xs text-neutral-400 font-bold uppercase mb-1">Görsel Açıklama</p>
                                                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                                                    {Object.entries(EXPERTISE_STATUSES).filter(([key]) => key !== 'İşlemli' && key !== 'Sorunlu').map(([status, config]) => (
                                                        <div key={status} className="flex items-center gap-1.5">
                                                            <div className="w-3 h-3 rounded border shadow-sm" style={{ backgroundColor: config.fill, borderColor: config.stroke }}></div>
                                                            <span className="text-[9px] font-bold text-neutral-600">{config.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 border-t-4 border-black pt-2 text-center shrink-0">
                                    <div className="flex flex-col items-center gap-0.5 text-black">
                                        <span className="text-sm font-bold uppercase tracking-widest text-neutral-600">İLETİŞİM</span>
                                        <div className="flex items-center gap-2">
                                            <Phone size={20} className="text-black fill-yellow-500"/>
                                            <span className="text-xl font-black tracking-tight">{userProfile.phone || '0555 555 55 55'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-400"><FileText size={64} className="mb-4 opacity-20"/><p className="text-lg">Lütfen yukarıdan bir araç seçiniz.</p></div>
                    )}
                </div>
            </div>
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 10mm; }
                    html, body { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body > * { visibility: hidden !important; }
                    #printable-area, 
                    #printable-area *, 
                    #printable-promo-card, 
                    #printable-promo-card * { 
                        visibility: visible !important; 
                    }
                    #printable-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        z-index: 99999 !important;
                        display: block !important;
                        overflow: visible !important;
                    }
                    #printable-promo-card {
                        width: 190mm !important;
                        height: auto !important;
                        min-height: 270mm !important;
                        max-height: 280mm !important;
                        box-shadow: none !important;
                        margin: 0 auto !important;
                        border: none !important;
                        background: white !important;
                        page-break-inside: avoid !important;
                    }
                    .print\\:hidden { display: none !important; }
                    .fixed { position: absolute !important; }
                }
            `}</style>
        </div>
    );
};

const SaleModal = ({ isOpen, onClose, onConfirm, price, setPrice }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 bg-green-50 flex justify-between items-center"><h3 className="font-bold text-lg text-green-800 flex items-center gap-2"><CheckCircle size={20}/> Satışı Tamamla</h3><button onClick={onClose}><X size={20}/></button></div>
        <form onSubmit={onConfirm} className="p-6">
            <label className="block text-sm font-bold text-neutral-700 mb-1">Gerçekleşen Satış Fiyatı (TL)</label>
            <input
                autoFocus
                type="text"
                inputMode='numeric'
                className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none text-xl font-bold text-green-700"
                value={price}
                onChange={(e) => setPrice(formatNumberInput(e.target.value))}
            />
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-green-700 transition shadow-lg">Satışı Onayla & Kaydet</button>
        </form>
      </div>
    </div>
  );
};

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

const SettingsModal = ({ isOpen, onClose, profile, setProfile, onLogout }) => {
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
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center"><h3 className="font-bold text-lg text-black flex items-center"><Settings size={20} className="mr-2 text-neutral-500"/> Hesap Ayarları</h3><button onClick={onClose} className="text-neutral-400 hover:text-black"><X size={24}/></button></div>
        <form onSubmit={(e)=>{e.preventDefault(); setProfile(formData); onClose();}} className="p-6 space-y-4">
          {/* Logo Yükleme */}
          <div className="border-b border-neutral-100 pb-4">
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Şirket Logosu</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain"/>
                ) : (
                  <ImageIcon size={32} className="text-neutral-300"/>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer">
                  <span className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition inline-flex items-center gap-2">
                    {isUploadingLogo ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>}
                    {isUploadingLogo ? 'Yükleniyor...' : 'Logo Yükle'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo}/>
                </label>
                {formData.logo && (
                  <button type="button" onClick={() => setFormData({...formData, logo: null})} className="text-xs text-red-500 hover:text-red-700 ml-2">Kaldır</button>
                )}
                <p className="text-[10px] text-neutral-400 mt-1">Logo raporlarda ve tanıtım kartlarında görünecektir.</p>
              </div>
            </div>
          </div>

          <div><label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Ad Soyad</label><div className="relative"><User className="absolute left-3 top-2.5 text-neutral-400" size={18}/><input type="text" className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/></div></div>
          <div><label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Ünvan</label><input type="text" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})}/></div>
          <div><label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Telefon</label><div className="relative"><span className="absolute left-3 top-2.5 text-neutral-400"><Phone size={18}/></span><input type="text" className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="05301234567" value={formData.phone} onChange={e=>setFormData({...formData, phone: handlePhoneInput(e.target.value)})}/></div></div>
          <div className="pt-4 border-t border-neutral-100"><label className="block text-xs font-bold text-neutral-500 uppercase mb-1 text-red-600">Şifre</label><div className="flex gap-2"><input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})}/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-xs text-neutral-500 underline">{showPassword?"Gizle":"Göster"}</button></div></div>
          <div className="pt-4 flex flex-col gap-3"><button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition flex items-center justify-center"><Save size={18} className="mr-2"/> Kaydet</button><button type="button" onClick={onLogout} className="w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition flex items-center justify-center border border-red-200"><LogOut size={18} className="mr-2"/> Çıkış</button></div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center border border-neutral-100">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600"><AlertTriangle size={24} /></div>
        <h3 className="font-bold text-lg text-black mb-2">Emin misiniz?</h3><p className="text-neutral-500 mb-6 text-sm">Bu kaydı silmek üzeresiniz. Bu işlem geri alınamaz.</p>
        <div className="flex space-x-3"><button onClick={onClose} className="flex-1 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 font-medium">İptal</button><button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700">Evet, Sil</button></div>
      </div>
    </div>
  );
};

const ReportModal = ({ isOpen, onClose, transactions, inventory, showToast, userProfile }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
 
  const soldCars = inventory.filter(c => !c.deleted && c.status === 'Satıldı');
  const isSoldCategoryActive = selectedCarId === 'status_satildi';
  const isSpecificCarSelected = !['all', 'general_expenses', 'status_stokta', 'status_satildi', 'status_kapora', 'search_vehicle'].includes(selectedCarId);
  const isSearchMode = selectedCarId === 'search_vehicle' || isSpecificCarSelected;

  useEffect(() => {
    if (isOpen) {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        setStartDate(format(firstDay));
        setEndDate(format(today));
        setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Silinen araçları hariç tut
  const filteredInventory = inventory.filter(c => !c.deleted &&
      ((c.plate?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
  );

  // Silinen işlemleri ve silinen araçlara ait işlemleri hariç tut
  const deletedCarIds = inventory.filter(c => c.deleted).map(c => c.id);
  
  let filteredTransactions = transactions.filter(t => {
      // Silinen işlemleri hariç tut
      if (t.deleted) return false;
      // Silinen araçlara ait işlemleri hariç tut
      if (t.carId && deletedCarIds.includes(t.carId)) return false;
      
      if (t.date < startDate || t.date > endDate) return false;
      if (selectedCarId === 'all') return true;
      if (selectedCarId === 'general_expenses') return !t.carId;
      if (['status_stokta', 'status_satildi', 'status_kapora'].includes(selectedCarId)) {
          if (!t.carId) return false;
          const car = inventory?.find(c => c.id === t.carId && !c.deleted);
          if (!car) return false;
          if (selectedCarId === 'status_stokta') return car.status === 'Stokta';
          if (selectedCarId === 'status_satildi') return car.status === 'Satıldı';
          if (selectedCarId === 'status_kapora') return car.status === 'Kapora Alındı';
      }
      if (selectedCarId === 'search_vehicle') return false;

      const selectedCar = inventory?.find(c => c.id === selectedCarId && !c.deleted);
      if (selectedCar) return t.carId === selectedCarId || (t.description && t.description.includes(selectedCar.plate));
      return false;
  });

  filteredTransactions.sort((a,b) => new Date(b.date) - new Date(a.date));
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((a,c) => a + c.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((a,c) => a + c.amount, 0);
  const netProfit = totalIncome - totalExpense;
  let profitRate = 0;
  if (totalExpense > 0) profitRate = ((netProfit / totalExpense) * 100).toFixed(1);

  const handlePrint = async (isPdf = false) => {
      let reportName = 'Rapor';
      if (selectedCarId === 'all') reportName = 'Genel_Finans_Raporu';
      else if (selectedCarId === 'general_expenses') reportName = 'Isletme_Giderleri_Raporu';
      else if (selectedCarId === 'status_stokta') reportName = 'Stoktaki_Araclar_Raporu';
      else if (selectedCarId === 'status_satildi') reportName = 'Satilan_Araclar_Raporu';
      else if (selectedCarId === 'status_kapora') reportName = 'Kapora_Raporu';
      else reportName = 'Arac_Ozel_Raporu';

      if (isPdf && window.html2pdf) {
          setIsGenerating(true);
          const element = document.getElementById('report-visible-content');
          const opt = {
              margin: 10,
              filename: `Aslanbas_${reportName}_${startDate}_${endDate}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
         
          try {
              await window.html2pdf().set(opt).from(element).save();
              showToast("PDF başarıyla indirildi.");
          } catch (error) {
              console.error("PDF generation failed", error);
              showToast("PDF oluşturulamadı. Lütfen Yazdır'ı deneyin.", "error");
          } finally {
              setIsGenerating(false);
          }
      } else {
          const originalTitle = document.title;
          document.title = `Aslanbas_${reportName}_${startDate}_${endDate}`;
          setTimeout(() => { window.focus(); window.print(); document.title = originalTitle; }, 500);
      }
  };

  const getBtnStyle = (id) => `px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border ${selectedCarId === id ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-white'}`;
  const searchBtnStyle = `px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border ${isSearchMode ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-white'}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-2xl border border-neutral-200">
        <div className="bg-neutral-900 text-white p-4 flex flex-col gap-4 print:hidden shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20}/> Rapor Oluşturucu</h3>
            <div className="flex gap-2">
                <button onClick={() => handlePrint(true)} disabled={isGenerating} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                    {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />} PDF İndir
                </button>
                <button onClick={() => handlePrint(false)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"><Printer size={16} /> Yazdır</button>
                <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white p-2 rounded-lg"><X size={20} /></button>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row gap-4 bg-neutral-800 p-3 rounded-xl items-start xl:items-center">
            <div className="flex flex-col gap-1 w-full xl:w-auto shrink-0">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Tarih Aralığı</label>
                <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-neutral-700 text-white text-xs px-2 py-2 rounded-lg outline-none focus:ring-1 focus:ring-yellow-500 border border-neutral-600"/><span className="text-neutral-500">-</span><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-neutral-700 text-white text-xs px-2 py-2 rounded-lg outline-none focus:ring-1 focus:ring-yellow-500 border border-neutral-600"/>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center"><label className="text-[10px] text-neutral-400 font-bold uppercase">Rapor Kapsamı</label></div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCarId('all')} className={getBtnStyle('all')}><LayoutDashboard size={14}/> Genel</button>
                    <button onClick={() => setSelectedCarId('general_expenses')} className={getBtnStyle('general_expenses')}><Building2 size={14}/> İşletme</button>
                    <button onClick={() => setSelectedCarId('status_stokta')} className={getBtnStyle('status_stokta')}><Car size={14}/> Stok</button>
                    <button onClick={() => setSelectedCarId('status_satildi')} className={getBtnStyle('status_satildi')}><CheckCircle size={14}/> Satılan</button>
                    <button onClick={() => setSelectedCarId('status_kapora')} className={getBtnStyle('status_kapora')}><CreditCard size={14}/> Kapora</button>
                    <button onClick={() => setSelectedCarId('search_vehicle')} className={searchBtnStyle}><Search size={14}/> Araç</button>
                </div>
               
                {isSearchMode && (
                    <div className="mt-2 p-2 bg-neutral-700/50 rounded-lg border border-neutral-600 animate-in fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <Search size={14} className="text-neutral-400"/>
                            <input
                                type="text"
                                placeholder="PLAKA, MARKA VEYA MODEL İLE ARAYIN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white text-xs outline-none w-full placeholder-neutral-500 uppercase font-bold"
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {filteredInventory.map(car => (
                                <button
                                    key={car.id}
                                    onClick={() => setSelectedCarId(car.id)}
                                    className={`px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${selectedCarId === car.id ? 'bg-green-500 text-white' : 'bg-neutral-600 text-neutral-300 hover:bg-neutral-500'}`}
                                >
                                    <span>{car.plate?.toLocaleUpperCase('tr-TR')}</span>
                                    <span className="opacity-70 font-normal">- {car.model}</span>
                                </button>
                            ))}
                            {filteredInventory.length === 0 && <span className="text-xs text-neutral-500 italic p-1">Sonuç bulunamadı.</span>}
                        </div>
                    </div>
                )}

                {isSoldCategoryActive && !isSearchMode && (
                    <div className="flex flex-wrap gap-2 mt-2 p-2 bg-neutral-700/50 rounded-lg border border-neutral-600 animate-in fade-in slide-in-from-top-2">
                        <div className="w-full text-[10px] text-neutral-400 font-bold mb-1">HIZLI SEÇİM (SATILANLAR):</div>
                        <button onClick={() => setSelectedCarId('status_satildi')} className={`px-2 py-1 rounded text-xs font-bold transition ${selectedCarId === 'status_satildi' ? 'bg-white text-black' : 'bg-neutral-600 text-neutral-300 hover:bg-neutral-500'}`}>TÜMÜ</button>
                        {soldCars.map(car => (<button key={car.id} onClick={() => setSelectedCarId(car.id)} className={`px-2 py-1 rounded text-xs font-bold transition ${selectedCarId === car.id ? 'bg-green-500 text-white' : 'bg-neutral-600 text-neutral-300 hover:bg-neutral-500'}`}>{car.plate?.toLocaleUpperCase('tr-TR')}</button>))}
                        {soldCars.length === 0 && <span className="text-xs text-neutral-500 italic">Henüz satılan araç yok.</span>}
                    </div>
                )}
            </div>
          </div>
        </div>
       
        <div id="report-visible-content" className="flex-1 overflow-y-auto p-8 bg-white print:hidden">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
            <div className="flex items-center gap-4">
              {userProfile?.logo && <img src={userProfile.logo} alt="Logo" className="h-12 w-12 object-contain rounded"/>}
              <div><h1 className="text-3xl font-bold text-black tracking-tight">ASLANBAŞ OTO A.Ş.</h1><p className="text-neutral-500 text-sm mt-1">Finansal Durum Raporu</p></div>
            </div>
            <div className="text-right">
                <p className="font-bold text-sm text-black">
                    {selectedCarId === 'all' ? 'Genel Rapor' :
                     selectedCarId === 'general_expenses' ? 'İşletme Giderleri Raporu' :
                     selectedCarId === 'status_stokta' ? 'Stoktaki Araçlar Raporu' :
                     selectedCarId === 'status_satildi' ? 'Satılan Araçlar Raporu' :
                     selectedCarId === 'status_kapora' ? 'Kapora Alınan Araçlar Raporu' :
                     selectedCarId === 'search_vehicle' ? 'Araç Seçimi Yapınız' :
                     (() => {
                         const c = inventory.find(i => i.id === selectedCarId);
                         return c ? `${c.plate.toUpperCase()} - ${c.brand} ${c.model} Raporu` : 'Özel Araç Raporu';
                     })()
                    }
                </p>
                <p className="text-xs text-neutral-500">{formatDate(startDate)} - {formatDate(endDate)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-500 uppercase font-bold mb-1">Toplam Gelir</p><p className="text-xl font-bold text-green-700">{formatCurrency(totalIncome)}</p></div>
            <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-500 uppercase font-bold mb-1">Toplam Gider</p><p className="text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</p></div>
            <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Net Kâr</p>
                <div className="flex items-baseline gap-2">
                    <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-black' : 'text-red-600'}`}>{formatCurrency(netProfit)}</p>
                    {totalExpense > 0 && (<span className={`text-sm font-bold ${parseFloat(profitRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>({parseFloat(profitRate) > 0 ? '+' : ''}%{profitRate})</span>)}
                </div>
            </div>
          </div>
          <h4 className="font-bold text-lg mb-4 border-b border-neutral-200 pb-2">İşlem Dökümü</h4>
          <table className="w-full text-sm text-left mb-8">
            <thead><tr className="border-b border-black"><th className="py-2">Tarih</th><th className="py-2">Tür</th><th className="py-2">Kategori</th><th className="py-2">Açıklama</th><th className="py-2 text-right">Tutar</th></tr></thead>
            <tbody>{filteredTransactions.map((t, idx) => (<tr key={t.id || idx} className="border-b border-neutral-100"><td className="py-2 text-neutral-600">{formatDate(t.date)}</td><td className="py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.type === 'income' ? 'GELİR' : 'GİDER'}</span></td><td className="py-2 font-medium">{t.category}</td><td className="py-2 text-neutral-500 truncate max-w-xs">{t.description}</td><td className={`py-2 text-right font-mono font-bold ${t.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</td></tr>))}</tbody>
            <tfoot className="border-t-2 border-neutral-300 font-bold">
                <tr><td colSpan="4" className="py-3 text-right text-neutral-600">Toplam Gelir:</td><td className="py-3 text-right text-green-600">{formatCurrency(totalIncome)}</td></tr>
                <tr><td colSpan="4" className="py-2 text-right text-neutral-600">Toplam Gider:</td><td className="py-2 text-right text-red-600">-{formatCurrency(totalExpense)}</td></tr>
                <tr className="border-t border-black text-base"><td colSpan="4" className="py-3 text-right text-black">NET SONUÇ:</td><td className={`py-3 text-right ${netProfit >= 0 ? 'text-black' : 'text-red-600'}`}>{formatCurrency(netProfit)}</td></tr>
            </tfoot>
          </table>
          <div className="flex justify-between mt-20 pt-8 border-t border-black"><div className="text-center"><p className="font-bold text-sm">Muhasebe / Onay</p><div className="h-16"></div><p className="text-xs text-neutral-400">İmza / Kaşe</p></div><div className="text-center"><p className="font-bold text-sm">Aslanbaş Oto A.Ş. Yetkilisi</p><div className="h-16"></div><p className="text-xs text-neutral-400">İmza</p></div></div>
        </div>
      </div>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 15mm; }
          html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body > * { visibility: hidden !important; }
          #report-visible-content, 
          #report-visible-content * { 
            visibility: visible !important; 
          }
          #report-visible-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 15mm !important;
            background: white !important;
            z-index: 99999 !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const AddCarModal = ({ isOpen, onClose, newCar, setNewCar, onSave, isEditing, showToast }) => {
  const [activeTab, setActiveTab] = useState('general');
  const fileInputRef = useRef(null);
 
  useEffect(() => {
    if (isOpen) {
        setActiveTab('general');
    }
  }, [isOpen]);

  if (!isOpen) return null;
 
  const handleBrandChange = (e) => setNewCar({ ...newCar, brand: e.target.value, model: '', packageInfo: '', engineType: '' });
 
  const handleModelChange = (e) => setNewCar({ ...newCar, model: e.target.value, packageInfo: '', engineType: '' });

  const handleEngineChange = (e) => setNewCar({ ...newCar, engineType: e.target.value, packageInfo: '' });

  const handleNumberChange = (e, field) => setNewCar({ ...newCar, [field]: formatNumberInput(e.target.value) });
 
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + (newCar.photos?.length || 0) > 6) { showToast("En fazla 6 fotoğraf yükleyebilirsiniz.", "error"); return; }
    const processedPhotos = await Promise.all(files.map(file => resizeImage(file)));
    setNewCar(prev => ({ ...prev, photos: [...(prev.photos || []), ...processedPhotos] }));
  };
 
  const removePhoto = (index) => setNewCar(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
 
  const handleExpertiseChange = (partId, status) => {
      setNewCar(prev => ({
          ...prev,
          expertise: {
              ...prev.expertise,
              body: {
                  ...(prev.expertise?.body || CAR_SVG_PATHS.reduce((acc, p) => ({ ...acc, [p.id]: 'Orijinal' }), {})),
                  [partId]: status
              }
          }
      }));
  };

  const handleCloseModal = () => {
      onClose();
  }

  // Motor seçeneklerini al - VEHICLE_DATA yapısından
  const getAvailableEngines = () => {
      if (newCar.brand && newCar.model && VEHICLE_DATA[newCar.brand]?.[newCar.model]) {
          return Object.keys(VEHICLE_DATA[newCar.brand][newCar.model]);
      }
      return Object.keys(VEHICLE_DATA.default?.default || {});
  };

  // Paket seçeneklerini al - Motor seçimine göre
  const getAvailablePackages = () => {
      if (newCar.brand && newCar.model && newCar.engineType) {
          return VEHICLE_DATA[newCar.brand]?.[newCar.model]?.[newCar.engineType] || VEHICLE_DATA.default?.default?.default || ["Standart"];
      }
      if (newCar.brand && newCar.model) {
          // Motor seçilmemişse tüm paketleri birleştir
          const allPackages = new Set();
          const modelData = VEHICLE_DATA[newCar.brand]?.[newCar.model];
          if (modelData) {
              Object.values(modelData).forEach(packages => packages.forEach(p => allPackages.add(p)));
          }
          return allPackages.size > 0 ? Array.from(allPackages) : VEHICLE_DATA.default?.default?.default || ["Standart"];
      }
      return VEHICLE_DATA.default?.default?.default || ["Standart"];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-start bg-neutral-50 shrink-0">
          <div>
            <h3 className="font-bold text-lg text-black flex items-center gap-2"><Car size={20} className="text-yellow-600"/> {isEditing ? 'Araç Düzenle' : 'Yeni Araç Girişi'}</h3>
            <p className="text-xs text-neutral-500 mt-1">{newCar.brand} {newCar.model} - {newCar.plate?.toLocaleUpperCase('tr-TR')}</p>
          </div>
          <button onClick={handleCloseModal} className="text-neutral-400 hover:text-black"><X size={24} /></button>
        </div>
        <div className="flex border-b border-neutral-100 px-6 bg-white shrink-0 overflow-x-auto">
            {[{id: 'general', label: 'Genel Bilgiler', icon: FileText},{id: 'expertise', label: 'Ekspertiz', icon: CheckCircle},{id: 'photos', label: 'Fotoğraflar', icon: ImageIcon},{id: 'consignment', label: 'Sahiplik / Konsinye', icon: Handshake}].map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-yellow-500 text-black' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}><tab.icon size={16}/> {tab.label}</button>))}
        </div>
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><label className="label-sm">Plaka</label><input required type="text" className="input-std uppercase" value={newCar.plate} onChange={e => setNewCar({...newCar, plate: e.target.value.toLocaleUpperCase('tr-TR')})} placeholder="34 AB 123" /></div>
                        <div><label className="label-sm">Model Yılı</label><input required type="number" min="1900" max="2100" className="input-std" value={newCar.year || ''} onChange={e => setNewCar({...newCar, year: e.target.value})} placeholder={new Date().getFullYear()}/></div>
                        <div><label className="label-sm">Marka</label><select required type="text" className="input-std" value={newCar.brand} onChange={handleBrandChange}><option value="">Seçiniz</option>{Object.keys(CAR_DATA).sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}</select></div>
                        <div><label className="label-sm">Model</label><select required type="text" className="input-std" value={newCar.model} onChange={handleModelChange} disabled={!newCar.brand}><option value="">Seçiniz</option>{newCar.brand && CAR_DATA[newCar.brand]?.map(model => <option key={model} value={model}>{model}</option>)}<option value="Diğer">Diğer</option></select></div>
                        <div><label className="label-sm">KM</label><input required type="text" inputMode='numeric' className="input-std" value={newCar.km} onChange={e => handleNumberChange(e, 'km')} placeholder="0" /></div>
                        <div><label className="label-sm">Yakıt</label><select className="input-std" value={newCar.fuelType || 'Dizel'} onChange={e => setNewCar({...newCar, fuelType: e.target.value})}>{['Dizel', 'Benzin', 'Benzin & LPG', 'Hibrit', 'Elektrik'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                        <div><label className="label-sm">Vites</label><select className="input-std" value={newCar.gear || 'Otomatik'} onChange={e => setNewCar({...newCar, gear: e.target.value})}><option value="Otomatik">Otomatik</option><option value="Manuel">Manuel</option><option value="Yarı Otomatik">Yarı Otomatik</option></select></div>
                        <div><label className="label-sm">Giriş Tarihi</label><input required type="date" className="input-std" value={newCar.entryDate} onChange={e => setNewCar({...newCar, entryDate: e.target.value})} /></div>
                    </div>
                    <div>
                        <label className="label-sm">Motor</label>
                        <select
                            className="input-std"
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
                        <label className="label-sm">Araç Paketi/Versiyonu</label>
                        <select
                            required
                            className="input-std"
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
                    <div><label className="label-sm">Muayene Tarihi</label><input type="date" className="input-std" value={newCar.inspectionDate || ''} onChange={e => setNewCar({...newCar, inspectionDate: e.target.value})} /></div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div><label className="label-sm flex items-center gap-1">Alış Fiyatı {newCar.ownership === 'stock' && <span className="text-red-500 text-xs">*</span>}</label><input type="text" inputMode='numeric' className={`input-std ${newCar.ownership === 'stock' && (!newCar.purchasePrice || newCar.purchasePrice === '0') ? 'border-red-300 bg-red-50' : ''}`} value={newCar.purchasePrice} onChange={e => handleNumberChange(e, 'purchasePrice')} placeholder="0" disabled={newCar.ownership !== 'stock'}/></div>
                        <div><label className="label-sm flex items-center gap-1">{newCar.ownership === 'consignment' ? 'Satış Hedef Fiyatı' : 'Satış Fiyatı'} <span className="text-red-500 text-xs">*</span></label><input type="text" inputMode='numeric' className={`input-std ${(!newCar.salePrice || newCar.salePrice === '0') ? 'border-red-300 bg-red-50' : ''}`} value={newCar.salePrice} onChange={e => handleNumberChange(e, 'salePrice')} placeholder="0"/></div>
                    </div>
                    <div className="md:col-span-2"><label className="label-sm">Açıklama</label><textarea className="input-std h-20 resize-none" value={newCar.description} onChange={e => setNewCar({...newCar, description: e.target.value})} placeholder="Araç hakkında..." /></div>
                </div>
            )}
            {activeTab === 'expertise' && (
                <div className="space-y-6">
                    <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200"><h4 className="text-sm font-bold text-neutral-700 mb-4 text-center uppercase tracking-wide">Kaporta Ekspertizi</h4><ExpertiseVisualMap value={newCar.expertise?.body} onChange={handleExpertiseChange} /></div>
                    <div className="grid grid-cols-2 gap-4">{['Motor', 'Şanzıman', 'Yürüyen'].map(field => (<div key={field}><label className="label-sm">{field} Durumu</label><select className="input-std" value={newCar.expertise?.[field] || 'Orijinal'} onChange={e => setNewCar({...newCar, expertise: {...newCar.expertise, [field]: e.target.value}})}><option value="Orijinal">Orijinal</option><option value="İşlemli">İşlemli</option><option value="Sorunlu">Sorunlu</option></select></div>))}<div><label className="label-sm">Ekspertiz Puanı (%)</label><input type="number" min="0" max="100" className="input-std" value={newCar.expertise?.score || ''} onChange={e => setNewCar({...newCar, expertise: {...newCar.expertise, score: e.target.value}})} placeholder="95" /></div></div>
                    <div><label className="label-sm">Ekspertiz Notları</label><textarea className="input-std h-20 resize-none" value={newCar.expertise?.notes || ''} onChange={e => setNewCar({...newCar, expertise: {...newCar.expertise, notes: e.target.value}})} placeholder="Ek notlar..." /></div>
                </div>
            )}
            {activeTab === 'photos' && (
                <div className="space-y-4">
                    <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition"><Upload size={32} className="text-neutral-400 mb-2"/><p className="text-sm font-bold text-neutral-600">Fotoğraf Yükle</p><p className="text-xs text-neutral-400">Cihazdan seçmek için tıklayın (Max 6)</p><input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} /></div>
                    <div className="grid grid-cols-3 gap-2">{newCar.photos?.map((photo, index) => (<div key={index} className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden group"><img src={photo} alt={`Car ${index}`} className="w-full h-full object-cover" /><button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={12}/></button></div>))}</div>
                </div>
            )}
            {activeTab === 'consignment' && (
                <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ownership" checked={newCar.ownership === 'stock'} onChange={() => setNewCar({...newCar, ownership: 'stock'})} className="accent-black" /><span className="text-sm font-bold">Stok Araç (Satın Alma)</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ownership" checked={newCar.ownership === 'consignment'} onChange={() => setNewCar({...newCar, ownership: 'consignment'})} className="accent-yellow-500" /><span className="text-sm font-bold">Konsinye (Emanet)</span></label></div>
                    {newCar.ownership === 'consignment' ? (<div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2"><div><label className="label-sm">Araç Sahibi Adı</label><input type="text" className="input-std" value={newCar.ownerName || ''} onChange={e => setNewCar({...newCar, ownerName: e.target.value})} /></div><div><label className="label-sm">Sahibi Telefon</label><input type="text" className="input-std" value={newCar.ownerPhone || ''} onChange={e => setNewCar({...newCar, ownerPhone: handlePhoneInput(e.target.value)})} placeholder="05301234567" /></div></div>) : (<div className="p-4 bg-neutral-100 rounded text-sm text-gray-500 text-center">Stok araç seçili. Alış fiyatı bilgileri "Genel Bilgiler" sekmesindedir.</div>)}
                </div>
            )}
        </form>
        <div className="p-4 border-t border-neutral-100 flex justify-end gap-3 bg-white shrink-0"><button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg text-neutral-600 hover:bg-neutral-50 font-medium text-sm">İptal</button><button onClick={onSave} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-neutral-800 transition flex items-center"><Save size={18} className="mr-2" /> Kaydet</button></div>
      </div>
      <style>{`.label-sm { display: block; font-size: 0.75rem; font-weight: 700; color: #525252; margin-bottom: 0.25rem; } .input-std { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #e5e5e5; border-radius: 0.5rem; outline: none; font-size: 0.875rem; } .input-std:focus { box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.5); border-color: #eab308; }`}</style>
    </div>
  );
};

const CarDetailModal = ({ car, isOpen, onClose, showToast }) => {
  const [printMode, setPrintMode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  if (!isOpen || !car) return null;

  const handlePrint = async (mode) => {
    setPrintMode(mode);
    const safePlate = car.plate.replace(/\s+/g, '').toLocaleUpperCase('tr-TR');
    const titleMap = { info: `Arac_Bilgi_Fisi_${safePlate}`, expert: `Ekspertiz_Raporu_${safePlate}`, contract: `Konsinye_Sozlesme_${safePlate}` };
    const docTitle = titleMap[mode] || `Belge_${safePlate}`;

    await new Promise(r => setTimeout(r, 100));

    if (window.html2pdf) {
        setIsGenerating(true);
        const element = document.getElementById('printable-detail-content');
        const opt = {
            margin: 10,
            filename: `${docTitle}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await window.html2pdf().set(opt).from(element).save();
            showToast("PDF başarıyla indirildi.");
        } catch (error) {
            console.error("PDF generation failed", error);
            showToast("PDF oluşturulamadı. Lütfen Yazdır'ı deneyin.", "error");
            const originalTitle = document.title;
            document.title = docTitle;
            window.print();
            document.title = originalTitle;
        } finally {
            setIsGenerating(false);
            setPrintMode(null);
        }
    } else {
        const originalTitle = document.title;
        document.title = docTitle;
        window.focus();
        window.print();
        document.title = originalTitle;
        setPrintMode(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
             
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex justify-between items-start bg-neutral-50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${car.ownership === 'consignment' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{car.ownership === 'consignment' ? 'Konsinye' : 'Stok'}</span>
                    <span className="text-neutral-400 text-xs">{formatDate(car.entryDate)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-black">{car.brand} {car.model}</h2>
                  <p className="text-neutral-500">{car.year} • {car.km} KM • {car.plate?.toLocaleUpperCase('tr-TR')}</p>
                </div>
                <div className="flex gap-2">
                    <div className="dropdown relative group">
                        <button className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm" disabled={isGenerating}>
                            {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Download size={16}/>} PDF İndir
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-100 hidden group-hover:block z-10">
                            <button onClick={(e) => {e.stopPropagation(); handlePrint('info');}} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"><FileText size={14} className="mr-2"/> Araç Bilgi Fişi</button>
                            <button onClick={(e) => {e.stopPropagation(); handlePrint('expert');}} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"><CheckCircle size={14} className="mr-2"/> Ekspertiz Raporu</button>
                            {car.ownership === 'consignment' && <button onClick={(e) => {e.stopPropagation(); handlePrint('contract');}} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"><Handshake size={14} className="mr-2"/> Konsinye Sözleşmesi</button>}
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-neutral-100 p-2 rounded-lg hover:bg-neutral-200"><X size={20}/></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-neutral-200">
                             {car.photos && car.photos.length > 0 ? <img src={car.photos[0]} alt="Car Main" className="w-full h-full object-cover" /> : <div className="text-neutral-300 flex flex-col items-center"><ImageIcon size={48}/><span className="text-sm font-bold mt-2">Görsel Yok</span></div>}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                             {car.photos?.slice(1, 5).map((src, i) => (<div key={i} className="aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200"><img src={src} alt="Car Thumb" className="w-full h-full object-cover"/></div>))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100"><p className="text-[10px] text-neutral-400 font-bold uppercase">Marka / Model</p><p className="font-bold">{car.brand} {car.model}</p></div>
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100"><p className="text-[10px] text-neutral-400 font-bold uppercase">Yıl / KM</p><p className="font-bold">{car.year} / {car.km}</p></div>
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100"><p className="text-[10px] text-neutral-400 font-bold uppercase">Motor</p><p className="font-bold">{car.engineType || '-'}</p></div>
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100"><p className="text-[10px] text-neutral-400 font-bold uppercase">Yakıt</p><p className="font-bold">{car.fuelType || 'Dizel'}</p></div>
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100"><p className="text-[10px] text-neutral-400 font-bold uppercase">Vites</p><p className="font-bold">{car.gear || 'Otomatik'}</p></div>
                            {car.packageInfo && (
                                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100"><p className="text-[10px] text-neutral-400 font-bold uppercase">Paket</p><p className="font-bold">{car.packageInfo}</p></div>
                            )}
                        </div>
                        <div className="border-t border-neutral-100 pt-4"><p className="text-[10px] text-neutral-400 font-bold uppercase mb-2">Açıklama</p><p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">{car.description || 'Açıklama girilmemiş.'}</p></div>
                        {car.expertise?.body && (
                            <div className="border-t border-neutral-100 pt-4">
                                <p className="text-[10px] text-neutral-400 font-bold uppercase mb-2">Ekspertiz Özeti</p>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-bold border border-green-200">Motor: {car.expertise?.Motor || '-'}</span>
                                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold border border-blue-200">Şanzıman: {car.expertise?.Şanzıman || '-'}</span>
                                    <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 font-bold border border-orange-200">Puan: {car.expertise?.score || '-'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Printable Content Area (Hidden by default, shown when printing) */}
                <div id="printable-detail-content" className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 overflow-visible text-black top-0 left-0 w-full h-full m-0">
                    {printMode === 'info' && (
                        <div className="space-y-8">
                            <div className="bg-gray-100 p-8 rounded-xl text-center"><h2 className="text-5xl font-bold mb-2">{car.brand} {car.model}</h2><p className="text-2xl text-gray-600">{car.year} | {car.km} KM</p></div>
                            <div className="text-center"><p className="text-sm text-gray-500 uppercase font-bold mb-2">Fiyat</p><h1 className="text-6xl font-bold text-black">{formatCurrency(car.salePrice)}</h1></div>
                           
                            <div className="grid grid-cols-3 gap-4 text-center">
                                {['Motor', 'Şanzıman', 'Yürüyen'].map(key => (
                                    <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">{key}</p>
                                            <p className={`font-bold uppercase ${
                                                (car.expertise?.[key] || 'Orijinal') === 'Orijinal' ? 'text-green-700' :
                                                car.expertise?.[key] === 'İşlemli' ? 'text-yellow-600' : 'text-red-600'
                                            }`}>{car.expertise?.[key] || 'Orijinal'}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border p-6 rounded-xl"><h3 className="font-bold border-b pb-2 mb-4">Araç Özellikleri & Açıklama</h3><p className="text-lg leading-relaxed">{car.description}</p></div>
                            <div className="grid grid-cols-2 gap-4 mt-8">{car.photos && car.photos.slice(0, 2).map((src, i) => (<img key={i} src={src} alt={`Car ${i}`} className="w-full h-64 object-cover rounded-lg border border-gray-200" />))}</div>
                        </div>
                    )}
                    {printMode === 'expert' && (
                        <div>
                          <h2 className="text-2xl font-bold mb-6 bg-black text-white p-2 pl-4 rounded">{car.plate?.toLocaleUpperCase('tr-TR')} - Ekspertiz Detayları</h2>
                          {car.expertise?.body && (<div className="mb-8 flex justify-center scale-90 origin-top"><ExpertiseVisualMap value={car.expertise.body} readonly={true} /></div>)}
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
                            <div className="border-b py-2 flex justify-between"><span>Motor:</span> <strong>{car.expertise?.Motor || '-'}</strong></div>
                            <div className="border-b py-2 flex justify-between"><span>Şanzıman:</span> <strong>{car.expertise?.Şanzıman || '-'}</strong></div>
                            <div className="border-b py-2 flex justify-between"><span>Yürüyen Aksam:</span> <strong>{car.expertise?.Yürüyen || '-'}</strong></div>
                            <div className="border-b py-2 flex justify-between"><span>Ekspertiz Puanı:</span> <strong>{car.expertise?.score ? `%${car.expertise.score}` : '-'}</strong></div>
                          </div>
                          <div className="mt-8 border p-4 rounded bg-gray-50 min-h-[200px]"><h4 className="font-bold mb-2">Eksper Notları:</h4><p>{car.expertise?.notes || 'Ek not bulunmamaktadır.'}</p></div>
                          <div className="mt-12 flex justify-between px-8">
                            <div className="text-center"><p className="font-bold">Eksper Onay</p><div className="h-16 border-b border-black w-32"></div></div>
                            <div className="text-center"><p className="font-bold">Müşteri Onay</p><div className="h-16 border-b border-black w-32"></div></div>
                          </div>
                        </div>
                    )}
                    {printMode === 'contract' && (
                        <div className="text-sm leading-7 text-justify">
                          <h3 className="text-center font-bold text-xl mb-6 underline">ARAÇ SATIŞ VE KONSİNYE SÖZLEŞMESİ</h3>
                          <p>İşbu sözleşme, <strong>Aslanbaş Oto Galeri</strong> (Yetkili) ile <strong>{car.ownerName || 'Araç Sahibi'}</strong> (Araç Sahibi) arasında, aşağıda özellikleri belirtilen aracın satışı konusunda akdedilmiştir.</p>
                          <h4 className="font-bold mt-4 border-b">1. ARAÇ BİLGİLERİ</h4>
                          <p><strong>Plaka:</strong> {car.plate?.toLocaleUpperCase('tr-TR')} &nbsp; <strong>Marka/Model:</strong> {car.brand} {car.model} &nbsp; <strong>Yıl:</strong> {car.year}</p>
                          <h4 className="font-bold mt-4 border-b">2. SATIŞ ŞARTLARI</h4>
                          <p>Araç sahibi, aracın <strong>{formatCurrency(car.salePrice)}</strong> bedel ile satılması konusunda yetkiliye tam yetki vermiştir. Satış gerçekleştiğinde, satış bedeli üzerinden <strong>%{car.commissionRate || 5}</strong> oranında komisyon hizmet bedeli olarak galeriye ödenecektir.</p>
                          <h4 className="font-bold mt-4 border-b">3. HÜKÜMLER</h4>
                          <ul className="list-disc pl-5">
                            <li>Araç sahibi, aracın hukuki ve teknik ayıplarından sorumludur.</li>
                            <li>Galeri, aracı sergilemek, internette ilan vermek ve müşterilere göstermekle yükümlüdür.</li>
                            <li>Sözleşme tarihi: {formatDate(new Date().toISOString().split('T')[0])}</li>
                          </ul>
                          <div className="mt-16 flex justify-between px-12">
                            <div className="text-center"><p className="font-bold">ASLANBAŞ OTO GALERİ</p><p className="text-xs">Kaşe / İmza</p></div>
                            <div className="text-center"><p className="font-bold">ARAÇ SAHİBİ</p><p>{car.ownerName || 'İsim Soyisim'}</p><p className="text-xs">İmza</p></div>
                          </div>
                        </div>
                    )}
                </div>
            </div>
           
            <style>{`@media print { body * { visibility: hidden; } .print\\:block, .print\\:block * { visibility: visible; } .print\\:block { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 2rem; background: white; z-index: 9999; } }`}</style>
        </div>
    </div>
  );
};

const CarExpensesModal = ({ isOpen, onClose, car, carTransactions, onAddExpense, onDeleteTransaction }) => {
  const [expenseForm, setExpenseForm] = useState({ category: 'Yol / Yakıt', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
 
  useEffect(() => {
    if (isOpen) {
        setExpenseForm({ category: 'Yol / Yakıt', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    }
  }, [isOpen]);

  if (!isOpen || !car) return null;
 
  const totalExpense = carTransactions.filter(t => t.type === 'expense' && t.category !== 'Araç Alımı' && t.category !== 'Kapora İadesi').reduce((a, c) => a + c.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.amount || parseFormattedNumber(expenseForm.amount) <= 0) {
        onClose("Lütfen geçerli bir tutar girin.", "error");
        return;
    }
    onAddExpense({ ...expenseForm, amount: parseFormattedNumber(expenseForm.amount) });
    setExpenseForm(prev => ({ ...prev, amount: '', description: '' }));
  };
 
  const handleExpenseDelete = (transactionId) => {
    if (window.confirm("Bu masraf kaydını silmek istediğinize emin misiniz?")) {
      onDeleteTransaction(transactionId);
    }
  };


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-black flex items-center gap-2"><Receipt size={20} className="text-yellow-600"/> Araç Masraf Yönetimi</h3>
              <p className="text-xs text-neutral-500 mt-1">{car.brand} {car.model} - {car.plate?.toLocaleUpperCase('tr-TR')}</p>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-black"><X size={24}/></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="bg-black text-white p-4 rounded-xl mb-6 flex justify-between items-center shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Masraf (Alış Hariç):</span>
            <span className="text-xl font-black">{formatCurrency(totalExpense)}</span>
          </div>
          <h4 className="font-bold text-sm text-neutral-700 mb-3">Yeni Masraf Ekle</h4>
          <form onSubmit={handleSubmit} className="mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Kategori</label>
                    <select className="w-full p-2 border border-neutral-300 rounded text-sm bg-white" value={expenseForm.category} onChange={e=>setExpenseForm({...expenseForm, category: e.target.value})}>
                        {EXPENSE_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Tutar (TL)</label>
                    <input type="text" required inputMode='numeric' className="w-full p-2 border border-neutral-300 rounded text-sm" value={expenseForm.amount} onChange={e=>setExpenseForm({...expenseForm, amount: formatNumberInput(e.target.value)})} placeholder='0'/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Tarih</label>
                    <input type="date" required className="w-full p-2 border border-neutral-300 rounded text-sm" value={expenseForm.date} onChange={e=>setExpenseForm({...expenseForm, date: e.target.value})}/>
                </div>
            </div>
            <div className="mb-4">
                 <label className="block text-xs font-bold text-neutral-700 mb-1">Açıklama (Opsiyonel)</label>
                 <input type="text" className="w-full p-2 border border-neutral-300 rounded text-sm" value={expenseForm.description} onChange={e=>setExpenseForm({...expenseForm, description: e.target.value})} placeholder='Detaylı açıklama'/>
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-neutral-800 transition"><Plus size={16} className="inline mr-1"/> Masrafı Kaydet</button>
          </form>
         
          <h4 className="font-bold text-sm text-neutral-700 mb-3 border-t pt-4">Mevcut İşlemler</h4>
          <div className="space-y-2">
            {carTransactions.length > 0 ? carTransactions.filter(t => t.category !== 'Araç Alımı').map(t=>(
                <div key={t.id} className={`flex justify-between items-center p-3 rounded-xl border ${t.type === 'expense' ? 'bg-red-50' : 'bg-green-50'}`}>
                    <div className='flex-1 min-w-0'>
                      <span className={`font-bold text-sm ${t.type === 'expense' ? 'text-red-700' : 'text-green-700'}`}>{t.category}</span>
                      <p className='text-xs text-neutral-500 truncate'>{t.description}</p>
                    </div>
                    <div className='text-right ml-4'>
                      <span className={`font-black text-sm block ${t.type === 'expense' ? 'text-red-700' : 'text-green-700'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</span>
                      <span className='text-[10px] text-neutral-400'>{formatDate(t.date)}</span>
                    </div>
                    <div className='ml-4 flex gap-1 shrink-0'>
                        <button onClick={() => onDeleteTransaction(t.id)} className='text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-white'><Trash2 size={16}/></button>
                    </div>
                </div>
            )) : <p className="text-center text-neutral-400 text-sm py-4 bg-white rounded-xl">Bu araç için henüz masraf/gelir yok.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddCustomerModal = ({ isOpen, onClose, newCustomer, setNewCustomer, onSave, inventory, isEditing }) => {
  if (!isOpen) return null;
  const availableCars = inventory?.filter(c => !c.deleted && c.status !== 'Satıldı') || [];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-lg text-black flex items-center gap-2">
            <Users size={20} className={isEditing ? 'text-yellow-500' : 'text-blue-500'}/> 
            {isEditing ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black"><X size={24} /></button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div><label className="block text-sm font-medium text-neutral-700 mb-1">Ad Soyad</label><input required type="text" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Örn: Ali Veli" /></div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-1">Telefon</label><input required type="tel" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: handlePhoneInput(e.target.value)})} placeholder="05301234567" /></div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-1">Müşteri Tipi</label><select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white" value={newCustomer.type} onChange={e => setNewCustomer({...newCustomer, type: e.target.value})}><option value="Potansiyel">Potansiyel</option><option value="Alıcı">Alıcı</option><option value="Satıcı">Satıcı</option></select></div>
          {(newCustomer.type === 'Alıcı' || newCustomer.type === 'Potansiyel') && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">İlgilendiği Araç</label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white" value={newCustomer.interestedCarId || ''} onChange={e => setNewCustomer({...newCustomer, interestedCarId: e.target.value})}>
                <option value="">-- Araç Seçiniz (Opsiyonel) --</option>
                {availableCars.map(car => (
                  <option key={car.id} value={car.id}>{car.brand} {car.model} - {car.plate?.toLocaleUpperCase('tr-TR')} ({formatCurrency(car.salePrice)})</option>
                ))}
              </select>
            </div>
          )}
          <div><label className="block text-sm font-medium text-neutral-700 mb-1">Notlar</label><textarea className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none h-24 resize-none" value={newCustomer.notes} onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})} placeholder="Müşteri hakkında notlar..." /></div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 font-medium">İptal</button>
            <button type="submit" className={`px-6 py-2 rounded-lg font-bold flex items-center ${isEditing ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-yellow-500 text-black hover:bg-yellow-600'}`}>
              <Save size={18} className="mr-2" /> {isEditing ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddTransactionModal = ({ isOpen, onClose, newTransaction, setNewTransaction, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50"><h3 className="font-bold text-lg text-black flex items-center gap-2"><Wallet size={20} className='text-green-500'/> Manuel İşlem Ekle</h3><button onClick={onClose} className="text-neutral-400 hover:text-black"><X size={24} /></button></div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-neutral-700 mb-1">İşlem Türü</label><select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white" value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value})}><option value="expense">Gider (-)</option><option value="income">Gelir (+)</option></select></div>
            <div><label className="block text-sm font-medium text-neutral-700 mb-1">Kategori</label><input required type="text" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} placeholder="Örn: Sermaye Girişi" /></div>
          </div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-1">Açıklama</label><input required type="text" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} placeholder="Örn: Eylül ayı elektrik faturası" /></div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-1">Tutar (TL)</label><input required type="text" inputMode='numeric' className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: formatNumberInput(e.target.value)})} placeholder="0.00" /></div>
          <div><label className="block text-sm font-medium text-neutral-700 mb-1">Tarih</label><input required type="date" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} /></div>
          <div className="pt-4 flex justify-end space-x-3"><button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 font-medium">İptal</button><button type="submit" className="px-6 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-600 flex items-center"><Save size={18} className="mr-2" /> Kaydet</button></div>
        </form>
      </div>
    </div>
  );
};

const DepositModal = ({ isOpen, onClose, onSave, onCancel, amount, setAmount, existingAmount }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 bg-yellow-50 flex justify-between items-center"><h3 className="font-bold text-lg text-black flex items-center gap-2"><CreditCard size={20} className='text-yellow-600'/> Kapora İşlemleri</h3><button onClick={onClose} className="text-neutral-400 hover:text-black"><X size={20}/></button></div>
        <form onSubmit={onSave} className="p-6">
          <div className="mb-6"><label className="block text-sm font-medium text-neutral-700 mb-1">{existingAmount > 0 ? "Kapora Tutarı Düzenle (TL)" : "Kapora Tutarı (TL)"}</label><div className="relative"><span className="absolute left-3 top-2 text-neutral-500 font-bold">₺</span><input required type="text" inputMode='numeric' autoFocus className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-bold" value={amount} onChange={(e) => setAmount(formatNumberInput(e.target.value))} placeholder="0" /></div></div>
          <div className="flex flex-col gap-3">
            <button type="submit" className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-600 shadow-md">{existingAmount > 0 ? "Güncelle" : "Kaporayı Onayla"}</button>
            {existingAmount > 0 && <button type="button" onClick={onCancel} className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 border border-red-100 flex items-center justify-center"><RotateCcw size={18} className="mr-2"/> Kaporayı İptal Et / İade Yap</button>}
            <button type="button" onClick={onClose} className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-800">Vazgeç</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddGeneralExpenseModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ category: 'Dükkan Kirası', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  useEffect(() => { if(isOpen) setFormData({ category: 'Dükkan Kirası', description: '', amount: '', date: new Date().toISOString().split('T')[0] }); }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFormattedNumber(formData.amount) <= 0) {
      alert("Lütfen geçerli bir tutar girin.");
      return;
    }
    onSave({ ...formData, amount: parseFormattedNumber(formData.amount) });
    setFormData(prev => ({ ...prev, amount: '', description: '' }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-red-50"><h3 className="font-bold text-lg text-black flex items-center gap-2"><Building2 size={20} className='text-red-600'/> Genel Gider Ekle</h3><button onClick={onClose} className="text-neutral-400 hover:text-black"><X size={24}/></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-xs font-bold text-neutral-500">Kategori</label><select className="w-full p-2 border rounded" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>{GENERAL_EXPENSE_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-xs font-bold text-neutral-500">Tutar</label><input type="text" required inputMode='numeric' className="w-full p-2 border rounded" value={formData.amount} onChange={e=>setFormData({...formData, amount: formatNumberInput(e.target.value)})}/></div>
          <div><label className="block text-xs font-bold text-neutral-500">Açıklama</label><input type="text" required className="w-full p-2 border rounded" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}/></div>
          <div><label className="block text-xs font-bold text-neutral-500">Tarih</label><input type="date" required className="w-full p-2 border rounded" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})}/></div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-neutral-800 transition"><Save size={18} className="inline mr-1"/> Kaydet</button>
        </form>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
 
  const [activeView, setActiveView] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);

  const [isSidebarOpen, setSidebarOpen] = useState(false); // Default to closed on mobile
  const [loginError, setLoginError] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });

  const currentYear = new Date().getFullYear();
  const defaultCar = { brand: '', model: '', year: currentYear, plate: '', km: '', vehicleType: 'Sedan', purchasePrice: '', salePrice: '', description: '', status: 'Stokta', entryDate: new Date().toISOString().split('T')[0], inspectionDate: '', fuelType: 'Dizel', gear: 'Otomatik', ownership: 'stock', ownerName: '', ownerPhone: '', commissionRate: '', photos: [], expertise: {}, packageInfo: '', engineType: '' };
  const [newCar, setNewCar] = useState(defaultCar);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', type: 'Potansiyel', notes: '', interestedCarId: '' });
  const [newTransaction, setNewTransaction] = useState({ type: 'expense', category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });

  const [modals, setModals] = useState({ addCar: false, addCustomer: false, addTransaction: false, settings: false, delete: false, message: false, analysis: false, carExpenses: false, addGeneralExpense: false, report: false, carDetail: false, deposit: false, promoCard: false });
  const [editingCarId, setEditingCarId] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [activeCarDetail, setActiveCarDetail] = useState(null);
  const [activeItem, setActiveItem] = useState(null); // Used for Delete Modal (id)
  const [activeItemType, setActiveItemType] = useState(null); // Used for Delete Modal (type)
  const [activeExpenseCar, setActiveExpenseCar] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositModal, setDepositModal] = useState({ isOpen: false, carId: null, currentAmount: 0 });
  const [saleModal, setSaleModal] = useState({ isOpen: false, carId: null, price: '' });

  // Load html2pdf script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = () => console.log('✅ HTML2PDF loaded');
    script.onerror = () => console.error('❌ HTML2PDF failed to load');
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
        } catch (e) {
            console.error("Firebase Auth Error:", e);
            setUser({ uid: 'local-user-' + Date.now() });
            setIsAuthLoading(false);
        }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        if(u) setIsAuthLoading(false);
    });
    
    // Timeout fallback - if auth takes too long
    const timeout = setTimeout(() => {
        if (!user) {
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
   
    // Subscribe to collections
    const unsubInv = onSnapshot(collection(db, path, 'inventory'), s => {
        setInventory(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>new Date(b.entryDate)-new Date(a.entryDate)));
    }, (error) => console.error("Inventory Snapshot Error:", error));
   
    const unsubCust = onSnapshot(collection(db, path, 'customers'), s => {
        setCustomers(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>a.name.localeCompare(b.name)));
    }, (error) => console.error("Customers Snapshot Error:", error));
   
    const unsubTrans = onSnapshot(collection(db, path, 'transactions'), s => {
        setTransactions(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>new Date(b.date) - new Date(a.date)));
    }, (error) => console.error("Transactions Snapshot Error:", error));
   
    const unsubProf = onSnapshot(doc(db, path, 'settings', 'profile'), d => {
        if(d.exists()) setUserProfile(d.data());
        else setDoc(doc(db, path, 'settings', 'profile'), DEFAULT_PROFILE);
    }, (error) => console.error("Profile Snapshot Error:", error));

    return () => { unsubInv(); unsubCust(); unsubTrans(); unsubProf(); };
  }, [user, isAuthLoading]);

  const showToast = (message, type = 'success') => setToast({ message, type });
 
  // --- AUTHENTICATION LOGIC ---
  const handleLocalLogin = (pw) => {
      if (pw === userProfile.password) {
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          setLoginError('');
      } else {
          setLoginError('Hatalı şifre.');
      }
  };
 
  const handleLocalLogout = () => { 
      setIsAuthenticated(false); 
      localStorage.removeItem('isAuthenticated');
      setModals({...modals, settings: false}); 
  };
 
  const handlePasswordReset = async (code) => {
      if (code === '123456' && user) {
          try {
              const path = `artifacts/${appId}/users/${user.uid}`;
              // Update password to 'admin' (or a new temporary one)
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

  // --- CRUD OPERATIONS ---
 
  const handleSaveCar = async (e) => {
    e.preventDefault();
    if(!user) return;
   
    // Basic validation
    if (newCar.ownership === 'stock') {
        if (!newCar.purchasePrice || parseFormattedNumber(newCar.purchasePrice) <= 0) {
            showToast("Stok araç için Alış Fiyatı gereklidir.", "error");
            return;
        }
    }
    if (!newCar.salePrice || parseFormattedNumber(newCar.salePrice) <= 0) {
        showToast("Lütfen Satış Fiyatı/Hedef Fiyatı giriniz.", "error");
        return;
    }
   
    try {
      const parsedYear = parseInt(newCar.year);
      const carData = {
          ...newCar,
          year: isNaN(parsedYear) ? currentYear : parsedYear,
          km: formatNumberInput(newCar.km),
          purchasePrice: parseFormattedNumber(newCar.purchasePrice),
          salePrice: parseFormattedNumber(newCar.salePrice),
          commissionRate: parseInt(newCar.commissionRate) || (newCar.ownership === 'consignment' ? 5 : 0),
          // Ensure expertise is correctly structured
          expertise: newCar.expertise || {},
          packageInfo: newCar.packageInfo || '',
          engineType: newCar.engineType || '',
      };
     
      const basePath = `artifacts/${appId}/users/${user.uid}`;
     
      if (editingCarId) {
        await updateDoc(doc(db, basePath, 'inventory', editingCarId), carData);
        showToast("Araç güncellendi.");
      } else {
        const docRef = await addDoc(collection(db, basePath, 'inventory'), { ...carData, createdAt: new Date().toISOString() });
       
        // Automatically add purchase expense for stock cars ONLY on creation
        if (carData.ownership === 'stock' && carData.purchasePrice > 0) {
            await addDoc(collection(db, basePath, 'transactions'), {
                type: 'expense',
                category: 'Araç Alımı',
                amount: carData.purchasePrice,
                date: carData.entryDate,
                description: `${carData.plate?.toLocaleUpperCase('tr-TR')} - ${carData.brand} Alışı`,
                carId: docRef.id,
                createdAt: new Date().toISOString()
            });
        }
        showToast("Araç eklendi.");
      }
      setModals({...modals, addCar: false});
      setNewCar(defaultCar); // Reset form data
      setEditingCarId(null);
    } catch(err){
        console.error(err);
        showToast("Hata oluştu: " + err.message, "error");
    }
  };

  const handleDelete = async () => {
      if(!user || !activeItem || !activeItemType) return;
     
      try {
          const path = activeItemType === 'inventory' ? 'inventory' : 'customers';
          
          // Araç siliniyor ise, ilgili tüm işlemleri de soft-delete yap
          if (activeItemType === 'inventory') {
              const carTransactions = transactions.filter(t => t.carId === activeItem && !t.deleted);
              for (const t of carTransactions) {
                  await updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, 'transactions', t.id), {
                      deleted: true,
                      deletedAt: new Date().toISOString(),
                      deletedWithCarId: activeItem // Hangi araçla birlikte silindiğini kaydet
                  });
              }
          }
          
          // Soft delete - deleted: true yap
          await updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, path, activeItem), {
              deleted: true,
              deletedAt: new Date().toISOString()
          });
         
          setModals(m => ({...m, delete: false}));
          setActiveItem(null);
          setActiveItemType(null);
          showToast(activeItemType === 'inventory' ? "Araç ve ilgili işlemler çöp kutusuna taşındı." : "Müşteri çöp kutusuna taşındı.");
      } catch (e) {
          console.error("Soft Delete Error:", e);
          showToast("Silme işlemi başarısız oldu.", "error");
      }
  };

  const handlePermanentDelete = async (itemId, itemType) => {
      if(!user || !itemId || !itemType) return;
      if (!window.confirm("Kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
     
      try {
          const path = itemType === 'inventory' ? 'inventory' : 'customers';
          
          // Eğer araç siliniyor ise, ilgili tüm işlemleri de sil
          if (itemType === 'inventory') {
              const carTransactions = transactions.filter(t => t.carId === itemId);
              for (const t of carTransactions) {
                  await deleteDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, 'transactions', t.id));
              }
          }
          
          await deleteDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, path, itemId));
          showToast(itemType === 'inventory' ? "Araç ve ilgili işlemler kalıcı olarak silindi." : "Kalıcı olarak silindi.");
      } catch (e) {
          console.error("Permanent Delete Error:", e);
          showToast("Kalıcı silme başarısız.", "error");
      }
  };

  const handleRestore = async (itemId, itemType) => {
      if(!user || !itemId || !itemType) return;
     
      try {
          const path = itemType === 'inventory' ? 'inventory' : 'customers';
          
          // Araç geri yükleniyorsa, ilgili işlemleri de geri yükle
          if (itemType === 'inventory') {
              const deletedCarTransactions = transactions.filter(t => t.deletedWithCarId === itemId && t.deleted);
              for (const t of deletedCarTransactions) {
                  await updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, 'transactions', t.id), {
                      deleted: false,
                      deletedAt: null,
                      deletedWithCarId: null
                  });
              }
          }
          
          await updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, path, itemId), {
              deleted: false,
              deletedAt: null
          });
          showToast(itemType === 'inventory' ? "Araç ve ilgili işlemler geri yüklendi." : "Geri yüklendi.");
      } catch (e) {
          console.error("Restore Error:", e);
          showToast("Geri yükleme başarısız.", "error");
      }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!user || !transactionId) return;

    try {
      await deleteDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, 'transactions', transactionId));
      showToast("İşlem kaydı silindi.");
    } catch (e) {
      console.error("Transaction deletion error:", e);
      showToast("İşlem silinemedi.", "error");
    }
  };

  const handleUpdateStatus = async (carId, newStatus) => {
      if (!user) return;
      try {
          await updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, 'inventory', carId), { status: newStatus });
          showToast(`Araç durumu güncellendi: ${newStatus}`);
          setActiveMenuId(null);
      } catch (err) {
          console.error(err);
          showToast("Durum güncellenemedi.", "error");
      }
  };

  const initiateSale = (car) => {
      setSaleModal({ isOpen: true, carId: car.id, price: formatNumberInput(car.salePrice) });
      setActiveMenuId(null);
  };

  const handleConfirmSale = async (e) => {
      e.preventDefault();
      if (!user || !saleModal.carId) return;
     
      const car = inventory.find(c => c.id === saleModal.carId);
      if (!car) return;
     
      const finalPrice = parseFormattedNumber(saleModal.price);
      const basePath = `artifacts/${appId}/users/${user.uid}`;

      try {
          // 1. Update Car Status & Final Sale Price
          await updateDoc(doc(db, basePath, 'inventory', car.id), { status: 'Satıldı', salePrice: finalPrice, soldDate: new Date().toISOString().split('T')[0] });
         
          const deposit = car.depositAmount || 0;
          const finalIncome = finalPrice - deposit;
         
          // 2. Register Final Sale Income Transaction (excluding deposit if already recorded as income)
          if (finalIncome > 0) {
              await addDoc(collection(db, basePath, 'transactions'), {
                  type: 'income',
                  category: 'Araç Satışı',
                  description: `Satış - ${car.plate?.toLocaleUpperCase('tr-TR')} ${car.brand} ${car.model} ${deposit > 0 ? '(Kalan Tutar)' : ''}`,
                  amount: finalIncome,
                  carId: car.id,
                  date: new Date().toISOString().split('T')[0],
                  createdAt: new Date().toISOString()
              });
          }

          // 3. For consignment cars, register the commission as income.
          if (car.ownership === 'consignment') {
             const commission = finalPrice * (car.commissionRate / 100);
             const netPayout = finalPrice - commission;

             // Commission Income
             await addDoc(collection(db, basePath, 'transactions'), {
               type: 'income',
               category: 'Konsinye Komisyon',
               description: `Komisyon - ${car.plate?.toLocaleUpperCase('tr-TR')} - Satış: ${formatCurrency(finalPrice)}`,
               amount: commission,
               carId: car.id,
               date: new Date().toISOString().split('T')[0],
               createdAt: new Date().toISOString()
             });

             // Owner Payout Expense (Note: This is treated as an expense/outflow from the gallery's perspective)
             await addDoc(collection(db, basePath, 'transactions'), {
               type: 'expense',
               category: 'Konsinye Ödeme',
               description: `Konsinye Ödeme - ${car.plate?.toLocaleUpperCase('tr-TR')} - Net Ödenen: ${formatCurrency(netPayout)}`,
               amount: netPayout,
               carId: car.id,
               date: new Date().toISOString().split('T')[0],
               createdAt: new Date().toISOString()
             });
          }

          showToast(`Araç satışı ${formatCurrency(finalPrice)} bedelle tamamlandı.`);
          setSaleModal({ isOpen: false, carId: null, price: '' });
      } catch (err) {
          console.error(err);
          showToast("Satış işlemi kaydedilemedi.", "error");
      }
  };

  const handleAddCarExpense = async (expenseData) => {
      if (!user || !activeExpenseCar) return;
      try {
          await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}`, 'transactions'), {
              type: 'expense',
              category: expenseData.category,
              description: `${expenseData.category} - ${activeExpenseCar.plate?.toLocaleUpperCase('tr-TR')} ${expenseData.description ? `(${expenseData.description})` : ''}`,
              amount: expenseData.amount,
              carId: activeExpenseCar.id,
              date: expenseData.date || new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString()
          });
          showToast("Araç masrafı eklendi.");
      } catch (err) {
          console.error("Error adding expense:", err);
          showToast("Hata oluştu.", "error");
      }
  };

  const initiateDeposit = (carId) => {
      const car = inventory.find(c => c.id === carId);
      const existingDeposit = car.depositAmount || 0;
      setDepositModal({ isOpen: true, carId, currentAmount: existingDeposit });
      setDepositAmount(existingDeposit > 0 ? formatNumberInput(existingDeposit.toString()) : '');
      setActiveMenuId(null);
  };

  const confirmDeposit = async (e) => {
      e.preventDefault();
      if(!user || !depositModal.carId) return;
     
      const amt = parseFormattedNumber(depositAmount);
      const car = inventory.find(c=>c.id===depositModal.carId);
      const diff = amt - (depositModal.currentAmount || 0);
      const basePath = `artifacts/${appId}/users/${user.uid}`;
     
      try {
          await updateDoc(doc(db, basePath, 'inventory', depositModal.carId), {status: 'Kapora Alındı', depositAmount: amt});
         
          if(diff !== 0) {
              await addDoc(collection(db, basePath, 'transactions'), {
                  type: diff > 0 ? 'income' : 'expense',
                  category: diff > 0 ? (depositModal.currentAmount===0?'Kapora':'Kapora Eklemesi') : 'Kapora İadesi',
                  description: `Kapora - ${car.plate?.toLocaleUpperCase('tr-TR')}`,
                  amount: Math.abs(diff),
                  carId: car.id,
                  date: new Date().toISOString().split('T')[0],
                  createdAt: new Date().toISOString()
              });
          }
          setDepositModal({isOpen: false, carId: null, currentAmount: 0});
          showToast("Kapora işlemi kaydedildi.");
      } catch (e) {
          console.error("Deposit confirmation error:", e);
          showToast("Kapora işlemi kaydedilemedi.", "error");
      }
  };

  const cancelDeposit = async () => {
      if(!user || !depositModal.carId) return;
     
      const car = inventory.find(c=>c.id===depositModal.carId);
      const basePath = `artifacts/${appId}/users/${user.uid}`;

      try {
          // 1. Reset Car Status and Deposit Amount
          await updateDoc(doc(db, basePath, 'inventory', depositModal.carId), {status: 'Stokta', depositAmount: 0});
         
          // 2. Record Deposit Refund (Expense)
          if (car.depositAmount > 0) {
              await addDoc(collection(db, basePath, 'transactions'), {
                  type: 'expense',
                  category: 'Kapora İadesi',
                  description: `İade - ${car.plate?.toLocaleUpperCase('tr-TR')}`,
                  amount: car.depositAmount,
                  carId: car.id,
                  date: new Date().toISOString().split('T')[0],
                  createdAt: new Date().toISOString()
              });
          }
          setDepositModal({isOpen: false, carId: null, currentAmount: 0});
          showToast("Kapora iade edildi ve araç stok'a alındı.");
      } catch (e) {
          console.error("Deposit cancellation error:", e);
          showToast("Kapora iptal edilemedi.", "error");
      }
  };

  const handleAddTransaction = async (e) => {
      e.preventDefault();
      if(!user) return;

      const amount = parseFormattedNumber(newTransaction.amount);
      if (amount <= 0) {
          showToast("Tutar 0'dan büyük olmalıdır.", "error");
          return;
      }
     
      try {
          await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}`, 'transactions'), {
              ...newTransaction,
              amount: amount,
              createdAt: new Date().toISOString()
          });
          setModals({...modals, addTransaction: false});
          setNewTransaction({ type: 'expense', category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
          showToast("Manuel işlem eklendi.");
      } catch (e) {
          console.error("Manual transaction error:", e);
          showToast("İşlem eklenemedi.", "error");
      }
  };

  const handleAddGeneralExpense = async (expenseData) => {
      if (!user) return;
      try {
          await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}`, 'transactions'), {
              type: 'expense',
              category: expenseData.category,
              description: expenseData.description,
              amount: expenseData.amount,
              date: expenseData.date,
              createdAt: new Date().toISOString()
          });
          setModals({...modals, addGeneralExpense: false});
          showToast("Genel gider kaydedildi.");
      } catch (err) {
          console.error("Error adding general expense:", err);
          showToast("Hata oluştu.", "error");
      }
  };

  const handleAddCustomer = async (e) => {
      e.preventDefault();
      if(!user) return;
     
      try {
          const basePath = `artifacts/${appId}/users/${user.uid}`;
          
          if (editingCustomerId) {
              // Güncelleme
              await updateDoc(doc(db, basePath, 'customers', editingCustomerId), {
                  ...newCustomer,
                  updatedAt: new Date().toISOString()
              });
              showToast("Müşteri güncellendi.");
          } else {
              // Yeni ekleme
              await addDoc(collection(db, basePath, 'customers'), {
                  ...newCustomer,
                  createdAt: new Date().toISOString()
              });
              showToast("Müşteri eklendi.");
          }
          
          setModals({...modals, addCustomer: false});
          setNewCustomer({ name: '', phone: '', type: 'Potansiyel', notes: '', interestedCarId: '' });
          setEditingCustomerId(null);
      } catch (e) {
          console.error("Customer operation error:", e);
          showToast(editingCustomerId ? "Müşteri güncellenemedi." : "Müşteri eklenemedi.", "error");
      }
  };

  const filteredInventory = activeView === 'consignment'
    ? inventory.filter(c => c.ownership === 'consignment' && c.status !== 'Satıldı' && !c.deleted)
    : activeView === 'inventory'
    ? inventory.filter(c => c.ownership !== 'consignment' && c.status !== 'Satıldı' && !c.deleted)
    : activeView === 'trash'
    ? inventory.filter(c => c.deleted)
    : activeView === 'sold'
    ? inventory.filter(c => c.status === 'Satıldı' && !c.deleted)
    : inventory.filter(c => !c.deleted);

  if (isAuthLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2"/> Uygulama Yükleniyor...</div>;
  if (!isAuthenticated) return <LoginScreen onLogin={handleLocalLogin} onReset={handlePasswordReset} error={loginError} />;

  return (
    <div className="flex h-screen bg-white font-sans text-neutral-900 overflow-hidden">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
     
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
     
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center"><div><h1 className="text-lg font-bold tracking-tight text-white">ASLANBAŞ</h1><span className="text-[10px] text-neutral-400 tracking-widest">YÖNETİM PANELİ</span></div><button onClick={() => setSidebarOpen(false)} className="md:hidden text-neutral-400 hover:text-white"><X size={20}/></button></div>
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => { setNewCar({...defaultCar, ownership: activeView === 'consignment' ? 'consignment' : 'stock'}); setEditingCarId(null); setModals({...modals, addCar: true}); }} className="bg-yellow-500 text-black p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-yellow-400 transition-colors shadow-md h-20"><Plus size={24} strokeWidth={3} /><span className="text-[10px] font-bold uppercase text-center leading-tight">ARAÇ<br/>GİRİŞİ</span></button>
                <button onClick={() => setModals({...modals, promoCard: true})} className="bg-neutral-800 text-white p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-neutral-700 transition-colors border border-neutral-700 h-20"><FileText size={24} className="text-blue-400"/><span className="text-[10px] font-bold uppercase text-center leading-tight">TANITIM<br/>KARTI</span></button>
                <button onClick={() => setModals({...modals, addGeneralExpense: true})} className="bg-red-600 text-white p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-red-500 transition-colors border border-red-700 shadow-sm h-14"><Building2 size={16} className="text-white"/><span className="text-[10px] font-bold uppercase tracking-wide">GİDER</span></button>
                <button onClick={() => setModals({...modals, addTransaction: true})} className="bg-neutral-800 text-white p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-neutral-700 transition-colors border border-neutral-700 h-14"><Wallet size={16} className="text-green-500"/><span className="text-[10px] font-bold uppercase tracking-wide">İŞLEM</span></button>
            </div>
            <div className="border-t border-neutral-800 my-2 pt-2"></div>
            <SidebarItem id="dashboard" icon={LayoutDashboard} label="Genel Bakış" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="inventory" icon={Car} label="Stok Araçlar" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="consignment" icon={Handshake} label="Konsinye Araçlar" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="sold" icon={CheckCircle} label="Satılan Araçlar" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="finance" icon={Wallet} label="Gelir & Gider" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="reports" icon={FileText} label="Raporlar" activeView={activeView} setActiveView={() => setModals(m => ({...m, report: true}))} />
            <SidebarItem id="customers" icon={Users} label="Müşteriler" activeView={activeView} setActiveView={setActiveView} />
            <SidebarItem id="trash" icon={Trash2} label="Çöp Kutusu" activeView={activeView} setActiveView={setActiveView} />
        </div>
        <div className="p-4 border-t border-neutral-800">
            <button onClick={() => setModals({...modals, settings: true})} className="flex items-center gap-3 w-full hover:bg-neutral-800 p-2 rounded transition">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">{userProfile.name?.[0]}</div>
                <div className="text-left">
                    <p className="text-sm font-bold">{userProfile.name}</p>
                    <p className="text-xs text-neutral-400">{userProfile.title}</p>
                </div>
                <Settings size={16} className="ml-auto text-neutral-500"/>
            </button>
        </div>
      </aside>
     
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-neutral-600"><Menu size={24} /></button>
            <h2 className="font-bold text-xl text-black capitalize">
              {activeView === 'consignment' ? 'Konsinye Portföyü' :
               activeView === 'inventory' ? 'Stok Araçlar' :
               activeView === 'dashboard' ? 'Genel Bakış' :
               activeView === 'finance' ? 'Finans Yönetimi' :
               activeView === 'customers' ? 'Müşteriler' :
               activeView === 'sold' ? 'Satılan Araçlar' :
               activeView === 'trash' ? 'Çöp Kutusu' : 'Raporlar'}
            </h2>
          </div>
        </header>
       
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            {(activeView === 'inventory' || activeView === 'consignment' || activeView === 'sold') && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-visible">
                        <div className="p-4 border-b border-neutral-100 flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 text-neutral-400" size={18}/>
                                <input type="text" placeholder="Plaka, Marka veya Model ile Ara..." className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            </div>
                        </div>
                        {filteredInventory.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 text-neutral-600 font-medium">
                                    <tr>
                                        <th className="p-4">Araç</th>
                                        <th className="p-4">{activeView === 'sold' ? 'Satış Fiyatı' : 'Fiyat'}</th>
                                        <th className="p-4">Durum</th>
                                        <th className="p-4">{activeView === 'sold' ? 'Kâr/Zarar' : 'Stok Gün Sayısı'}</th>
                                        <th className="p-4 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {filteredInventory.map(car => {
                                        // Satılan araçlar için kâr/zarar hesapla (silinen işlemleri dahil etme)
                                        const carTrans = transactions.filter(t => !t.deleted && t.carId === car.id);
                                        const totalIncome = carTrans.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
                                        const totalExpense = carTrans.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
                                        const profit = totalIncome - totalExpense;
                                        
                                        return (
                                        <tr key={car.id} className="hover:bg-neutral-50 cursor-pointer" onClick={() => {setActiveCarDetail(car); setModals({...modals, carDetail: true});}}>
                                            <td className="p-4">
                                                <div className="font-bold text-black">{car.brand} {car.model}</div>
                                                <div className="text-neutral-500 text-xs">{car.year} • {car.km} KM • {car.plate?.toLocaleUpperCase('tr-TR')}</div>
                                                {car.ownership === 'consignment' && car.ownerName && (
                                                    <div 
                                                        className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1 cursor-pointer hover:text-purple-800 hover:underline"
                                                        onClick={(e) => {e.stopPropagation(); setActiveCarDetail(car); setModals({...modals, carDetail: true});}}
                                                    >
                                                        <Handshake size={12}/> Sahibi: {car.ownerName}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold">{formatCurrency(car.salePrice)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${car.status === 'Satıldı' ? 'bg-green-100 text-green-700' : car.status === 'Kapora Alındı' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {car.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {activeView === 'sold' ? (
                                                    <span className={`text-sm font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                                                    </span>
                                                ) : (
                                                    <span className={`text-xs font-bold ${calculateDaysDifference(car.entryDate) >= 60 ? 'text-red-500' : calculateDaysDifference(car.entryDate) >= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                        {calculateDaysDifference(car.entryDate)} gün
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                                <div className="relative inline-block text-left">
                                                    <button onClick={() => setActiveMenuId(activeMenuId === car.id ? null : car.id)} className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical size={16}/></button>
                                                    {activeMenuId === car.id && (
                                                         // Dropdown Menu
                                                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-neutral-100 py-1 text-left origin-top-right">
                                                             {car.status !== 'Satıldı' && (
                                                               <>
                                                                    <button onClick={() => initiateSale(car)} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"><Check size={14} className="mr-2"/> Satıldı</button>
                                                                    <button onClick={() => initiateDeposit(car.id)} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"><CreditCard size={14} className="mr-2"/> Kapora İşlemi</button>
                                                               </>
                                                             )}
                                                             <button onClick={() => {setActiveExpenseCar(car); setModals({...modals, carExpenses: true}); setActiveMenuId(null);}} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"><Receipt size={14} className="mr-2"/> Finans & Masraf</button>
                                                             <button onClick={() => { setEditingCarId(car.id); setNewCar({...car, km: formatNumberInput(car.km), purchasePrice: formatNumberInput(car.purchasePrice), salePrice: formatNumberInput(car.salePrice)}); setModals({...modals, addCar: true}); setActiveMenuId(null); }} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"><Edit size={14} className="mr-2"/> Düzenle</button>
                                                             <div className="border-t border-neutral-100 my-1"></div>
                                                             <button onClick={() => {setActiveItem(car.id); setActiveItemType('inventory'); setModals({...modals, delete: true}); setActiveMenuId(null);}} className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"><Trash2 size={14} className="mr-2"/> Sil</button>
                                                          </div>
                                                     )}
                                                </div>
                                            </td>
                                        </tr>
                                    );})}
                                </tbody>
                            </table>
                        ) : <div className="p-10 text-center text-neutral-400">{activeView === 'sold' ? 'Henüz satılan araç yok.' : 'Bu kategoride araç bulunamadı.'}</div>}
                    </div>
                </div>
            )}
            {activeView === 'dashboard' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <StatCard title="Stok Araç Sayısı" value={inventory.filter(c => !c.deleted && c.ownership === 'stock' && c.status !== 'Satıldı').length} icon={Car} colorClass="bg-black text-white"/>
                        <StatCard title="Konsinye Araç Sayısı" value={inventory.filter(c => !c.deleted && c.ownership === 'consignment' && c.status !== 'Satıldı').length} icon={Handshake} colorClass="bg-purple-600 text-white"/>
                        <StatCard title="Kaporası Alınan" value={inventory.filter(c => !c.deleted && c.status === 'Kapora Alındı').length} icon={CreditCard} colorClass="bg-orange-500 text-white"/>
                        <StatCard title="Bu Ay Satış" value={transactions.filter(t => !t.deleted && t.type === 'income' && t.category === 'Araç Satışı' && t.date.startsWith(new Date().toISOString().substring(0, 7))).length} icon={TrendingUp} colorClass="bg-green-600 text-white"/>
                        <StatCard title="Kasa Durumu" value={formatCurrency(transactions.filter(t => !t.deleted).reduce((acc, t) => acc + (t.type === 'income' ? (Number(t.amount) || 0) : -(Number(t.amount) || 0)), 0))} icon={Wallet} colorClass="bg-yellow-500 text-black"/>
                    </div>
                </div>
            )}
            {activeView === 'finance' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-black">Gelir & Gider Yönetimi</h2></div>
                   
                    {/* Genel İşletme Giderleri/Gelirleri */}
                    <FinanceGroupRow title="Genel İşletme (Net)" subtext="Kira, Fatura, Maaş vb. İşlemleri" amount={transactions.filter(t=>!t.deleted && !t.carId && t.category!=='Araç Alımı').reduce((acc,t)=>acc+(t.type==='income'?t.amount:-t.amount),0)} type='capital'>
                        <div className="space-y-2 p-2">{transactions.filter(t=>!t.deleted && !t.carId && t.category!=='Araç Alımı').map(t=>(<div key={t.id} className="flex justify-between items-center text-sm p-2 border-b hover:bg-neutral-100"><span className="text-neutral-500 flex-1">{formatDate(t.date)} - {t.category} ({t.description})</span><span className={`mr-3 font-bold ${t.type==='income'?'text-green-600':'text-red-600'}`}>{t.type==='income'?'+':'-'}{formatCurrency(t.amount)}</span><button onClick={()=>handleDeleteTransaction(t.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 size={14}/></button></div>))}</div>
                    </FinanceGroupRow>
                   
                    {/* Tüm Araç İşlemleri Net Durumu */}
                    <FinanceGroupRow title="Araç Portföyü (Net)" subtext="Tüm Araçların Alım, Satım ve Masraf Durumu" amount={transactions.filter(t=>!t.deleted && !!t.carId).reduce((acc,t)=>acc+(t.type==='income'?t.amount:-t.amount),0)} type='car'>
                          <div className="space-y-2 p-2">{transactions.filter(t=>!t.deleted && !!t.carId).map(t=>(<div key={t.id} className="flex justify-between items-center text-sm p-2 border-b hover:bg-neutral-100"><span className="text-neutral-500 flex-1">{formatDate(t.date)} - {t.description}</span><span className={`mr-3 font-bold ${t.type==='income'?'text-green-600':'text-red-600'}`}>{t.type==='income'?'+':'-'}{formatCurrency(t.amount)}</span><button onClick={()=>handleDeleteTransaction(t.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 size={14}/></button></div>))}</div>
                    </FinanceGroupRow>

                    <h3 className="font-bold text-lg text-black mt-8 mb-2">Araç Bazlı Finans</h3>
                    {inventory.filter(c => !c.deleted).map(car => {
                        const carTrans = transactions.filter(t => !t.deleted && (t.carId === car.id || t.description.includes(car.plate)));
                        const totalCarIncome = carTrans.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
                        const totalCarExpense = carTrans.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
                        const netStatus = totalCarIncome - totalCarExpense;
                        let profitPercent = null;
                        // Calculate P/L relative to total expenses (excluding car purchase cost itself for stock P/L)
                        const operationalExpense = totalCarExpense - (car.ownership === 'stock' ? (carTrans.find(t => t.category === 'Araç Alımı')?.amount || 0) : 0);
                       
                        if (totalCarIncome > 0 && car.status === 'Satıldı') {
                             profitPercent = ((netStatus / totalCarIncome) * 100).toFixed(1);
                        } else if (car.status !== 'Satıldı' && operationalExpense > 0) {
                            profitPercent = ((-operationalExpense / (car.purchasePrice || 1)) * 100).toFixed(1);
                        }
                       
                        // Konsinye araç için hesaplamalar
                        const commissionRate = car.commissionRate || 5;
                        const saleAmount = carTrans.find(t => t.category === 'Araç Satışı')?.amount || car.salePrice || 0;
                        const ownerShare = car.ownership === 'consignment' ? Math.round(saleAmount * (100 - commissionRate) / 100) : 0;
                        const galleryCommission = car.ownership === 'consignment' ? saleAmount - ownerShare : 0;
                        const paidToOwner = carTrans.filter(t => t.category === 'Araç Sahibine Ödeme').reduce((a, c) => a + c.amount, 0);
                        const remainingToOwner = ownerShare - paidToOwner;
                        
                        return (
                        <FinanceGroupRow key={car.id} type="car" title={`${car.brand} ${car.model}`} subtext={`${car.plate?.toLocaleUpperCase('tr-TR')} ${car.ownership === 'consignment' ? '(Konsinye)' : ''}`} amount={netStatus} percentage={profitPercent} defaultExpanded={false}>
                            <div className="p-4 bg-neutral-50">
                            {/* Stok Araç için Normal Görünüm */}
                            {car.ownership !== 'consignment' && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white p-3 rounded border border-neutral-200"><p className="text-[10px] text-neutral-500 uppercase">Alış Fiyatı</p><p className="font-bold text-sm">{formatCurrency(car.purchasePrice || 0)}</p></div>
                                    <div className="bg-white p-3 rounded border border-neutral-200"><p className="text-[10px] text-neutral-500 uppercase">Satış Fiyatı</p><p className="font-bold text-sm">{formatCurrency(car.salePrice || 0)}</p></div>
                                </div>
                            )}
                            
                            {/* Konsinye Araç için Detaylı Görünüm */}
                            {car.ownership === 'consignment' && (
                                <div className="mb-4">
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Handshake size={18} className="text-purple-600"/>
                                            <h5 className="font-bold text-purple-800">Konsinye Detayları</h5>
                                            {car.ownerName && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded ml-auto">Sahibi: {car.ownerName}</span>}
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="bg-white p-3 rounded border border-purple-100">
                                                <p className="text-[10px] text-neutral-500 uppercase">Satış Fiyatı</p>
                                                <p className="font-bold text-sm">{formatCurrency(saleAmount)}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded border border-purple-100">
                                                <p className="text-[10px] text-neutral-500 uppercase">Komisyon (%{commissionRate})</p>
                                                <p className="font-bold text-sm text-green-600">+{formatCurrency(galleryCommission)}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded border border-purple-100">
                                                <p className="text-[10px] text-neutral-500 uppercase">Sahibine Verilecek</p>
                                                <p className="font-bold text-sm text-purple-700">{formatCurrency(ownerShare)}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded border border-purple-100">
                                                <p className="text-[10px] text-neutral-500 uppercase">Sahibine Ödenen</p>
                                                <p className="font-bold text-sm text-blue-600">{formatCurrency(paidToOwner)}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Kalan Borç veya Tamamlandı */}
                                        {car.status === 'Satıldı' && (
                                            <div className={`mt-3 p-3 rounded-lg ${remainingToOwner > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                                                {remainingToOwner > 0 ? (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <AlertCircle size={18} className="text-red-500"/>
                                                            <span className="text-sm font-bold text-red-700">Sahibine Verilmesi Gereken:</span>
                                                        </div>
                                                        <span className="text-lg font-bold text-red-600">{formatCurrency(remainingToOwner)}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle size={18} className="text-green-500"/>
                                                        <span className="text-sm font-bold text-green-700">Araç sahibine ödeme tamamlandı!</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Kasada Kalan */}
                                        <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Wallet size={18} className="text-yellow-600"/>
                                                    <span className="text-sm font-bold text-yellow-800">Kasada Kalan (Net Komisyon):</span>
                                                </div>
                                                <span className="text-lg font-bold text-yellow-700">{formatCurrency(galleryCommission - totalCarExpense + (car.ownership === 'consignment' ? 0 : totalCarIncome))}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <h5 className="text-xs font-bold text-neutral-500 mb-2 uppercase">İşlem Geçmişi</h5>
                            {carTrans.length > 0 ? (<table className="w-full text-left text-xs">
                              <thead className="text-neutral-400 border-b border-neutral-200"><tr><th className="pb-2">Tarih</th><th className="pb-2">İşlem</th><th className="pb-2 text-right">Tutar</th></tr></thead>
                              <tbody className="divide-y divide-neutral-200">
                                {carTrans.map(t => (<tr key={t.id}><td className="py-2 text-neutral-500">{formatDate(t.date)}</td><td className="py-2">{t.category} <span className="text-neutral-400">({t.description})</span></td><td className={`py-2 text-right font-bold ${t.type==='income'?'text-green-600':'text-red-600'}`}>{t.type==='income'?'+':'-'}{formatCurrency(t.amount)}</td></tr>))}
                              </tbody>
                            </table>) : <p className="text-xs text-neutral-400">Henüz işlem yok.</p>}
                            </div>
                        </FinanceGroupRow>
                        );
                    })}
                </div>
            )}
            {activeView === 'customers' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-black">Müşteri Listesi</h2><button onClick={() => setModals({...modals, addCustomer: true})} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neutral-800"><Plus size={18}/> Müşteri Ekle</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {customers.filter(c => !c.deleted).length > 0 ? customers.filter(c => !c.deleted).map(c=>{
                            const interestedCar = c.interestedCarId ? inventory.find(car => car.id === c.interestedCarId) : null;
                            return (
                            <div key={c.id} className="bg-white p-4 rounded-xl border hover:shadow-md transition relative">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-black">{c.name}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${c.type === 'Alıcı' ? 'bg-green-100 text-green-700' : c.type === 'Satıcı' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-500'}`}>{c.type}</span>
                                </div>
                                <p className="text-sm text-neutral-500 flex items-center gap-2 mb-2"><Phone size={14}/> {formatPhoneNumber(c.phone)}</p>
                                {interestedCar && (
                                    <div 
                                        className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded mb-2 cursor-pointer hover:bg-yellow-100 transition flex items-center gap-1"
                                        onClick={(e) => {e.stopPropagation(); setActiveCarDetail(interestedCar); setModals({...modals, carDetail: true});}}
                                    >
                                        <Car size={12}/> 
                                        <span className="font-bold">İlgilendiği Araç:</span> {interestedCar.brand} {interestedCar.model} - {interestedCar.plate?.toLocaleUpperCase('tr-TR')}
                                    </div>
                                )}
                                <p className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded min-h-[40px]">{c.notes || 'Not yok.'}</p>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button onClick={(e) => {e.stopPropagation(); setEditingCustomerId(c.id); setNewCustomer({name: c.name, phone: c.phone, type: c.type, notes: c.notes || '', interestedCarId: c.interestedCarId || ''}); setModals({...modals, addCustomer: true});}} className="p-1 text-neutral-400 hover:text-yellow-600 rounded-full hover:bg-yellow-50"><Edit size={16}/></button>
                                    <button onClick={(e) => {e.stopPropagation(); setActiveItem(c.id); setActiveItemType('customer'); setModals({...modals, delete: true});}} className="p-1 text-neutral-400 hover:text-red-500 rounded-full hover:bg-red-50"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        );}) : <p className="text-neutral-400 text-sm py-4">Henüz müşteri kaydı yok.</p>}
                    </div>
                </div>
            )}
            {activeView === 'trash' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-black flex items-center gap-2"><Trash2 size={24} className="text-red-500"/> Çöp Kutusu</h2>
                        <p className="text-sm text-neutral-500">Silinen öğeler burada listelenir. Geri yükleyebilir veya kalıcı olarak silebilirsiniz.</p>
                    </div>
                    
                    {/* Silinen Araçlar */}
                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                        <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
                            <h3 className="font-bold text-black flex items-center gap-2"><Car size={18}/> Silinen Araçlar ({inventory.filter(c => c.deleted).length})</h3>
                        </div>
                        {inventory.filter(c => c.deleted).length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {inventory.filter(c => c.deleted).map(car => (
                                    <div key={car.id} className="flex items-center justify-between p-4 hover:bg-neutral-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                {car.images && car.images.length > 0 ? (
                                                    <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover"/>
                                                ) : (
                                                    <Car size={24} className="text-neutral-400"/>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">{car.brand} {car.model}</p>
                                                <p className="text-sm text-neutral-500">{car.plate?.toLocaleUpperCase('tr-TR')} - {car.year}</p>
                                                <p className="text-xs text-red-400">Silinme: {car.deletedAt ? formatDate(car.deletedAt.split('T')[0]) : '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleRestore(car.id, 'inventory')} 
                                                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-1"
                                            >
                                                <RotateCcw size={14}/> Geri Yükle
                                            </button>
                                            <button 
                                                onClick={() => handlePermanentDelete(car.id, 'inventory')} 
                                                className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-200 flex items-center gap-1"
                                            >
                                                <Trash2 size={14}/> Kalıcı Sil
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-neutral-400">
                                <Car size={40} className="mx-auto mb-2 opacity-30"/>
                                <p>Çöp kutusunda araç yok.</p>
                            </div>
                        )}
                    </div>

                    {/* Silinen Müşteriler */}
                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                        <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
                            <h3 className="font-bold text-black flex items-center gap-2"><Users size={18}/> Silinen Müşteriler ({customers.filter(c => c.deleted).length})</h3>
                        </div>
                        {customers.filter(c => c.deleted).length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {customers.filter(c => c.deleted).map(customer => (
                                    <div key={customer.id} className="flex items-center justify-between p-4 hover:bg-neutral-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-neutral-400"/>
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">{customer.name}</p>
                                                <p className="text-sm text-neutral-500">{customer.phone} - {customer.type}</p>
                                                <p className="text-xs text-red-400">Silinme: {customer.deletedAt ? formatDate(customer.deletedAt.split('T')[0]) : '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleRestore(customer.id, 'customer')} 
                                                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-1"
                                            >
                                                <RotateCcw size={14}/> Geri Yükle
                                            </button>
                                            <button 
                                                onClick={() => handlePermanentDelete(customer.id, 'customer')} 
                                                className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-200 flex items-center gap-1"
                                            >
                                                <Trash2 size={14}/> Kalıcı Sil
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-neutral-400">
                                <Users size={40} className="mx-auto mb-2 opacity-30"/>
                                <p>Çöp kutusunda müşteri yok.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
       
        {/* MODAL COMPONENTS */}
        <AddCarModal
            isOpen={modals.addCar}
            onClose={() => {setModals({...modals, addCar: false}); setNewCar(defaultCar); setEditingCarId(null);}}
            newCar={newCar}
            setNewCar={setNewCar}
            onSave={handleSaveCar}
            isEditing={!!editingCarId}
            showToast={showToast}
        />
        <CarDetailModal
            isOpen={modals.carDetail}
            onClose={() => setModals({...modals, carDetail: false})}
            car={activeCarDetail}
            showToast={showToast}
        />
        <ReportModal
            isOpen={modals.report}
            onClose={() => setModals({...modals, report: false})}
            transactions={transactions}
            inventory={inventory}
            showToast={showToast}
            userProfile={userProfile}
        />
        <SettingsModal
            isOpen={modals.settings}
            onClose={() => setModals({...modals, settings: false})}
            profile={userProfile}
            setProfile={(p) => {setDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, 'settings', 'profile'), p, { merge: true }); setUserProfile(p);}}
            onLogout={handleLocalLogout}
        />
        <CarExpensesModal
            isOpen={modals.carExpenses}
            onClose={() => {setModals({...modals, carExpenses: false}); setActiveExpenseCar(null);}}
            car={activeExpenseCar}
            carTransactions={transactions.filter(t => t.carId === activeExpenseCar?.id).sort((a,b) => new Date(b.date) - new Date(a.date))}
            onAddExpense={handleAddCarExpense}
            onDeleteTransaction={handleDeleteTransaction}
        />
        <AddTransactionModal
            isOpen={modals.addTransaction}
            onClose={() => setModals({...modals, addTransaction: false})}
            newTransaction={newTransaction}
            setNewTransaction={setNewTransaction}
            onSave={handleAddTransaction}
        />
        <AddGeneralExpenseModal
            isOpen={modals.addGeneralExpense}
            onClose={() => setModals({...modals, addGeneralExpense: false})}
            onSave={handleAddGeneralExpense}
        />
        <AddCustomerModal
            isOpen={modals.addCustomer}
            onClose={() => {setModals({...modals, addCustomer: false}); setEditingCustomerId(null); setNewCustomer({ name: '', phone: '', type: 'Potansiyel', notes: '', interestedCarId: '' });}}
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            onSave={handleAddCustomer}
            inventory={inventory}
            isEditing={!!editingCustomerId}
        />
        <DepositModal
            isOpen={depositModal.isOpen}
            onClose={() => setDepositModal({...depositModal, isOpen: false})}
            onSave={confirmDeposit}
            onCancel={cancelDeposit}
            amount={depositAmount}
            setAmount={setDepositAmount}
            existingAmount={depositModal.currentAmount}
        />
        <SaleModal
            isOpen={saleModal.isOpen}
            onClose={() => setSaleModal({ ...saleModal, isOpen: false })}
            onConfirm={handleConfirmSale}
            price={saleModal.price}
            setPrice={(val) => setSaleModal({ ...saleModal, price: val })}
        />
        <PromoCardModal
            isOpen={modals.promoCard}
            onClose={() => setModals({...modals, promoCard: false})}
            inventory={inventory}
            userProfile={userProfile}
            showToast={showToast}
        />
       
        {/* Global Delete Confirmation Modal */}
        {modals.delete && (
            <DeleteConfirmationModal
                isOpen={modals.delete}
                onClose={() => setModals({...modals, delete: false})}
                onConfirm={handleDelete}
            />
        )}
      </div>
    </div>
  );
}
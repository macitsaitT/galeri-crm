// Yardımcı fonksiyonlar

// Sayı formatlama (1.000.000 formatı)
export const formatNumberInput = (value) => {
  if (!value) return '';
  const rawValue = value.toString().replace(/\D/g, '');
  if (!rawValue) return '';
  return new Intl.NumberFormat('tr-TR').format(rawValue);
};

// Formatlı sayıyı parse etme
export const parseFormattedNumber = (value) => {
  if (!value) return 0;
  const cleanValue = value.toString().replace(/\./g, '');
  return parseInt(cleanValue, 10) || 0;
};

// Para birimi formatı
export const formatCurrency = (val) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(val || 0);
};

// Tarih formatı (GG.AA.YYYY)
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateString;
};

// Telefon numarası formatlama: 0(530)8487836
export const formatPhoneNumber = (value) => {
  if (!value) return '';
  const digits = value.toString().replace(/\D/g, '');
  if (!digits) return '';
  
  if (digits.length === 11 && digits.startsWith('0')) {
    return `0(${digits.slice(1, 4)})${digits.slice(4, 11)}`;
  } else if (digits.length === 10 && digits.startsWith('5')) {
    return `0(${digits.slice(0, 3)})${digits.slice(3, 10)}`;
  }
  return value;
};

// Telefon input handler
export const handlePhoneInput = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 11);
};

// Gün farkı hesaplama
export const calculateDaysDifference = (dateString) => {
  if (!dateString) return 0;
  const entryDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - entryDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Mekanik durum renkleri
export const getMechanicalStatusColors = (status) => {
  if (status === 'Orijinal') return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
  if (status === 'İşlemli' || status === 'Boyalı') return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
  if (status === 'Sorunlu' || status === 'Değişen') return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
  return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
};

// Resim boyutlandırma
export const resizeImage = (file) => {
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

// Unique ID üretme
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

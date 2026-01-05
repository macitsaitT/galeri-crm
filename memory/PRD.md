# Galeri CRM - Product Requirements Document

## Proje Özeti
Araç galerisi yönetim sistemi (CRM). Araç envanteri, müşteri yönetimi, finansal takip ve raporlama özellikleri içerir.

## Teknoloji Stack
- **Frontend**: React + TailwindCSS + Lucide Icons
- **Backend**: Firebase (Firestore Database)
- **Authentication**: Local password authentication (şifre: 1)

## Tamamlanan Özellikler ✅

### 1. Firebase Entegrasyonu (05 Ocak 2026)
- Firestore veritabanı bağlantısı
- Gerçek zamanlı veri senkronizasyonu (onSnapshot)
- CRUD işlemleri (araç, müşteri, işlem)
- Kullanıcı profil yönetimi
- Veri kalıcılığı - sayfa yenilenince veriler korunuyor

### 2. Araç Yönetimi
- Araç ekleme/düzenleme/silme
- Stok ve konsinye araç ayrımı
- Araç durumu takibi (Stokta, Kapora Alındı, Satıldı)
- Ekspertiz bilgileri ve görsel harita
- Fotoğraf yükleme

### 3. Müşteri Yönetimi
- Müşteri ekleme/düzenleme/silme
- Müşteri tipleri (Potansiyel, Alıcı, Satıcı)
- İlgilenilen araç bağlantısı

### 4. Finansal Takip
- Araç alış/satış işlemleri
- Kapora yönetimi
- Araç masrafları
- Genel işletme giderleri
- Gelir/gider raporları

### 5. Dashboard
- Stok araç sayısı
- Konsinye araç sayısı
- Kapora alınan araç sayısı
- Aylık satış
- Kasa durumu
- Son işlemler listesi

### 6. Diğer Özellikler
- Çöp kutusu (soft delete)
- Ayarlar (profil, şifre, logo)
- Responsive tasarım

## Veritabanı Yapısı (Firestore)
```
artifacts/galeri-crm-app/users/{userId}/
├── inventory/          # Araçlar
├── customers/          # Müşteriler
├── transactions/       # İşlemler
└── settings/profile    # Kullanıcı ayarları
```

## Dosya Yapısı
```
/app/frontend/src/
├── App.js                    # Ana uygulama
├── services/firebase.js      # Firebase servisleri
├── components/
│   ├── Dashboard.jsx
│   ├── InventoryList.jsx
│   ├── CustomersList.jsx
│   ├── FinanceView.jsx
│   ├── LoginScreen.jsx
│   ├── Sidebar.jsx
│   └── modals/              # Modal bileşenleri
└── data/mock.js             # Sabit veriler (marka/model listesi)
```

## Test Bilgileri
- **Login şifresi**: 1
- **Firebase projesi**: galericrm

## Gelecek Geliştirmeler (Backlog)
- [ ] Tanıtım kartı PDF oluşturma
- [ ] Rapor modülü
- [ ] Ekspertiz raporu PDF
- [ ] Konsinye sözleşmesi PDF
- [ ] Çoklu kullanıcı desteği
- [ ] Yetkilendirme sistemi

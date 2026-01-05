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
- **Kapsamlı marka/model veritabanı** (30+ marka, 500+ model)
- **Motor tipi seçimi** (markaya ve modele göre)
- **Araç paketi/versiyonu seçimi** (motora göre)

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

### 6. Raporlar Modülü (05 Ocak 2026)
- **Özet Rapor**: Toplam gelir/gider, net durum, araç işlemleri, genel işletme
- **İşlemler Raporu**: Tarih filtrelemeli tüm işlem listesi
- **Envanter Raporu**: Araç stok durumu, toplam değer
- PDF/Yazdır özelliği

### 7. Tanıtım Kartı (05 Ocak 2026)
- Araç seçerek tanıtım kartı oluşturma
- PDF indirme özelliği
- Araç bilgileri, fotoğraf, fiyat gösterimi

### 8. Diğer Özellikler
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

## Test Bilgileri
- **Login şifresi**: 1
- **Firebase projesi**: galericrm

## Gelecek Geliştirmeler (Backlog)
- [ ] Ekspertiz raporu PDF
- [ ] Konsinye sözleşmesi PDF
- [ ] Çoklu kullanıcı desteği
- [ ] Yetkilendirme sistemi

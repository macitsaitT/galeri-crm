# Aslanbaş Oto - Galeri CRM PRD

## Project Overview
- **Project Name:** Aslanbaş Oto Galeri CRM
- **Version:** 2.1.0
- **Last Updated:** 2026-02-26
- **Status:** MVP Complete - Tüm Orijinal Özellikler Aktif

## Original Problem Statement
Kullanıcı, GitHub'daki mevcut Galeri CRM uygulamasını profesyonelleştirmek ve Play Store/App Store'a yüklemek istedi. Orijinal uygulamadaki TÜM özellikler korunarak MongoDB backend'e geçildi.

### User Requirements
1. ✅ Firebase'den MongoDB backend'e geçiş
2. ✅ Profesyonel UI/UX tasarımı
3. ✅ Mobil uygulama desteği (PWA)
4. ✅ TÜM mevcut özelliklerin korunması

## User Personas
1. **Galeri Sahibi (Primary):** Tüm araç stokunu, satışları ve finansı yönetir
2. **Galeri Çalışanı:** Araç ekleme, müşteri takibi ve satış işlemleri yapar
3. **Muhasebeci:** Gelir/gider raporlarını inceler

## Core Requirements & Implementation Status

### Dashboard
- [x] 5 Stat Kartı (Stok, Konsinye, Kaporası Alınan, Bu Ay Satış, Kasa Durumu)
- [x] 4 Quick Action Butonu (Araç Girişi, Tanıtım Kartı, Gider, İşlem)
- [x] Son İşlemler listesi
- [x] Stok Durumu listesi
- [x] Raporlar butonu
- [x] Aylık Gelir/Gider bar chart + Araç Dağılımı donut chart (Recharts)
- [x] Son 30 gün satış trendi area chart + Marka sıralaması

### Araç Yönetimi
- [x] Araç ekleme/düzenleme (4 Sekmeli Form)
- [x] Ekspertiz (13 kaporta parçası durumu + 3 mekanik durum)
- [x] Fotoğraflar (Object Storage ile)
- [x] Sahiplik/Konsinye
- [x] Sigorta ve muayene tarihleri
- [x] Stok/Konsinye/Satılan araç listeleri

### Finansal Özellikler
- [x] Gelir/Gider listeleme
- [x] Gider/İşlem ekleme modalleri
- [x] Kapora alma/iade
- [x] Satış işlemi (çalışan payı dahil)

### Raporlama
- [x] Rapor Oluşturucu Modal (yeniden tasarlandı - 2026-02-26)
- [x] İkonlu rapor kapsamı butonları (Genel, İşletme, Stok, Satılan, Kapora, Araç)
- [x] Araç bazlı rapor filtreleme (Plaka Ara + Araç Seç)
- [x] Kırmızı PDF butonu + Sarı/Amber Yazdır butonu
- [x] Tarih aralığı filtreleme
- [x] Finansal özet kartları (Gelir, Gider, Net Kâr)
- [x] İşlem dökümü tablosu
- [x] İmza alanları

### Tanıtım Kartı
- [x] Araç seçimi ve profesyonel kart tasarımı
- [x] PDF indirme

### Müşteri Yönetimi
- [x] Müşteri CRUD + tipi (Potansiyel, Aktif, Satış Yapıldı)
- [x] WhatsApp ve SMS linkleri

### Diğer Özellikler
- [x] JWT tabanlı kimlik doğrulama
- [x] True-black koyu tema
- [x] Çöp kutusu (soft delete + restore)
- [x] Responsive tasarım (Desktop + Mobile)
- [x] PWA manifest + Offline Support (Service Worker)
- [x] Takvim/Randevu sistemi
- [x] Excel export (Cars, Customers, Transactions)
- [x] PDF Expertise Report export
- [x] KVKK uyumlu hesap silme
- [x] Veri şifreleme (Fernet)
- [x] Tüm modallar viewport'ta ortalanmış (2026-02-26 düzeltildi)

## Tech Stack
- **Frontend:** React 19, TailwindCSS, Radix UI, Lucide Icons, Recharts, react-big-calendar
- **Backend:** FastAPI, Python, MongoDB (pymongo)
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
- **Storage:** Emergent Object Storage
- **Styling:** Custom dark theme (The Asphalt Suite)

## API Endpoints
```
POST /api/auth/register, /api/auth/login, /api/auth/delete-account
GET  /api/auth/me, /api/auth/verify-email/{token}
PUT  /api/auth/profile

GET/POST       /api/vehicles (CRUD)
PUT/PATCH/DEL  /api/vehicles/:id
POST           /api/vehicles/:id/restore, /api/vehicles/:id/export-pdf

GET/POST       /api/customers (CRUD)
PUT/DEL        /api/customers/:id
POST           /api/customers/:id/restore

GET/POST       /api/transactions (CRUD)
PUT/DEL        /api/transactions/:id

GET            /api/stats
GET/POST/PUT/DEL /api/appointments (CRUD)
POST           /api/upload
GET            /api/export/{vehicles|customers|transactions}
```

## Test Credentials
- Email: demo@aslanbasoto.com
- Password: demo123

## Prioritized Backlog

### P0 (Critical) - All Done ✅
- [x] All original features migrated
- [x] Modal centering fix (viewport-centered, sidebar independent)
- [x] Report modal redesign with icons, vehicle filter, styled buttons

### P1 (High Priority) - Next Phase
- [ ] Multi-user and Role Management (Admin, Salesperson)
- [ ] Real email verification (currently MOCKED)
- [ ] Capacitor native build (APK/IPA)

### P2 (Medium Priority)
- [ ] Google Social Login
- [ ] Backend refactoring (break server.py into routes/models/services)

### P3 (Low Priority)
- [ ] AI-powered vehicle valuation
- [ ] Integration with auto listing sites

## Mocked Services
- Email sending (verification) - placeholder
- Google Authentication - placeholder

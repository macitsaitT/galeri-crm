# Aslanbaş Oto - Galeri CRM PRD

## Project Overview
- **Project Name:** Aslanbaş Oto Galeri CRM
- **Version:** 2.0.0
- **Last Updated:** 2024-02-25
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

### Araç Yönetimi
- [x] Araç ekleme/düzenleme (4 Sekmeli Form)
  - [x] Genel Bilgiler (Marka, Model, Yıl, Plaka, KM, Yakıt, Vites, Motor, Paket)
  - [x] Ekspertiz (13 kaporta parçası durumu + 3 mekanik durum)
  - [x] Fotoğraflar
  - [x] Sahiplik/Konsinye (Araç sahibi bilgileri, komisyon oranı)
- [x] Sigorta başlangıç/bitiş tarihleri
- [x] Muayene tarihi
- [x] Stok araç listesi
- [x] Konsinye araç listesi
- [x] Satılan araç listesi

### Finansal Özellikler
- [x] Gelir/Gider listeleme
- [x] Gider ekleme modal (kategorili)
- [x] İşlem ekleme modal (Gelir/Gider)
- [x] Kapora alma/iade
- [x] Satış işlemi (çalışan payı dahil)

### Raporlama
- [x] Rapor Oluşturucu Modal
- [x] Tarih aralığı filtreleme
- [x] Rapor kapsamı filtreleri (Genel, İşletme, Stok, Satılan, Kapora, Araç)
- [x] PDF indirme
- [x] Yazdırma
- [x] Finansal özet (Gelir, Gider, Net Kar)
- [x] İşlem dökümü tablosu
- [x] İmza alanları

### Tanıtım Kartı
- [x] Araç seçimi
- [x] Profesyonel kart tasarımı
- [x] Kaporta durum diyagramı (SVG)
- [x] Mekanik durum özeti
- [x] Araç özellikleri (KM, Yakıt, Vites, Kasa, Muayene)
- [x] PDF indirme

### Müşteri Yönetimi
- [x] Müşteri listesi
- [x] Müşteri ekleme/düzenleme
- [x] Müşteri tipi (Potansiyel, Aktif, Satış Yapıldı)
- [x] İlgilendiği araç bağlantısı

### Diğer Özellikler
- [x] JWT tabanlı kimlik doğrulama
- [x] Koyu/Açık tema desteği
- [x] Çöp kutusu (soft delete + restore)
- [x] Responsive tasarım (Desktop + Mobile)
- [x] PWA manifest
- [x] Bottom Navigation (mobil)
- [x] FAB butonu (mobil)
- [x] Sidebar quick actions (desktop)

## Tech Stack
- **Frontend:** React 19, TailwindCSS, Radix UI, Lucide Icons
- **Backend:** FastAPI, Motor (async MongoDB driver)
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
- **Styling:** Custom design system (The Asphalt Suite)

## API Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile

GET  /api/cars
POST /api/cars
PUT  /api/cars/:id
PATCH /api/cars/:id
DELETE /api/cars/:id
POST /api/cars/:id/restore

GET  /api/customers
POST /api/customers
PUT  /api/customers/:id
DELETE /api/customers/:id
POST /api/customers/:id/restore

GET  /api/transactions
POST /api/transactions
PUT  /api/transactions/:id
DELETE /api/transactions/:id

GET  /api/stats
```

## Test Credentials
- Email: demo@aslanbasoto.com
- Password: demo123

## Prioritized Backlog

### P0 (Critical) - Done ✅
- [x] All original features migrated
- [x] Backend API (MongoDB)
- [x] Professional UI/UX
- [x] Mobile responsive design
- [x] Dynamic chained dropdowns in Add Car form (Brand→Model, Brand→Package, Province→District, Model Year, Engine Types)
- [x] Visual car expertise diagram with clickable parts (13 parts, 4 statuses: Orijinal/Boyalı/Değişen/Lokal)
- [x] Ekspertiz Puanı (%), Tramer Kayıt Tutarı (TL), Ekspertiz Notları
- [x] Phone number field in registration form
- [x] Email verification during registration (MOCKED - code shown on screen)
- [x] KVKK compliant account deletion feature with 'SİL' confirmation
- [x] Photo upload via Emergent Object Storage (drag & drop, multi-file)
- [x] Excel export for Cars, Customers, Transactions (openpyxl)
- [x] PDF Expertise Report export (reportlab)
- [x] WhatsApp customer communication links (wa.me)
- [x] Data encryption for sensitive customer fields (Fernet)
- [x] Capacitor configuration for native mobile builds (com.aslanbasoto.crm)
- [x] Professional expertise SVG+HTML hybrid diagram (13 parts, color-coded, car silhouette)
- [x] Pure black dark theme (background: #0a0a0a, card: #141414)
- [x] Dashboard charts: Monthly Gelir/Gider bar chart + Araç Dağılımı donut chart (Recharts)

### P1 (High Priority) - Next Phase
- [ ] Capacitor integration for native mobile apps (Play Store/App Store)
- [ ] Cloudinary integration for photo uploads
- [ ] WhatsApp integration for customer contact

### P2 (Medium Priority)
- [ ] Offline support with service worker
- [ ] Export reports to Excel
- [ ] Multi-user support with roles
- [ ] Push notifications

### P3 (Low Priority)
- [ ] AI-powered vehicle valuation
- [ ] Integration with auto listing sites
- [ ] SMS notifications
- [ ] Calendar for test drives

# Aslanbaş Oto - Galeri CRM PRD

## Project Overview
- **Project Name:** Aslanbaş Oto Galeri CRM
- **Version:** 2.2.0
- **Last Updated:** 2026-02-26
- **Status:** MVP Complete - Tüm Özellikler Aktif

## Original Problem Statement
Kullanıcı, GitHub'daki mevcut Galeri CRM uygulamasını profesyonelleştirmek ve Play Store/App Store'a yüklemek istedi. Orijinal uygulamadaki TÜM özellikler korunarak MongoDB backend'e geçildi.

## User Personas
1. **Galeri Sahibi (Primary):** Tüm araç stokunu, satışları ve finansı yönetir
2. **Galeri Çalışanı:** Araç ekleme, müşteri takibi ve satış işlemleri yapar
3. **Muhasebeci:** Gelir/gider raporlarını inceler

## Core Requirements & Implementation Status

### Dashboard
- [x] 5 Stat Kartı, 4 Quick Action, Son İşlemler, Stok Durumu, Raporlar butonu
- [x] Aylık Gelir/Gider bar chart + Araç Dağılımı donut chart (Recharts)
- [x] Son 30 gün satış trendi area chart + Marka sıralaması

### Araç Yönetimi
- [x] Araç ekleme/düzenleme (4 Sekmeli Form), Ekspertiz, Fotoğraflar, Sahiplik/Konsinye
- [x] Stok/Konsinye/Satılan araç listeleri

### Finansal Özellikler
- [x] Gelir/Gider CRUD, Kapora alma/iade, Satış işlemi

### Raporlama
- [x] Rapor Oluşturucu Modal (max-w-5xl, geniş tasarım)
- [x] İkonlu rapor kapsamı butonları (Genel, İşletme, Stok, Satılan, Kapora, Araç)
- [x] Araç bazlı rapor filtreleme (Plaka Ara + Araç Seç)
- [x] Profesyonel PDF/Yazdır düzeni (sayfa başlığı, tarih, şirket logosu, watermark)
- [x] Transparent logo watermark (opacity: 0.06) tüm PDF çıktılarında

### Logo Yönetimi (2026-02-26)
- [x] Ayarlar sayfasında logo yükleme (drag & click)
- [x] Logo önizleme ve silme
- [x] Logo Object Storage'a yüklenir, user profile'da logo_url olarak saklanır
- [x] Rapor PDF'lerinde transparent watermark olarak görünür
- [x] Tanıtım Kartı PDF'lerinde transparent watermark ve header'da görünür

### Tanıtım Kartı
- [x] Araç seçimi ve profesyonel kart tasarımı, logo desteği, PDF indirme

### Müşteri Yönetimi
- [x] CRUD + tipi, WhatsApp/SMS linkleri

### Diğer
- [x] JWT auth, True-black dark theme, Çöp kutusu, Responsive, PWA, Takvim
- [x] Excel/PDF export, KVKK hesap silme, Veri şifreleme (Fernet)
- [x] Tüm modallar viewport ortasında, X butonu butonlarla örtüşmez

## Tech Stack
- Frontend: React 19, TailwindCSS, Radix UI, Lucide Icons, Recharts, react-big-calendar
- Backend: FastAPI, Python, MongoDB (pymongo)
- Storage: Emergent Object Storage (photos + logos)
- Auth: JWT + bcrypt

## API Endpoints
```
POST /api/auth/register, /api/auth/login (returns logo_url)
GET /api/auth/me, PUT /api/auth/profile (supports logo_url)
DELETE /api/auth/delete-account

CRUD: /api/cars, /api/customers, /api/transactions, /api/appointments
GET /api/stats
POST /api/upload (images for cars + logos)
GET /api/files/{path}
GET /api/export/{vehicles|customers|transactions}
```

## Test Credentials
- Email: demo@aslanbasoto.com
- Password: demo123

## Prioritized Backlog

### P0 - All Done
- [x] All original features, modal centering, report redesign, logo upload, professional PDFs

### P1 - Next Phase
- [ ] Multi-user and Role Management (Admin, Salesperson)
- [ ] Real email verification (currently MOCKED)
- [ ] Capacitor native build (APK/IPA)

### P2
- [ ] Google Social Login
- [ ] Backend refactoring (server.py -> routes/models/services)

### P3
- [ ] AI-powered vehicle valuation
- [ ] Integration with auto listing sites

## Mocked Services
- Email sending (verification) - placeholder
- Google Authentication - placeholder

# Aslanbaş Oto - Galeri CRM PRD

## Project Overview
- **Project Name:** Aslanbaş Oto Galeri CRM
- **Version:** 2.3.0
- **Last Updated:** 2026-02-26
- **Status:** MVP Complete - Tüm Özellikler Aktif

## Original Problem Statement
Kullanıcı, GitHub'daki mevcut Galeri CRM uygulamasını profesyonelleştirmek ve Play Store/App Store'a yüklemek istedi.

## Core Requirements & Implementation Status

### Dashboard
- [x] Stat kartları, Quick Actions, Son İşlemler, Stok Durumu, Raporlar
- [x] Recharts grafikleri (Gelir/Gider, Araç Dağılımı, Satış Trendi, Marka Sıralaması)

### Araç Yönetimi
- [x] 4 Sekmeli Form (Genel, Ekspertiz, Fotoğraf, Sahiplik)
- [x] Zincirleme dropdown: Marka → Model → Motor → Paket (model bazlı filtreleme)
- [x] Model-specific motor ve paket seçenekleri (BMW 3 Serisi: 6 motor, Fiat Egea: 4 motor vb.)
- [x] Marka değişince model/motor/paket sıfırlanır, model değişince motor/paket sıfırlanır
- [x] Ekspertiz diagram, fotoğraf yükleme, konsinye/stok

### Raporlama & PDF
- [x] Rapor Oluşturucu Modal (max-w-5xl, ikonlu butonlar)
- [x] Profesyonel PDF/Yazdır düzeni: transparent logo watermark, sayfa başlığı
- [x] Logo varsa sadece logo görünür (şirket adı/telefon gizlenir)

### Logo Yönetimi
- [x] Ayarlar'da logo yükleme/silme/önizleme
- [x] PDF çıktılarında transparent watermark

### Diğer
- [x] JWT auth, dark theme, KVKK silme, şifreleme, PWA, takvim, Excel/PDF export
- [x] Tüm modallar viewport ortasında, X butonu örtüşmez

## API Endpoints
```
POST /api/auth/register, /api/auth/login (returns logo_url)
GET /api/auth/me, PUT /api/auth/profile
CRUD: /api/vehicles, /api/customers, /api/transactions, /api/appointments
GET /api/stats, POST /api/upload, GET /api/export/{type}
```

## Test Credentials
- demo@aslanbasoto.com / demo123

## Prioritized Backlog
### P1 - Next
- [ ] Multi-user/Role Management
- [ ] Real email verification (MOCKED)
- [ ] Capacitor native build

### P2
- [ ] Google Social Login
- [ ] Backend refactoring (server.py → routes/models)

### P3
- [ ] AI vehicle valuation

## Mocked Services
- Email sending, Google Auth

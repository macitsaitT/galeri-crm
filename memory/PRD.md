# Aslanbaş Oto - Galeri CRM PRD

## Project Overview
- **Project Name:** Aslanbaş Oto Galeri CRM
- **Version:** 1.0.0
- **Last Updated:** 2024-02-25
- **Status:** MVP Complete

## Original Problem Statement
Kullanıcı, GitHub'daki mevcut Galeri CRM uygulamasını profesyonelleştirmek ve Play Store/App Store'a yüklemek istedi.

### User Requirements
1. Firebase'den MongoDB backend'e geçiş
2. Profesyonel UI/UX tasarımı
3. Mobil uygulama desteği (PWA + Capacitor)
4. Tüm mevcut özelliklerin korunması ve iyileştirilmesi

## User Personas
1. **Galeri Sahibi (Primary):** Tüm araç stokunu, satışları ve finansı yönetir
2. **Galeri Çalışanı:** Araç ekleme, müşteri takibi ve satış işlemleri yapar
3. **Muhasebeci:** Gelir/gider raporlarını inceler

## Core Requirements (Static)
- [x] Kullanıcı kimlik doğrulama (Login/Register)
- [x] Araç yönetimi (CRUD - Stok ve Konsinye)
- [x] Müşteri yönetimi
- [x] Finans takibi (Gelir/Gider)
- [x] Kapora işlemleri
- [x] Satış işlemleri
- [x] Dashboard ve istatistikler
- [x] Çöp kutusu (soft delete)
- [x] Koyu/Açık tema desteği

## What's Been Implemented

### 2024-02-25 - MVP Release
**Backend (FastAPI + MongoDB):**
- JWT tabanlı kimlik doğrulama
- Araç CRUD API'leri
- Müşteri CRUD API'leri
- İşlem (Transaction) API'leri
- İstatistik endpoint'i
- Tüm API'ler test edildi (18/18 başarılı)

**Frontend (React 19 + TailwindCSS):**
- Profesyonel koyu tema tasarımı ("The Asphalt Suite")
- Responsive layout (Desktop + Mobile)
- Dashboard sayfası
- Stok/Konsinye/Satılan araçlar sayfaları
- Müşteriler sayfası
- Finans sayfası
- Çöp kutusu sayfası
- Ayarlar sayfası
- Araç ekleme/düzenleme modal
- Müşteri ekleme/düzenleme modal
- Satış modal
- Kapora modal
- Sidebar navigation (Desktop)
- Bottom navigation + FAB (Mobile)

**PWA Yapılandırması:**
- manifest.json oluşturuldu
- Mobile-first meta tags eklendi
- Apple touch icon desteği

## Tech Stack
- **Frontend:** React 19, TailwindCSS, Radix UI, Lucide Icons
- **Backend:** FastAPI, Motor (async MongoDB driver)
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
- **Styling:** Custom design system with CSS variables

## Test Results
- Backend: 100% (18/18 tests passed)
- Frontend: 95% (minor modal overlay issue fixed)

## Prioritized Backlog

### P0 (Critical) - Done ✅
- [x] Backend API migration to MongoDB
- [x] Authentication system
- [x] Core CRUD operations
- [x] Professional UI/UX redesign

### P1 (High Priority) - Next Phase
- [ ] Capacitor integration for native mobile apps
- [ ] Image upload for vehicle photos (Cloudinary)
- [ ] WhatsApp integration for customer contact
- [ ] Push notifications

### P2 (Medium Priority) - Future
- [ ] Offline support with service worker
- [ ] Advanced reporting and charts
- [ ] Export to PDF/Excel
- [ ] Multi-user support with roles
- [ ] Vehicle price history tracking

### P3 (Low Priority) - Backlog
- [ ] AI-powered vehicle valuation
- [ ] Integration with arabasatarım.com
- [ ] SMS notifications
- [ ] Calendar integration for test drives

## API Endpoints
```
POST /api/auth/register - Kullanıcı kaydı
POST /api/auth/login - Giriş
GET  /api/auth/me - Profil bilgisi
PUT  /api/auth/profile - Profil güncelleme

GET  /api/cars - Araç listesi
POST /api/cars - Araç ekle
PUT  /api/cars/:id - Araç güncelle
PATCH /api/cars/:id - Kısmi güncelleme
DELETE /api/cars/:id - Araç sil
POST /api/cars/:id/restore - Geri yükle

GET  /api/customers - Müşteri listesi
POST /api/customers - Müşteri ekle
PUT  /api/customers/:id - Müşteri güncelle
DELETE /api/customers/:id - Müşteri sil
POST /api/customers/:id/restore - Geri yükle

GET  /api/transactions - İşlem listesi
POST /api/transactions - İşlem ekle
PUT  /api/transactions/:id - İşlem güncelle
DELETE /api/transactions/:id - İşlem sil

GET  /api/stats - Dashboard istatistikleri
```

## Test Credentials
- Email: demo@aslanbasoto.com
- Password: demo123

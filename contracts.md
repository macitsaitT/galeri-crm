# Galeri CRM - Backend Entegrasyon Kontratı

## Firebase Konfigürasyonu
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBLHWzRA3YCKnqPY-azW2rk6YBF6RW8rVQ",
  authDomain: "galericrm.firebaseapp.com",
  projectId: "galericrm",
  storageBucket: "galericrm.firebasestorage.app",
  messagingSenderId: "817592744736",
  appId: "1:817592744736:web:ecc3a201c030a3737c7545",
  measurementId: "G-R9TG832BDD"
};
```

## Firestore Koleksiyonları

### 1. `inventory` - Araç Envanteri
```json
{
  "id": "auto-generated",
  "brand": "string",
  "model": "string",
  "year": "number",
  "plate": "string",
  "km": "string",
  "vehicleType": "string",
  "purchasePrice": "number",
  "salePrice": "number",
  "description": "string",
  "status": "Stokta | Kapora Alındı | Satıldı",
  "entryDate": "date-string",
  "soldDate": "date-string | null",
  "inspectionDate": "date-string",
  "fuelType": "string",
  "gear": "string",
  "ownership": "stock | consignment",
  "ownerName": "string",
  "ownerPhone": "string",
  "commissionRate": "number",
  "depositAmount": "number",
  "photos": ["base64-strings"],
  "expertise": {
    "body": { "partId": "status" },
    "Motor": "string",
    "Şanzıman": "string",
    "Yürüyen": "string",
    "score": "number",
    "notes": "string"
  },
  "packageInfo": "string",
  "engineType": "string",
  "customerId": "string",
  "customerName": "string",
  "employeeShare": "number",
  "deleted": "boolean",
  "deletedAt": "timestamp",
  "createdAt": "timestamp"
}
```

### 2. `customers` - Müşteriler
```json
{
  "id": "auto-generated",
  "name": "string",
  "phone": "string",
  "type": "Potansiyel | Alıcı | Satıcı",
  "notes": "string",
  "interestedCarId": "string",
  "deleted": "boolean",
  "deletedAt": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3. `transactions` - Finansal İşlemler
```json
{
  "id": "auto-generated",
  "type": "income | expense",
  "category": "string",
  "description": "string",
  "amount": "number",
  "carId": "string | null",
  "date": "date-string",
  "deleted": "boolean",
  "deletedAt": "timestamp",
  "createdAt": "timestamp"
}
```

### 4. `settings/profile` - Kullanıcı Profili
```json
{
  "name": "string",
  "title": "string",
  "phone": "string",
  "password": "string",
  "logo": "base64-string | null"
}
```

## Mock Data → Firebase Geçişi

| Mock Dosyası | Firebase Koleksiyonu |
|--------------|---------------------|
| mockInventory | inventory |
| mockCustomers | customers |
| mockTransactions | transactions |
| DEFAULT_PROFILE | settings/profile |

## Firestore Yapısı
```
artifacts/
  galeri-crm-app/
    users/
      {userId}/
        inventory/
          {carId}
        customers/
          {customerId}
        transactions/
          {transactionId}
        settings/
          profile
```

## CRUD İşlemleri

### Araç İşlemleri
- `addDoc(inventory)` - Yeni araç ekle
- `updateDoc(inventory/{id})` - Araç güncelle
- `updateDoc(inventory/{id}, {deleted: true})` - Soft delete
- `deleteDoc(inventory/{id})` - Kalıcı sil
- `onSnapshot(inventory)` - Realtime dinleme

### Müşteri İşlemleri
- `addDoc(customers)` - Yeni müşteri ekle
- `updateDoc(customers/{id})` - Müşteri güncelle
- `updateDoc(customers/{id}, {deleted: true})` - Soft delete

### İşlem Kayıtları
- `addDoc(transactions)` - Yeni işlem ekle
- `deleteDoc(transactions/{id})` - İşlem sil

### Profil
- `setDoc(settings/profile)` - Profil kaydet/güncelle
- `onSnapshot(settings/profile)` - Realtime dinleme

# OX GROUP API Documentation

Bu API NestJS framework yordamida yaratilgan bo'lib, OX tizimi bilan integratsiya qilish uchun mo'ljallangan.

## 📋 Texnologiyalar

- **NestJS** - Asosiy framework
- **Prisma ORM** - Ma'lumotlar bazasi bilan ishlash
- **JWT** - Autentifikatsiya
- **class-validator** - DTO validatsiya
- **Custom Decorators** - @AdminOnly(), @ManagerOnly()

## 🔐 Autentifikatsiya

### 1. Login

Foydalanuvchi tizimga kirishni boshlaydi.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "otp": "846435",
  "message": "for test with otp code"
}
```

**Xususiyatlar:**

- Agar foydalanuvchi mavjud bo'lmasa, yangi foydalanuvchi yaratiladi
- Default role: `manager`
- OTP generatsiya qilinadi (real yuborish shart emas)

### 2. OTP Tekshirish

OTP orqali autentifikatsiyani yakunlash.

```http
POST /auth/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicW9kaXJvdm95YmVram9uMDhAZ21haWwuY29tIiwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3NTE4MjcyODgsImV4cCI6MTc1MTkxMzY4OH0.DLfcHNDR58DMPXRbQoUmf2IIYuphJs7kc5utsJ-Va3Y"
}
```

## 🏢 Kompaniya Boshqaruvi

### 1. Kompaniya Ro'yxatdan O'tkazish

OX loyihasiga tegishli kompaniyani qo'shish.

```http
POST /api/register-company
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "token": "Bearer xyz",
  "subdomain": "demo"
}
```

**Response (Yangi kompaniya):**

```json
{
  "message": "Yangi kompaniya yaratildi va siz admin bo‘ldingiz"
}
```

**Response (Mavjud kompaniya):**

```json
{
  "message": "Siz kompaniyaga manager sifatida biriktirildingiz"
}
```

**Jarayon:**

1. OX'dagi `/profile` endpointga token orqali so'rov yuboriladi
2. Token validatsiya qilinadi
3. Kompaniya subdomain bo'yicha bazada tekshiriladi:
   - **Mavjud emas**: Kompaniya qo'shiladi, foydalanuvchiga `admin` roli beriladi
   - **Mavjud**: Foydalanuvchi shu kompaniyaga `manager` sifatida biriktiriladi

### 2. Kompaniya O'chirish

```http
DELETE /api//delete-company/:id
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "message": "Kompaniya o‘chirildi"
}
```

**Cheklovlar:**

- Faqat `admin` roldagi foydalanuvchilar
- Faqat o'zi qo'shgan kompaniyani o'chira oladi

## 📦 Mahsulotlar

### 1. Mahsulotlar Ro'yxati

Foydalanuvchiga biriktirilgan kompaniya orqali mahsulotlar ro'yxatini olish.

```http
GET /api/products?page=1&size=10
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**

- `page` (optional): Sahifa raqami (default: 1)
- `size` (optional): Sahifa hajmi (default: 10, max: 20)

**Response:**

```json
{
  "data": [],
  "total_count": 0,
  "page": 1
}
```

**Xususiyatlar:**

- Faqat `manager` roldagi foydalanuvchilar foydalanishi mumkin
- Foydalanuvchiga biriktirilgan kompaniya subdomain va token orqali OX'dagi `/variations` endpointga so'rov yuboriladi
- `size` 20 dan katta bo'lsa, 400 xatolik qaytaradi

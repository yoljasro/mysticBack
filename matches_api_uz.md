# Tanishuv (Matching) API Qo'llanmasi

Barcha so'rovlar uchun headerda `Authorization: Bearer <token>` bo'lishi shart.

---

## 1. Tavsiyalar Tasmasini Olish (Get Feed)
Foydalanuvchi hali "like" yoki "pass" bosmagan yangi profillar ro'yxatini qaytaradi.

- **URL:** `/api/matches/feed`
- **Metod:** `GET`
- **Natijada (Response):**
  - Har bir foydalanuvchi ob'ektida `compatibilityScore` (moslik foizi) bo'ladi.
```json
[
  {
    "_id": "60a7c4f5...",
    "name": "Ali",
    "avatar": "/uploads/ali.jpg",
    "bio": "Dasturchiman",
    "compatibilityScore": 85,
    "photos": ["/uploads/photo1.jpg"],
    "interests": ["Sport", "Coding"]
  }
]
```

---

## 2. Saralangan Ro'yxat (Quick Matches)
Profillarni moslik darajasi (eng yuqori foizdan pastga) bo'yicha saralab qaytaradi. Figma'dagi "List" bo'limi uchun.

- **URL:** `/api/matches/quick`
- **Metod:** `GET`
- **Natijada:** Feed bilan bir xil formatda, lekin eng moslar birinchi chiqadi.

---

## 3. Like yoki Pass Bosish (Swipe Action)
Biror foydalanuvchiga munosabat bildirish.

- **URL:** `/api/matches/action`
- **Metod:** `POST`
- **Body:**
```json
{
  "recipientId": "foydalanuvchi_id_si",
  "action": "like" // yoki "pass"
}
```
- **Natija (Agar Match bo'lsa):**
```json
{
  "message": "It is a match!",
  "isMatch": true,
  "chat": {
    "_id": "60b8d5f...",
    "chatName": "Match Chat",
    "participants": [ ... ]
  }
}
```
*Eslatma: Match bo'lganda tizim avtomatik chat yaratadi.*

---

## 4. Mos Kelganlar Ro'yxati (Matches List)
Fizik foydalanuvchi bilan o'zaro like bosishgan (match bo'lgan) barcha foydalanuvchilar.

- **URL:** `/api/matches`
- **Metod:** `GET`
- **Natijada:** O'zaro yoqqan profillar ro'yxati.

---

## 5. Chat va Xabarlar
Match bo'lgandan keyin `/api/chat` endpointlari orqali yozishish mumkin.

- **Chatlarni ko'rish:** `GET /api/chat`
- **Xabar yuborish:** `POST /api/chat/messages` (Body: `{ chatId, content }`)
- **Xabarlarni o'qish:** `GET /api/chat/messages/:chatId`

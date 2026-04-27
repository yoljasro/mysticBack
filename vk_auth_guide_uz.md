# VK Autentifikatsiyasi (VK ID) - API Qo'llanmasi

Ushbu hujjat frontend dasturchilar uchun VK (VKontakte) orqali tizimga kirish va ro'yxatdan o'tish jarayonini backend bilan integratsiya qilishni tushuntiradi.

## Umumiy jarayon (Flow)
1. Frontend (Mobile/Web) VK SDK yordamida foydalanuvchini autentifikatsiya qiladi.
2. VK'dan `accessToken` olinadi.
3. Olingan `accessToken` quyidagi API endpoint'ga yuboriladi.
4. Backend tokenni tekshiradi va foydalanuvchi mavjud bo'lsa uni tizimga kiritadi, bo'lmasa yangi foydalanuvchi yaratadi.
5. Backend foydalanuvchiga tizimda ishlatiladigan **JWT Token** va **Email/User** ma'lumotlarini qaytaradi.

---

## 1. VK Login / Register

`POST /api/auth/vk`

Foydalanuvchini VK orqali tizimga kiritish yoki ro'yxatdan o'tkazish.

### So'rov tanasi (Request Body)
| Maydon | Turi | Majburiyligi | Tavsif |
| :--- | :--- | :--- | :--- |
| `accessToken` | String | **Ha** | VK SDK tomonidan berilgan ruxsat belgisi (token). |
| `email` | String | Yo'q | Agar VK SDK foydalanuvchi emailini qaytargan bo'lsa, uni yuborish tavsiya etiladi (hisoblarni o'zaro ulash uchun). |
| `phone` | String | Yo'q | Agar VK SDK foydalanuvchi telefon raqamini qaytargan bo'lsa. |

#### Namuna (JSON):
```json
{
  "accessToken": "vk2.a.EXAMPLE_TOKEN_12345...",
  "email": "user@example.com",
  "phone": "+998901234567"
}
```

---

### Muvaffaqiyatli javob (Success Response - 200 OK)
Javobda bizning tizimimizda foydalaniladigan JWT Token va foydalanuvchi obyekti qaytadi.

```json
{
  "message": "Вход через VK выполнен успешно",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6432f...",
    "name": "Ivan Ivanov",
    "email": "vk_12345678@vk.login",
    "avatar": "https://sun9-88.userapi.com/s/v1/...jpg",
    "authProvider": "vk",
    "vkId": "12345678",
    "isVerified": true,
    "onboardingCompleted": false,
    ...
  }
}
```

> [!NOTE]
> Agar VK foydalanuvchi emailini bermasa, backend avtomatik ravishda `vk_ID@vk.login` ko'rinishidagi vaqtinchalik email yaratadi.

---

### Xatoliklar (Errors)

#### 400 Bad Request (Token yuborilmaganda)
```json
{
  "message": "Требуется VK Access Token"
}
```

#### 400 Bad Request (Token noto'g'ri yoki muddati o'tgan bo'lsa)
```json
{
  "message": "Недействительный токен VK",
  "error": {
    "error_code": 5,
    "error_msg": "User authorization failed: invalid access_token"
  }
}
```

#### 500 Internal Server Error
```json
{
  "message": "Ошибка авторизации через VK",
  "error": "Xatolik haqida batafsil ma'lumot"
}
```

---

## Foydali maslahatlar (Frontend uchun)
1. **Scopes:** VK orqali token olayotganda `email` va `photos` ruxsatlarini (scopes) so'rashni unutmang. Bu hisoblarni to'g'ri bog'lash va foydalanuvchi rasmini olish uchun muhim.
2. **Redirect URI:** Agarda web brauzer orqali ishlatilayotgan bo'lsa, VK panelidagi `Redirect URI` backenddagi marshrut bilan emas, balki sizning frontend sahifangiz bilan mos kelishi kerak.
3. **Authorization Header:** Backenddan olingan `token` (JWT) keyingi barcha himoyalangan so'rovlarda (profil ma'lumotlari, chat va h.k.) `Authorization: Bearer <TOKEN>` ko'rinishida yuborilishi shart.

# Profile API Documentation (MysticBack)

Управление профилем пользователя, включая загрузку файлов, личную информацию и настройки приложения (на основе дизайна Figma).

Все запросы к `/api/profile` требуют JWT токен в заголовке `Authorization`:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Получить профиль пользователя
Метод возвращает все текущие данные пользователя, включая аватар, настройки уведомлений и приложения. (Пароль скрыт).

* **URL:** `/api/profile/`
* **Метод:** `GET`
* **Success Response:** `200 OK`

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Александр",
  "email": "user@example.com",
  "avatar": "/uploads/avatar-1624445555.jpg",
  "phone": "+79261234567",
  "gender": "male",
  "dateOfBirth": "1995-06-03T00:00:00.000Z",
  "placeOfBirth": "Москва",
  "timeOfBirth": "14:30",
  "bio": "Люблю астрологию",
  "isOpenForReading": true,
  "notificationSettings": {
    "dailyHoroscope": true,
    "newAndFullMoon": true,
    "compatibilityOfTheDay": true,
    "promotions": true,
    "soundEffects": true
  },
  "appSettings": {
    "language": "russian",
    "theme": "dark",
    "timeFormat": "24h"
  },
  "photos": ["/uploads/photo-1.jpg"],
  "videos": []
}
```

---

## 2. Обновить профиль (Настройки и Редактирование)
Позволяет обновлять любые разрешенные поля (текстовые данные, настройки, булевы значения). Вы можете передать только те поля, которые хотите изменить (например, только `theme` или только `isOpenForReading`).

*Нельзя обновить: `email`, `password`, `googleId`, `appleId`.*

* **URL:** `/api/profile/`
* **Метод:** `PUT`
* **Content-Type:** `application/json`

**Пример тела запроса (обновление настроек приложения и темы):**
```json
{
  "name": "Новое Имя",
  "bio": "Обновленная информация о себе",
  "isOpenForReading": false,
  "appSettings": {
    "theme": "light",
    "language": "english"
  },
  "notificationSettings": {
    "dailyHoroscope": false
  }
}
```

* **Success Response:** `200 OK` (Возвращает обновленный объект пользователя).
* **Error Response:** `400 Bad Request` (Если отправлены запрещенные поля).

---

## 3. Загрузка файлов (Аватар, Фото, Видео)

Для загрузки файлов используйте формат `multipart/form-data`.

### 3.1 Загрузить Аватар
* **URL:** `/api/profile/avatar`
* **Метод:** `POST`
* **Тело запроса:** `form-data`
  * Ключ: `avatar` (Тип: File, одно изображение)

### 3.2 Загрузить Фотографии (до 10 шт.)
* **URL:** `/api/profile/photos`
* **Метод:** `POST`
* **Тело запроса:** `form-data`
  * Ключ: `photos` (Тип: File, можно выбрать несколько изображений)

### 3.3 Загрузить Видео (до 5 шт.)
* **URL:** `/api/profile/videos`
* **Метод:** `POST`
* **Тело запроса:** `form-data`
  * Ключ: `videos` (Тип: File, можно выбрать несколько видеофайлов)

* **Success Response (для всех загрузок):** `200 OK` с обновленным объектом пользователя (url файла будет лежать в массиве `photos`/`videos` или строке `avatar`, начинаясь с `/uploads/...`).

---
### Описание полей настроек (Figma)

**`notificationSettings` (Уведомления):**
* `dailyHoroscope` (Дневной гороскоп)
* `newAndFullMoon` (Новолуния и Полнолуния)
* `compatibilityOfTheDay` (Совместимость Дня)
* `promotions` (Акции и скидки)
* `soundEffects` (Звуковые эффекты)

**`appSettings` (Общие настройки):**
* `language` (Язык приложения: "russian", "english")
* `theme` (Тема оформления: "light", "dark", "system")
* `timeFormat` (Единицы измерения: "24h", "12h")

**Остальные настройки:**
* `isOpenForReading` (Открыт(а) для синастрий - Boolean)

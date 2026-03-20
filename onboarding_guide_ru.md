# Полное руководство по Onboarding API

В данном документе описаны все эндпоинты для процесса онбординга, структура запросов и примеры ответов.

## 🔑 Авторизация (JWT)
Для всех запросов к API онбординга необходимо передавать токен в заголовке `Authorization`.

**Заголовок:**
`Authorization: Bearer <JWT_TOKEN>`

---

## 🚀 Эндпоинты

### 1. Обновление профиля (Patch Update)
Этот эндпоинт используется для большинства шагов онбординга (заполнение текстовой информации, выбор интересов, местоположение и т.д.).

- **URL:** `/api/onboarding/update`
- **Метод:** `PATCH`
- **Запрос (Body - JSON):**
```json
{
    "nickname": "StarGazer",
    "gender": "male",
    "location": {
        "latitude": 41.3111,
        "longitude": 69.2406,
        "address": "Ташкент, Узбекистан"
    },
    "searchRadius": 30,
    "placeOfBirth": "Самарканд",
    "timeOfBirth": "20:15",
    "lookingFor": ["friendship", "serious_relationship"],
    "interests": ["Astrology", "Technology", "Art"],
    "bio": "Люблю изучать звезды и программировать.",
    "onboardingStep": 5,
    "notificationsEnabled": true
}
```

- **Успешный ответ (200 OK):**
```json
{
    "message": "Profile updated successfully",
    "user": {
        "_id": "60d...",
        "name": "Ivan",
        "nickname": "StarGazer",
        "gender": "male",
        "onboardingStep": 5,
        "onboardingCompleted": false
    }
}
```

---

### 2. Загрузка фотографий (Upload Photos)
Используется для загрузки галереи изображений пользователя.

- **URL:** `/api/onboarding/photos`
- **Метод:** `POST`
- **Content-Type:** `multipart/form-data`
- **Параметры (Form Data):**
    - `photos`: (Файлы) массив изображений (до 10 штук). Для завершения онбординга (на 9-м шаге) достаточно хотя бы одного файла.
    - `replace`: (Строка) `"true"` или `"false"`. Если true, текущая галерея будет полностью заменена новыми фото.

- **Успешный ответ (200 OK):**
```json
{
    "message": "Photos uploaded successfully",
    "photos": [
        "https://domain.com/uploads/photos-1625...jpg",
        "https://domain.com/uploads/photos-1625...png"
    ]
}
```

---

### 3. Получение статуса онбординга (Get Status)
Позволяет приложению узнать текущий прогресс пользователя.

- **URL:** `/api/onboarding/status`
- **Метод:** `GET`

- **Успешный ответ (200 OK):**
```json
{
    "onboardingStep": 5,
    "onboardingCompleted": false
}
```

---

### 4. Тест личности Юнга (Jung Personality Test)
Используется для определения темперамента пользователя (Холерик, Сангвиник, Флегматик, Меланхолик).

- **URL:** `/api/onboarding/jung-test`
- **Метод:** `POST`
- **Запрос (Body - JSON):**
```json
{
    "answers": ["A", "B", "C", "D", "A", "B", "B", "C", "D", "A", "A", "B", "C", "D", "A", "B", "C", "D", "A", "B"]
}
```
*Примечание: массив `answers` должен содержать ровно 20 ответов (A, B, C или D).*

- **Успешный ответ (200 OK):**
```json
{
    "message": "Jung testi muvaffaqiyatli saqlandi.",
    "jungType": "A",
    "label": "Холерик",
    "scores": {
        "choleric": 7,
        "sanguine": 5,
        "phlegmatic": 4,
        "melancholic": 4
    }
}
```

---

## 📋 Описание полей модели User (Onboarding)

| Поле | Тип | Описание |
| :--- | :--- | :--- |
| `nickname` | String | Публичное имя (никнейм). |
| `gender` | String | Пол (`male`, `female`, `other`). |
| `location` | Object | Объект с `latitude`, `longitude` и `address`. |
| `searchRadius` | Number | Радиус поиска людей в км. |
| `placeOfBirth` | String | Название места рождения. |
| `timeOfBirth` | String | Время рождения в формате "HH:mm". |
| `lookingFor` | Array | Массив строк (цели знакомства). |
| `interests` | Array | Массив строк (список интересов). |
| `photos` | Array | Список URL загруженных фотографий. |
| `bio` | String | Биография / О себе (макс. 500 симв.). |
| `personalityType`| String| Тип личности (инфо по маскам в Figma). |
| `onboardingStep` | Number | Номер текущего шага. |
| `onboardingCompleted`| Boolean| Флаг завершения всего процесса. |
| `notificationsEnabled`| Boolean| Включены ли push-уведомления. |

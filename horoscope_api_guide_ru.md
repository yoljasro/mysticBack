# Гороскоп — Техническое задание и руководство по API

**Проект:** Mystic | **Дата:** 2026-04-03

---

## 1. Описание функции

Пользователи могут просматривать **ежедневные, еженедельные и ежемесячные** гороскопы для своего знака зодиака. Прогнозы делятся на 4 категории: **Общее, Любовь, Карьера, Здоровье**.

Если пользователь не указал знак зодиака в запросе — система автоматически определяет его по полю `zodiacSign` или по дате рождения (`dateOfBirth`) из профиля.

---

## 2. Схема базы данных

**Модель:** `Horoscope` | **Файл:** `models/Horoscope.js`

| Поле | Тип | Описание |
|------|-----|----------|
| `sign` | String (enum) | Знак зодиака: `aries`, `taurus`, `gemini`, `cancer`, `leo`, `virgo`, `libra`, `scorpio`, `sagittarius`, `capricorn`, `aquarius`, `pisces` |
| `type` | String (enum) | Тип прогноза: `daily` / `weekly` / `monthly` |
| `date` | String | Дата: `YYYY-MM-DD` (daily), `YYYY-WN` (weekly), `YYYY-MM` (monthly) |
| `predictions.general` | String | Общий прогноз (обязательно) |
| `predictions.love` | String | Любовь и отношения |
| `predictions.career` | String | Карьера и финансы |
| `predictions.health` | String | Здоровье |
| `luckyNumber` | Number | Счастливое число |
| `luckyColor` | String | Счастливый цвет |
| `compatibility` | [String] | Совместимые знаки |

> **Уникальный индекс:** комбинация `{ sign, type, date }` — не может повторяться.

---

## 3. API Эндпоинты

### 3.1 Получить прогноз

```
GET /api/horoscope
```

**Авторизация:** `Authorization: Bearer <token>` (обязательно)

**Query-параметры:**

| Параметр | Тип | Обязательно | Описание |
|----------|-----|-------------|----------|
| `sign` | String | Нет | Знак зодиака. Если не указан — берётся из профиля пользователя |
| `type` | String | Нет | `daily` (по умолчанию), `weekly`, `monthly` |
| `date` | String | Нет | Конкретная дата. Если не указана — текущая дата/неделя/месяц |

#### Примеры запросов

**Сегодня (свой знак):**
```
GET /api/horoscope
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Завтра:**
```
GET /api/horoscope?type=daily&date=2026-04-04
Authorization: Bearer <token>
```

**Конкретный знак, еженедельный:**
```
GET /api/horoscope?sign=scorpio&type=weekly
Authorization: Bearer <token>
```

**Ежемесячный:**
```
GET /api/horoscope?sign=leo&type=monthly
Authorization: Bearer <token>
```

#### Успешный ответ (200)

```json
{
  "_id": "661e...",
  "sign": "aries",
  "type": "daily",
  "date": "2026-04-03",
  "predictions": {
    "general": "Сегодня день полный энергии и новых возможностей. Действуйте решительно.",
    "love": "Романтическое настроение способствует сближению. Уделите время партнёру.",
    "career": "Ваша инициатива будет отмечена руководством. Хороший день для новых проектов.",
    "health": "Физическая активность принесёт пользу. Не переусердствуйте."
  },
  "luckyNumber": 9,
  "luckyColor": "Красный",
  "compatibility": ["leo", "sagittarius"],
  "createdAt": "2026-04-03T...",
  "updatedAt": "2026-04-03T..."
}
```

#### Если данных нет (200 — плейсхолдер)

Если прогноз на выбранную дату ещё не добавлен в базу, API возвращает заглушку:

```json
{
  "sign": "aries",
  "type": "daily",
  "date": "2026-04-05",
  "predictions": {
    "general": "Звёзды сегодня молчат. Проверьте позже или выберите другую дату.",
    "love": "Любви никогда не бывает слишком много.",
    "career": "Ваш путь к успеху чист.",
    "health": "Берегите себя и свои силы."
  },
  "luckyNumber": 42,
  "luckyColor": "Azure",
  "compatibility": ["leo", "libra"]
}
```

#### Ошибки

| Код | Описание |
|-----|----------|
| 400 | Знак зодиака не указан и не удалось определить из профиля |
| 401 | Токен отсутствует или недействителен |

---

### 3.2 Список всех знаков зодиака

```
GET /api/horoscope/signs
```

**Авторизация:** не требуется

#### Ответ (200)

```json
[
  { "id": "aries",       "name": "Aries",       "dates": "Mar 21 - Apr 19", "icon": "♈" },
  { "id": "taurus",      "name": "Taurus",      "dates": "Apr 20 - May 20", "icon": "♉" },
  { "id": "gemini",      "name": "Gemini",      "dates": "May 21 - Jun 20", "icon": "♊" },
  { "id": "cancer",      "name": "Cancer",      "dates": "Jun 21 - Jul 22", "icon": "♋" },
  { "id": "leo",         "name": "Leo",         "dates": "Jul 23 - Aug 22", "icon": "♌" },
  { "id": "virgo",       "name": "Virgo",       "dates": "Aug 23 - Sep 22", "icon": "♍" },
  { "id": "libra",       "name": "Libra",       "dates": "Sep 23 - Oct 22", "icon": "♎" },
  { "id": "scorpio",     "name": "Scorpio",     "dates": "Oct 23 - Nov 21", "icon": "♏" },
  { "id": "sagittarius", "name": "Sagittarius", "dates": "Nov 22 - Dec 21", "icon": "♐" },
  { "id": "capricorn",   "name": "Capricorn",   "dates": "Dec 22 - Jan 19", "icon": "♑" },
  { "id": "aquarius",    "name": "Aquarius",    "dates": "Jan 20 - Feb 18", "icon": "♒" },
  { "id": "pisces",      "name": "Pisces",      "dates": "Feb 19 - Mar 20", "icon": "♓" }
]
```

---

## 4. Админ-панель

**URL:** `http://<хост>:<порт>/admin` → раздел **Astrology** → **Horoscope**

Через админ-панель можно:
- Создавать новые прогнозы для любого знака и даты
- Редактировать существующие прогнозы
- Удалять устаревшие записи
- Загружать прогнозы заранее (на будущие даты)

---

## 5. Заполнение тестовыми данными

Для быстрого заполнения базы данными на сегодняшний день:

```bash
node seed_horoscope.js
```

Скрипт создаёт ежедневный прогноз для всех 12 знаков на текущую дату.  
Если данные уже существуют — пропускает без дублирования.

---

## 6. Соответствие дизайну Figma

| Элемент в Figma | Реализация в API |
|-----------------|------------------|
| Сетка из 12 знаков | `GET /api/horoscope/signs` |
| Вкладка «Сегодня» | `GET /api/horoscope?type=daily` |
| Вкладка «Завтра» | `GET /api/horoscope?type=daily&date=<завтрашняя_дата>` |
| Вкладка «Неделя» | `GET /api/horoscope?type=weekly` |
| Вкладка «Месяц» | `GET /api/horoscope?type=monthly` |
| Раздел «Общее» | `predictions.general` |
| Раздел «Любовь» | `predictions.love` |
| Раздел «Карьера» | `predictions.career` |
| Раздел «Здоровье» | `predictions.health` |
| Счастливое число | `luckyNumber` |
| Счастливый цвет | `luckyColor` |
| Совместимые знаки | `compatibility[]` |

---

## 7. Автоматическое определение знака

Если параметр `sign` не передан в запросе, система определяет знак пользователя в следующем порядке:

1. **`user.zodiacSign`** — если поле заполнено в профиле
2. **`user.dateOfBirth`** — вычисляется функцией `getZodiacSign()`
3. Если оба поля пусты — возвращается ошибка `400`

---

## 8. Интеграция с фронтендом (рекомендации)

```javascript
// Пример: получить гороскоп на сегодня
const response = await fetch('/api/horoscope', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();

// data.predictions.general  → Общий прогноз
// data.predictions.love     → Любовь
// data.predictions.career   → Карьера
// data.predictions.health   → Здоровье
// data.luckyNumber          → Счастливое число
// data.luckyColor           → Счастливый цвет
// data.compatibility        → Совместимые знаки
```

```javascript
// Пример: получить гороскоп на завтра
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dateStr = tomorrow.toISOString().split('T')[0];

const response = await fetch(`/api/horoscope?type=daily&date=${dateStr}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

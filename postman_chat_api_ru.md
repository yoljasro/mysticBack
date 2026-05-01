# Postman-Style API Documentation: Chat Module (Mystic)

Это детальное руководство по использованию эндпоинтов чата. Все запросы требуют авторизации `Bearer Token`.

---

## 1. Поиск Пользователей (Search Users)
*Используется для поиска людей по имени, email или телефону.*

- **Method:** `GET`
- **URL:** `{{base_url}}/api/auth/users?search=alex`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
[
  {
    "_id": "65db...",
    "name": "Alex Smith",
    "email": "alex@example.com",
    "phone": "+998901234567",
    "avatar": "http://..."
  }
]
```

---

## 2. Создать/Открыть Чат (Access 1-on-1 Chat)
*Создает новый чат или возвращает существующий с указанным пользователем.*

- **Method:** `POST`
- **URL:** `{{base_url}}/api/chat`
- **Body (JSON):**
```json
{
  "userId": "65db..." 
}
```
- **Response (200 OK):** Возвращает объект чата с участниками и последним сообщением.

---

## 3. Получить Все Чаты (Fetch All Chats)
*Список всех активных чатов пользователя.*

- **Method:** `GET`
- **URL:** `{{base_url}}/api/chat`
- **Response (200 OK):** Массив объектов чатов.

---

## 4. Групповой Чат (Group Chat)

### Создать группу
- **Method:** `POST`
- **URL:** `{{base_url}}/api/chat/group`
- **Body (JSON):**
```json
{
  "name": "My Cool Group",
  "users": "[\"id1\", \"id2\"]"
}
```

### Переименовать группу
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/chat/rename`
- **Body:** `{ "chatId": "...", "chatName": "New Name" }`

---

## 5. Сообщения (Messages)

### Отправить текстовое сообщение
- **Method:** `POST`
- **URL:** `{{base_url}}/api/chat/messages`
- **Body (JSON):**
```json
{
  "content": "Привет! Как дела?",
  "chatId": "65dc..."
}
```

### Отправить сообщение с файлами (Медиа)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/chat/messages`
- **Body (form-data):**
  - `content`: "Вот фото"
  - `chatId`: "65dc..."
  - `attachments`: [File1, File2] (массив файлов)

### Получить историю сообщений
- **Method:** `GET`
- **URL:** `{{base_url}}/api/chat/messages/{{chatId}}`

---

## 6. Удаление и Очистка (Delete & Clear)

### Удалить чат полностью
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/chat/{{chatId}}`

### Очистить историю сообщений
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/chat/messages/clear/{{chatId}}`

---

## 7. Контакты (Contacts)

### Добавить в контакты
- **Method:** `POST`
- **URL:** `{{base_url}}/api/chat/contacts/add`
- **Body:** `{ "contactId": "65db..." }`

### Получить список контактов
- **Method:** `GET`
- **URL:** `{{base_url}}/api/chat/contacts`

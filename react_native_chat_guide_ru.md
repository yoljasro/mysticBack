# Интеграция Chat API в React Native (Mystic)

Это практическое руководство по подключению чата с использованием `axios` и `socket.io-client`.

---

## 📦 Установка зависимостей
```bash
npm install socket.io-client axios
# или
yarn add socket.io-client axios
```

---

## 🔗 Подключение к Socket.io

Создайте отдельный сервис или хук для работы с сокетами.

```javascript
import { io } from "socket.io-client";

const ENDPOINT = "http://your-api-url.com"; // URL вашего бэкенда
let socket;

export const initiateSocketConnection = (user) => {
    socket = io(ENDPOINT, {
        transports: ["websocket"],
    });

    // 1. Авторизация в сокете (Setup)
    socket.emit("setup", user);

    socket.on("connected", () => {
        console.log("Socket connected!");
    });
};

export const joinChatRoom = (chatId) => {
    if (socket) socket.emit("join chat", chatId);
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};
```

---

## 📡 Отправка и получение сообщений

### 1. Отправка через REST API
Сначала отправляем сообщение на сервер через HTTP, чтобы оно сохранилось в базе.

```javascript
import axios from "axios";

const sendMessage = async (content, chatId, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.post(
            "/api/chat/messages",
            { content, chatId },
            config
        );

        // После успеха уведомляем сокет
        socket.emit("new message", data);
        
        return data;
    } catch (error) {
        console.error("Error sending message", error);
    }
};
```

### 2. Получение сообщений (Real-time)
В вашем компоненте экрана чата:

```javascript
useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessageReceived) => {
        // Если сообщение пришло в текущий открытый чат
        if (selectedChatCompare._id === newMessageReceived.chat._id) {
            setMessages([...messages, newMessageReceived]);
        } else {
            // Иначе — показываем уведомление или инкрементим непрочитанные
            showNotification(newMessageReceived);
        }
    });

    return () => socket.off("message received");
}, [messages]);
```

---

## ⌨️ Индикаторы печати (Typing...)

```javascript
// Когда пользователь печатает
const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
    }

    // Логика остановки таймера
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }
    }, timerLength);
};

// Слушаем других пользователей (в useEffect)
socket.on("typing", () => setIsTyping(true));
socket.on("stop typing", () => setIsTyping(false));
```

---

## 📂 Работа с медиа (Фото/Видео)
Для отправки файлов используйте `FormData`.

```javascript
const sendMediaMessage = async (file, chatId, token) => {
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("attachments", {
        uri: file.uri,
        type: file.type,
        name: file.fileName,
    });

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    };

    const { data } = await axios.post("/api/chat/messages", formData, config);
    socket.emit("new message", data);
};
```

---

## 📌 Советы по UI
1. **FlatList:** Для списка сообщений используйте `FlatList` с параметром `inverted`, чтобы новые сообщения были снизу.
2. **KeyboardAvoidingView:** Обязательно используйте для корректного отображения ввода при открытой клавиатуре.
3. **Optimistic UI:** Добавляйте сообщение в список сразу в `setMessages` во время запроса, а если пришла ошибка — удаляйте/помечайте "не доставлено".

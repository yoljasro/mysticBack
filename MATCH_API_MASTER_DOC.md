# 🌟 Mystic Match API: Master Documentation

This document provides a comprehensive guide for frontend developers to integrate the **Match & Swipe** system (Tinder-style) with the backend.

---

## 🚀 Overview & Base URL

- **Production URL:** `https://mainstream.ceo/api`
- **Development URL:** `http://localhost:5000/api`
- **Format:** `JSON`
- **Authentication:** All Match endpoints require a **Bearer Token** in the header.

---

## 🔐 Authentication

To use these APIs, you must include the JWT token obtained after login/register.

**Header Example:**
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 📱 User Flow (Step-by-Step)

1.  **Get Feed:** Call `GET /matches/feed` to show users in the "Swipe" screen. Each user comes with a `compatibilityScore`.
2.  **Swipe:** When a user likes (right) or passes (left), call `POST /matches/action`.
3.  **Check for Match:** If `isMatch: true` is returned, show a "Match!" popup. The `chat` object will be provided in the response.
4.  **Chat:** Users can immediately start messaging via the `chatId` using the Chat API.
5.  **View List:** Call `GET /matches/quick` to show users sorted by compatibility in the "Quick Matches" tab.
6.  **My Matches:** Call `GET /matches` to show a list of people the user has already matched with.

---

## 🛠 Endpoints Reference

### 1. Get Swiping Feed
Returns a list of potential matches that the user hasn't seen yet.

- **URL:** `/matches/feed`
- **Method:** `GET`
- **Success Response:** `200 OK`
```json
[
  {
    "_id": "60a7c4...",
    "name": "Elena",
    "nickname": "elena_star",
    "avatar": "/uploads/avatar_123.jpg",
    "bio": "Searching for my soulmate 🔮",
    "compatibilityScore": 87,
    "photos": ["/uploads/img1.jpg", "/uploads/img2.jpg"],
    "ageRange": "22-26",
    "gender": "female",
    "dateOfBirth": "1998-05-20T00:00:00.000Z"
  }
]
```

---

### 2. Get Quick Matches (Sorted)
Returns users sorted by their compatibility score (highest first). Ideal for the "List" view.

- **URL:** `/matches/quick`
- **Method:** `GET`
- **Success Response:** `200 OK`
*(Returns the same format as Feed, but sorted)*

---

### 3. Record a Swipe (Action)
Used for both Liking and Passing.

- **URL:** `/matches/action`
- **Method:** `POST`
- **Body:**
```json
{
  "recipientId": "60a7c4...",
  "action": "like" 
}
```
*Note: `action` can be "like" or "pass".*

- **Success Response (No Match):**
```json
{
  "message": "Swiped successfully",
  "isMatch": false,
  "chat": null
}
```

- **Success Response (MATCH!):**
```json
{
  "message": "It is a match!",
  "isMatch": true,
  "chat": {
    "_id": "70b9d5...",
    "chatName": "Match Chat",
    "isGroupChat": false,
    "participants": [...]
  }
}
```

---

### 4. Get Received Likes
Returns a list of users who have liked you, but whom you haven't swiped on yet.

- **URL:** `/matches/likes-received`
- **Method:** `GET`
- **Success Response:** `200 OK`
```json
[
  {
    "_id": "60a7c4...",
    "name": "Maria",
    "avatar": "/uploads/maria.jpg",
    "nickname": "maria_99",
    "dateOfBirth": "1999-03-15T00:00:00.000Z",
    "gender": "female",
    "bio": "Hi there! ✨",
    "photos": ["..."]
  }
]
```

---

### 5. My Matches
Returns only the people you have successfully matched with.

- **URL:** `/matches`
- **Method:** `GET`
- **Success Response:** `200 OK`
```json
[
  {
    "_id": "60a7c4...",
    "name": "Elena",
    "avatar": "/uploads/avatar_123.jpg",
    "nickname": "elena_star"
  }
]
```

---

## 💬 Chat API (Quick Ref)

Once a match is made, use these to talk:

- **Send Message:** `POST /chat/messages`
  - Body: `{ "chatId": "...", "content": "Hi Elena!" }`
- **Fetch Messages:** `GET /chat/messages/:chatId`
- **My Chats:** `GET /chat`

---

## ⚠️ Error Codes

- **401 Unauthorized:** Token is missing or expired.
- **400 Bad Request:** Missing `recipientId` or invalid `action`.
- **404 Not Found:** User not found.
- **500 Server Error:** Something went wrong on the server.

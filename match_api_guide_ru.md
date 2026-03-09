# Matches API Guide (Tinder-like Swiping)

All endpoints require authentication (Bearer Token).

## 1. Get Feed (Potential Matches)
Retrieves a list of users that the current user hasn't liked or passed yet.

- **URL:** `/api/matches/feed`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "_id": "60a7c4f5...",
    "name": "User 1",
    "avatar": "/uploads/avatar1.jpg",
    "bio": "Hello world",
    "ageRange": "18-24",
    "gender": "female",
    "nickname": "user1",
    "photos": ["/uploads/photo1.jpg"]
  },
  ...
]
```

## 2. Swipe (Like / Pass)
Records the user's swipe action on another user.

- **URL:** `/api/matches/action`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "recipientId": "60a7c4f5...",
  "action": "like" // or "pass"
}
```
- **Response (If not a match):**
```json
{
  "message": "Swiped successfully",
  "isMatch": false,
  "chat": null
}
```
- **Response (If it is a match!):**
```json
{
  "message": "It is a match!",
  "isMatch": true,
  "chat": {
    "_id": "60b8d5f...",
    "chatName": "Match Chat",
    "isGroupChat": false,
    "participants": [ ... ]
  }
}
```

## 3. Get Matches List
Retrieves a list of all users the current user has successfully matched with.

- **URL:** `/api/matches`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "_id": "60a7c4f5...",
    "name": "User 1",
    "avatar": "/uploads/avatar1.jpg",
    "nickname": "user1",
    "ageRange": "18-24"
  },
  ...
]
```

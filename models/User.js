const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    dateOfBirth: {
        type: Date
    },
    phone: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String
    },
    appleId: {
        type: String
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'apple'],
        default: 'local'
    },
    deviceToken: {
        type: String
    },
    lunarSettings: {
        newAndFullMoon: { type: Boolean, default: true }, // Новолуние и Полнолуние
        moonPhaseChange: { type: Boolean, default: true }, // Смена фаз луны
        tipOfTheDay: { type: Boolean, default: true }, // Совет дня
        affirmation: { type: Boolean, default: true } // Аффирмация дня
    },
    // Onboarding fields
    nickname: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', '']
    },
    location: {
        latitude: Number,
        longitude: Number,
        address: String,
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    timezone: {
        type: String,
        default: 'UTC+5'
    },
    searchRadius: {
        type: Number,
        default: 50
    },
    locationEnabled: {
        type: Boolean,
        default: false
    },
    placeOfBirth: {
        type: String
    },
    timeOfBirth: {
        type: String // Format HH:mm
    },
    lookingFor: [String], // General categories
    lookingForGoal: {
        type: String,
        enum: ['Серьезные отношения', 'Открытость к общению', 'Дружеское общение', 'Новый опыт'],
        default: 'Открытость к общению'
    },
    interests: {
        type: [String],
        enum: [
            'Йога', 'Медитация', 'Астрология', 'Таро', 'Психология',
            'Путешествия', 'Искусство', 'Музыка', 'Книги', 'Спорт',
            'Кино', 'Фотография', 'Кулинария', 'Танцы', 'Природа'
        ]
    },
    searchSettings: {
        radius: { type: Number, default: 50 },
        minAge: { type: Number, default: 18 },
        maxAge: { type: Number, default: 100 }
    },
    photos: [{
        url: String,
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }
    }],
    bio: {
        type: String,
        maxLength: 500
    },
    personalityType: {
        type: String // To store mask type/personality info
    },
    notificationsEnabled: {
        type: Boolean,
        default: false
    },
    onboardingStep: {
        type: Number,
        default: 1
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    ageRange: {
        type: String,
        default: ''
    },
    hideProfile: {
        type: Boolean,
        default: false
    },
    videos: [{
        url: String,
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }
    }],
    jungType: {
        type: String,
        default: ''
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notificationSettings: {
        dailyHoroscope: { type: Boolean, default: true },
        newAndFullMoon: { type: Boolean, default: true },
        compatibilityOfTheDay: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true },
        soundEffects: { type: Boolean, default: true }
    },
    appSettings: {
        language: { type: String, default: 'russian' },
        theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
        timeFormat: { type: String, enum: ['12h', '24h'], default: '24h' }
    },
    isOpenForReading: {
        type: Boolean,
        default: true
    },
    zodiacSign: {
        type: String,
        default: ''
    },
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    mutedChats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }]
}, { timestamps: true });

userSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('User', userSchema);

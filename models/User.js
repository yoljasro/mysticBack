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
        required: true
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
        address: String
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
    lookingFor: [{
        type: String
    }],
    interests: [{
        type: String
    }],
    photos: [{
        type: String
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
        type: String
    }],
    jungType: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

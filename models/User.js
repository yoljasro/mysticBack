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
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

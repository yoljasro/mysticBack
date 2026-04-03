const mongoose = require('mongoose');

const horoscopeSchema = new mongoose.Schema({
    sign: {
        type: String,
        required: true,
        enum: [
            'aries', 'taurus', 'gemini', 'cancer', 
            'leo', 'virgo', 'libra', 'scorpio', 
            'sagittarius', 'capricorn', 'aquarius', 'pisces'
        ],
        lowercase: true
    },
    type: {
        type: String,
        required: true,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    date: {
        type: String, // YYYY-MM-DD for daily, YYYY-WW for weekly, YYYY-MM for monthly
        required: true
    },
    predictions: {
        general: {
            type: String,
            required: true
        },
        love: {
            type: String,
            default: ''
        },
        career: {
            type: String,
            default: ''
        },
        health: {
            type: String,
            default: ''
        }
    },
    luckyNumber: {
        type: Number
    },
    luckyColor: {
        type: String
    },
    compatibility: [{
        type: String,
        enum: [
            'aries', 'taurus', 'gemini', 'cancer', 
            'leo', 'virgo', 'libra', 'scorpio', 
            'sagittarius', 'capricorn', 'aquarius', 'pisces'
        ]
    }]
}, { timestamps: true });

// Index for faster queries by sign, type, and date
horoscopeSchema.index({ sign: 1, type: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Horoscope', horoscopeSchema);

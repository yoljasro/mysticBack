const mongoose = require('mongoose');

const tarotCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        upright: { type: String, default: '' },
        reversed: { type: String, default: '' }
    },
    loveForecast: {
        upright: { type: String, default: '' },
        reversed: { type: String, default: '' },
        strongPoint: String,
        watchOut: String,
        tipOfTheDay: String
    },
    careerForecast: {
        upright: { type: String, default: '' },
        reversed: { type: String, default: '' },
        strongPoint: String,
        watchOut: String,
        tipOfTheDay: String
    },
    healthForecast: {
        upright: { type: String, default: '' },
        reversed: { type: String, default: '' },
        strongPoint: String,
        watchOut: String,
        tipOfTheDay: String
    },
    advice: {
        type: String,
        default: ''
    },
    image: {
        type: String, // URL to the image of the card
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('TarotCard', tarotCardSchema);

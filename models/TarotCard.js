const mongoose = require('mongoose');

const tarotCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    loveForecast: {
        strength: {
            type: String, // e.g., 'Глубина', 'Страсть', etc.
            required: true
        },
        focus: {
            type: String, // e.g., 'Эмоции', 'Стабильность', etc.
            required: true
        },
        tipOfTheDay: {
            type: String, // e.g., 'Не колебаться, если захочешь написать первой'
            required: true
        }
    },
    image: {
        type: String, // URL to the image of the card
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('TarotCard', tarotCardSchema);

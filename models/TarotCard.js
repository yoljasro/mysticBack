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
        description: String,
        strongPoint: String,
        watchOut: String,
        tipOfTheDay: String
    },
    careerForecast: {
        description: String,
        strongPoint: String,
        watchOut: String,
        tipOfTheDay: String
    },
    healthForecast: {
        description: String,
        strongPoint: String,
        watchOut: String,
        tipOfTheDay: String
    },
    image: {
        type: String, // URL to the image of the card
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('TarotCard', tarotCardSchema);

const mongoose = require('mongoose');

const natalChartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profileName: {
        type: String, // e.g., "Моя карта", "Мой друг"
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String, // DD.MM.YYYY
        required: true
    },
    timeOfBirth: {
        type: String, // HH:MM
        default: ''
    },
    isTimeUnknown: {
        type: Boolean,
        default: false
    },
    placeOfBirth: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        default: ''
    },
    // The calculated astrological data payload 
    chartData: {
        type: mongoose.Schema.Types.Mixed, // Storing unstructured JSON data for planets, houses, aspects, texts
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('NatalChart', natalChartSchema);

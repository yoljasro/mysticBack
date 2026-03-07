const mongoose = require('mongoose');

const lunarDaySchema = new mongoose.Schema({
    date: {
        type: String, // format: "YYYY-MM-DD" e.g "2026-03-07"
        required: true,
        unique: true
    },
    moonPhase: {
        type: String, // e.g. "Растущая Луна"
        required: true
    },
    zodiacSign: {
        type: String, // e.g. "Рак"
        required: true
    },
    // The specific lunar day number, e.g. 14 as portrayed in UI "14-й Лунный день"
    lunarDayNumber: {
        type: Number,
        required: true
    },
    scores: {
        health: { type: Number, default: 0 }, // 0 to 100
        work: { type: Number, default: 0 },
        relationships: { type: Number, default: 0 }
    },
    tipOfTheDay: {
        type: String, // e.g. "Совет дня: Не лучший день для конфликтов..."
    },
    practices: [{
        type: { type: String }, // e.g., "Медитация", "Чек-лист", "Аффирмация"
        title: { type: String },
        description: { type: String },
    }]
}, { timestamps: true });

module.exports = mongoose.model('LunarDay', lunarDaySchema);

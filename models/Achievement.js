const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🏆'
    },
    isUnlocked: {
        type: Boolean,
        default: true
    },
    dateUnlocked: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);

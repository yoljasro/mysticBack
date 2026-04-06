const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['like', 'pass'],
        required: true
    },
    isMatch: {
        type: Boolean,
        default: false
    },
    compatibilityScore: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Prevent duplicate interactions
interactionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Interaction', interactionSchema);


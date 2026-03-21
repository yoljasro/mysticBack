const Achievement = require('../models/Achievement');
const Prediction = require('../models/Prediction');
const NatalChart = require('../models/NatalChart');
const asyncHandler = require('express-async-handler');

// @desc    Get data for "My Astrological Path" screen
// @route   GET /api/profile/astrological-path
// @access  Private
const getAstrologicalJourney = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Fetch natal charts (limited for journey overview)
    const natalCharts = await NatalChart.find({ user: userId })
        .select('profileName createdAt')
        .limit(5);

    // Fetch recent predictions/history
    let archivePredictions = await Prediction.find({ user: userId })
        .sort({ date: -1 })
        .limit(10);

    // If empty, create some initial ones (lazy initialization)
    if (archivePredictions.length === 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        archivePredictions = await Prediction.create([
            { user: userId, title: 'Добро пожаловать!', content: 'Ваш путь в мире мистики начинается здесь.', date: today, type: 'daily' },
            { user: userId, title: 'Первые шаги', content: 'Вы успешно настроили свой профиль и готовы к новым открытиям.', date: yesterday, type: 'daily' }
        ]);
    }

    // Fetch achievements
    let achievements = await Achievement.find({ user: userId })
        .sort({ dateUnlocked: -1 });

    // If empty, create initial ones
    if (achievements.length === 0) {
        achievements = await Achievement.create([
            { user: userId, title: 'Новичок', icon: '🌟', isUnlocked: true },
            { user: userId, title: 'Исследователь', icon: '🔭', isUnlocked: true }
        ]);
    }

    res.json({
        natalCharts,
        archivePredictions,
        achievements
    });
});

module.exports = {
    getAstrologicalJourney
};

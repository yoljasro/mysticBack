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
    const archivePredictions = await Prediction.find({ user: userId })
        .sort({ date: -1 })
        .limit(10);

    // Fetch achievements
    const achievements = await Achievement.find({ user: userId })
        .sort({ dateUnlocked: -1 });

    res.json({
        natalCharts,
        archivePredictions,
        achievements
    });
});

module.exports = {
    getAstrologicalJourney
};

const express = require('express');
const router = express.Router();
const lunarController = require('../controllers/lunarController');
const auth = require('../middleware/auth');

// Note: Ensure /api/lunar routes are mounted in server.js

// 1. Get detailed info for a single date
router.get('/day/:date', auth, lunarController.getDayDetails);

// 2. Get high-level overview for a month
router.get('/month/:year/:month', auth, lunarController.getMonthOverview);

// 3. Update notification settings (Screen 4)
router.put('/settings', auth, lunarController.updateSettings);

module.exports = router;

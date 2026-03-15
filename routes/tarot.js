const express = require('express');
const {
    drawDailyCard,
    drawAgain
} = require('../controllers/tarotController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/daily', protect, drawDailyCard);
router.post('/draw', protect, drawAgain);

module.exports = router;

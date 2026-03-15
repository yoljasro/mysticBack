const express = require('express');
const {
    drawDailyCard,
    drawAgain
} = require('../controllers/tarotController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/daily', auth, drawDailyCard);
router.post('/draw', auth, drawAgain);

module.exports = router;

const express = require('express');
const {
    drawDailyCard,
    drawAgain,
    getAllCards,
    getCardById,
    drawThreeCardSpread
} = require('../controllers/tarotController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/daily', auth, drawDailyCard);
router.post('/draw', auth, drawAgain);
router.get('/cards', auth, getAllCards);
router.get('/cards/:id', auth, getCardById);
router.get('/spread/three', auth, drawThreeCardSpread);

module.exports = router;

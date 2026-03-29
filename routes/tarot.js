const express = require('express');
const {
    drawDailyCard,
    drawAgain,
    getAllCards,
    getCardById,
    drawThreeCardSpread,
    getTarotHistory,
    deleteTarotHistory
} = require('../controllers/tarotController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/daily', auth, drawDailyCard);
router.post('/draw', auth, drawAgain);
router.get('/cards', auth, getAllCards);
router.get('/cards/:id', auth, getCardById);
router.get('/spread/three', auth, drawThreeCardSpread);
router.get('/history', auth, getTarotHistory);
router.delete('/history/:id', auth, deleteTarotHistory);

module.exports = router;

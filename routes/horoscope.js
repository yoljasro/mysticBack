const express = require('express');
const router = express.Router();
const { getHoroscope, getSignsList } = require('../controllers/horoscopeController');
const auth = require('../middleware/auth');

// /signs must be before / to avoid route conflicts
router.get('/signs', getSignsList);
router.get('/', auth, getHoroscope);

module.exports = router;

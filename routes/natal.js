const express = require('express');
const router = express.Router();
const natalController = require('../controllers/natalController');
const auth = require('../middleware/auth');

// Note: Ensure /api/natal routes are mounted in server.js

// 1. Calculate & Save a new Natal Chart
router.post('/calculate', auth, natalController.calculateAndSaveChart);

// 2. Get all saved Natal Charts for the logged-in user
router.get('/', auth, natalController.getMyCharts);

// 3. Get detailed data for a specific saved chart
router.get('/:id', auth, natalController.getChartById);

// 4. Delete a saved Natal Chart
router.delete('/:id', auth, natalController.deleteChart);

module.exports = router;

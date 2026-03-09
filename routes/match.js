const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth');

// @desc    Get feed of potential matches
// @route   GET /api/matches/feed
// @access  Private
router.get('/feed', auth, matchController.getFeed);
router.get('/quick', auth, matchController.getQuickMatches);

// @desc    Swipe on a user (like/pass)
// @route   POST /api/matches/action
// @access  Private
router.action = router.post('/action', auth, matchController.swipeAction);

// @desc    Get list of matches
// @route   GET /api/matches
// @access  Private
router.get('/', auth, matchController.getMatches);

module.exports = router;

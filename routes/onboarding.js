const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// PATCH /api/onboarding/update - Update general profile info/onboarding steps
router.patch('/update', auth, onboardingController.updateProfile);

// POST /api/onboarding/photos - Upload user photos (gallery)
router.post('/photos', auth, upload.array('photos', 10), onboardingController.uploadPhotos);

// GET /api/onboarding/status - Get current onboarding progress
router.get('/status', auth, onboardingController.getOnboardingStatus);

module.exports = router;

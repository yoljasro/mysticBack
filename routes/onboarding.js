const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// PATCH /api/onboarding/update - Update general profile info/onboarding steps
router.patch('/update', auth, onboardingController.updateProfile);

// POST /api/onboarding/media - Upload user photos/videos (gallery)
router.post('/media', auth, upload.array('media', 10), onboardingController.uploadMedia);

// Keep old route for backward compatibility, but use the new controller method
router.post('/photos', auth, upload.array('photos', 10), onboardingController.uploadMedia);

// GET /api/onboarding/status - Get current onboarding progress
router.get('/status', auth, onboardingController.getOnboardingStatus);

module.exports = router;

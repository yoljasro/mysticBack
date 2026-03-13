const router = require('express').Router();
const protect = require('../middleware/auth');

const validateProfile = require('../middleware/validateProfile');
const {
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadPhotos,
    uploadVideos,
} = require('../controllers/profileController');

const { getAstrologicalJourney } = require('../controllers/astrologyController');
const { getNotifications, markRead } = require('../controllers/notificationController');

router.get('/', protect, getProfile);
router.put('/', protect, validateProfile, updateProfile);
router.post('/avatar', protect, uploadAvatar);
router.post('/photos', protect, uploadPhotos);
router.post('/videos', protect, uploadVideos);

// New Routes
router.get('/astrological-path', protect, getAstrologicalJourney);
router.get('/archive', protect, getNotifications);
router.put('/archive/read', protect, markRead);

module.exports = router;

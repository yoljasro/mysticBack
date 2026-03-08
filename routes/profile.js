const router = require('express').Router();
const { protect } = require('../middleware/auth');

const validateProfile = require('../middleware/validateProfile');
const {
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadPhotos,
    uploadVideos,
} = require('../controllers/profileController');

router.get('/', protect, getProfile);
router.put('/', protect, validateProfile, updateProfile);
router.post('/avatar', protect, uploadAvatar);
router.post('/photos', protect, uploadPhotos);
router.post('/videos', protect, uploadVideos);

module.exports = router;

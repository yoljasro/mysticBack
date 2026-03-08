const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const upload = require('../middleware/upload');

// @desc    Get logged in user's profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

// @desc    Update logged in user's profile (partial)
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const disallowed = ['email', 'password', 'googleId', 'appleId', 'authProvider'];
    const updates = {};
    Object.keys(req.body).forEach((key) => {
        if (!disallowed.includes(key)) {
            updates[key] = req.body[key];
        }
    });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password -__v');
    res.json(user);
});

// @desc    Upload avatar image
// @route   POST /api/profile/avatar
// @access  Private
const uploadAvatar = [
    upload.single('avatar'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: `/uploads/${req.file.filename}` },
            { new: true }
        ).select('-password -__v');
        res.json(user);
    })
];

// @desc    Upload multiple photos
// @route   POST /api/profile/photos
// @access  Private
const uploadPhotos = [
    upload.array('photos', 10),
    asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No photos uploaded' });
        }
        const photoUrls = req.files.map((f) => `/uploads/${f.filename}`);
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { photos: { $each: photoUrls } } },
            { new: true }
        ).select('-password -__v');
        res.json(user);
    })
];

// @desc    Upload multiple videos
// @route   POST /api/profile/videos
// @access  Private
const uploadVideos = [
    upload.array('videos', 5),
    asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No videos uploaded' });
        }
        const videoUrls = req.files.map((f) => `/uploads/${f.filename}`);
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { videos: { $each: videoUrls } } },
            { new: true }
        ).select('-password -__v');
        res.json(user);
    })
];

module.exports = {
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadPhotos,
    uploadVideos,
};

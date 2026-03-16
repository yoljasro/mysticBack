const User = require('../models/User');

// Update user profile for a specific onboarding step or general update
exports.updateProfile = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'name', 'nickname', 'gender', 'location', 'searchRadius',
            'placeOfBirth', 'timeOfBirth', 'lookingFor', 'lookingForGoal', 'interests',
            'photos', 'bio', 'personalityType', 'onboardingStep',
            'onboardingCompleted', 'notificationsEnabled', 'ageRange',
            'dateOfBirth', 'hideProfile', 'jungType', 'locationEnabled', 'timezone',
            'searchSettings'
        ];

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        updates.forEach((update) => {
            if (update === 'location' && req.body.location.latitude && req.body.location.longitude) {
                req.user.location = {
                    ...req.body.location,
                    type: 'Point',
                    coordinates: [req.body.location.longitude, req.body.location.latitude]
                };
            } else {
                req.user[update] = req.body[update];
            }
        });

        // 6 photos/videos validation if onboarding is being completed
        if (req.body.onboardingCompleted === true || req.body.onboardingStep === 9) {
            const mediaCount = (req.user.photos?.length || 0) + (req.user.videos?.length || 0);
            if (mediaCount < 6) {
                return res.status(400).send({ error: 'Please upload at least 6 photos or videos to complete onboarding.' });
            }
        }

        await req.user.save();

        res.status(200).send({
            message: 'Profile updated successfully',
            user: req.user
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Upload multiple photos/videos for the user gallery
exports.uploadMedia = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ error: 'Please upload at least one file.' });
        }

        const newPhotos = [];
        const newVideos = [];

        req.files.forEach(file => {
            const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            if (file.mimetype.startsWith('image/')) {
                newPhotos.push(url);
            } else if (file.mimetype.startsWith('video/')) {
                newVideos.push(url);
            }
        });

        // Add new media to existing ones, or replace?
        if (req.body.replace === 'true') {
            if (newPhotos.length > 0) req.user.photos = newPhotos;
            if (newVideos.length > 0) req.user.videos = newVideos;
        } else {
            req.user.photos = req.user.photos.concat(newPhotos);
            req.user.videos = req.user.videos.concat(newVideos);
        }

        await req.user.save();

        res.status(200).send({
            message: 'Media uploaded successfully',
            photos: req.user.photos,
            videos: req.user.videos
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get current onboarding progress
exports.getOnboardingStatus = async (req, res) => {
    res.status(200).send({
        onboardingStep: req.user.onboardingStep,
        onboardingCompleted: req.user.onboardingCompleted
    });
};

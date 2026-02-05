const User = require('../models/User');

// Update user profile for a specific onboarding step or general update
exports.updateProfile = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'name', 'nickname', 'gender', 'location', 'searchRadius',
            'placeOfBirth', 'timeOfBirth', 'lookingFor', 'interests',
            'photos', 'bio', 'personalityType', 'onboardingStep',
            'onboardingCompleted'
        ];

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.status(200).send({
            message: 'Profile updated successfully',
            user: req.user
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Upload multiple photos for the user gallery
exports.uploadPhotos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ error: 'Please upload at least one image.' });
        }

        const photoUrls = req.files.map(file => {
            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        });

        // Add new photos to existing ones, or replace? 
        // Based on Figma, it looks like a gallery. Let's append or replace based on request.
        if (req.body.replace === 'true') {
            req.user.photos = photoUrls;
        } else {
            req.user.photos = req.user.photos.concat(photoUrls);
        }

        await req.user.save();

        res.status(200).send({
            message: 'Photos uploaded successfully',
            photos: req.user.photos
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

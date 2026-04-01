const User = require('../models/User');
const { getZodiacSign } = require('../utils/astrology');

// ─── Jung temperament scoring helper ────────────────────────────────────────
const TEMPERAMENT_LABELS = {
    A: 'Холерик',
    B: 'Сангвиник',
    C: 'Флегматик',
    D: 'Меланхолик',
};

function calculateTemperament(userAnswers) {
    const scores = { A: 0, B: 0, C: 0, D: 0 };
    userAnswers.forEach(ans => {
        const key = String(ans).toUpperCase();
        if (scores[key] !== undefined) scores[key]++;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];

    return {
        type: dominant,
        label: TEMPERAMENT_LABELS[dominant],
        scores: {
            choleric: scores.A,
            sanguine: scores.B,
            phlegmatic: scores.C,
            melancholic: scores.D,
        },
    };
}

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
            } else if ((update === 'photos' || update === 'videos') && Array.isArray(req.body[update])) {
                req.user[update] = req.body[update].map(item => {
                    return typeof item === 'string' ? { url: item } : item;
                });
            } else {
                req.user[update] = req.body[update];
            }
        });

        // Auto-calculate zodiacSign when dateOfBirth is provided
        if (req.body.dateOfBirth) {
            req.user.zodiacSign = getZodiacSign(new Date(req.body.dateOfBirth));
        }


        // At least 1 photo/video validation if onboarding is being completed
        if (req.body.onboardingCompleted === true || req.body.onboardingStep === 9) {
            const mediaCount = (req.user.photos?.length || 0) + (req.user.videos?.length || 0);
            if (mediaCount < 1) {
                return res.status(400).send({ error: 'Пожалуйста, загрузите хотя бы одно фото или видео для завершения онбординга.' });
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
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            if (file.mimetype.startsWith('image/')) {
                newPhotos.push({ url: fileUrl });
            } else if (file.mimetype.startsWith('video/')) {
                newVideos.push({ url: fileUrl });
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

// POST /api/onboarding/jung-test
// Body: { answers: ['A','B','C', ...] }  — 20 answers from the Jung personality test
exports.submitJungTest = async (req, res) => {
    try {
        const { answers } = req.body;

        if (!Array.isArray(answers) || answers.length !== 20) {
            return res.status(400).json({
                error: 'answers massivi kerak va u 20 ta javobdan iborat bo\'lishi kerak.'
            });
        }

        const validOptions = ['A', 'B', 'C', 'D'];
        const allValid = answers.every(a => validOptions.includes(String(a).toUpperCase()));
        if (!allValid) {
            return res.status(400).json({
                error: 'Har bir javob faqat A, B, C yoki D bo\'lishi kerak.'
            });
        }

        const result = calculateTemperament(answers);

        // Persist on the user document
        req.user.jungType = result.type;          // e.g. "A"
        req.user.personalityType = result.label;  // e.g. "Холерик"
        await req.user.save();

        return res.status(200).json({
            message: 'Jung testi muvaffaqiyatli saqlandi.',
            jungType: result.type,
            label: result.label,
            scores: result.scores,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

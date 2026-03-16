const User = require('../models/User');
const Interaction = require('../models/Interaction');
const Chat = require('../models/Chat');
const asyncHandler = require('express-async-handler');

// Helper to calculate distance in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
};

// Helper function to calculate compatibility percentage for different categories
const calculateCompatibility = (user1, user2) => {
    const calculateScore = (baseWeight, interestWeight, lookingForWeight, jungWeight) => {
        let score = baseWeight;

        // 1. Interests overlap (max interestWeight)
        if (user1.interests && user2.interests) {
            const commonInterests = user1.interests.filter(interest =>
                user2.interests.includes(interest)
            );
            score += Math.min(commonInterests.length * 5, interestWeight);
        }

        // 2. Looking For overlap (max lookingForWeight)
        if (user1.lookingFor && user2.lookingFor) {
            const commonLookingFor = user1.lookingFor.filter(item =>
                user2.lookingFor.includes(item)
            );
            if (commonLookingFor.length > 0) score += lookingForWeight;
        }

        // 4. Random variance (±5%)
        const variance = Math.floor(Math.random() * 11) - 5;
        score += variance;

        return Math.min(Math.max(score, 10), 99);
    };

    const getSummary = (score, category) => {
        if (score >= 80) return `У вас отличная совместимость в ${category}! Вы идеально дополняете друг друга.`;
        if (score >= 50) return `У вас хорошая база для ${category}, но есть над чем работать.`;
        return `Ваши взгляды на ${category} могут не совпадать, но это повод для диалога.`;
    };

    const overallScore = calculateScore(20, 30, 20, 20);
    const loveScore = calculateScore(15, 25, 30, 25);
    const friendshipScore = calculateScore(25, 40, 10, 20);
    const workScore = calculateScore(20, 20, 10, 40);

    return {
        overall: overallScore,
        categories: {
            love: { score: loveScore, description: getSummary(loveScore, "любви") },
            friendship: { score: friendshipScore, description: getSummary(friendshipScore, "дружбе") },
            work: { score: workScore, description: getSummary(workScore, "работе") }
        }
    };
};

// @desc    Get user feed (potential matches)
// @route   GET /api/matches/feed
// @access  Private
const getFeed = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);

    // Find users we've already interacted with
    const interactions = await Interaction.find({ requester: currentUserId });
    const interactedUserIds = interactions.map(i => i.recipient.toString());

    interactedUserIds.push(currentUserId.toString());

    // 5. Query filters from request or user settings
    const minAge = req.query.minAge || currentUser.searchSettings?.minAge;
    const maxAge = req.query.maxAge || currentUser.searchSettings?.maxAge;
    const genderPreference = req.query.genderPreference;
    const radius = req.query.radius || currentUser.searchSettings?.radius;
    const zodiacSigns = req.query.zodiacSigns;
    
    const query = {
        _id: { $nin: interactedUserIds },
        onboardingCompleted: true,
        hideProfile: false
    };

    if (minAge || maxAge) {
        // Simple age calc for filter (dateOfBirth range)
        const today = new Date();
        if (minAge) {
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - parseInt(minAge));
            query.dateOfBirth = { ...query.dateOfBirth, $lte: minDate };
        }
        if (maxAge) {
            const maxDate = new Date();
            maxDate.setFullYear(today.getFullYear() - parseInt(maxAge));
            query.dateOfBirth = { ...query.dateOfBirth, $gte: maxDate };
        }
    }

    if (genderPreference && genderPreference !== 'all') {
        query.gender = genderPreference;
    }

    if (zodiacSigns) {
        const signs = Array.isArray(zodiacSigns) ? zodiacSigns : [zodiacSigns];
        query.zodiacSign = { $in: signs };
    }

    // Geospatial search
    if (radius && currentUser.location && currentUser.location.coordinates) {
        query["location.coordinates"] = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: currentUser.location.coordinates
                },
                $maxDistance: parseInt(radius) * 1000 // Convert km to meters
            }
        };
    }

    // Fetch potential matches
    const feedUsers = await User.find(query).select('name avatar bio photos ageRange gender nickname location interests lookingFor jungType dateOfBirth zodiacSign');

    // Add compatibility score and distance to each user
    const feedWithScores = feedUsers.map(user => {
        const userObj = user.toObject();
        const compatibility = calculateCompatibility(currentUser, user);
        userObj.compatibility = compatibility;
        userObj.compatibilityScore = compatibility.overall;
        
        // Calculate distance if coordinates exist
        if (currentUser.location?.coordinates && user.location?.coordinates) {
            const [lon1, lat1] = currentUser.location.coordinates;
            const [lon2, lat2] = user.location.coordinates;
            // Native distance calc or simplified
            userObj.distance = calculateDistance(lat1, lon1, lat2, lon2);
        }

        return userObj;
    });

    res.json(feedWithScores);
});

// @desc    Get quick matches (sorted by compatibility)
// @route   GET /api/matches/quick
// @access  Private
const getQuickMatches = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);

    const interactions = await Interaction.find({ requester: currentUserId });
    const interactedUserIds = interactions.map(i => i.recipient.toString());
    interactedUserIds.push(currentUserId.toString());

    const potentialMatches = await User.find({
        _id: { $nin: interactedUserIds },
        onboardingCompleted: true,
        hideProfile: false
    }).select('name avatar bio photos ageRange gender nickname location interests lookingFor jungType dateOfBirth');

    const matchesWithScores = potentialMatches.map(user => {
        const userObj = user.toObject();
        const compatibility = calculateCompatibility(currentUser, user);
        userObj.compatibility = compatibility;
        userObj.compatibilityScore = compatibility.overall;
        return userObj;
    });

    // Sort by compatibility score descending
    matchesWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(matchesWithScores);
});

// @desc    Like or pass a user
// @route   POST /api/matches/action
// @access  Private
const swipeAction = asyncHandler(async (req, res) => {
    const requesterId = req.user.id;
    const { recipientId, action } = req.body;

    if (!recipientId || !['like', 'pass'].includes(action)) {
        return res.status(400).json({ message: 'Valid recipientId and action (like/pass) are required' });
    }

    if (requesterId.toString() === recipientId.toString()) {
        return res.status(400).json({ message: 'You cannot swipe on yourself' });
    }

    // Check if interaction already exists to prevent duplicates
    const existingInteraction = await Interaction.findOne({ requester: requesterId, recipient: recipientId });
    if (existingInteraction) {
        return res.status(400).json({ message: 'You have already interacted with this user' });
    }

    // Check if the recipient already liked the requester
    const recipientInteraction = await Interaction.findOne({
        requester: recipientId,
        recipient: requesterId,
        action: 'like'
    });

    let isMatch = false;
    let chatRoom = null;
    let compatibilityScore = null;

    if (action === 'like' && recipientInteraction) {
        // It's a match!
        isMatch = true;

        // Fetch users to calculate compatibility
        const requester = await User.findById(requesterId);
        const recipient = await User.findById(recipientId);
        compatibilityScore = calculateCompatibility(requester, recipient);

        // Update both interactions to reflect the match and score
        recipientInteraction.isMatch = true;
        recipientInteraction.compatibilityScore = compatibilityScore;
        await recipientInteraction.save();

        // Emit socket event to the person who liked first
        const io = req.app.get("io");
        if (io) {
            io.to(recipientId.toString()).emit("match received", {
                user: {
                    _id: requester._id,
                    name: requester.name,
                    avatar: requester.avatar,
                    nickname: requester.nickname
                },
                compatibilityScore: compatibilityScore
            });
        }

        // Automatically create a one-on-one chat room
        chatRoom = await Chat.findOne({
            isGroupChat: false,
            $and: [
                { participants: { $elemMatch: { $eq: requesterId } } },
                { participants: { $elemMatch: { $eq: recipientId } } }
            ]
        });

        if (!chatRoom) {
            chatRoom = await Chat.create({
                chatName: 'Match Chat',
                isGroupChat: false,
                participants: [requesterId, recipientId]
            });
            chatRoom = await Chat.findOne({ _id: chatRoom._id }).populate("participants", "-password");
        }
    }

    const newInteraction = await Interaction.create({
        requester: requesterId,
        recipient: recipientId,
        action: action,
        isMatch: isMatch,
        compatibilityScore: compatibilityScore || 0
    });

    res.status(201).json({
        message: isMatch ? 'It is a match!' : 'Swiped successfully',
        isMatch: isMatch,
        compatibilityScore: compatibilityScore,
        chat: chatRoom ? chatRoom : null
    });
});

// @desc    Get all users the current user is matched with
// @route   GET /api/matches
// @access  Private
const getMatches = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;

    // Find all interaction where it's a match and current user is the requester or recipient
    const matches = await Interaction.find({
        $or: [
            { requester: currentUserId, isMatch: true },
            { recipient: currentUserId, isMatch: true } // Usually if one is set to true, the reciprocal one is also true
        ]
    })
        .populate('requester', 'name avatar nickname ageRange')
        .populate('recipient', 'name avatar nickname ageRange');

    // Extract the profile of the matched user (not the current user)
    const matchedProfiles = matches.map(match => {
        let profile;
        if (match.requester._id.toString() === currentUserId.toString()) {
            profile = match.recipient.toObject();
        } else {
            profile = match.requester.toObject();
        }
        profile.compatibilityScore = match.compatibilityScore;
        return profile;
    });

    // Remove duplicates if the query happens to fetch reciprocal pairs 
    const uniqueMatchIds = new Set();
    const uniqueMatches = [];
    matchedProfiles.forEach(profile => {
        if (!uniqueMatchIds.has(profile._id.toString())) {
            uniqueMatchIds.add(profile._id.toString());
            uniqueMatches.push(profile);
        }
    });

    res.json(uniqueMatches);
});

// @desc    Get all users who liked the current user but no match yet
// @route   GET /api/matches/likes-received
// @access  Private
const getLikesReceived = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;

    // Find all users the current user has already interacted with
    const myInteractions = await Interaction.find({ requester: currentUserId });
    const interactedUserIds = myInteractions.map(i => i.recipient.toString());

    // Find interactions where current user is the recipient, action is 'like', it's NOT a match yet,
    // and the current user has NOT interacted back with the requester
    const interactions = await Interaction.find({
        recipient: currentUserId,
        action: 'like',
        isMatch: false,
        requester: { $nin: interactedUserIds }
    }).populate('requester', 'name avatar nickname ageRange dateOfBirth gender bio photos');

    const usersWhoLiked = interactions.map(i => i.requester);

    res.json(usersWhoLiked);
});

module.exports = {
    getFeed,
    getQuickMatches,
    getLikesReceived,
    swipeAction,
    getMatches
};

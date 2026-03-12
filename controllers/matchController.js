const User = require('../models/User');
const Interaction = require('../models/Interaction');
const Chat = require('../models/Chat');
const asyncHandler = require('express-async-handler');

// Helper function to calculate compatibility percentage
const calculateCompatibility = (user1, user2) => {
    let score = 20; // Base compatibility

    // 1. Interests overlap (max 40%)
    if (user1.interests && user2.interests) {
        const commonInterests = user1.interests.filter(interest =>
            user2.interests.includes(interest)
        );
        score += Math.min(commonInterests.length * 10, 40);
    }

    // 2. Looking For overlap (20%)
    if (user1.lookingFor && user2.lookingFor) {
        const commonLookingFor = user1.lookingFor.filter(item =>
            user2.lookingFor.includes(item)
        );
        if (commonLookingFor.length > 0) score += 20;
    }

    // 3. Jung Type / Personality (20%)
    if (user1.jungType && user2.jungType) {
        // Simplified: if both have a type, they get a bonus for the feature's sake
        score += 20;
    }

    // 4. Random variance for "mystic" feel (±5%)
    const variance = Math.floor(Math.random() * 11) - 5;
    score += variance;

    return Math.min(Math.max(score, 10), 99); // Keep between 10% and 99%
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

    // Fetch potential matches
    const feedUsers = await User.find({
        _id: { $nin: interactedUserIds },
        onboardingCompleted: true,
        hideProfile: false
    }).select('name avatar bio photos ageRange gender nickname location interests lookingFor jungType dateOfBirth');

    // Add compatibility score to each user
    const feedWithScores = feedUsers.map(user => {
        const userObj = user.toObject();
        userObj.compatibilityScore = calculateCompatibility(currentUser, user);
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
        userObj.compatibilityScore = calculateCompatibility(currentUser, user);
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

    // Find interactions where current user is the recipient, action is 'like', and it's NOT a match yet
    const interactions = await Interaction.find({
        recipient: currentUserId,
        action: 'like',
        isMatch: false
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

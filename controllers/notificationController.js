const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

// @desc    Get user notifications (Archive)
// @route   GET /api/profile/archive
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Mark one or all notifications as read
// @route   PUT /api/profile/archive/read
// @access  Private
const markRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.body;

    if (notificationId) {
        await Notification.findOneAndUpdate(
            { _id: notificationId, user: req.user.id },
            { isRead: true }
        );
    } else {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );
    }

    res.json({ message: 'Success' });
});

module.exports = {
    getNotifications,
    markRead
};

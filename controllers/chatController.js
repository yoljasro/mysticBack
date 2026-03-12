const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

// Access 1-on-1 chat or create if doesn't exist
exports.accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send({ error: "UserId param not sent with request" });
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { participants: { $elemMatch: { $eq: req.user._id } } },
            { participants: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("participants", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name avatar email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            participants: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "participants",
                "-password"
            );

            // Emit socket event for new chat
            const io = req.app.get("io");
            if (io) {
                FullChat.participants.forEach(user => {
                    if (user._id.toString() !== req.user._id.toString()) {
                        io.to(user._id.toString()).emit("new chat", FullChat);
                    }
                });
            }

            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
};

// Fetch all chats for a user
exports.fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const results = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name avatar email",
        });

        // Calculate unreadCount for each chat
        const chatsWithUnreadCount = await Promise.all(results.map(async (chat) => {
            const unreadCount = await Message.countDocuments({
                chat: chat._id,
                sender: { $ne: req.user._id },
                readBy: { $ne: req.user._id }
            });
            return { ...chat._doc, unreadCount };
        }));

        res.status(200).send(chatsWithUnreadCount);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Create Group Chat
exports.createGroupChat = async (req, res) => {
    if (!req.body.participants || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var participants = JSON.parse(req.body.participants);

    if (participants.length < 2) {
        return res.status(400).send("More than 2 participants are required to form a group chat");
    }

    participants.push(req.user);

    let groupImage = "";
    if (req.file) {
        groupImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            participants: participants,
            isGroupChat: true,
            groupAdmin: req.user,
            groupImage: groupImage,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        // Emit socket event for new group chat
        const io = req.app.get("io");
        if (io) {
            fullGroupChat.participants.forEach(user => {
                if (user._id.toString() !== req.user._id.toString()) {
                    io.to(user._id.toString()).emit("new chat", fullGroupChat);
                }
            });
        }

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Rename Group
exports.renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName: chatName },
        { new: true }
    )
        .populate("participants", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404).send({ error: "Chat Not Found" });
    } else {
        res.json(updatedChat);
    }
};

// Add to Group
exports.addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { participants: userId } },
        { new: true }
    )
        .populate("participants", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404).send({ error: "Chat Not Found" });
    } else {
        res.json(added);
    }
};

// Remove from Group
exports.removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { participants: userId } },
        { new: true }
    )
        .populate("participants", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404).send({ error: "Chat Not Found" });
    } else {
        res.json(removed);
    }
};

// Get all messages for a chat
exports.allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name avatar email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Send a new message
exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if ((!content && (!req.files || req.files.length === 0)) || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    const attachments = [];
    if (req.files) {
        req.files.forEach(file => {
            const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            attachments.push(url);
        });
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        attachments: attachments,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.participants",
            select: "name avatar email deviceToken",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        const io = req.app.get("io");
        if (io) {
            message.chat.participants.forEach((user) => {
                if (user._id.toString() !== message.sender._id.toString()) {
                    io.in(user._id.toString()).emit("message received", message);
                }
            });
        }

        // Push Notification logic
        try {
            const notificationService = require('../services/notificationService');
            const recipients = message.chat.participants.filter(
                (p) => p._id.toString() !== message.sender._id.toString() && p.deviceToken
            );

            if (recipients.length > 0) {
                const tokens = recipients.map((r) => r.deviceToken);
                await notificationService.sendPushNotification(tokens, {
                    title: message.sender.name,
                    body: message.content || "Sent an attachment",
                    data: { chatId: message.chat._id.toString() }
                });
            }
        } catch (pushError) {
            console.error("Push notification error:", pushError.message);
        }

        res.json(message);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Send a voice message
exports.sendVoiceMessage = async (req, res) => {
    const { chatId } = req.body;

    if (!req.file || !chatId) {
        return res.status(400).send({ error: "Audio file and chatId are required" });
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    var newMessage = {
        sender: req.user._id,
        content: "Voice message",
        chat: chatId,
        attachments: [url],
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.participants",
            select: "name avatar email deviceToken",
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        const io = req.app.get("io");
        if (io) {
            message.chat.participants.forEach((user) => {
                if (user._id.toString() !== message.sender._id.toString()) {
                    io.in(user._id.toString()).emit("message received", message);
                }
            });
        }

        // Push Notification logic
        try {
            const notificationService = require('../services/notificationService');
            const recipients = message.chat.participants.filter(
                (p) => p._id.toString() !== message.sender._id.toString() && p.deviceToken
            );

            if (recipients.length > 0) {
                const tokens = recipients.map((r) => r.deviceToken);
                await notificationService.sendPushNotification(tokens, {
                    title: message.sender.name,
                    body: "🎤 Voice message",
                    data: { chatId: message.chat._id.toString() }
                });
            }
        } catch (pushError) {
            console.error("Push notification error:", pushError.message);
        }

        res.json(message);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Contact Management
exports.addContact = async (req, res) => {
    try {
        const { contactId } = req.body;
        if (!contactId) return res.status(400).send({ error: "ContactId is required" });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { contacts: contactId } },
            { new: true }
        ).populate("contacts", "name email avatar phone");

        res.status(200).json(user.contacts);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("contacts", "name email avatar phone");
        res.status(200).json(user.contacts);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Delete Chat
exports.deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);

        if (!chat) return res.status(404).send({ error: "Chat not found" });

        // Check if user is participant
        if (!chat.participants.includes(req.user._id)) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        await Chat.findByIdAndDelete(chatId);
        // Also delete all related messages? (Optional, but usually preferred)
        await Message.deleteMany({ chat: chatId });

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Clear Chat Messages
exports.clearMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        await Message.deleteMany({ chat: chatId });
        res.status(200).json({ message: "Messages cleared" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
// Mark messages in a chat as read
exports.markAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;

        await Message.updateMany(
            { chat: chatId, readBy: { $ne: req.user._id } },
            { $addToSet: { readBy: req.user._id } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Update Group Image
exports.updateGroupImage = async (req, res) => {
    const { chatId } = req.body;

    if (!req.file || !chatId) {
        return res.status(400).send({ error: "Image file and chatId are required" });
    }

    const groupImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { groupImage: groupImage },
            { new: true }
        )
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(404).send({ error: "Chat Not Found" });
        }

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

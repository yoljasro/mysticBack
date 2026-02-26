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
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
};

// Fetch all chats for a user
exports.fetchChats = async (req, res) => {
    try {
        Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name avatar email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Create Group Chat
exports.createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

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
        .populate("users", "-password")
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
            select: "name avatar email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

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

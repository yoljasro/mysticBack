const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Chat routes
router.post('/', auth, chatController.accessChat);
router.get('/', auth, chatController.fetchChats);
router.post('/group', auth, upload.single('groupImage'), chatController.createGroupChat);
router.put('/rename', auth, chatController.renameGroup);
router.put('/groupImage', auth, upload.single('groupImage'), chatController.updateGroupImage);
router.put('/groupremove', auth, chatController.removeFromGroup);
router.put('/groupadd', auth, chatController.addToGroup);
router.delete('/:chatId', auth, chatController.deleteChat);
router.put('/markAsRead/:chatId', auth, chatController.markAsRead);
router.delete('/messages/clear/:chatId', auth, chatController.clearMessages);

// Block/Mute routes
router.put('/block', auth, chatController.blockUser);
router.put('/unblock', auth, chatController.unblockUser);
router.put('/mute/:chatId', auth, chatController.muteChat);
router.put('/unmute/:chatId', auth, chatController.unmuteChat);
// Message routes
router.get('/messages/:chatId', auth, chatController.allMessages);
router.post('/messages', auth, upload.array('attachments', 10), chatController.sendMessage);
router.post('/messages/voice', auth, upload.single('audio'), chatController.sendVoiceMessage);

// Contact routes
router.post('/contacts/add', auth, chatController.addContact);
router.get('/contacts', auth, chatController.getContacts);

module.exports = router;

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Chat routes
router.post('/', auth, chatController.accessChat);
router.get('/', auth, chatController.fetchChats);
router.post('/group', auth, chatController.createGroupChat);
router.put('/rename', auth, chatController.renameGroup);
router.put('/groupremove', auth, chatController.removeFromGroup);
router.put('/groupadd', auth, chatController.addToGroup);
router.delete('/:chatId', auth, chatController.deleteChat);
router.delete('/messages/clear/:chatId', auth, chatController.clearMessages);

const upload = require('../middleware/upload');

// Message routes
router.get('/messages/:chatId', auth, chatController.allMessages);
router.post('/messages', auth, upload.array('attachments', 10), chatController.sendMessage);

// Contact routes
router.post('/contacts/add', auth, chatController.addContact);
router.get('/contacts', auth, chatController.getContacts);

module.exports = router;

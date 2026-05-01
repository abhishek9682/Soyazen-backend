const express = require('express');
const { sendMessage, getConversation, getAllConversations, getMyConversation, getUnreadCount } = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/my', protect, getMyConversation);
router.get('/conversations', protect, admin, getAllConversations);
router.get('/unread-count', protect, admin, getUnreadCount);
router.get('/:conversationId', protect, getConversation);

module.exports = router;

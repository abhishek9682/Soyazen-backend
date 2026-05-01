const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message (customer or admin)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { message, conversationId, messageType, orderId } = req.body;
        const senderRole = req.user.isAdmin ? 'admin' : 'customer';

        const newMsg = await Message.create({
            sender: req.user._id,
            senderName: req.user.name,
            senderRole,
            message,
            conversationId: conversationId || req.user._id.toString(),
            messageType: messageType || 'text',
            orderId: orderId || undefined
        });

        res.status(201).json(newMsg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversation messages for a user
// @route   GET /api/messages/:conversationId
// @access  Private
const getConversation = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId })
            .sort({ createdAt: 1 })
            .limit(100);

        // Mark messages as read if admin is viewing
        if (req.user.isAdmin) {
            await Message.updateMany(
                { conversationId: req.params.conversationId, senderRole: 'customer', isRead: false },
                { isRead: true }
            );
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all conversations (Admin only) - list of unique conversations
// @route   GET /api/messages/conversations
// @access  Private/Admin
const getAllConversations = async (req, res) => {
    try {
        // Aggregate to get one message per conversation with latest message
        const conversations = await Message.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$message' },
                    lastMessageAt: { $first: '$createdAt' },
                    senderName: { $first: '$senderName' },
                    unreadCount: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ['$senderRole', 'customer'] }, { $eq: ['$isRead', false] }] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: { lastMessageAt: -1 }
            }
        ]);

        // Fetch user details for each conversation
        const conversationsWithUsers = await Promise.all(
            conversations.map(async (conv) => {
                const user = await User.findById(conv._id).select('name email phoneNumber');
                return { ...conv, user };
            })
        );

        res.json(conversationsWithUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my own conversation (customer)
// @route   GET /api/messages/my
// @access  Private
const getMyConversation = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.user._id.toString() })
            .sort({ createdAt: 1 });

        // Mark admin messages as read
        await Message.updateMany(
            { conversationId: req.user._id.toString(), senderRole: 'admin', isRead: false },
            { isRead: true }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unread message count for admin
// @route   GET /api/messages/unread-count
// @access  Private/Admin
const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({ senderRole: 'customer', isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendMessage, getConversation, getAllConversations, getMyConversation, getUnreadCount };

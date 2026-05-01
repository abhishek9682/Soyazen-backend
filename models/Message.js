const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    message: { type: String, required: true },
    conversationId: { type: String, required: true }, // userId for grouping conversations
    isRead: { type: Boolean, default: false },
    messageType: { type: String, enum: ['text', 'order_ref'], default: 'text' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);

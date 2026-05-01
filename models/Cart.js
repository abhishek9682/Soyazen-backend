const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true, default: 1 },
            image: { type: String }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String }, // For a secondary display name/catchphrase
    description: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: String }, // e.g., '500g', '1L'
    category: { type: String, required: true, enum: ['tofu', 'milk', 'drinks', 'snacks', 'organic'] },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    benefits: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

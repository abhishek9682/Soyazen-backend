const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    phoneNumber: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

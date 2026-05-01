const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    primaryColor: { type: String, default: '#4CAF50' },
    secondaryColor: { type: String, default: '#8BC34A' },
    accentColor: { type: String, default: '#F1F8E9' },
    logoUrl: { type: String },
    companyName: { type: String, default: 'SoyPure' },
    contactEmail: { type: String, default: 'info@soypure.com' },
    contactPhone: { type: String, default: '+919876543210' },
    whatsappNumber: { type: String, default: '919876543210' },
    aboutTitle: { type: String, default: 'Our Soy Story' },
    aboutDescription: { type: String, default: 'We are committed to providing the purest plant-based nutrition to our community.' },
    mission: { type: String, default: 'To revolutionize health through high-quality soy products.' },
    vision: { type: String, default: 'To become the global leader in sustainable plant-based nutrition.' },
    aboutImageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);

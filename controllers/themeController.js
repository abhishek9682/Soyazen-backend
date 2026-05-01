const Theme = require('../models/Theme');

// @desc    Get theme settings
// @route   GET /api/theme
// @access  Public
const getTheme = async (req, res) => {
    try {
        let theme = await Theme.findOne();
        if (!theme) {
            theme = await Theme.create({});
        }
        res.json(theme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update theme settings
// @route   PUT /api/theme
// @access  Private/Admin
const updateTheme = async (req, res) => {
    try {
        let theme = await Theme.findOne();

        if (theme) {
            theme.primaryColor = req.body.primaryColor || theme.primaryColor;
            theme.secondaryColor = req.body.secondaryColor || theme.secondaryColor;
            theme.accentColor = req.body.accentColor || theme.accentColor;
            theme.logoUrl = req.body.logoUrl || theme.logoUrl;
            theme.companyName = req.body.companyName || theme.companyName;
            theme.contactEmail = req.body.contactEmail || theme.contactEmail;
            theme.contactPhone = req.body.contactPhone || theme.contactPhone;
            theme.whatsappNumber = req.body.whatsappNumber || theme.whatsappNumber;
            theme.aboutTitle = req.body.aboutTitle || theme.aboutTitle;
            theme.aboutDescription = req.body.aboutDescription || theme.aboutDescription;
            theme.mission = req.body.mission || theme.mission;
            theme.vision = req.body.vision || theme.vision;
            theme.aboutImageUrl = req.body.aboutImageUrl || theme.aboutImageUrl;

            const updatedTheme = await theme.save();
            res.json(updatedTheme);
        } else {
            const newTheme = await Theme.create(req.body);
            res.status(201).json(newTheme);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTheme, updateTheme };

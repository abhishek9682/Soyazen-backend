const Favorite = require('../models/Favorite');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ user: req.user._id }).populate('products');
        if (favorite) {
            res.json(favorite);
        } else {
            res.json({ products: [] });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add/Remove product from favorites (Toggle)
// @route   POST /api/favorites
// @access  Private
const toggleFavorite = async (req, res) => {
    const { productId } = req.body;

    try {
        let favorite = await Favorite.findOne({ user: req.user._id });

        if (favorite) {
            const isFavorite = favorite.products.includes(productId);

            if (isFavorite) {
                favorite.products = favorite.products.filter((id) => id.toString() !== productId);
            } else {
                favorite.products.push(productId);
            }
            await favorite.save();
        } else {
            favorite = await Favorite.create({
                user: req.user._id,
                products: [productId]
            });
        }
        res.status(200).json(favorite);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getFavorites, toggleFavorite };

const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            res.json(cart);
        } else {
            res.json({ items: [] });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = async (req, res) => {
    const { product, name, price, qty, image } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            const existItem = cart.items.find((x) => x.product.toString() === product);

            if (existItem) {
                existItem.qty = qty;
            } else {
                cart.items.push({ product, name, price, qty, image });
            }
            await cart.save();
        } else {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product, name, price, qty, image }]
            });
        }
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeItemFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = cart.items.filter((x) => x.product.toString() !== req.params.id);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addItemToCart, removeItemFromCart };

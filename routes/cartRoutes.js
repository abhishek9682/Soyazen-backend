const express = require('express');
const { getCart, addItemToCart, removeItemFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getCart)
    .post(protect, addItemToCart);

router.route('/:id')
    .delete(protect, removeItemFromCart);

module.exports = router;

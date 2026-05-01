const express = require('express');
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getFavorites)
    .post(protect, toggleFavorite);

module.exports = router;

const express = require('express');
const { authUser, registerUser, updateUserProfile, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.route('/profile').put(protect, updateUserProfile);

// Admin routes
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;

const express = require('express');
const {
    addOrderItems,
    verifyPayment,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderStatus,
    deleteOrder,
    getAnalytics,
    getDashboardStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/analytics', protect, admin, getAnalytics);
router.get('/stats', protect, admin, getDashboardStats);
router.post('/verify', protect, verifyPayment);

router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, deleteOrder);

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

module.exports = router;

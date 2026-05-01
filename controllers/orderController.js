const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        if (paymentMethod === 'cod') {
            return res.status(201).json({ order: createdOrder });
        }

        // Create Razorpay Order
        const options = {
            amount: Math.round(totalPrice * 100),
            currency: "INR",
            receipt: `receipt_order_${createdOrder._id}`,
        };

        try {
            const razorpayOrder = await razorpay.orders.create(options);
            res.status(201).json({
                order: createdOrder,
                razorpayOrder
            });
        } catch (error) {
            res.status(201).json({ order: createdOrder, razorpayError: 'Razorpay order creation failed, please use COD' });
        }
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        const order = await Order.findById(orderId);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: razorpay_payment_id,
                status: 'paid',
                update_time: Date.now().toString(),
            };
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } else {
        res.status(400).json({ message: 'Invalid payment signature' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email phoneNumber');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email phoneNumber').sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = 'delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = status;
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        if (status === 'cancelled') {
            order.isPaid = false;
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Analytics (Sales and Profit)
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const orders = await Order.find({ isPaid: true });

        // Simple analytics: Daily revenue for the last 7 days
        const last7Days = [...Array(7).keys()].map(i => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const revenueData = last7Days.map(date => {
            const dailyOrders = orders.filter(o => o.paidAt && o.paidAt.toISOString().split('T')[0] === date);
            const revenue = dailyOrders.reduce((acc, o) => acc + o.totalPrice, 0);
            return { date, revenue, profit: revenue * 0.3 };
        });

        res.json(revenueData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const paidOrders = await Order.find({ isPaid: true });
        const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalPrice, 0);
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

        res.json({
            totalOrders,
            totalRevenue,
            pendingOrders,
            deliveredOrders,
            avgOrderValue: totalOrders > 0 ? totalRevenue / paidOrders.length : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};

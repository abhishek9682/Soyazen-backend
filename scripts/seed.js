const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Message = require('../models/Message');

dotenv.config();

const products = [
  {
    name: 'Organic Silk Tofu',
    title: 'Stone-Pressed Virgin Silk',
    description: 'Our signature silk tofu, stone-pressed in the traditional Himalayan style. Ultra-smooth, rich in protein, and crafted from 100% organic Non-GMO soy beans. Perfect for smoothies, desserts, and creamy soups.',
    price: 180,
    category: 'tofu',
    stock: 50,
    weight: '250g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800'],
    benefits: ['100% Organic', 'High Protein', 'No Preservatives', 'Non-GMO'],
    rating: 4.8,
    numReviews: 42
  },
  {
    name: 'Himalayan Smoked Paneer',
    title: 'Oak-Wood Smoked Savor',
    description: 'Tofu with a twist. Smoked over oak-wood for 12 hours to give it a rich, savory, and deep flavor profile. Perfect for steaks, grills, and gourmet sandwiches.',
    price: 240,
    category: 'tofu',
    stock: 30,
    weight: '200g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800'],
    benefits: ['Artisan Smoked', 'Firm Texture', 'Rich Flavor'],
    rating: 4.6,
    numReviews: 28
  },
  {
    name: 'Vanilla Bean Soy Milk',
    title: 'Velvety Plant Energy',
    description: 'Brewed with real Bourbon vanilla beans. Our soy milk is creamy, naturally sweet, and packed with essential amino acids. Zero chalky aftertaste. Great for coffee, cereal, and baking.',
    price: 90,
    category: 'milk',
    stock: 100,
    weight: '500ml',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800'],
    benefits: ['Real Vanilla', 'Calcium Enriched', 'Lactose Free'],
    rating: 4.9,
    numReviews: 87
  },
  {
    name: 'Roasted Soy Nuts',
    title: 'The Ultimate Protein Crunch',
    description: 'Lightly salted and slow-roasted soy nuts. A perfect keto-friendly snack that keeps you full and energized throughout the day. 15g of protein per serving.',
    price: 120,
    category: 'snacks',
    stock: 200,
    weight: '150g',
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1510443415848-18e00fb3039d?auto=format&fit=crop&q=80&w=800'],
    benefits: ['Keto Friendly', 'Oven Roasted', 'Zero Cholesterol'],
    rating: 4.3,
    numReviews: 34
  },
  {
    name: 'Matcha Infused Soy Drink',
    title: 'Centering Green Energy',
    description: 'Ceremonial grade Matcha blended with our signature soy milk. A refreshing drink designed for mental clarity and antioxidants. Rich, smooth, and energizing.',
    price: 150,
    category: 'drinks',
    stock: 60,
    weight: '250ml',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800'],
    benefits: ['Antioxidant Rich', 'Natural Caffeine', 'Detoxifying'],
    rating: 4.7,
    numReviews: 56
  },
  {
    name: 'Fermented Miso Tofu',
    title: 'Ancient Probiotic Wisdom',
    description: 'Traditional Japanese-style tofu fermented with authentic miso. Deeply umami, probiotic-rich, and excellent for gut health. Best served grilled or in broths.',
    price: 320,
    category: 'tofu',
    stock: 20,
    weight: '300g',
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800'],
    benefits: ['Probiotic Rich', 'Fermented', 'Gut Health'],
    rating: 4.5,
    numReviews: 19
  },
  {
    name: 'Chocolate Soy Protein Bar',
    title: 'Power-Packed Indulgence',
    description: 'Dark chocolate coated soy protein bar with 20g of plant protein. No artificial sweeteners, no compromise on taste. Your post-workout best friend.',
    price: 85,
    category: 'snacks',
    stock: 150,
    weight: '60g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800'],
    benefits: ['20g Protein', 'No Artificial Sweeteners', 'Post-Workout'],
    rating: 4.4,
    numReviews: 63
  },
  {
    name: 'Turmeric Soy Latte Mix',
    title: 'Golden Immunity Blend',
    description: 'Anti-inflammatory turmeric with organic soy powder and black pepper for enhanced absorption. A golden latte mix that supports immunity, reduces inflammation, and tastes divine.',
    price: 199,
    category: 'drinks',
    stock: 80,
    weight: '200g',
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=800'],
    benefits: ['Anti-Inflammatory', 'Immunity Boost', 'Ayurvedic'],
    rating: 4.6,
    numReviews: 41
  },
  {
    name: 'Organic Soy Granola',
    title: 'Morning Ritual Crunch',
    description: 'Slow-baked organic granola with toasted soy flakes, oats, and honey. A premium breakfast that delivers sustained energy and a delightful crunch every morning.',
    price: 275,
    category: 'organic',
    stock: 45,
    weight: '400g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=800'],
    benefits: ['Slow Baked', 'Sustained Energy', '100% Organic'],
    rating: 4.8,
    numReviews: 72
  },
  {
    name: 'Unsweetened Soy Milk',
    title: 'Pure & Clean Plant Protein',
    description: 'The purest form of soy milk - unsweetened, unflavored, and packed with natural soy goodness. 8g of protein per glass. Perfect for those monitoring their sugar intake.',
    price: 75,
    category: 'milk',
    stock: 120,
    weight: '1L',
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800'],
    benefits: ['No Added Sugar', '8g Protein', 'Diabetic Friendly'],
    rating: 4.2,
    numReviews: 95
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all data
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Message.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Soyazen Admin',
      email: 'admin@soyazen.com',
      password: adminPassword,
      isAdmin: true,
      phoneNumber: '+91 98765 43210',
      address: { street: '42 Green Valley Road', city: 'Mumbai', state: 'Maharashtra', zip: '400001', country: 'India' }
    });

    // Create sample customers
    const customerPassword = await bcrypt.hash('password123', 10);
    const customers = await User.insertMany([
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: customerPassword,
        phoneNumber: '+91 98001 11111',
        address: { street: '12 Park Avenue', city: 'Delhi', state: 'Delhi', zip: '110001', country: 'India' }
      },
      {
        name: 'Rahul Mehta',
        email: 'rahul@example.com',
        password: customerPassword,
        phoneNumber: '+91 98002 22222',
        address: { street: '55 MG Road', city: 'Bangalore', state: 'Karnataka', zip: '560001', country: 'India' }
      },
      {
        name: 'Anjali Verma',
        email: 'anjali@example.com',
        password: customerPassword,
        phoneNumber: '+91 98003 33333',
        address: { street: '7 Rose Garden', city: 'Pune', state: 'Maharashtra', zip: '411001', country: 'India' }
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        password: customerPassword,
        phoneNumber: '+91 98004 44444',
        address: { street: '22 Gandhi Nagar', city: 'Ahmedabad', state: 'Gujarat', zip: '380001', country: 'India' }
      },
      {
        name: 'Deepika Nair',
        email: 'deepika@example.com',
        password: customerPassword,
        phoneNumber: '+91 98005 55555',
        address: { street: '9 Lake View', city: 'Chennai', state: 'Tamil Nadu', zip: '600001', country: 'India' }
      }
    ]);
    console.log(`👥 Created ${customers.length + 1} users`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create orders
    const orderStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    const sampleOrders = [
      {
        user: customers[0]._id,
        orderItems: [
          { name: createdProducts[0].name, qty: 2, image: createdProducts[0].images[0], price: createdProducts[0].price, product: createdProducts[0]._id },
          { name: createdProducts[2].name, qty: 1, image: createdProducts[2].images[0], price: createdProducts[2].price, product: createdProducts[2]._id }
        ],
        shippingAddress: { address: '12 Park Avenue', city: 'Delhi', postalCode: '110001', country: 'India' },
        paymentMethod: 'razorpay',
        taxPrice: 81,
        shippingPrice: 50,
        totalPrice: 581,
        isPaid: true,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        orderStatus: 'delivered',
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: customers[1]._id,
        orderItems: [
          { name: createdProducts[4].name, qty: 3, image: createdProducts[4].images[0], price: createdProducts[4].price, product: createdProducts[4]._id }
        ],
        shippingAddress: { address: '55 MG Road', city: 'Bangalore', postalCode: '560001', country: 'India' },
        paymentMethod: 'cod',
        taxPrice: 54,
        shippingPrice: 50,
        totalPrice: 554,
        isPaid: false,
        orderStatus: 'pending'
      },
      {
        user: customers[2]._id,
        orderItems: [
          { name: createdProducts[1].name, qty: 1, image: createdProducts[1].images[0], price: createdProducts[1].price, product: createdProducts[1]._id },
          { name: createdProducts[6].name, qty: 2, image: createdProducts[6].images[0], price: createdProducts[6].price, product: createdProducts[6]._id },
          { name: createdProducts[3].name, qty: 1, image: createdProducts[3].images[0], price: createdProducts[3].price, product: createdProducts[3]._id }
        ],
        shippingAddress: { address: '7 Rose Garden', city: 'Pune', postalCode: '411001', country: 'India' },
        paymentMethod: 'razorpay',
        taxPrice: 108,
        shippingPrice: 50,
        totalPrice: 788,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        orderStatus: 'shipped'
      },
      {
        user: customers[3]._id,
        orderItems: [
          { name: createdProducts[8].name, qty: 2, image: createdProducts[8].images[0], price: createdProducts[8].price, product: createdProducts[8]._id }
        ],
        shippingAddress: { address: '22 Gandhi Nagar', city: 'Ahmedabad', postalCode: '380001', country: 'India' },
        paymentMethod: 'cod',
        taxPrice: 99,
        shippingPrice: 50,
        totalPrice: 699,
        isPaid: false,
        orderStatus: 'cancelled'
      },
      {
        user: customers[4]._id,
        orderItems: [
          { name: createdProducts[7].name, qty: 1, image: createdProducts[7].images[0], price: createdProducts[7].price, product: createdProducts[7]._id },
          { name: createdProducts[9].name, qty: 2, image: createdProducts[9].images[0], price: createdProducts[9].price, product: createdProducts[9]._id }
        ],
        shippingAddress: { address: '9 Lake View', city: 'Chennai', postalCode: '600001', country: 'India' },
        paymentMethod: 'razorpay',
        taxPrice: 108,
        shippingPrice: 50,
        totalPrice: 508,
        isPaid: true,
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        orderStatus: 'pending'
      },
      {
        user: customers[0]._id,
        orderItems: [
          { name: createdProducts[5].name, qty: 1, image: createdProducts[5].images[0], price: createdProducts[5].price, product: createdProducts[5]._id }
        ],
        shippingAddress: { address: '12 Park Avenue', city: 'Delhi', postalCode: '110001', country: 'India' },
        paymentMethod: 'razorpay',
        taxPrice: 58,
        shippingPrice: 50,
        totalPrice: 428,
        isPaid: true,
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        orderStatus: 'delivered',
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`🛒 Created ${sampleOrders.length} orders`);

    // Create sample chat messages
    const sampleMessages = [
      {
        sender: customers[0]._id,
        senderName: customers[0].name,
        senderRole: 'customer',
        message: 'Hi! I wanted to ask about my recent order. When will it be delivered?',
        conversationId: customers[0]._id.toString(),
        isRead: true
      },
      {
        sender: admin._id,
        senderName: admin.name,
        senderRole: 'admin',
        message: 'Hello Priya! Your order is currently being processed and will be dispatched within 24 hours. You will receive a tracking number via email.',
        conversationId: customers[0]._id.toString(),
        isRead: true
      },
      {
        sender: customers[0]._id,
        senderName: customers[0].name,
        senderRole: 'customer',
        message: 'Thank you! Also, do you have any offers on bulk orders?',
        conversationId: customers[0]._id.toString(),
        isRead: false
      },
      {
        sender: customers[1]._id,
        senderName: customers[1].name,
        senderRole: 'customer',
        message: 'Hello, I would like to know if the Organic Silk Tofu is gluten-free?',
        conversationId: customers[1]._id.toString(),
        isRead: false
      },
      {
        sender: customers[2]._id,
        senderName: customers[2].name,
        senderRole: 'customer',
        message: 'Can I customize my subscription to receive products every 2 weeks instead of monthly?',
        conversationId: customers[2]._id.toString(),
        isRead: false
      }
    ];

    await Message.insertMany(sampleMessages);
    console.log(`💬 Created ${sampleMessages.length} messages`);

    console.log('\n🚀 DATABASE SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Login: admin@soyazen.com');
    console.log('🔑 Admin Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Test Customer: priya@example.com');
    console.log('🔑 Test Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

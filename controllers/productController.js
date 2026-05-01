const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, title, description, price, weight, category, stock, images, benefits, isFeatured } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.weight = weight || product.weight;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            product.images = images || product.images;
            product.benefits = benefits || product.benefits;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, title, description, price, weight, category, stock, images, benefits, isFeatured } = req.body;

        const product = new Product({
            name,
            title,
            description,
            price,
            weight,
            category,
            stock,
            images,
            benefits,
            isFeatured,
            user: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

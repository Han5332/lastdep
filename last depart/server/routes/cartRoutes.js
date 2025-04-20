const express = require('express');
const router = express.Router();
const Cart = require('../models/cartmodel');
const Product = require('../models/product');

// ==============================
// PRODUCT ROUTES
// ==============================

// GET: Fetch ALL products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});

// GET: Fetch a SINGLE product by ID
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
});

// ==============================
// CART ROUTES
// ==============================

// POST: Add item to cart
router.post("/cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.modifiedOn = Date.now();
    await cart.save();

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET: Fetch cart by userId
router.get("/cart", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Format for frontend: return product object with quantity
    const formattedCart = {
      items: cart.items.map(item => ({
        product: item.productId,
        quantity: item.quantity
      }))
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST: Remove an item from cart
router.post("/cartremove", async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'Missing userId or productId' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    cart.modifiedOn = Date.now();
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;

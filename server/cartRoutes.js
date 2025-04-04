const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

// Add to Cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json({ message: "Product added", cart });
});

// Get Cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
  res.json(cart || { items: [] });
});

module.exports = router;

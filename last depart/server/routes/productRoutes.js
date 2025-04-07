const express = require('express');
const router = express.Router();
const Product = require('../models/product');  // Assuming Product model is in the models folder

// POST: Add new product
router.post("/add", async (req, res) => {
    const { name, price, description, stock, image } = req.body;
  
    try {
        // Create a new product using the provided details
        const newProduct = new Product({
            name,
            price,
            description,
            stock,
            image,  // Image URL or path can be saved here
        });
  
        // Save the new product to the database
        await newProduct.save();

        // Send back the newly created product as the response
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: "Failed to add product", error: err });
    }
});

// GET: Fetch a product by productId
router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
  }
});


module.exports = router;

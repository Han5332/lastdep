
const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model("Product", ProductSchema);
  
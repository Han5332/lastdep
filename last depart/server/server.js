const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://hanhe:ouzel5332@lastdeparture.plcbk1j.mongodb.net/?retryWrites=true&w=majority&appName=LASTDEPARTURE")
  .then(() => console.log("MongoDB Connected"))
  .catch((e) => console.log("MongoDB Connection Failed", e));


const express = require("express");
const path = require("path");
const cors = require("cors");
// require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Use CORS with correct frontend origin(s)
app.use(cors({
  origin: ["http://127.0.0.1:5000", "http://localhost:5000", "https://han5332.github.io/lastdep" , "loginpage.html", "signup.html", "product1.html"], // Ensure this matches your frontend
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// Serve the main login page
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "loginpage.html"));
});

// API route for user login
app.use(express.json()); // Middleware to parse JSON
app.use(express.static(path.join(__dirname, '../public')));

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// Import the cart routes
const cartRoutes = require('./routes/cartRoutes');
app.use('/api', cartRoutes);







const productRoutes = require('./routes/productRoutes');  
app.use('/api', productRoutes);  

// app.post('/api/products', async (req, res) => {
//   const { name, price, description, stock } = req.body;

//   try {
//     const newProduct = new Product({ name, price, description, stock });
//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding product', error });
//   }
// });



// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));

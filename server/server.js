const express = require("express");
const path = require("path");
const cors = require("cors");
const LogInCollection = require("./mongo"); // Ensure this file exists and is correct
// require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Use CORS with correct frontend origin(s)
app.use(cors({
  origin: ["http://127.0.0.1:5000", "http://localhost:5000" , "loginpage.html", "signup.html", "product1.html"], // Ensure this matches your frontend
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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    const user = await LogInCollection.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Proceed with generating a token or session here
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// API route to register new users
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await LogInCollection.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const newUser = new LogInCollection({ email, password });
    await newUser.save();
    
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/cart", async (req, res) => {

  const { productId, quantity } = req.body;
  const userId = req.user.id;

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

module.exports = router;







// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));

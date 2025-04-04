const express = require("express");
const path = require("path");
const cors = require("cors");
const LogInCollection = require("./mongo"); // Ensure this file exists and is correct

const app = express();
const port = process.env.PORT || 5000;

//Use CORS with correct frontend origin(s)
app.use(cors({
  origin: ["http://127.0.0.1:5000", "http://localhost:5000" , "loginpage.html", "signup.html"], // Ensure this matches your frontend
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Set up static files and views
const templatePath = path.join(__dirname, '../templates'); // Ensure correct spelling
const publicPath = path.join(__dirname, '../public'); // Ensure this path exists

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

//Serve the main login page
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "loginpage.html"));
});

//Serve the signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(publicPath, "signup.html"));
});





// ✅ Signup Route
app.post("/signup", async (req, res) => {  
    try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await LogInCollection.findOne({ email, password });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    await LogInCollection.create({ email, password });

    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body; // ✅ Extract email instead of name
  
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const user = await LogInCollection.findOne({ email }); // ✅ Find user by email
  
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      res.json({
        message: "Login successful",
        token: "sample-token", // Replace with real authentication
        userId: user._id
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// ✅ Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));

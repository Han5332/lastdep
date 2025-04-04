const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://hanhe:ouzel5332@lastdeparture.plcbk1j.mongodb.net/?retryWrites=true&w=majority&appName=LASTDEPARTURE")
  .then(() => console.log("MongoDB Connected"))
  .catch((e) => console.log("MongoDB Connection Failed", e));

const logInSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LogInCollection = mongoose.model("LogInCollection", logInSchema);

module.exports = LogInCollection;


// cart schema
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);

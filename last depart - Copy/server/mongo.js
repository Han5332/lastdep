const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://hanhe:ouzel5332@lastdeparture.plcbk1j.mongodb.net/?retryWrites=true&w=majority&appName=LASTDEPARTURE")
  .then(() => console.log("MongoDB Connected"))
  .catch((e) => console.log("MongoDB Connection Failed", e));

const logInSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
});

const LogInCollection = mongoose.model("LogInCollection", logInSchema);

module.exports = LogInCollection;

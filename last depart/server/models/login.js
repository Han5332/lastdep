const mongoose = require("mongoose");

const logInSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },

});

const LogInCollection = mongoose.model("LogInCollection", logInSchema);

module.exports = LogInCollection;

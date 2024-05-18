const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  position: String,
  about: String,
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema);

module.exports = EmployeeModel;

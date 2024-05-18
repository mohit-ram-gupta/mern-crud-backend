const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./model/Employee");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee");

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json({ success: true, user: user });
        } else {
          res.json({ success: false, message: "The password is incorrect" });
        }
      } else {
        res.json({ success: false, message: "No record existed" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    });
});

app.post("/register", (req, res) => {
  EmployeeModel.create(req.body)
    .then((employees) => res.json(employees))
    .catch((err) => res.json(err));
});

app.get("/display/:id", (req, res) => {
  const employeeId = req.params.id;
  EmployeeModel.findById(employeeId)
    .then((employee) => {
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    })
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

app.post("/update-profile/:id", (req, res) => {
  const userId = req.params.id;
  const userDataToUpdate = req.body;

  EmployeeModel.findByIdAndUpdate(userId, userDataToUpdate, { new: true })
    .then((updatedEmployee) => {
      if (!updatedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(updatedEmployee);
    })
    .catch((error) => {
      console.error("Error updating employee profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    });
});

app.delete("/delete-profile/:id", (req, res) => {
  const userId = req.params.id;
  EmployeeModel.findByIdAndDelete(userId)
    .then((deletedEmployee) => {
      if (!deletedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Error deleting profile:", error);
      res
        .status(500)
        .json({ error: "Failed to delete profile. Please try again later." });
    });
});

app.listen(3001, () => {
  console.log("server is running");
});

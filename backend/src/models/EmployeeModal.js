const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  colorName: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const addEmployee = mongoose.model("newEmployee", employeeSchema);
module.exports = addEmployee;

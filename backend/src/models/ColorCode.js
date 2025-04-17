const mongoose = require("mongoose");

const colorCodeSchema = new mongoose.Schema({
  colorName: {
    type: String,
    required: true,
  },
  hexCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const colorCodeType = mongoose.model("color", colorCodeSchema);
module.exports = colorCodeType;

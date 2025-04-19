const mongoose = require("mongoose");

const defectIdentifySchema = new mongoose.Schema({
  EmployeeName: {
    type: String,
    required: true,
  },
  defectName: {
    type: String,
    required: true,
  },
  defectCount: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const defectIdentifyType = mongoose.model(
  "defectIdentify",
  defectIdentifySchema
);
module.exports = defectIdentifyType;

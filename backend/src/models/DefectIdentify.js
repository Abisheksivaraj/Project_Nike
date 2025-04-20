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
    default: function () {
      // Get current UTC time
      const now = new Date();
      // Add 5 hours and 30 minutes to convert to IST
      return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    },
  },
});

const defectIdentifyType = mongoose.model(
  "defectIdentify",
  defectIdentifySchema
);
module.exports = defectIdentifyType;

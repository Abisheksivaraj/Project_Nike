const mongoose = require("mongoose");

const defectSchema = new mongoose.Schema({
  defectName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const defectType = mongoose.model("defect", defectSchema);
module.exports = defectType;

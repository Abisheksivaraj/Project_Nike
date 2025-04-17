const mongoose = require("mongoose");

const defectSchema = new mongoose.Schema({
  defectName: {
    type: String,
    required: true,
  },
});

const defectType = mongoose.model("defect", defectSchema);
module.exports = defectType;

const express = require("express");
const defectType = require("../models/DefectType");
const route = express.Router();

route.post("/add-Defect", async (req, res) => {
  try {
    const { defectName } = req.body;
    const defect = new defectType({ defectName });
    await defect.save();
    res.status(201).json({ message: "defect Type Added Successfully" });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

route.get("/get-Defect", async (req, res) => {
  try {
    const defect = await defectType.find();
    res.status(200).json(defect);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete defect type by ID
route.delete("/delete-Defect/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the defect by ID and delete it
    const deletedDefect = await defectType.findByIdAndDelete(id);

    // If no defect was found with that ID
    if (!deletedDefect) {
      return res.status(404).json({ message: "Defect type not found" });
    }

    // Return success message
    res.status(200).json({ message: "Defect type deleted successfully" });
  } catch (error) {
    console.error("Error deleting defect type:", error);

    // If the error is related to an invalid ID format
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid defect ID format" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = route;

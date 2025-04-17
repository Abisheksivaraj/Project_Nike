const express = require("express");
const colorCodeType = require("../models/ColorCode");

const route = express.Router();

route.post("/add-Color", async (req, res) => {
  try {
    const { colorName,hexCode } = req.body;
    const color = new colorCodeType({ colorName, hexCode });
    await color.save();
    res.status(201).json({ message: "color Code Addded Successfully" });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

route.get("/get-Color", async (req, res) => {
  try {
    const color = await colorCodeType.find();
    res.status(200).json(color);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this to your existing route.js file
route.delete("/delete-color/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedColor = await colorCodeType.findByIdAndDelete(id);
    
    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }
    
    res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = route
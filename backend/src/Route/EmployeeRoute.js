const express = require("express");
const addEmployee = require("../models/EmployeeModal");
const route = express.Router(); // Create router instance

// Create new employee
route.post("/addEmployee", async (req, res) => {
  try {
    const { firstName, lastName, colorCode, colorName, image } = req.body;

    if (!colorName) {
      return res.status(400).json({ message: "colorName is required" });
    }

    const newEmployee = new addEmployee({
      firstName,
      lastName,
      colorCode,
      colorName,
      image,
    });
    await newEmployee.save();
    res.json({ message: "Employee Added Successfully", data: newEmployee });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all employees
route.get("/getEmployee", async (req, res) => {
  try {
    const employees = await addEmployee.find();
    res.json({ data: employees });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get single employee by ID
route.get("/employee/:id", async (req, res) => {
  try {
    const employee = await addEmployee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ data: employee });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update employee
// Update employee
route.put("/updateEmployee/:id", async (req, res) => {
  try {
    const { firstName, lastName, colorCode, colorName, image } = req.body;
    const updatedEmployee = await addEmployee.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        colorCode,
        colorName,
        image,
      },
      { new: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee Updated Successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Delete employee
route.delete("/deleteEmployee/:id", async (req, res) => {
  try {
    const deletedEmployee = await addEmployee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee Deleted Successfully" });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = route; // Export router instance

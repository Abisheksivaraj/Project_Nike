import React, { useState, useEffect } from "react";
import { api } from "../../apiConfig";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [defectTypes, setDefectTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch defect types
  const fetchDefectTypes = async () => {
    try {
      const response = await api.get("/get-Defect");
      const defectData = response.data;
      setDefectTypes(defectData);
      return defectData;
    } catch (error) {
      console.error("Error fetching defect types:", error);
      return [];
    }
  };

  // Function to fetch employee data
  const fetchEmployees = async () => {
    try {
      const response = await api.get("/getEmployee");
      const employeeData = response.data.data;
      setEmployees(employeeData);
      return employeeData;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  };

  // Function to fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [defectData, employeeData] = await Promise.all([
        fetchDefectTypes(),
        fetchEmployees(),
      ]);

      // If data is already initialized, just update defect types and employees
      if (data.length > 0) {
        updateDashboardData(defectData, employeeData);
      } else {
        // Initialize dashboard data with fetched defect types and employees
        initializeDashboardData(defectData, employeeData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const refreshInterval = setInterval(() => {
      fetchAllData();
    }, 3000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Helper function to get color name from color code
  const getColorName = (colorCode) => {
    // Convert any hex, rgb or color code to a standard color name
    const colorMap = {
      "#DBEAFE": "Blue",
      "#FFEDD5": "Orange",
      "#FCE7F3": "Pink",
      "#DCFCE7": "Green",
      "#FEF3C7": "Yellow",
      "#F3E8FF": "Purple",
      "#FEE2E2": "Red",
      "#F3F4F6": "Gray",
      // Add lowercase versions for direct comparison
      blue: "Blue",
      orange: "Orange",
      pink: "Pink",
      green: "Green",
      yellow: "Yellow",
      purple: "Purple",
      red: "Red",
      gray: "Gray",
    };

    // Check if colorCode exactly matches a key (case-insensitive)
    const lowerCode = colorCode.toLowerCase();
    if (colorMap[lowerCode]) {
      return colorMap[lowerCode];
    }

    // Default to the original code if no match
    return colorCode;
  };

  const updateDashboardData = (defectData, employeeData) => {
    const newData = [...data];

    // Update existing data with new employees if needed
    const currentEmployeeIds = newData.map((person) => person.id);
    const newEmployees = employeeData.filter(
      (emp) => !currentEmployeeIds.includes(emp._id)
    );

    // Add new employees
    newEmployees.forEach((employee) => {
      newData.push({
        id: employee._id,
        colorCode: employee.colorName || "Default", // Use colorCode from employee model
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        fullName:
          `${employee.firstName || ""} ${employee.lastName || ""}`.trim(),
        image: employee.image || "",
        defects: defectData.map((defect) => {
          const defectName =
            defect.defectName || defect.name || defect.type || "Unknown";
          return {
            type: defectName,
            hourlyData: [0, 0, 0, 0, 0, 0, 0, 0],
            total: 0,
          };
        }),
      });
    });

    // Update existing employees' information
    newData.forEach((person, index) => {
      const updatedEmployee = employeeData.find((emp) => emp._id === person.id);
      if (updatedEmployee) {
        // Use colorCode from the employee model, not color
        newData[index].colorCode = updatedEmployee.colorName || "Default";
        newData[index].firstName = updatedEmployee.firstName || "";
        newData[index].lastName = updatedEmployee.lastName || "";
        newData[index].fullName =
          `${updatedEmployee.firstName || ""} ${updatedEmployee.lastName || ""}`.trim();
        newData[index].image = updatedEmployee.image || "";
      }

      // Update defect types
      const existingDefects = {};
      person.defects.forEach((defect) => {
        existingDefects[defect.type] = defect;
      });

      person.defects = defectData.map((defect) => {
        const defectName =
          defect.defectName || defect.name || defect.type || "Unknown";

        // If this defect type already exists, preserve its data
        if (existingDefects[defectName]) {
          return existingDefects[defectName];
        }

        // Otherwise create a new defect entry
        return {
          type: defectName,
          hourlyData: [0, 0, 0, 0, 0, 0, 0, 0],
          total: 0,
        };
      });
    });

    setData(newData);
  };

  // Initialize dashboard data with dynamic defect types and employees
  const initializeDashboardData = (defectData, employeeData) => {
    // Create data structure with dynamic defect types and employees
    const initializedData = employeeData.map((employee) => {
      return {
        id: employee._id,
        colorCode: employee.colorName || "Default", // Use colorCode from employee model
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        fullName:
          `${employee.firstName || ""} ${employee.lastName || ""}`.trim(),
        image: employee.image || "",
        defects: defectData.map((defect) => {
          // Try different properties that might contain the defect name
          const defectName =
            defect.defectName || defect.name || defect.type || "Unknown";

          return {
            type: defectName,
            hourlyData: [0, 0, 0, 0, 0, 0, 0, 0],
            total: 0,
          };
        }),
      };
    });

    setData(initializedData);
  };

  // Function to update a cell value
  const updateCellValue = (personIndex, defectIndex, hourIndex, value) => {
    const newData = [...data];
    const numValue = parseInt(value) || 0;
    newData[personIndex].defects[defectIndex].hourlyData[hourIndex] = numValue;

    // Recalculate the total for this defect
    newData[personIndex].defects[defectIndex].total = newData[
      personIndex
    ].defects[defectIndex].hourlyData.reduce((sum, val) => sum + val, 0);

    setData(newData);
  };

  // Calculate grand total for a person
  const calculateGrandTotal = (personIndex) => {
    return (
      data[personIndex]?.defects.reduce(
        (sum, defect) => sum + defect.total,
        0
      ) || 0
    );
  };

  // Helper function to determine background color
  const getBackgroundColor = (colorCode) => {
    // Handle both color names and hex values
    const colorMap = {
      blue: "#DBEAFE",
      orange: "#FFEDD5",
      pink: "#FCE7F3",
      green: "#DCFCE7",
      yellow: "#FEF3C7",
      purple: "#F3E8FF",
      red: "#FEE2E2",
      gray: "#F3F4F6",
    };

    const lowerColorCode = colorCode.toLowerCase();

    // If it's a color name in our map, use the mapped color
    if (colorMap[lowerColorCode]) {
      return colorMap[lowerColorCode];
    }

    // Otherwise, use the color value directly (should be hex, rgb, etc.)
    return lowerColorCode;
  };

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#045F85]">
              <th className="border border-gray-300 text-white px-4 py-2">Color</th>
              <th className="border border-gray-300 text-white px-4 py-2">Name</th>
              <th className="border border-gray-300 text-white px-4 py-2">Image</th>
              <th className="border border-gray-300 text-white px-4 py-2">Defect type</th>
              <th className="border border-gray-300 text-white px-4 py-2">1</th>
              <th className="border border-gray-300 text-white px-4 py-2">2</th>
              <th className="border border-gray-300 text-white px-4 py-2">3</th>
              <th className="border border-gray-300 text-white px-4 py-2">4</th>
              <th className="border border-gray-300 text-white px-4 py-2">5</th>
              <th className="border border-gray-300 text-white px-4 py-2">6</th>
              <th className="border border-gray-300 text-white px-4 py-2">7</th>
              <th className="border border-gray-300 text-white px-4 py-2">8</th>
              <th className="border border-gray-300 text-white px-4 py-2">Total</th>
              <th className="border border-gray-300 text-white px-4 py-2">G.Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person, personIndex) => (
              <React.Fragment key={personIndex}>
                {person.defects.map((defect, defectIndex) => (
                  <tr key={`${personIndex}-${defectIndex}`}>
                    {defectIndex === 0 && (
                      <>
                        <td
                          className="border border-gray-300 px-4 py-2 text-center"
                          rowSpan={person.defects.length}
                          style={{
                            backgroundColor: getBackgroundColor(
                              person.colorCode
                            ),
                          }}
                        >
                          {/* Show color name instead of code */}
                          {getColorName(person.colorCode)}
                        </td>
                        <td
                          className="border border-gray-300 px-4 py-2 text-center"
                          rowSpan={person.defects.length}
                        >
                          {person.fullName || "Unknown"}
                        </td>
                        <td
                          className="border border-gray-300 px-4 py-2 text-center"
                          rowSpan={person.defects.length}
                        >
                          {person.image ? (
                            <img
                              src={person.image}
                              alt={person.fullName}
                              className="w-12 h-12 rounded-full mx-auto object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 mx-auto flex items-center justify-center">
                              <span className="text-gray-600 font-bold">
                                {person.firstName
                                  ? person.firstName.charAt(0)
                                  : ""}
                                {person.lastName
                                  ? person.lastName.charAt(0)
                                  : ""}
                              </span>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                    <td className="border border-gray-300 px-4 py-2">
                      {defect.type}
                    </td>
                    {defect.hourlyData.map((value, hourIndex) => (
                      <td
                        key={hourIndex}
                        className="border border-gray-300 p-0 text-center"
                      >
                        <input
                          type="text"
                          value={value || ""}
                          onChange={(e) =>
                            updateCellValue(
                              personIndex,
                              defectIndex,
                              hourIndex,
                              e.target.value
                            )
                          }
                          className="w-full h-full py-2 px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </td>
                    ))}
                    <td className="border border-gray-300 px-4 py-2 text-center font-medium bg-gray-100">
                      {defect.total}
                    </td>
                    {defectIndex === 0 && (
                      <td
                        className="border border-gray-300 px-4 py-2 text-center font-bold bg-gray-200"
                        rowSpan={person.defects.length}
                      >
                        {calculateGrandTotal(personIndex)}
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

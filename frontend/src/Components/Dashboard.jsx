import React, { useState, useEffect } from "react";
import { api } from "../../apiConfig";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [defectTypes, setDefectTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [defectIdentifyData, setDefectIdentifyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topDefects, setTopDefects] = useState([]);

  // Function to fetch defect types
  const fetchDefectTypes = async () => {
    try {
      const response = await api.get("/get-Defect");
      const defectData = response.data;
      console.log("Fetched defect types:", defectData);
      setDefectTypes(defectData);
      return defectData;
    } catch (error) {
      console.error("Error fetching defect types:", error);
      setError("Failed to fetch defect types");
      return [];
    }
  };

  // Function to fetch employee data
  const fetchEmployees = async () => {
    try {
      const response = await api.get("/getEmployee");
      // Make sure to handle both response.data and response.data.data patterns
      let employeeData = response.data;
      if (employeeData && employeeData.data) {
        employeeData = employeeData.data;
      }
      console.log("Fetched employees:", employeeData);
      setEmployees(employeeData);
      return employeeData;
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees");
      return [];
    }
  };

  // Function to fetch defect identification data
  const fetchDefectIdentifyData = async () => {
    try {
      const response = await api.get("/get-DefectIdentify");
      console.log("Fetched defect identification data:", response.data);
      let defectIdentifyData = response.data;
      if (defectIdentifyData && defectIdentifyData.data) {
        defectIdentifyData = defectIdentifyData.data;
      }
      console.log("Fetched defect identify data:", defectIdentifyData);
      setDefectIdentifyData(defectIdentifyData);
      return defectIdentifyData;
    } catch (error) {
      console.error("Error fetching defect identification data:", error);
      setError("Failed to fetch defect identification data");
      return [];
    }
  };

  // Function to fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [defectData, employeeData, defectIdentifyData] = await Promise.all([
        fetchDefectTypes(),
        fetchEmployees(),
        fetchDefectIdentifyData(),
      ]);

      console.log("All data fetched successfully");

      // If data is already initialized, just update defect types and employees
      if (data.length > 0) {
        updateDashboardData(defectData, employeeData, defectIdentifyData);
      } else {
        // Initialize dashboard data with fetched defect types and employees
        initializeDashboardData(defectData, employeeData, defectIdentifyData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Auto-refresh has been removed
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
    const lowerCode = (colorCode || "").toLowerCase();
    if (colorMap[lowerCode]) {
      return colorMap[lowerCode];
    }

    // Default to the original code if no match
    return colorCode || "Default";
  };

  // Function to find employee ID from employee name - IMPROVED
  const findEmployeeIdByName = (employeeName, employeeData) => {
    if (!employeeName || !employeeData || !employeeData.length) return null;

    // Normalize the employee name for comparison
    const normalizedName = employeeName.trim().toLowerCase();

    // Try to find by exact name match first (case insensitive)
    const employee = employeeData.find((emp) => {
      const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`
        .trim()
        .toLowerCase();
      return fullName === normalizedName;
    });

    if (employee) return employee._id;

    // If no exact match, try to find by partial match
    const partialMatch = employeeData.find((emp) => {
      const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`
        .trim()
        .toLowerCase();
      const firstName = (emp.firstName || "").trim().toLowerCase();

      return (
        normalizedName.includes(fullName) ||
        fullName.includes(normalizedName) ||
        normalizedName.includes(firstName) ||
        firstName.includes(normalizedName)
      );
    });

    return partialMatch ? partialMatch._id : null;
  };

  // FIXED: Function to count defects for each employee and defect type by hour
  // Modify the processDefectCounts function to handle the time correctly
  const processDefectCounts = (
    employeeData,
    defectData,
    defectIdentifyData
  ) => {
    console.log("Processing defect counts with time-based mapping...");
    console.log(`Employee count: ${employeeData.length}`);
    console.log(`Defect type count: ${defectData.length}`);
    console.log(`Defect identify data count: ${defectIdentifyData.length}`);

    // Early return if any data is empty
    if (
      !employeeData.length ||
      !defectData.length ||
      !defectIdentifyData.length
    ) {
      console.warn("Some data is empty, returning empty counts");
      return {};
    }

    // Initialize counts for each employee and defect type
    const counts = {};
    let processedItems = 0;
    let skippedItems = 0;

    // Create employee name to ID map for faster lookups
    const employeeNameMap = {};
    employeeData.forEach((emp) => {
      const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`
        .trim()
        .toLowerCase();
      employeeNameMap[fullName] = emp._id;
      if (emp.firstName) {
        employeeNameMap[emp.firstName.toLowerCase()] = emp._id;
      }
    });

    // Initialize structure for each employee
    employeeData.forEach((emp) => {
      const employeeId = emp._id;
      if (!employeeId) {
        console.warn("Employee missing _id:", emp);
        return;
      }

      counts[employeeId] = {};

      // Initialize counts for each defect type
      defectData.forEach((defect) => {
        const defectName =
          defect.defectName || defect.name || defect.type || "Unknown";
        counts[employeeId][defectName] = [0, 0, 0, 0, 0, 0, 0, 0]; // 8 hours
      });
    });

    // Define time ranges for the 8 columns
    const timeRanges = [
      { start: 9, end: 10 }, // Column 0: 09:00-10:00
      { start: 10, end: 11 }, // Column 1: 10:00-11:00
      { start: 11, end: 12 }, // Column 2: 11:00-12:00
      { start: 12, end: 13 }, // Column 3: 12:00-13:00
      { start: 13, end: 14 }, // Column 4: 13:00-14:00
      { start: 14, end: 15 }, // Column 5: 14:00-15:00
      { start: 15, end: 16 }, // Column 6: 15:00-16:00
      { start: 16, end: 17 }, // Column 7: 16:00-17:00
    ];

    // Function to determine column index based on time
    const getColumnIndexFromTime = (timeStr) => {
      // Handle different time formats
      let hour = null;

      // Try parsing the time from various formats
      if (timeStr) {
        // Format: HH:MM or H:MM
        const timeMatch = timeStr.match(/(\d{1,2})[:.]\d{2}/);
        if (timeMatch) {
          hour = parseInt(timeMatch[1]);
        }
        // Format: HH or H (just the hour)
        else if (/^\d{1,2}$/.test(timeStr)) {
          hour = parseInt(timeStr);
        }
      }

      // If we couldn't parse the hour, return null
      if (hour === null) {
        return null;
      }

      // Find the matching time range
      for (let i = 0; i < timeRanges.length; i++) {
        if (hour >= timeRanges[i].start && hour < timeRanges[i].end) {
          return i;
        }
      }

      // If hour is outside our ranges, return null
      return null;
    };

    // Process defect identify data
    defectIdentifyData.forEach((item, index) => {
      // Debug the first few items
      if (index < 5) {
        console.log(`Sample defect item ${index}:`, item);
      }

      // Extract values from the correct schema fields
      const employeeName = item.EmployeeName || "";
      const defectName = item.defectName || "Unknown";
      const defectCount = parseInt(item.defectCount) || 1;

      // Extract time from the defect identify data
      const timeStr = item.time || item.timeIdentified || "";

      // Get column index based on time
      const columnIndex = getColumnIndexFromTime(timeStr);

      if (columnIndex === null) {
        if (index < 10) {
          console.log(
            `Skipped item ${index}: Invalid time format or out of range: "${timeStr}"`
          );
        }
        skippedItems++;
        return;
      }

      // Find the employee ID from the name - try direct lookup first
      let employeeId = null;
      const normalizedName = employeeName.toLowerCase().trim();

      if (employeeNameMap[normalizedName]) {
        employeeId = employeeNameMap[normalizedName];
      } else {
        employeeId = findEmployeeIdByName(employeeName, employeeData);
      }

      if (!employeeId || !counts[employeeId]) {
        skippedItems++;
        if (index < 10) {
          console.log(
            `Skipped item ${index}: Employee ${employeeName} (ID: ${employeeId}) not found`
          );
        }
        return;
      }

      // Check if this defect type exists for this employee
      if (!counts[employeeId][defectName]) {
        // If it doesn't exist, initialize it (happens with dynamic defect types)
        counts[employeeId][defectName] = [0, 0, 0, 0, 0, 0, 0, 0];
      }

      // Update the count for the appropriate hour
      counts[employeeId][defectName][columnIndex] += defectCount;
      processedItems++;

      if (index < 10) {
        console.log(
          `Processed item ${index}: counts[${employeeId}][${defectName}][${columnIndex}] = ${counts[employeeId][defectName][columnIndex]}, time: ${timeStr}`
        );
      }
    });

    console.log(
      `Processed ${processedItems} items, skipped ${skippedItems} items`
    );
    return counts;
  };

  // Function to calculate top 3 defect types per day
  const calculateTopDefects = (data) => {
    // Create an object to store totals for each defect type
    const defectTotals = {};

    // Iterate through each person and their defects
    data.forEach((person) => {
      person.defects.forEach((defect) => {
        const defectType = defect.type;

        // If this defect type doesn't exist in our totals object yet, initialize it
        if (!defectTotals[defectType]) {
          defectTotals[defectType] = 0;
        }

        // Add the total defects for this defect type
        defectTotals[defectType] += defect.total;
      });
    });

    // Convert to array and sort by total in descending order
    const sortedDefects = Object.entries(defectTotals)
      .map(([type, total]) => ({ type, total }))
      .sort((a, b) => b.total - a.total);

    // Return the top 3 (or fewer if less than 3 types exist)
    return sortedDefects.slice(0, 3);
  };

  const updateDashboardData = (
    defectData,
    employeeData,
    defectIdentifyData
  ) => {
    console.log("Updating dashboard data...");
    const defectCounts = processDefectCounts(
      employeeData,
      defectData,
      defectIdentifyData
    );

    console.log("Defect counts processed, updating UI");
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

          // Get hourly data from defect counts if available
          const hourlyData = defectCounts[employee._id]?.[defectName] || [
            0, 0, 0, 0, 0, 0, 0, 0,
          ];
          const total = hourlyData.reduce((sum, val) => sum + val, 0);

          return {
            type: defectName,
            hourlyData: hourlyData,
            total: total,
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

      // Update defect types and their counts
      const existingDefects = {};
      person.defects.forEach((defect) => {
        existingDefects[defect.type] = defect;
      });

      person.defects = defectData.map((defect) => {
        const defectName =
          defect.defectName || defect.name || defect.type || "Unknown";

        // Get hourly data from defect counts if available
        const hourlyData = defectCounts[person.id]?.[defectName] || [
          0, 0, 0, 0, 0, 0, 0, 0,
        ];
        const total = hourlyData.reduce((sum, val) => sum + val, 0);

        // If this defect type already exists, update its data
        if (existingDefects[defectName]) {
          return {
            ...existingDefects[defectName],
            hourlyData: hourlyData,
            total: total,
          };
        }

        // Otherwise create a new defect entry
        return {
          type: defectName,
          hourlyData: hourlyData,
          total: total,
        };
      });
    });

    console.log("Dashboard data updated with new counts");
    setData(newData);

    // Calculate and set top defects
    const topDefectsList = calculateTopDefects(newData);
    setTopDefects(topDefectsList);
  };

  // Initialize dashboard data with dynamic defect types and employees
  const initializeDashboardData = (
    defectData,
    employeeData,
    defectIdentifyData
  ) => {
    console.log("Initializing dashboard data...");
    // Process defect counts
    const defectCounts = processDefectCounts(
      employeeData,
      defectData,
      defectIdentifyData
    );
    console.log("Initial defect counts processed");

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

          // Get hourly data from defect counts if available
          const hourlyData = defectCounts[employee._id]?.[defectName] || [
            0, 0, 0, 0, 0, 0, 0, 0,
          ];
          const total = hourlyData.reduce((sum, val) => sum + val, 0);

          return {
            type: defectName,
            hourlyData: hourlyData,
            total: total,
          };
        }),
      };
    });

    console.log(
      "Dashboard data initialized:",
      initializedData.length,
      "employees"
    );
    setData(initializedData);

    // Calculate and set top defects
    const topDefectsList = calculateTopDefects(initializedData);
    setTopDefects(topDefectsList);
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

    // Recalculate top defects whenever data changes
    const topDefectsList = calculateTopDefects(newData);
    setTopDefects(topDefectsList);
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

    const lowerColorCode = (colorCode || "").toLowerCase();

    // If it's a color name in our map, use the mapped color
    if (colorMap[lowerColorCode]) {
      return colorMap[lowerColorCode];
    }

    // Otherwise, use the color value directly (should be hex, rgb, etc.)
    return lowerColorCode || "#F3F4F6"; // Default to gray if no color
  };

  // Time labels for the columns
  const getTimeLabels = () => {
    return [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
    ];
  };

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <p className="text-red-500">Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => fetchAllData()}
        >
          Retry
        </button>
      </div>
    );
  }

  const timeLabels = getTimeLabels();

  return (
    <div className="p-2 sm:p-4 max-w-full sm:max-w-6xl mx-auto">
      {/* Header with Responsive Layout */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg sm:text-xl font-bold">Defect Dashboard</h2>
        <button
          className="px-2 py-1 sm:px-3 sm:py-1 bg-green-500 text-white text-sm sm:text-base rounded hover:bg-green-600 w-full sm:w-auto"
          onClick={() => fetchAllData()}
        >
          Refresh Data
        </button>
      </div>

      {/* Top 3 Defects Section - Responsive Cards */}
      <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-md">
        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-blue-800">
          Top 3 Defect Types Today
        </h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
          {topDefects.length > 0 ? (
            topDefects.map((defect, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg shadow flex-1 min-w-full sm:min-w-0 ${
                  index === 0
                    ? "bg-red-100 border-l-4 border-red-500"
                    : index === 1
                      ? "bg-orange-100 border-l-4 border-orange-500"
                      : "bg-yellow-100 border-l-4 border-yellow-500"
                }`}
              >
                <div className="text-lg sm:text-xl font-bold mb-1">
                  {index + 1}. {defect.type}
                </div>
                <div className="text-gray-700">
                  <span className="font-medium text-base sm:text-lg">
                    {defect.total}
                  </span>{" "}
                  defects
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No defect data available</div>
          )}
        </div>
      </div>

      {/* Responsive Table with Horizontal Scroll on Small Screens */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-800">
                <th className="border border-gray-300 bg-[#045F85] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                  Color
                </th>
                <th className="border border-gray-300 bg-[#045F85] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                  Name
                </th>
                <th className="border border-gray-300 bg-[#045F85] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                  Image
                </th>
                <th className="border border-gray-300 bg-[#045F85] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                  Defect type
                </th>
                {timeLabels.map((label, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 bg-[#045F85] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
                  >
                    {index + 1}
                    <br />
                    <span className="text-xxs sm:text-xs">{label}</span>
                  </th>
                ))}
                <th className="border border-gray-300 bg-[#045F85] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                  Total
                </th>
                <th className="border border-gray-300 bg-[#045F85] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                  G.Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="14" className="text-center py-4 text-sm">
                    No data available. Please check API connections.
                  </td>
                </tr>
              ) : (
                data.map((person, personIndex) => (
                  <React.Fragment key={personIndex}>
                    {person.defects.map((defect, defectIndex) => (
                      <tr
                        key={`${personIndex}-${defectIndex}`}
                        className="hover:bg-gray-50"
                      >
                        {defectIndex === 0 && (
                          <>
                            <td
                              className="border border-gray-300 px-1 py-1 sm:px-4 sm:py-2 text-center text-xs sm:text-sm"
                              rowSpan={person.defects.length}
                              style={{
                                backgroundColor: getBackgroundColor(
                                  person.colorCode
                                ),
                              }}
                            >
                              {getColorName(person.colorCode)}
                            </td>
                            <td
                              className="border border-gray-300 px-1 py-1 sm:px-4 sm:py-2 text-center text-xs sm:text-sm"
                              rowSpan={person.defects.length}
                            >
                              {person.fullName || "Unknown"}
                            </td>
                            <td
                              className="border border-gray-300 px-1 py-1 sm:px-4 sm:py-2 text-center"
                              rowSpan={person.defects.length}
                            >
                              {person.image ? (
                                <img
                                  src={person.image}
                                  alt={person.fullName}
                                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full mx-auto object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-300 mx-auto flex items-center justify-center">
                                  <span className="text-gray-600 font-bold text-xs sm:text-sm">
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
                        <td className="border border-gray-300 px-1 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
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
                              className="w-full h-full py-1 px-1 sm:py-2 sm:px-2 text-center text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                          </td>
                        ))}
                        <td className="border border-gray-300 px-1 py-1 sm:px-4 sm:py-2 text-center font-medium bg-gray-100 text-xs sm:text-sm">
                          {defect.total}
                        </td>
                        {defectIndex === 0 && (
                          <td
                            className="border border-gray-300 px-1 py-1 sm:px-4 sm:py-2 text-center font-bold bg-gray-200 text-xs sm:text-sm"
                            rowSpan={person.defects.length}
                          >
                            {calculateGrandTotal(personIndex)}
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { api } from "../../apiConfig";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [defectTypes, setDefectTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await api.get("/get-Defect");
      const defectData = response.data;
      setDefectTypes(defectData);

      // If data is already initialized, just update defect types
      if (data.length > 0) {
        updateDefectTypes(defectData);
      } else {
        // Initialize dashboard data with fetched defect types
        initializeDashboardData(defectData);
      }
    } catch (error) {
      console.error("Error fetching defect types:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up initial data fetch and refresh interval
  useEffect(() => {
    // Fetch data immediately on component mount
    fetchData();

    // Set up interval for refreshing data every 3 seconds
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Function to update defect types without resetting user input
  const updateDefectTypes = (defectData) => {
    const newData = [...data];

    // For each person
    newData.forEach((person, personIndex) => {
      // Create a map of existing defect data
      const existingDefects = {};
      person.defects.forEach((defect) => {
        existingDefects[defect.type] = defect;
      });

      // Update defects array with new defect types, preserving existing data
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

  // Initialize dashboard data with dynamic defect types
  const initializeDashboardData = (defectData) => {
    const defaultPeople = [
      { colorCode: "Blue", name: "Arul" },
      { colorCode: "Orange", name: "Ramu" },
      { colorCode: "Pink", name: "Venkat" },
      { colorCode: "Green", name: "Thiru" },
    ];

    // Create data structure with dynamic defect types
    const initializedData = defaultPeople.map((person) => {
      return {
        ...person,
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

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <p>Loading defect data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">
        Defect Tracking Dashboard
      </h1> */}
      

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-yellow-200">
              <th className="border border-gray-300 px-4 py-2">Color code</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Defect type</th>
              <th className="border border-gray-300 px-4 py-2">1</th>
              <th className="border border-gray-300 px-4 py-2">2</th>
              <th className="border border-gray-300 px-4 py-2">3</th>
              <th className="border border-gray-300 px-4 py-2">4</th>
              <th className="border border-gray-300 px-4 py-2">5</th>
              <th className="border border-gray-300 px-4 py-2">6</th>
              <th className="border border-gray-300 px-4 py-2">7</th>
              <th className="border border-gray-300 px-4 py-2">8</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">G.Total</th>
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
                            backgroundColor:
                              person.colorCode.toLowerCase() === "blue"
                                ? "#DBEAFE"
                                : person.colorCode.toLowerCase() === "orange"
                                  ? "#FFEDD5"
                                  : person.colorCode.toLowerCase() === "pink"
                                    ? "#FCE7F3"
                                    : person.colorCode.toLowerCase() === "green"
                                      ? "#DCFCE7"
                                      : "white",
                          }}
                        >
                          {person.colorCode}
                        </td>
                        <td
                          className="border border-gray-300 px-4 py-2 text-center"
                          rowSpan={person.defects.length}
                        >
                          {person.name}
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

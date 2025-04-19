import React, { useState, useEffect } from "react";
import { api } from "../../apiConfig";

const AdminProcess = () => {
  const [operators, setOperators] = useState([]);
  const [defects, setDefects] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [operatorDefects, setOperatorDefects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [defectRecords, setDefectRecords] = useState([]);

  // First useEffect to load operators and defects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const employeeResponse = await api.get("/getEmployee");
        const formattedOperators = employeeResponse.data.data.map(
          (employee) => ({
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            colorCode: employee.colorCode || "#6B7280",
            image: employee.image || "/api/placeholder/48/48",
          })
        );
        setOperators(formattedOperators);

        const defectResponse = await api.get("/get-Defect");
        const formattedDefects = defectResponse.data.map((defect) => ({
          id: defect._id,
          name: defect.defectName,
        }));
        setDefects(formattedDefects);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Second useEffect to load defect records after operators and defects are loaded
  useEffect(() => {
    // Only proceed if both operators and defects are loaded
    if (operators.length > 0 && defects.length > 0) {
      fetchExistingDefects();
    }
  }, [operators, defects]);

  const Toast = ({ message, type }) => {
    return (
      <div className="fixed top-17 -right-30 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out">
        <div
          className={`px-6 py-3 rounded-lg shadow-lg flex items-center ${
            type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {type === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <p className="font-medium">{message}</p>
        </div>
      </div>
    );
  };

  // Fetch existing defect records from MongoDB
  const fetchExistingDefects = async () => {
    try {
      const response = await api.get("/get-DefectIdentify");

      // Store the raw records
      setDefectRecords(response.data);

      // Create a mapping of operator-defect-counts
      const defectMapping = {};

      response.data.forEach((record) => {
        // Find operator by name
        const operator = operators.find(
          (op) => op.name === record.EmployeeName
        );

        // Find defect by name
        const defect = defects.find((d) => d.name === record.defectName);

        if (operator && defect) {
          if (!defectMapping[operator.id]) {
            defectMapping[operator.id] = {};
          }

          // Force conversion to number to prevent string concatenation
          defectMapping[operator.id][defect.id] =
            parseInt(record.defectCount) || 0;
        }
      });

      setOperatorDefects(defectMapping);
    } catch (err) {
      console.error("Failed to fetch existing defects:", err);
    }
  };

  const handleOperatorClick = (operatorId) => {
    setSelectedOperator(operatorId);
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDefectClick = async (defectId) => {
    if (selectedOperator) {
      // Get operator and defect details
      const operator = operators.find((op) => op.id === selectedOperator);
      const defect = defects.find((d) => d.id === defectId);

      if (!operator || !defect) return;

      // Get the current count or default to 0
      const currentDefects = operatorDefects[selectedOperator] || {};

      // Force conversion to number by using parseInt or Number
      const currentCount = parseInt(currentDefects[defectId]) || 0;

      // Set the new count as the next sequential number
      // If currentCount is 0, make it 1
      // If it's already a number, increment it by 1
      const newCount = currentCount + 1;

      try {
        let response;

        // Check if a record already exists for this operator and defect
        const existingRecord = defectRecords.find(
          (record) =>
            record.EmployeeName === operator.name &&
            record.defectName === defect.name
        );

        if (existingRecord) {
          // Update existing record - explicitly send as a number
          response = await api.put(
            `/update-defect-record/${existingRecord._id}`,
            {
              defectCount: Number(newCount),
            }
          );
        } else {
          // Create new record - explicitly send as a number
          response = await api.post("/find-Defect", {
            defectName: defect.name,
            EmployeeName: operator.name,
            defectCount: Number(newCount),
          });
        }

        // Update local state
        setOperatorDefects((prev) => {
          const updated = { ...prev };
          if (!updated[selectedOperator]) {
            updated[selectedOperator] = {};
          }
          updated[selectedOperator][defectId] = newCount;
          return updated;
        });

        // Refresh defect records to ensure everything is in sync
        await fetchExistingDefects();

        // Show toast notification instead of inline message
        showToast("success", "Defect recorded successfully");
      } catch (err) {
        console.error("Failed to save defect:", err);
        showToast("error", "Failed to record defect");
      }
    }
  };

  const getDefectCounts = (operatorId) => {
    const defectCounts = operatorDefects[operatorId] || {};
    return Object.entries(defectCounts).map(([defectId, count]) => {
      const defect = defects.find((d) => d.id === defectId);
      return {
        id: defectId,
        name: defect?.name,
        count,
      };
    });
  };

  const getTotalDefectCount = (operatorId) => {
    if (!operatorDefects[operatorId]) return 0;
    return Object.values(operatorDefects[operatorId]).reduce(
      (sum, count) => sum + count,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen font-sans">
      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Quality Control Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-row gap-8">
        {/* Operators Section */}
        <div className="w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#045F85] text-white p-4">
            <h2 className="text-xl font-semibold">Operators</h2>
            <p className="text-indigo-100 text-sm">
              Select an operator to assign defects
            </p>
          </div>
          {operators.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No operators found. Please add employees to the system.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {operators.map((operator) => (
                <div
                  key={operator.id}
                  className={`flex items-center p-4 cursor-pointer transition-all ${
                    selectedOperator === operator.id
                      ? "bg-indigo-50 border-l-4"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                  onClick={() => handleOperatorClick(operator.id)}
                  style={{
                    borderColor: operator.colorCode,
                    backgroundColor:
                      selectedOperator === operator.id
                        ? `${operator.colorCode}20`
                        : undefined,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full mr-4 flex items-center justify-center overflow-hidden shadow-md"
                    style={{
                      borderColor: operator.colorCode,
                      borderWidth: "2px",
                    }}
                  >
                    <img
                      src={operator.image}
                      alt={operator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">{operator.name}</p>
                    {operatorDefects[operator.id] &&
                      Object.keys(operatorDefects[operator.id]).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getDefectCounts(operator.id).map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                            >
                              {item.name}
                              <span className="ml-1 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {item.count}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="ml-2 flex items-center">
                    {getTotalDefectCount(operator.id) > 0 && (
                      <div
                        className="text-white rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2"
                        style={{ backgroundColor: operator.colorCode }}
                      >
                        {getTotalDefectCount(operator.id)}
                      </div>
                    )}
                    {selectedOperator === operator.id && (
                      <div className="text-indigo-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Defects Section */}
        <div className="w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#045F85] text-white p-4">
            <h2 className="text-xl font-semibold">Defect Types</h2>
            <p className="text-indigo-100 text-sm">
              {selectedOperator
                ? `Select defects for ${operators.find((op) => op.id === selectedOperator)?.name}`
                : "Select an operator first"}
            </p>
          </div>
          {defects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No defect types found. Please add defect types to the system.
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 gap-2">
              {defects.map((defect) => {
                // Get the current count for this defect if it exists
                const defectCount = selectedOperator
                  ? operatorDefects[selectedOperator]?.[defect.id] || 0
                  : 0;

                // Get the selected operator's color code
                const selectedOperatorColor = selectedOperator
                  ? operators.find((op) => op.id === selectedOperator)
                      ?.colorCode
                  : "#10B981"; // Default green color if no operator selected

                return (
                  <div
                    key={defect.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedOperator
                        ? defectCount > 0
                          ? "border-l-4"
                          : "bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent"
                        : "bg-gray-100 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      selectedOperator && handleDefectClick(defect.id)
                    }
                    style={{
                      borderColor:
                        defectCount > 0 ? selectedOperatorColor : "transparent",
                      backgroundColor:
                        defectCount > 0
                          ? `${selectedOperatorColor}10`
                          : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {defectCount > 0 && (
                          <div
                            className="mr-3"
                            style={{ color: selectedOperatorColor }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <p className="font-medium text-gray-800">
                          {defect.name}
                        </p>
                      </div>
                      {defectCount > 0 && (
                        <div
                          className="text-white rounded-full w-6 h-6 flex items-center justify-center font-bold"
                          style={{ backgroundColor: selectedOperatorColor }}
                        >
                          {defectCount}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProcess;

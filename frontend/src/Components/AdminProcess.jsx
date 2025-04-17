import React, { useState } from "react";

const AdminProcess = () => {
  // Sample data for operators with color codes
  const operators = [
    { id: 1, name: "John Smith", colorCode: "#FF5733" },
    { id: 2, name: "Emily Johnson", colorCode: "#33FF57" },
    { id: 3, name: "Michael Brown", colorCode: "#3357FF" },
    { id: 4, name: "Sarah Davis", colorCode: "#F3FF33" },
    { id: 5, name: "Robert Wilson", colorCode: "#FF33F3" },
  ];

  // Sample defect types
  const defects = [
    { id: 1, name: "Misalignment" },
    { id: 2, name: "Component Damage" },
    { id: 3, name: "Connection Error" },
    { id: 4, name: "Material Defect" },
    { id: 5, name: "Assembly Issue" },
  ];

  // State for selected operator and defect assignments
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [operatorDefects, setOperatorDefects] = useState({});

  // Handle operator selection
  const handleOperatorClick = (operatorId) => {
    setSelectedOperator(operatorId);
  };

  // Handle defect assignment - now allowing multiple defects per operator
  const handleDefectClick = (defectId) => {
    if (selectedOperator) {
      setOperatorDefects((prev) => {
        const currentDefects = prev[selectedOperator] || [];

        // If defect is already assigned, remove it; otherwise add it
        if (currentDefects.includes(defectId)) {
          return {
            ...prev,
            [selectedOperator]: currentDefects.filter((id) => id !== defectId),
          };
        } else {
          return {
            ...prev,
            [selectedOperator]: [...currentDefects, defectId],
          };
        }
      });
    }
  };

  // Check if a defect is assigned to selected operator
  const isDefectAssigned = (defectId) => {
    return (
      selectedOperator &&
      operatorDefects[selectedOperator] &&
      operatorDefects[selectedOperator].includes(defectId)
    );
  };

  // Get defect names for an operator
  const getDefectNames = (operatorId) => {
    const defectIds = operatorDefects[operatorId] || [];
    return defectIds.map((id) => defects.find((d) => d.id === id)?.name);
  };

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Quality Control Dashboard
      </h1>

      <div className="flex flex-row gap-8">
        {/* Operators Section */}
        <div className="w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-xl font-semibold">Operators</h2>
            <p className="text-indigo-100 text-sm">
              Select an operator to assign defects
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {operators.map((operator) => (
              <div
                key={operator.id}
                className={`flex items-center p-4 cursor-pointer transition-all ${
                  selectedOperator === operator.id
                    ? "bg-indigo-50 border-l-4 border-indigo-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleOperatorClick(operator.id)}
              >
                <div
                  className="w-10 h-10 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: operator.colorCode }}
                >
                  {operator.name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">{operator.name}</p>
                  {operatorDefects[operator.id] &&
                    operatorDefects[operator.id].length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getDefectNames(operator.id).map((name, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
                {selectedOperator === operator.id && (
                  <div className="ml-2 text-indigo-600">
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
            ))}
          </div>
        </div>

        {/* Defects Section */}
        <div className="w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-xl font-semibold">Defect Types</h2>
            <p className="text-indigo-100 text-sm">
              {selectedOperator
                ? `Select defects for ${operators.find((op) => op.id === selectedOperator)?.name}`
                : "Select an operator first"}
            </p>
          </div>
          <div className="p-4 grid grid-cols-1 gap-2">
            {defects.map((defect) => (
              <div
                key={defect.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedOperator
                    ? isDefectAssigned(defect.id)
                      ? "bg-green-100 border-l-4 border-green-500"
                      : "bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent"
                    : "bg-gray-100 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => selectedOperator && handleDefectClick(defect.id)}
              >
                <div className="flex items-center">
                  {isDefectAssigned(defect.id) && (
                    <div className="mr-3 text-green-600">
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
                  <p className="font-medium text-gray-800">{defect.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-indigo-600 text-white p-4">
          <h2 className="text-xl font-semibold">Quality Control Summary</h2>
          <p className="text-indigo-100 text-sm">Current defect assignments</p>
        </div>
        <div className="p-6">
          {Object.keys(operatorDefects).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(operatorDefects).map(([opId, defectIds]) => {
                if (defectIds.length === 0) return null;

                const operator = operators.find(
                  (op) => op.id === parseInt(opId)
                );
                return (
                  <div
                    key={opId}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className="w-6 h-6 rounded-full mr-2"
                        style={{ backgroundColor: operator?.colorCode }}
                      />
                      <h3 className="font-medium text-gray-800">
                        {operator?.name}
                      </h3>
                    </div>
                    <div className="ml-8">
                      <ul className="list-disc text-sm text-gray-600 space-y-1">
                        {defectIds.map((defId) => (
                          <li key={defId}>
                            {defects.find((def) => def.id === defId)?.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>No defects assigned yet.</p>
              <p className="text-sm mt-2">
                Select an operator and click on defect types to begin tracking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProcess;

import React, { useState } from "react";

const IssueMaster = () => {
  const [defectTypes, setDefectTypes] = useState([]);
  const [newDefectType, setNewDefectType] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleAddDefectType = () => {
    if (!newDefectType.trim()) return;

    if (defectTypes.length >= 7) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setDefectTypes([...defectTypes, newDefectType.trim()]);
    setNewDefectType("");
  };

  const handleDeleteDefectType = (indexToDelete) => {
    setDefectTypes(defectTypes.filter((_, index) => index !== indexToDelete));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddDefectType();
    }
  };

  return (
    <div className="bg-white h-[30rem] rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Issue Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Input Section */}
        <div className="space-y-4 h-[23rem]">
          <div className="bg-gray-50 h-[13rem] p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Add New Defect Type
            </h2>
            <div className="flex">
              <input
                type="text"
                className="flex-1 rounded-l-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDefectType}
                onChange={(e) => setNewDefectType(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter defect type..."
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                onClick={handleAddDefectType}
              >
                Add
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Maximum 7 defect types allowed
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-gray-50 h-[7rem] p-4 rounded-lg border border-gray-200">
            <div className="flex  justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Defect Types Used
              </span>
              <span className="text-sm font-medium text-gray-700">
                {defectTypes.length}/7
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(defectTypes.length / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Column - Display Section */}
        <div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Current Defect Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {defectTypes.length > 0 ? (
                defectTypes.map((type, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{type}</span>
                    <button
                      onClick={() => handleDeleteDefectType(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No defect types added yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert notification */}
      {showAlert && (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-yellow-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Warning</p>
              <p className="text-sm">You can't add more than 7 defect types!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueMaster;

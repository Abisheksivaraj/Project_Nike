import React, { useState, useEffect } from "react";
import { api } from "../../apiConfig";

const IssueMaster = () => {
  const [defectTypes, setDefectTypes] = useState([]);
  const [newDefectType, setNewDefectType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch defect types when component mounts
  useEffect(() => {
    const fetchDefectTypes = async () => {
      try {
        setLoading(true);
        const response = await api.get("/get-Defect");

        if (response.data) {
          setDefectTypes(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching defect types:", err);
        setError("Failed to load defect types");
        setLoading(false);
      }
    };

    fetchDefectTypes();
  }, []);

  const handleAddDefectType = async (e) => {
    e.preventDefault();
    console.log("Add defect button clicked"); // Debug log

    if (!newDefectType.trim()) {
      console.log("Empty defect type, returning early");
      return;
    }

    if (defectTypes.length >= 7) {
      console.log("Max defect types reached");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      console.log("Making API call to add defect");
      const response = await api.post("/add-Defect", {
        defectName: newDefectType.trim(),
      });

      console.log("API response:", response);

      // Check if response.data is a success message string or contains message property
      if (response.data) {
        if (typeof response.data === "string" || response.data.message) {
          // Show success message
          const message =
            typeof response.data === "string"
              ? response.data
              : response.data.message;
          setSuccessMessage(message);
          setTimeout(() => setSuccessMessage(null), 3000);

          // Add the new defect type to the list with proper structure
          setDefectTypes((prevTypes) => [
            ...prevTypes,
            {
              defectName: newDefectType.trim(),
              // If your API doesn't return an ID, you might want to generate a temporary one
              // or handle this case differently based on your backend implementation
              id: Date.now().toString(),
            },
          ]);
        } else {
          // If response.data has the expected structure, use it directly
          setDefectTypes((prevTypes) => [...prevTypes, response.data]);
        }

        setNewDefectType("");
        console.log("State updated successfully");
      }
    } catch (error) {
      console.error("Error adding defect type:", error);
      setError("Failed to add defect type");
      setTimeout(() => setError(null), 3000);
    }

    // Debug log after everything is done
    console.log("Add defect function completed");
  };

  const handleDeleteDefectType = async (id, index) => {
    try {
      // Assuming you have a delete endpoint that takes the defect ID
      await api.delete(`/delete-Defect/${id}`);

      // Remove from state after successful deletion
      setDefectTypes(defectTypes.filter((_, i) => i !== index));

      // Show success message
      setSuccessMessage("Defect type deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting defect type:", err);
      setError("Failed to delete defect type");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddDefectType(e);
    }
  };

  // Helper function to safely extract defect name
  const getDefectName = (type) => {
    if (typeof type === "string") {
      return type;
    }
    if (type && typeof type === "object") {
      // Check if it's an error object with message property
      if (type.message) {
        return String(type.message);
      }
      // Return defectName if it exists, otherwise stringify the object
      return type.defectName || JSON.stringify(type);
    }
    // Fallback for any other case
    return String(type);
  };

  // Helper function to safely extract defect ID
  const getDefectId = (type, index) => {
    if (type && typeof type === "object") {
      return type.id || type._id || index;
    }
    return index;
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
            <div className="flex justify-between mb-2">
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

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {defectTypes.length > 0 ? (
                  defectTypes.map((type, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{getDefectName(type)}</span>
                      <button
                        onClick={() =>
                          handleDeleteDefectType(
                            getDefectId(type, index),
                            index
                          )
                        }
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
            )}
          </div>
        </div>
      </div>

      {/* Alert notification */}
      {showAlert && (
        <div className="fixed top-[5rem] right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
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

      {/* Success message alert */}
      {successMessage && (
        <div className="fixed top-[5rem] right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-green-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueMaster;

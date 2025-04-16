// import React, { useState } from "react";

// export default function Dashboard() {
//   const [data, setData] = useState([
//     {
//       colorCode: "Blue",
//       name: "Arul",
//       defects: [
//         { type: "Clean", hourlyData: [1, 0, 0, 0, 0, 0, 0, 0], total: 10 },
//         { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 3 },
//         { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//       ],
//     },
//     {
//       colorCode: "Orange",
//       name: "Ramu",
//       defects: [
//         { type: "Clean", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//       ],
//     },
//     {
//       colorCode: "Pink",
//       name: "Venkat",
//       defects: [
//         { type: "Clean", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//       ],
//     },
//     {
//       colorCode: "Green",
//       name: "Thiru",
//       defects: [
//         { type: "Clean", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//         { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
//       ],
//     },
//   ]);

//   // Function to update a cell value
//   const updateCellValue = (personIndex, defectIndex, hourIndex, value) => {
//     const newData = [...data];
//     const numValue = parseInt(value) || 0;
//     newData[personIndex].defects[defectIndex].hourlyData[hourIndex] = numValue;

//     // Recalculate the total for this defect
//     newData[personIndex].defects[defectIndex].total = newData[
//       personIndex
//     ].defects[defectIndex].hourlyData.reduce((sum, val) => sum + val, 0);

//     setData(newData);
//   };

//   // Calculate grand total for a person
//   const calculateGrandTotal = (personIndex) => {
//     return data[personIndex].defects.reduce(
//       (sum, defect) => sum + defect.total,
//       0
//     );
//   };

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         Defect Tracking Dashboard
//       </h1>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-yellow-200">
//               <th className="border border-gray-300 px-4 py-2">Color code</th>
//               <th className="border border-gray-300 px-4 py-2">Name</th>
//               <th className="border border-gray-300 px-4 py-2">Defect type</th>
//               <th className="border border-gray-300 px-4 py-2">1</th>
//               <th className="border border-gray-300 px-4 py-2">2</th>
//               <th className="border border-gray-300 px-4 py-2">3</th>
//               <th className="border border-gray-300 px-4 py-2">4</th>
//               <th className="border border-gray-300 px-4 py-2">5</th>
//               <th className="border border-gray-300 px-4 py-2">6</th>
//               <th className="border border-gray-300 px-4 py-2">7</th>
//               <th className="border border-gray-300 px-4 py-2">8</th>
//               <th className="border border-gray-300 px-4 py-2">Total</th>
//               <th className="border border-gray-300 px-4 py-2">G.Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((person, personIndex) => (
//               <React.Fragment key={personIndex}>
//                 {person.defects.map((defect, defectIndex) => (
//                   <tr key={`${personIndex}-${defectIndex}`}>
//                     {defectIndex === 0 && (
//                       <>
//                         <td
//                           className="border border-gray-300 px-4 py-2 text-center"
//                           rowSpan={person.defects.length}
//                           style={{
//                             backgroundColor:
//                               person.colorCode.toLowerCase() === "blue"
//                                 ? "#DBEAFE"
//                                 : person.colorCode.toLowerCase() === "orange"
//                                   ? "#FFEDD5"
//                                   : person.colorCode.toLowerCase() === "pink"
//                                     ? "#FCE7F3"
//                                     : person.colorCode.toLowerCase() === "green"
//                                       ? "#DCFCE7"
//                                       : "white",
//                           }}
//                         >
//                           {person.colorCode}
//                         </td>
//                         <td
//                           className="border border-gray-300 px-4 py-2 text-center"
//                           rowSpan={person.defects.length}
//                         >
//                           {person.name}
//                         </td>
//                       </>
//                     )}
//                     <td className="border border-gray-300 px-4 py-2">
//                       {defect.type}
//                     </td>
//                     {defect.hourlyData.map((value, hourIndex) => (
//                       <td
//                         key={hourIndex}
//                         className="border border-gray-300 p-0 text-center"
//                       >
//                         <input
//                           type="text"
//                           value={value || ""}
//                           onChange={(e) =>
//                             updateCellValue(
//                               personIndex,
//                               defectIndex,
//                               hourIndex,
//                               e.target.value
//                             )
//                           }
//                           className="w-full h-full py-2 px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
//                         />
//                       </td>
//                     ))}
//                     <td className="border border-gray-300 px-4 py-2 text-center font-medium bg-gray-100">
//                       {defect.total}
//                     </td>
//                     {defectIndex === 0 && (
//                       <td
//                         className="border border-gray-300 px-4 py-2 text-center font-bold bg-gray-200"
//                         rowSpan={person.defects.length}
//                       >
//                         {calculateGrandTotal(personIndex)}
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";

export default function DefectTrackingDashboard() {
  const [data, setData] = useState([
    {
      colorCode: "Blue",
      name: "Arul",
      defects: [
        { type: "Clean", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
      ],
    },
    {
      colorCode: "Orange",
      name: "Ramu",
      defects: [
        { type: "Clean", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
      ],
    },
    {
      colorCode: "Pink",
      name: "Venkat",
      defects: [
        { type: "Clean", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
      ],
    },
    {
      colorCode: "Green",
      name: "Thiru",
      defects: [
        { type: "Clean", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Trimming", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Bond", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Rock", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
        { type: "Banana", hourlyData: [0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
      ],
    },
  ]);

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
    return data[personIndex].defects.reduce(
      (sum, defect) => sum + defect.total,
      0
    );
  };

  // Get color styles based on color code
  const getColorStyles = (colorCode) => {
    const colorMap = {
      Blue: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        badge: "bg-blue-500",
      },
      Orange: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-300",
        badge: "bg-orange-500",
      },
      Pink: {
        bg: "bg-pink-100",
        text: "text-pink-800",
        border: "border-pink-300",
        badge: "bg-pink-500",
      },
      Green: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        badge: "bg-green-500",
      },
    };

    return (
      colorMap[colorCode] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        badge: "bg-gray-500",
      }
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            Defect Tracking Dashboard
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Color Code
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Defect Type
                </th>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                  <th
                    key={hour}
                    className="px-4 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-700"
                  >
                    {hour}
                  </th>
                ))}
                <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-sm font-semibold text-gray-700">
                  G.Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((person, personIndex) => (
                <React.Fragment key={personIndex}>
                  {person.defects.map((defect, defectIndex) => {
                    const colorStyles = getColorStyles(person.colorCode);
                    const isFirstDefect = defectIndex === 0;
                    const isLastDefect =
                      defectIndex === person.defects.length - 1;
                    const borderClass = isLastDefect ? "border-b" : "";

                    return (
                      <tr
                        key={`${personIndex}-${defectIndex}`}
                        className={`hover:bg-gray-50 ${defectIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        {isFirstDefect && (
                          <>
                            <td
                              rowSpan={person.defects.length}
                              className={`px-4 py-1 ${borderClass} text-center`}
                            >
                              <div
                                className={`inline-flex items-center justify-center w-full h-full`}
                              >
                                <span
                                  className={`inline-block w-6 h-6 rounded-full ${colorStyles.badge}`}
                                ></span>
                                <span
                                  className={`ml-2 font-medium ${colorStyles.text}`}
                                >
                                  {person.colorCode}
                                </span>
                              </div>
                            </td>
                            <td
                              rowSpan={person.defects.length}
                              className={`px-4 py-1 ${borderClass} font-medium`}
                            >
                              {person.name}
                            </td>
                          </>
                        )}
                        <td className={`px-4 py-1 ${borderClass}`}>
                          {defect.type}
                        </td>
                        {defect.hourlyData.map((value, hourIndex) => (
                          <td
                            key={hourIndex}
                            className={`p-0 text-center ${borderClass}`}
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
                              className="w-full py-2 px-2 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 border-transparent"
                            />
                          </td>
                        ))}
                        <td
                          className={`px-4 py-1 text-center font-medium bg-gray-100 ${borderClass}`}
                        >
                          {defect.total}
                        </td>
                        {isFirstDefect && (
                          <td
                            rowSpan={person.defects.length}
                            className={`px-4 py-1 text-center font-bold ${colorStyles.bg} ${colorStyles.text}`}
                          >
                            {calculateGrandTotal(personIndex)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

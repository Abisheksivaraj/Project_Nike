import React from "react";
import AdminPage from "./Components/AdminPage";
import Dashboard from "./Components/Dashboard";
import IssueMaster from "./Components/IssueMaster";
import ColorCodeMaster from "./Components/ColorCodeMAster";
import AddEmployee from "./Components/AddEmployee";
import AdminProcess from "./Components/AdminProcess";
import Login from "./Components/Login";
import { Route, Routes, useLocation } from "react-router-dom";


const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {!isAuthPage && (
        <div>
          <AdminPage />
          <div>
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </div>
      )}

      {isAuthPage && (
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;

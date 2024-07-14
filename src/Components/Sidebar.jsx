import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (isCollapsed) {
      setDropdownOpen(false);
    }
  }, [isCollapsed]);

  return (
    <div className={`flex`}>
      <div
        className={`${
          isCollapsed ? "w-0" : "w-64"
        } bg-gray-800 text-green-300 flex flex-col transition-width duration-300`}
      >
        <div className="px-4 py-2 text-lg font-bold">
          {!isCollapsed && "Admin Menu"}
        </div>
        <nav className="flex-1">
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-700">
            {!isCollapsed && (
              <div>
                <i class="bi bi-house-door"></i>
                <span>&nbsp;Home</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="block px-4 py-2 hover:bg-gray-700 text-left w-full focus:outline-none"
          >
            {!isCollapsed && dropdownOpen ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <i
                  class="fa fa-solid fa-angle-up "
                  style={{
                    paddingTop: "5px",
                    display: "block",
                  }}
                ></i>
                <span>&nbsp;Records</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <i
                  class="fa fa-solid fa-angle-down "
                  style={{
                    paddingTop: "5px",
                    display: "block",
                  }}
                ></i>
                <span>&nbsp;Records</span>
              </div>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 py-2 w-48 bg-gray-800 rounded shadow-xl">
              <Link
                to="/viewdoctors"
                className="block px-4 py-2 text-green-300 hover:bg-gray-700"
              >
                Doctors
              </Link>
              <hr style={{ color: "white" }} />
              <Link
                to="/viewpatients"
                className="block px-4 py-2 text-green-300 hover:bg-gray-700"
              >
                Patients
              </Link>
              <Link
                to="/viewdepartments"
                className="block px-4 py-2 text-green-300 hover:bg-gray-700"
              >
                Departments
              </Link>
            </div>
          )}
          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700">
            {!isCollapsed && (
              <div>
                <i class="bi bi-gear"></i>
                <span>&nbsp;Settings</span>
              </div>
            )}
          </Link>
        </nav>
      </div>
      <button
        onClick={toggleSidebar}
        className="bg-gray-800 text-white px-2 py-1 hover:bg-gray-700"
      >
        {isCollapsed ? (
          <i
            class="fa fa-lg fa-solid fa-angle-right"
            style={{ color: "#63E6BE" }}
          ></i>
        ) : (
          <i
            class="fa fa-lg fa-solid fa-angle-left"
            style={{ color: "#63E6BE" }}
          ></i>
        )}
      </button>
    </div>
  );
};

export default Sidebar;

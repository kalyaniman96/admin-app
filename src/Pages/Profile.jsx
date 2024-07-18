import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";

const Profile = ({ darkMode, setDarkMode }) => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const id = localStorage.getItem("user ID");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const getData = async () => {
    const res = await axios.get(`admin/getdata/${id}`);
    console.log("+++ API response", res.data);
    setUserData(res.data.userData);
    if (res.data) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []); // The empty dependency list is very important , otherwise the api call will keep executing in infinite-loop

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("user ID");
    localStorage.removeItem("isAuthenticated");
  };

  //style component
  const styles = {
    style: {
      display: "flex",
      flexDirection: "column",
      // justifyContent: "center",
      alignItems: "center",
      color: "green",
    },
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          {isLoading ? (
            <div
              className="loading-container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Loader />
            </div>
          ) : (
            <div>
              <div
                className={`flex h-screen flex-grow-1 ${
                  darkMode ? "bg-dark text-white" : "bg-gray-200"
                }`}
              >
                <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="flex-1 flex flex-col">
                  <Navbar darkMode={darkMode} />
                  <div style={styles.style}>
                    {/* <img src={userData} alt={user.name} /> */}
                    &nbsp;
                    <h1
                      style={{ fontWeight: "bold" }}
                    >{`Welcome ${userData.email}`}</h1>
                  </div>
                  <div className="container-fluid h-screen">
                    <div className="row d-flex justify-content-between">
                      <div className="col-auto">
                        <button onClick={() => navigate("/dashboard")}>
                          <i className="fa fa-lg fa-solid fa-arrow-left">
                            {" "}
                            Home
                          </i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <Footer darkMode={darkMode} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        navigate("/")
      )}
    </div>
  );
};

export default Profile;

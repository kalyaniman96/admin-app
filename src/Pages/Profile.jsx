import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
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
            <div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              <div style={styles.style}>
                {/* <img src={userData} alt={user.name} /> */}
                &nbsp;
                <h2>{`Welcome ${userData.email}`}</h2>
              </div>
              <div className="container-fluid">
                <div className="row d-flex justify-content-between">
                  <div className="col-auto">
                    <button onClick={() => navigate("/dashboard")}>
                      <i className="fa fa-lg fa-solid fa-arrow-left"> Home</i>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        navigate("/")
      )}
    </div>
  );
};

export default Profile;

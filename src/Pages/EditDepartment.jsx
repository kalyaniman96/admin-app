import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const EditDepartment = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [errors, setErrors] = useState({});
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.departmentid;
  console.log(id);

  const getDepartment = async (id) => {
    try {
      const res = await axios.get(`/department/getdata/${id}`);
      console.log("+++ API response: ", res.data.data);

      setName(res.data.data.name);
      setDescription(res.data.data.description);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    getDepartment(id);
  }, []);

  const updateDepartment = async (id) => {
    try {
      const updatedData = {
        name: name,
        description: description,
      };
      console.log("+++ Updated data: ", updatedData);
      const res = await axios.put(`/department/update/${id}`, updatedData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const validateFormAndUpdate = () => {
    const newErrors = {};

    if (name === "") newErrors.name = "Please enter the name";
    if (description === "") newErrors.department = "Please enter the email";

    //set the 'newErrors' object as the value of the 'error' state variable
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updateDepartment(id);
      setUpdateSuccessful(true);
    }
  };

  useEffect(() => {
    if (updateSuccessful) {
      navigate("/viewdepartments");
      notify("Data updated successfully");
    }
  }, [updateSuccessful]);

  return (
    <>
      {isAuthenticated ? (
        <div
          className={`flex h-screen flex-grow-1 ${
            darkMode ? "modal-dark bg-dark text-white" : "bg-gray-200"
          }`}
        >
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="flex-1 flex flex-col">
            <Navbar darkMode={darkMode} />
            <div
              className={`card p-4 m-10 ${
                darkMode ? "bg-dark text-white" : ""
              } `}
            >
              <div className=" form-box ">
                <h1 className="card-title text-center font-bold">
                  Edit department data
                </h1>
                <div>
                  <div className="form-group">
                    <label htmlFor="name">
                      Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">
                      Description<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="description"
                      type="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (
                      <p className="text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div className="flex justify-start items-center space-x-2 mt-4">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(-1)}
                    >
                      <i className="fa fa-sm fa-solid fa-arrow-left"> Back</i>
                    </button>
                    <input
                      className="btn btn-primary"
                      value="Submit"
                      type="submit"
                      onClick={() => validateFormAndUpdate()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default EditDepartment;

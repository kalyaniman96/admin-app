import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const EditAppointment = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");
  const [date, setDate] = useState("");
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [errors, setErrors] = useState({});
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.appointmentid;
  console.log("+++ Appointment id to edit: ", id);

  const getAppointment = async (id) => {
    try {
      const res = await axios.get(`/appointment/getdata/${id}`);
      console.log("+++ API response for edit appointment: ", res.data.data);

      setDepartment(res.data.data.department);
      setDoctor(res.data.data.doctor);
      setPatient(res.data.data.patient);
      setDate(res.data.data.date);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    getAppointment(id);
  }, []);

  const updateAppointment = async (id) => {
    try {
      const updatedData = {
        department: department,
        doctor: doctor,
        patient: patient,
        date: date,
      };
      // console.log("+++ Updated data: ", updatedData);
      const res = await axios.put(`/appointment/update/${id}`, updatedData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const validateFormAndUpdate = () => {
    const newErrors = {};

    if (date === "") newErrors.date = "Please pick a date";

    //set the 'newErrors' object as the value of the 'error' state variable
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updateAppointment(id);
      setUpdateSuccessful(true);
    }
  };

  useEffect(() => {
    if (updateSuccessful) {
      navigate("/viewappointments");
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
            <div className="h-screen">
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
                      <label htmlFor="name">Department</label>
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        value={department}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Doctor</label>
                      <input
                        className="form-control"
                        id="description"
                        type="text"
                        value={doctor}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Patient</label>
                      <input
                        className="form-control"
                        id="description"
                        type="text"
                        value={patient}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Date</label>
                      <input
                        className="form-control"
                        id="description"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                      {errors.date && (
                        <p className="text-red-500">{errors.date}</p>
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
            <Footer darkMode={darkMode} />
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default EditAppointment;

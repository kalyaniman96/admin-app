import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const EditPatient = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.patientid;
  console.log(id);

  const getPatient = async (id) => {
    try {
      const res = await axios.get(`/patient/getdata/${id}`);
      console.log("+++ API response: ", res.data.data);

      setName(res.data.data.name);
      setEmail(res.data.data.email);
      setPhone(res.data.data.phone);
      setDepartment(res.data.data.department);
      setGender(res.data.data.gender);
      setMedicalHistory(res.data.data.medicalHistory);
      setCurrentMedications(res.data.data.currentMedications);
      setEmergencyContactName(res.data.data.emergencyContactName);
      setEmergencyContactNumber(res.data.data.emergencyContactNumber);
      setEmergencyContactRelation(res.data.data.emergencyContactRelation);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    getPatient(id);
  }, []);

  const updatePatient = async (id) => {
    try {
      const updatedData = {
        name: name,
        email: email,
        phone: phone,
        department: department,
        gender: gender,
        medicalHistory: medicalHistory,
        currentMedications: currentMedications,
        emergencyContactName: emergencyContactName,
        emergencyContactNumber: emergencyContactNumber,
        emergencyContactRelation: emergencyContactRelation,
      };
      console.log("+++ Updated data: ", updatedData);
      const res = await axios.put(`/patient/update/${id}`, updatedData);
      setMessage(res.data.message);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const validateFormAndUpdate = () => {
    const newErrors = {};

    if (name === "") newErrors.name = "Please enter name";
    if (email === "") newErrors.email = "Please enter email";
    if (phone === "") newErrors.phone = "Please enter phone number";
    if (department === "") newErrors.department = "Please enter department";
    // if (gender === "") newErrors.gender = "Please enter the gender";
    if (medicalHistory === "")
      newErrors.medicalHistory = "Please enter medical history";
    if (currentMedications === "")
      newErrors.currentMedications = "Please enter current medications";

    if (emergencyContactName === "")
      newErrors.emergencyContactName = "Please enter emergency contact name";
    if (emergencyContactNumber === "")
      newErrors.emergencyContactNumber =
        "Please enter emergency contact number";
    // if (emergencyContactRelation === "")
    //   newErrors.emergencyContactRelation =
    //     "Please enter hospital emergency contact relation";

    //set the 'newErrors' object as the value of the 'error' state variable
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updatePatient(id);
      setUpdateSuccessful(true);
    }
  };

  useEffect(() => {
    if (updateSuccessful) {
      navigate("/viewpatients");
      notify("Data updated successfully");
    }
  }, [updateSuccessful]);

  return (
    <>
      {isAuthenticated ? (
        <div
          className={`flex flex-grow-1 ${
            darkMode ? "bg-dark text-white" : "bg-gray-200"
          }`}
        >
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="flex-1 flex flex-col">
            <Navbar darkMode={darkMode} />
            <div
              className={`card p-4 m-10 ${
                darkMode ? "modal-dark bg-dark text-white" : ""
              } `}
            >
              <div className="form-box">
                <h1 className="card-title text-center font-bold">
                  Edit patient data
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
                    <label htmlFor="email">
                      Email<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && (
                      <p className="text-red-500">{errors.phone}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="department">
                      Department<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="department"
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                    {errors.department && (
                      <p className="text-red-500">{errors.department}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <input
                      className="form-control"
                      id="gender"
                      type="text"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    {/* {errors.gender && (
                      <p className="text-red-500">{errors.gender}</p>
                    )} */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicalHistory">
                      Medical History<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="medicalHistory"
                      type="text"
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                    />
                    {errors.medicalHistory && (
                      <p className="text-red-500">{errors.medicalHistory}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="currentMedications">
                      Current Medications<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="currentMedications"
                      type="text"
                      value={currentMedications}
                      onChange={(e) => setCurrentMedications(e.target.value)}
                    />
                    {errors.currentMedications && (
                      <p className="text-red-500">
                        {errors.currentMedications}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyContactName">
                      Emergency Contact Name
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="emergencyContactName"
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                    />
                    {/* {errors.emergencyContactName && (
                      <p className="text-red-500">
                        {errors.emergencyContactName}
                      </p>
                    )} */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyContactNumber">
                      Emergency Contact Number
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="emergencyContactNumber"
                      type="text"
                      value={emergencyContactNumber}
                      onChange={(e) =>
                        setEmergencyContactNumber(e.target.value)
                      }
                    />
                    {errors.emergencyContactNumber && (
                      <p className="text-red-500">
                        {errors.emergencyContactNumber}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyContactRelation">
                      Emergency Contact Relation
                    </label>
                    <input
                      className="form-control"
                      id="emergencyContactRelation"
                      type="text"
                      value={emergencyContactRelation}
                      onChange={(e) =>
                        setEmergencyContactRelation(e.target.value)
                      }
                    />
                    {/* {errors.emergencyContactRelation && (
                      <p className="text-red-500">{errors.emergencyContactRelation}</p>
                    )} */}
                  </div>
                  <div className="flex justify-start items-center space-x-2 mt-4">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(-1)}
                    >
                      <i className="fa fa-sm fa-arrow-left"> Back</i>
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
            <Footer darkMode={darkMode} />
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default EditPatient;

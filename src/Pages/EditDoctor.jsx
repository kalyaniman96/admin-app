import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const EditDoctor = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [address, setAddress] = useState("");
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.doctorid;
  console.log(id);

  const getDoctor = async (id) => {
    try {
      const res = await axios.get(`/doctor/getdata/${id}`);
      console.log("+++ API response: ", res.data.data);

      setName(res.data.data.name);
      setEmail(res.data.data.email);
      setPhone(res.data.data.phone);
      setDepartment(res.data.data.department);
      setGender(res.data.data.gender);
      setQualification(res.data.data.qualification);
      setExperience(res.data.data.experience);
      setHospitalAffiliation(res.data.data.hospitalAffiliation);
      setLicenseNumber(res.data.data.licenseNumber);
      setAddress(res.data.data.address);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    getDoctor(id);
  }, []);

  const updateDoctor = async (id) => {
    try {
      const updatedData = {
        name: name,
        email: email,
        phone: phone,
        department: department,
        gender: gender,
        qualification: qualification,
        experience: experience,
        hospitalAffiliation: hospitalAffiliation,
        licenseNumber: licenseNumber,
        address: address,
      };
      console.log("+++ Updated data: ", updatedData);
      const res = await axios.put(`/doctor/update/${id}`, updatedData);
      setMessage(res.data.message);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const validateFormAndUpdate = () => {
    const newErrors = {};

    if (name === "") newErrors.name = "Please enter the name";
    if (email === "") newErrors.email = "Please enter the email";
    if (phone === "") newErrors.phone = "Please enter the phone number";
    if (department === "") newErrors.department = "Please enter the department";
    // if (gender === "") newErrors.gender = "Please enter the gender";
    if (qualification === "")
      newErrors.qualification = "Please enter the qualification";
    if (experience === "") newErrors.experience = "Please enter the experience";
    // if (hospitalAffiliation === "")
    // newErrors.hospitalAffiliation = "Please enter the hospital affiliation";
    if (licenseNumber === "")
      newErrors.licenseNumber = "Please enter the license number";
    if (address === "") newErrors.address = "Please enter the address";

    //set the 'newErrors' object as the value of the 'error' state variable
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updateDoctor(id);
      setUpdateSuccessful(true);
    }
  };

  useEffect(() => {
    if (updateSuccessful) {
      navigate("/viewdoctors");
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
              <div className=" form-box ">
                <h1 className="card-title text-center font-bold">
                  Edit doctor data
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
                    <label htmlFor="qualification">
                      Qualification<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="qualification"
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                    />
                    {errors.qualification && (
                      <p className="text-red-500">{errors.qualification}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">
                      Experience<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="experience"
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                    {errors.experience && (
                      <p className="text-red-500">{errors.experience}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="hospitalAffiliation">
                      Hospital Affiliation
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="hospitalAffiliation"
                      type="text"
                      value={hospitalAffiliation}
                      onChange={(e) => setHospitalAffiliation(e.target.value)}
                    />
                    {/* {errors.hospitalAffiliation && (
                      <p className="text-red-500">
                        {errors.hospitalAffiliation}
                      </p>
                    )} */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="licenseNumber">
                      License Number<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="licenseNumber"
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-500">{errors.licenseNumber}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">
                      Address<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && (
                      <p className="text-red-500">{errors.address}</p>
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
            <Footer darkMode={darkMode} />
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default EditDoctor;

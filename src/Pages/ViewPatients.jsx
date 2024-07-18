import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import dateFormat from "dateformat";
import { useFormik } from "formik";
import { X } from "lucide-react";
import patientSchema from "../Schemas/PatientSchema";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";

const ViewPatients = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getPatientData = async () => {
    try {
      const res = await axios.get(`/patient/getdata`);
      console.log("+++ API response", res);

      setPatientData(res.data.data);
      console.log("++++ All patient data :", patientData);
    } catch (error) {
      console.log("+++ Error while fetching data: ", error);
    }
  };
  //Get all departments data
  console.log("+++All departments name: ", departmentData);
  const getDepartmentData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/department/getdata");
      console.log("+++ Departments :", res);
      if (res.status === 200) {
        //taking only department names from the api response and storing them in state variable
        setDepartmentData(res.data.data.map((deparment) => deparment.name));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      getPatientData();
      getDepartmentData();
    }
  }, [showModal]);

  //pagination...
  useEffect(() => {
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const filteredPatients = patientData.filter((patient) =>
      patient.department
        .toLowerCase()
        .includes(selectedDepartment.toLowerCase())
    );
    setDisplayedPatients(
      filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
    );
  }, [currentPage, patientData, selectedDepartment]);

  const totalPages = Math.ceil(
    patientData.filter((patient) =>
      patient.department
        .toLowerCase()
        .includes(selectedDepartment.toLowerCase())
    ).length / patientsPerPage
  );
  // react sweet alert box
  const MySwal = withReactContent(Swal);

  const deletePatient = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/patient/delete/${id}`);
          console.log("+++ API response after delete patient: ", res);
          if (res.status === 200) {
            notify(res.data.message);
          }
          getPatientData();
        } catch (error) {
          console.log("+++ Error while deleting data: ", error);
        }
        MySwal.fire("Deleted!", "The patient has been deleted.", "success");
      }
    });
  };

  const editPatient = (id) => {
    navigate("/editpatient", { state: { patientid: id } });
  };

  const handleReset = () => {
    setFormValues({
      name: "",
      email: "",
      phone: "",
      department: "",
      gender: "",
      medicalHistory: "",
      currentMedications: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelation: "",
    });
  };

  //modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  //add patient form handling
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    gender: "",
    medicalHistory: "",
    currentMedications: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContactRelation: "",
  });

  const { errors, touched, handleBlur, handleChange, handleSubmit, resetForm } =
    useFormik({
      initialValues: formValues,
      validationSchema: patientSchema,
      onSubmit: (values) => {
        handleAddPatient(values);
        setShowModal(false);
        resetForm();
      },
    });

  const handleAddPatient = async (userdata) => {
    try {
      console.log("Form Values:", userdata); // Debug: log form values

      const res = await axios.post("/patient/create", userdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("+++ API response for add patient: ", res);

      if (res.status === 200) {
        notify(res.data.message);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      errorToast("Failed to add new patient");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    handleChange(e);
  };

  return (
    <>
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
            <div
              className={`flex flex-grow-1 ${
                darkMode ? "bg-dark text-white" : "bg-gray-200"
              }`}
            >
              <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
              <div className="flex flex-column flex-grow-1">
                <Navbar darkMode={darkMode} />
                <div
                  className={`container-fluid main-content flex flex-grow-1 h-screen flex-column ${
                    darkMode ? "bg-dark text-white" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                    <div className="col"></div>
                    <div className="col-auto">
                      <button
                        className="btn btn-info p-20 rounded-circle"
                        onClick={handleOpen}
                        title="Add patient"
                        style={{ width: "70px", height: "70px" }}
                      >
                        <i className="fa fa-user fa-2x"></i>
                        <br />
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                    <div className="col">
                      <div className="float-right relative z-0">
                        <select
                          className={`form-select ${
                            darkMode ? "bg-gray-600 text-white" : ""
                          }`}
                          value={selectedDepartment}
                          onChange={(e) =>
                            setSelectedDepartment(e.target.value)
                          }
                        >
                          <option value="">All departments</option>
                          {departmentData.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {showModal && (
                    <>
                      {/* Add patient modal */}
                      <div
                        className={`modal-backdrop ${
                          darkMode ? "modal-dark" : ""
                        }`}
                      >
                        <div className="modal-container">
                          <div className="row justify-content-center">
                            <div className="col-md-4 mt-10">
                              <button
                                className="float-right"
                                onClick={handleClose}
                              >
                                <X size={30} />
                              </button>
                              <form
                                onSubmit={handleSubmit}
                                className={`shadow p-3 mt-5 mb-5 rounded ${
                                  darkMode ? "bg-dark text-white" : "bg-white"
                                }`}
                              >
                                <div
                                  style={{
                                    maxHeight: "550px",
                                    overflow: "auto",
                                  }}
                                >
                                  <div className="card-title text-center font-bold">
                                    <h1>Add Patient</h1>
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="name">
                                      Name
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.name && touched.name
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="name"
                                      name="name"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.name}
                                      required
                                    />
                                    {errors.name && touched.name && (
                                      <div className="invalid-feedback">
                                        {errors.name}
                                      </div>
                                    )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="email">
                                      Email
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                      type="email"
                                      className={`form-control ${
                                        errors.email && touched.email
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="email"
                                      name="email"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.email}
                                      required
                                    />
                                    {errors.email && touched.email && (
                                      <div className="invalid-feedback">
                                        {errors.email}
                                      </div>
                                    )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="phone">
                                      Phone
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.phone && touched.phone
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="phone"
                                      name="phone"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.phone}
                                      required
                                    />
                                    {errors.phone && touched.phone && (
                                      <div className="invalid-feedback">
                                        {errors.phone}
                                      </div>
                                    )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="department">
                                      Department
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select
                                      className={`form-control ${
                                        errors.department && touched.department
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="department"
                                      name="department"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.department}
                                      required
                                    >
                                      <option value="">
                                        Select a department
                                      </option>
                                      {departmentData.map((department) => (
                                        <option
                                          key={department}
                                          value={department}
                                        >
                                          {department}
                                        </option>
                                      ))}
                                    </select>
                                    {errors.department &&
                                      touched.department && (
                                        <div className="invalid-feedback">
                                          {errors.department}
                                        </div>
                                      )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                      className={`form-control ${
                                        errors.gender && touched.gender
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="gender"
                                      name="gender"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.gender}
                                      required
                                    >
                                      <option value="">Select gender</option>
                                      <option value="male">Male</option>
                                      <option value="female">Female</option>
                                      <option value="other">Other</option>
                                    </select>
                                    {errors.gender && touched.gender && (
                                      <div className="invalid-feedback">
                                        {errors.gender}
                                      </div>
                                    )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="medicalHistory">
                                      Medical History
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <textarea
                                      className={`form-control ${
                                        errors.medicalHistory &&
                                        touched.medicalHistory
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="medicalHistory"
                                      name="medicalHistory"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.medicalHistory}
                                      required
                                    />
                                    {errors.medicalHistory &&
                                      touched.medicalHistory && (
                                        <div className="invalid-feedback">
                                          {errors.medicalHistory}
                                        </div>
                                      )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="currentMedications">
                                      Current Medications
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <textarea
                                      className={`form-control ${
                                        errors.currentMedications &&
                                        touched.currentMedications
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="currentMedications"
                                      name="currentMedications"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.currentMedications}
                                      required
                                    />
                                    {errors.currentMedications &&
                                      touched.currentMedications && (
                                        <div className="invalid-feedback">
                                          {errors.currentMedications}
                                        </div>
                                      )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="emergencyContactName">
                                      Emergency Contact Name
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.emergencyContactName &&
                                        touched.emergencyContactName
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="emergencyContactName"
                                      name="emergencyContactName"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.emergencyContactName}
                                      required
                                    />
                                    {errors.emergencyContactName &&
                                      touched.emergencyContactName && (
                                        <div className="invalid-feedback">
                                          {errors.emergencyContactName}
                                        </div>
                                      )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="emergencyContactNumber">
                                      Emergency Contact Number
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.emergencyContactNumber &&
                                        touched.emergencyContactNumber
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="emergencyContactNumber"
                                      name="emergencyContactNumber"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={formValues.emergencyContactNumber}
                                      required
                                    />
                                    {errors.emergencyContactNumber &&
                                      touched.emergencyContactNumber && (
                                        <div className="invalid-feedback">
                                          {errors.emergencyContactNumber}
                                        </div>
                                      )}
                                  </div>
                                  <div className="mb-3">
                                    <label htmlFor="emergencyContactRelation">
                                      Emergency Contact Relation
                                    </label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.emergencyContactRelation &&
                                        touched.emergencyContactRelation
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="emergencyContactRelation"
                                      name="emergencyContactRelation"
                                      onChange={handleInputChange}
                                      onBlur={handleBlur}
                                      value={
                                        formValues.emergencyContactRelation
                                      }
                                      required
                                    />
                                    {errors.emergencyContactRelation &&
                                      touched.emergencyContactRelation && (
                                        <div className="invalid-feedback">
                                          {errors.emergencyContactRelation}
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <button
                                    type="submit"
                                    className="btn btn-block btn-primary mt-4"
                                  >
                                    Add Patient
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-block btn-secondary"
                                    onClick={handleReset}
                                  >
                                    Reset
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div
                    className="table-responsive"
                    style={{
                      maxHeight: "500px",
                      overflow: "auto",
                    }}
                  >
                    <table
                      className={`table ${
                        darkMode ? "table-dark" : "table-striped"
                      }`}
                    >
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Gender</th>
                          <th scope="col">Department</th>
                          <th scope="col">Medical History</th>
                          <th scope="col">Current Medications</th>
                          <th scope="col">Emergency Contact Name</th>
                          <th scope="col">Emergency Contact Number</th>
                          <th scope="col">Emergency Contact Relation</th>
                          <th scope="col">Created on</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedPatients.length > 0 ? (
                          displayedPatients.map((patient, index) => (
                            <tr key={patient._id}>
                              <th scope="row">
                                {index +
                                  1 +
                                  (currentPage - 1) * patientsPerPage}
                              </th>
                              <td>{patient.name}</td>
                              <td>{patient.email}</td>
                              <td>{patient.phone}</td>
                              <td>{patient.gender}</td>
                              <td>{patient.department}</td>
                              <td>{patient.medicalHistory}</td>
                              <td>{patient.currentMedications}</td>
                              <td>{patient.emergencyContactName}</td>
                              <td>{patient.emergencyContactNumber}</td>
                              <td>{patient.emergencyContactRelation}</td>
                              <td>
                                {dateFormat(patient.createdAt, "dd/mm/yyyy")}
                              </td>
                              <td>
                                <div>
                                  <button
                                    className="btn btn-sm btn-warning m-1"
                                    onClick={() => editPatient(patient._id)}
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </button>

                                  <button
                                    className="btn btn-sm btn-danger m-1 "
                                    onClick={() => deletePatient(patient._id)}
                                  >
                                    <i className=" bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="12"
                              className="text-danger text-center"
                            >
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-2">
                    <ResponsivePagination
                      previousLabel="Prev"
                      nextLabel="Next"
                      current={currentPage}
                      total={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>

                  {/* <div className="container-fluid">
                  <div className="row d-flex justify-content-between">
                    <div className="col-auto">
                      <button onClick={() => navigate("/dashboard")}>
                        <i className="fa fa-lg fa-solid fa-arrow-left"> Home</i>
                      </button>
                    </div>
                  </div>
                </div> */}
                </div>
                <Footer darkMode={darkMode} />
              </div>
            </div>
          )}
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default ViewPatients;

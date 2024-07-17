import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Loader from "../Components/Loader";
import patientSchema from "../Schemas/PatientSchema";
import { useFormik } from "formik";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const PatientsByDepartment = ({
  notify,
  errorToast,
  darkMode,
  setDarkMode,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [patientsData, setPatientsData] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const location = useLocation();
  const deptId = location.state?.deptId;
  const [departmentName, setDepartmentName] = useState("");

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`/department/getdata/${deptId}`);
      if (res.status === 200) {
        setPatientsData(res.data.patients);
        setDepartmentName(res.data.data.name);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      getData();
    }
  }, [showModal]);

  // pagination
  useEffect(() => {
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    setDisplayedPatients(
      patientsData.slice(indexOfFirstPatient, indexOfLastPatient)
    );
  }, [currentPage, patientsData]);

  const totalPages = Math.ceil(patientsData.length / patientsPerPage);

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
          if (res.status === 200) {
            notify(res.data.message);
          }
          getData();
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

  // modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  // this function will reset every value in the field except the
  const handleReset = () => {
    formik.resetForm({
      values: {
        ...formik.initialValues,
        department: departmentName,
      },
    });
  };

  // addPatient form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      department: departmentName,
      gender: "",
      medicalHistory: "",
      currentMedications: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelation: "",
    },
    validationSchema: patientSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post("/patient/create", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 200) {
          notify(res.data.message);
          setShowModal(false);
          getData();
        }
      } catch (error) {
        console.error("Error adding user:", error);
        errorToast("Failed to add user");
      }
    },
  });
  // department field will hold a constant value that can never be changed
  useEffect(() => {
    if (departmentName) {
      formik.setFieldValue("department", departmentName);
    }
  }, [departmentName]);

  return (
    <>
      {isAuthenticated ? (
        <div>
          {isLoading ? (
            <div
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
            <>
              <div
                className={`flex h-screen flex-grow-1 ${
                  darkMode ? "bg-dark text-white" : "bg-gray-200"
                }`}
              >
                <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="flex-1 flex flex-grow-1 flex-col">
                  <Navbar darkMode={darkMode} />
                  <div className="container-fluid main-content flex-grow-1 flex-col">
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
                      <div className="col"></div>
                    </div>
                    {showModal && (
                      <>
                        {/* add patient modal */}
                        <div className="modal-backdrop">
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
                                  onSubmit={formik.handleSubmit}
                                  className={`shadow p-3 mt-5 mb-5 rounded ${
                                    darkMode ? "bg-dark text-white" : "bg-white"
                                  }`}
                                  style={{ position: "relative" }}
                                >
                                  <div
                                    style={{
                                      maxHeight: "550px",
                                      overflowY: "auto",
                                      paddingBottom: "60px",
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
                                        name="name"
                                        className={`form-control ${
                                          formik.errors.name &&
                                          formik.touched.name &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.name &&
                                      formik.touched.name ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.name}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="email">
                                        Email
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <input
                                        name="email"
                                        className={`form-control ${
                                          formik.errors.email &&
                                          formik.touched.email &&
                                          "is-invalid"
                                        }`}
                                        type="email"
                                        placeholder="Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.email &&
                                      formik.touched.email ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.email}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="phone">
                                        Phone
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <input
                                        name="phone"
                                        className={`form-control ${
                                          formik.errors.phone &&
                                          formik.touched.phone &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.phone &&
                                      formik.touched.phone ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.phone}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="department">
                                        Department
                                      </label>
                                      <input
                                        name="department"
                                        className="form-control"
                                        type="text"
                                        value={formik.values.department}
                                        readOnly
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="gender">Gender</label>
                                      <select
                                        name="gender"
                                        className={`form-control ${
                                          formik.errors.gender &&
                                          formik.touched.gender &&
                                          "is-invalid"
                                        }`}
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                      </select>
                                      {formik.errors.gender &&
                                      formik.touched.gender ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.gender}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="medicalHistory">
                                        Medical history*
                                      </label>
                                      <input
                                        name="medicalHistory"
                                        className={`form-control ${
                                          formik.errors.medicalHistory &&
                                          formik.touched.medicalHistory &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Medical history"
                                        value={formik.values.medicalHistory}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.medicalHistory &&
                                      formik.touched.medicalHistory ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.medicalHistory}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="currentMedications">
                                        Current Medications*
                                      </label>
                                      <input
                                        name="currentMedications"
                                        className={`form-control ${
                                          formik.errors.currentMedications &&
                                          formik.touched.currentMedications &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Current Medications"
                                        value={formik.values.currentMedications}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.currentMedications &&
                                      formik.touched.currentMedications ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.currentMedications}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="emergencyContactName">
                                        Emergency Contact Name
                                      </label>
                                      <input
                                        name="emergencyContactName"
                                        className={`form-control ${
                                          formik.errors.emergencyContactName &&
                                          formik.touched.emergencyContactName &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Emergency Contact Name"
                                        value={
                                          formik.values.emergencyContactName
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.emergencyContactName &&
                                      formik.touched.emergencyContactName ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.emergencyContactName}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="emergencyContactPhone">
                                        Emergency contact number*
                                      </label>
                                      <input
                                        name="emergencyContactNumber"
                                        className={`form-control ${
                                          formik.errors
                                            .emergencyContactNumber &&
                                          formik.touched
                                            .emergencyContactNumber &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Emergency contact number"
                                        value={
                                          formik.values.emergencyContactNumber
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.emergencyContactNumber &&
                                      formik.touched.emergencyContactNumber ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.emergencyContactNumber}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="emergencyContactRelation">
                                        Emergency contact relation*
                                      </label>
                                      <input
                                        name="emergencyContactRelation"
                                        className={`form-control ${
                                          formik.errors
                                            .emergencyContactRelation &&
                                          formik.touched
                                            .emergencyContactRelation &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Emergency contact relation"
                                        value={
                                          formik.values.emergencyContactRelation
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.emergencyContactRelation &&
                                      formik.touched
                                        .emergencyContactRelation ? (
                                        <p className="invalid-feedback">
                                          {
                                            formik.errors
                                              .emergencyContactRelation
                                          }
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      type="submit"
                                      className="btn btn-primary btn-block mb-2"
                                    >
                                      Submit
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-block"
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
                    <div className="table-responsive">
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
                            <th scope="col">Department</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Medical History</th>
                            <th scope="col">Current Medications</th>
                            <th scope="col">Emergency Contact Name</th>
                            <th scope="col">Emergency Contact Number</th>
                            <th scope="col">Emergency Contact Relation</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedPatients.map((patient, index) => (
                            <tr key={patient._id}>
                              <th scope="row">{index + 1}</th>
                              <td>{patient.name}</td>
                              <td>{patient.email}</td>
                              <td>{patient.phone}</td>
                              <td>{departmentName}</td>
                              <td>{patient.gender}</td>
                              <td>{patient.medicalHistory}</td>
                              <td>{patient.currentMedications}</td>
                              <td>{patient.emergencyContactName}</td>
                              <td>{patient.emergencyContactNumber}</td>
                              <td>{patient.emergencyContactRelation}</td>
                              <td>
                                <button
                                  className="btn btn-warning btn-sm m-1"
                                  onClick={() => editPatient(patient._id)}
                                >
                                  <i className="fa fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-1"
                                  onClick={() => deletePatient(patient._id)}
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="d-flex justify-content-center">
                        <ResponsivePagination
                          total={totalPages}
                          current={currentPage}
                          previousLabel="Prev"
                          nextLabel="Next"
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </div>
                    <div className="container-fluid">
                      <div className="row d-flex justify-content-between">
                        <div className="col-auto">
                          <button onClick={() => navigate("/viewdepartments")}>
                            <i className="fa fa-lg fa-solid fa-arrow-left">
                              {" "}
                              Back
                            </i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        navigate("/login")
      )}
    </>
  );
};

export default PatientsByDepartment;

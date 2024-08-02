import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Loader from "../Components/Loader";
import doctorSchema from "../Schemas/DoctorSchema";
import { useFormik } from "formik";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Footer from "../Components/Footer";

const DoctorsByDepartment = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorsData, setDoctorsData] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  const location = useLocation();
  const deptId = location.state?.deptId;
  const [departmentName, setDepartmentName] = useState("");

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`/department/getdata/${deptId}`);
      if (res.status === 200) {
        setDoctorsData(res.data.doctors);
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
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    setDisplayedDoctors(
      doctorsData.slice(indexOfFirstDoctor, indexOfLastDoctor)
    );
  }, [currentPage, doctorsData]);

  const totalPages = Math.ceil(doctorsData.length / doctorsPerPage);

  // react sweet alert box
  const MySwal = withReactContent(Swal);

  const deleteDoctor = async (id) => {
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
          const res = await axios.delete(`/doctor/delete/${id}`);
          if (res.status === 200) {
            notify(res.data.message);
          }
          getData();
        } catch (error) {
          console.log("+++ Error while deleting data: ", error);
        }
        MySwal.fire("Deleted!", "The doctor has been deleted.", "success");
      }
    });
  };

  const editDoctor = (id) => {
    navigate("/editdoctor", { state: { doctorid: id } });
  };

  // modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleReset = () => {
    formik.resetForm({
      values: {
        ...formik.initialValues,
        department: departmentName,
      },
    });
  };

  // addDoctor form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      department: departmentName,
      gender: "",
      qualification: "",
      experience: "",
      hospitalAffiliation: "",
      licenseNumber: "",
      address: "",
    },
    validationSchema: doctorSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post("/doctor/create", values, {
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
            <div>
              <div
                className={`flex flex-grow-1 ${
                  darkMode ? "bg-dark text-white" : "bg-gray-200"
                }`}
              >
                <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="flex-1 flex flex-col">
                  <Navbar darkMode={darkMode} />
                  <div className="container-fluid main-content">
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                      <div className="col"></div>
                      <div className="col-auto">
                        <button
                          className="btn btn-info p-20 rounded-circle"
                          onClick={handleOpen}
                          title="Add doctor"
                          style={{ width: "70px", height: "70px" }}
                        >
                          <i className="fa fa-user-md fa-2x"></i>
                          <br />
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                      <div className="col"></div>
                    </div>
                    {showModal && (
                      <>
                        {/* add doctor modal */}
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
                                      <h1>Add Doctor</h1>
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
                                      <label htmlFor="qualification">
                                        Qualification
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <input
                                        name="qualification"
                                        className={`form-control ${
                                          formik.errors.qualification &&
                                          formik.touched.qualification &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Qualification"
                                        value={formik.values.qualification}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.qualification &&
                                      formik.touched.qualification ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.qualification}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="experience">
                                        Experience
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <input
                                        name="experience"
                                        className={`form-control ${
                                          formik.errors.experience &&
                                          formik.touched.experience &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Experience"
                                        value={formik.values.experience}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.experience &&
                                      formik.touched.experience ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.experience}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="hospitalAffiliation">
                                        Hospital Affiliation
                                      </label>
                                      <input
                                        name="hospitalAffiliation"
                                        className={`form-control ${
                                          formik.errors.hospitalAffiliation &&
                                          formik.touched.hospitalAffiliation &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Hospital Affiliation"
                                        value={
                                          formik.values.hospitalAffiliation
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.hospitalAffiliation &&
                                      formik.touched.hospitalAffiliation ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.hospitalAffiliation}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="licenseNumber">
                                        License Number
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <input
                                        name="licenseNumber"
                                        className={`form-control ${
                                          formik.errors.licenseNumber &&
                                          formik.touched.licenseNumber &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="License Number"
                                        value={formik.values.licenseNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.licenseNumber &&
                                      formik.touched.licenseNumber ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.licenseNumber}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="address">
                                        Address
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <input
                                        name="address"
                                        className={`form-control ${
                                          formik.errors.address &&
                                          formik.touched.address &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.address &&
                                      formik.touched.address ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.address}
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
                            <th scope="col">Qualification</th>
                            <th scope="col">Experience</th>
                            <th scope="col">Hospital Affiliation</th>
                            <th scope="col">License Number</th>
                            <th scope="col">Address</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedDoctors.map((doctor, index) => (
                            <tr key={doctor._id}>
                              <th scope="row">{index + 1}</th>
                              <td>{doctor.name}</td>
                              <td>{doctor.email}</td>
                              <td>{doctor.phone}</td>
                              <td>{departmentName}</td>
                              <td>{doctor.gender}</td>
                              <td>{doctor.qualification}</td>
                              <td>{doctor.experience}</td>
                              <td>{doctor.hospitalAffiliation}</td>
                              <td>{doctor.licenseNumber}</td>
                              <td>{doctor.address}</td>
                              <td>
                                <button
                                  className="btn btn-warning btn-sm m-1"
                                  onClick={() => editDoctor(doctor._id)}
                                >
                                  <i className="fa fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-1"
                                  onClick={() => deleteDoctor(doctor._id)}
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
                    <div className="container-fluid p-2">
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
                  <Footer darkMode={darkMode} />
                </div>
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

export default DoctorsByDepartment;

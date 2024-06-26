import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useFormik } from "formik";
import { X } from "lucide-react";
import doctorSchema from "../Schemas/DoctorSchema";
import Loader from "../Components/Loader";

const ViewDoctors = ({ notify, errorToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const doctorsPerPage = 5;
  const [doctorData, setdoctorData] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getdata = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/doctor/getdata`);
      console.log("+++ API response", res);

      if (res.status === 200) {
        setdoctorData(res.data.data);
        setIsLoading(false);
      }
      console.log("++++ All doctor data :", doctorData);
    } catch (error) {
      console.log("+++ Error while fetching data: ", error);
    }
  };

  useEffect(() => {
    if (!showModal) {
      getdata();
    }
  }, [showModal]);

  //pagination
  useEffect(() => {
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const filteredDoctors = doctorData.filter((doctor) =>
      doctor.department.toLowerCase().includes(selectedDepartment.toLowerCase())
    );
    setDisplayedDoctors(
      filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
    );
  }, [currentPage, doctorData, selectedDepartment]);

  const totalPages = Math.ceil(
    doctorData.filter((doctor) =>
      doctor.department.toLowerCase().includes(selectedDepartment.toLowerCase())
    ).length / doctorsPerPage
  );

  const deleteDoctor = async (id) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      const res = await axios.delete(`/doctor/delete/${id}`);
      console.log("+++ API response", res);
      notify(res.data.message);
      getdata();
    }
  };

  const editDoctor = (id) => {
    navigate("/editdoctor", { state: { doctorid: id } });
  };

  const handleReset = () => {
    setFormValues({
      name: "",
      email: "",
      phone: "",
      department: "",
      gender: "",
      qualification: "",
      experience: "",
      hospitalAffiliation: "",
      licenseNumber: "",
      address: "",
    });
  };

  const departments = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Surgery",
    "Dermatology",
    "Gynecology",
    "Gastroenterology",
    "Orthopedics",
  ];
  // modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  //addDoctor form handling
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    gender: "",
    qualification: "",
    experience: "",
    hospitalAffiliation: "",
    licenseNumber: "",
    address: "",
  });

  const { errors, touched, handleBlur, handleChange, handleSubmit, resetForm } =
    useFormik({
      initialValues: formValues,
      validationSchema: doctorSchema,
      onSubmit: (values) => {
        handleAddDoctor(values);
        setShowModal(false);
        resetForm();
      },
    });

  const handleAddDoctor = async (userdata) => {
    try {
      console.log("Form Values:", userdata);

      const res = await axios.post("/doctor/create", userdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("+++API response for add doctor...", res);

      if (res.status === 200) {
        notify(res.data.message);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      errorToast("Failed to add user");
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
              <div className="flex h-screen bg-gray-200">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
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
                      <div className="col">
                        <div className="float-right relative z-0">
                          <select
                            className="form-select"
                            value={selectedDepartment}
                            onChange={(e) =>
                              setSelectedDepartment(e.target.value)
                            }
                          >
                            <option value="">All Departments</option>
                            {departments.map((department) => (
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
                                  onSubmit={handleSubmit}
                                  className="shadow p-3 mt-5 mb-5 bg-white rounded"
                                >
                                  <div
                                    style={{
                                      maxHeight: "550px",
                                      overflow: "auto",
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
                                          errors.name &&
                                          touched.name &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Name"
                                        value={formValues.name}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.name && touched.name ? (
                                        <p className="invalid-feedback">
                                          {errors.name}
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
                                          errors.email &&
                                          touched.email &&
                                          "is-invalid"
                                        }`}
                                        type="email"
                                        placeholder="Email"
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.email && touched.email ? (
                                        <p className="invalid-feedback">
                                          {errors.email}
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
                                          errors.phone &&
                                          touched.phone &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.phone && touched.phone ? (
                                        <p className="invalid-feedback">
                                          {errors.phone}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="department">
                                        Department
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <input
                                        name="department"
                                        className={`form-control ${
                                          errors.department &&
                                          touched.department &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="department"
                                        value={formValues.department}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.department &&
                                      touched.department ? (
                                        <p className="invalid-feedback">
                                          {errors.department}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="gender">Gender</label>
                                      <input
                                        name="gender"
                                        className={`form-control ${
                                          errors.gender &&
                                          touched.gender &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Gender"
                                        value={formValues.gender}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.gender && touched.gender ? (
                                        <p className="invalid-feedback">
                                          {errors.gender}
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
                                          errors.qualification &&
                                          touched.qualification &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Qualification"
                                        value={formValues.qualification}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.qualification &&
                                      touched.qualification ? (
                                        <p className="invalid-feedback">
                                          {errors.qualification}
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
                                          errors.experience &&
                                          touched.experience &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Experience"
                                        value={formValues.experience}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.experience &&
                                      touched.experience ? (
                                        <p className="invalid-feedback">
                                          {errors.experience}
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
                                          errors.hospitalAffiliation &&
                                          touched.hospitalAffiliation &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Hospital affiliation"
                                        value={formValues.hospitalAffiliation}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.hospitalAffiliation &&
                                      touched.hospitalAffiliation ? (
                                        <p className="invalid-feedback">
                                          {errors.hospitalAffiliation}
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
                                          errors.licenseNumber &&
                                          touched.licenseNumber &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="License number"
                                        value={formValues.licenseNumber}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.licenseNumber &&
                                      touched.licenseNumber ? (
                                        <p className="invalid-feedback">
                                          {errors.licenseNumber}
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
                                          errors.address &&
                                          touched.address &&
                                          "is-invalid"
                                        }`}
                                        type="text"
                                        placeholder="Address"
                                        value={formValues.address}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.address && touched.address ? (
                                        <p className="invalid-feedback">
                                          {errors.address}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="mb-2">
                                    <button
                                      type="submit"
                                      className="btn btn-primary w-100"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                  <div className="mb-2">
                                    <button
                                      type="submit"
                                      className="btn btn-secondary w-100"
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
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Department</th>
                            <th scope="col">Qualification</th>
                            <th scope="col">Hospital Affiliation</th>
                            <th scope="col">License Number</th>
                            <th scope="col">Address</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedDoctors.length > 0 ? (
                            displayedDoctors.map((doctor, index) => (
                              <tr key={doctor._id}>
                                <th scope="row">
                                  {index +
                                    1 +
                                    (currentPage - 1) * doctorsPerPage}
                                </th>
                                <td>{doctor.name}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.phone}</td>
                                <td>{doctor.gender}</td>
                                <td>{doctor.department}</td>
                                <td>{doctor.qualification}</td>
                                <td>{doctor.hospitalAffiliation}</td>
                                <td>{doctor.licenseNumber}</td>
                                <td>{doctor.address}</td>
                                <td>
                                  {dateFormat(doctor.createdAt, "dd/mm/yyyy")}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-warning m-1"
                                    onClick={() => editDoctor(doctor._id)}
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </button>

                                  <button
                                    className="btn btn-sm btn-danger m-1"
                                    onClick={() => deleteDoctor(doctor._id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
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
                        previousLabel="Previous"
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
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default ViewDoctors;

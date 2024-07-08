import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useFormik } from "formik";
import { X } from "lucide-react";
import doctorSchema from "../Schemas/DoctorSchema";
import Loader from "../Components/Loader";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ViewDoctors = ({ notify, errorToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorData, setDoctorData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();
  const doctorsPerPage = 5;

  // Fetch all doctors data
  const getDoctorData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/doctor/getdata");
      console.log("API response:", res);
      if (res.status === 200) {
        setDoctorData(res.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
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
      getDoctorData();
      getDepartmentData();
    }
  }, [showModal]);

  // Pagination logic
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

  // SweetAlert configuration
  const MySwal = withReactContent(Swal);

  // Delete doctor function
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
          console.log("API response after delete:", res);
          if (res.status === 200) {
            notify(res.data.message);
          }
          getDoctorData();
        } catch (error) {
          console.error("Error deleting data:", error);
        }
        MySwal.fire("Deleted!", "The doctor has been deleted.", "success");
      }
    });
  };

  // Edit doctor function
  const editDoctor = (id) => {
    navigate("/editdoctor", { state: { doctorid: id } });
  };

  // Reset formik form
  const handleReset = () => {
    formik.resetForm();
  };

  // Departments list

  // Modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  // Formik for add doctor form
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      department: "", // Use selectedDepartment as initial value
      gender: "",
      qualification: "",
      experience: "",
      hospitalAffiliation: "",
      licenseNumber: "",
      address: "",
    },
    validationSchema: doctorSchema,
    onSubmit: (values) => {
      handleAddDoctor(values);
      setShowModal(false);
      formik.resetForm();
    },
  });

  // Add doctor function
  const handleAddDoctor = async (doctordata) => {
    try {
      const res = await axios.post("/doctor/create", doctordata);

      if (res.status === 200) {
        notify(res.data.message);
        getDoctorData();
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      errorToast("Failed to add doctor");
    }
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
                          {departmentData.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div
                    className="table-responsive"
                    style={{ overflowX: "auto" }}
                  >
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Department</th>
                          <th>Gender</th>
                          <th>Qualification</th>
                          <th>Experience</th>
                          <th>Hospital Affiliation</th>
                          <th>License Number</th>
                          <th>Address</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedDoctors.length > 0 ? (
                          displayedDoctors.map((doctor, index) => (
                            <tr key={doctor._id}>
                              <th scope="row">
                                {index + 1 + (currentPage - 1) * doctorsPerPage}
                              </th>
                              <td>{doctor.name}</td>
                              <td>{doctor.email}</td>
                              <td>{doctor.phone}</td>
                              <td>{doctor.department}</td>
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
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="12"
                              className="text-center text-danger"
                            >
                              No data found for selected department.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {!isLoading && (
                    <div className="mt-3">
                      <ResponsivePagination
                        total={totalPages}
                        current={currentPage}
                        onPageChange={setCurrentPage}
                        showPageSizeOptions={true}
                        previousLabel="Prev"
                        nextLabel="Next"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Add Doctor Modal */}
          <div
            className={`modal ${showModal ? "d-block show" : ""}`}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header justify-content-center">
                  <h5 className="modal-title  font-bold">Add Doctor</h5>
                  <button
                    type="button"
                    className="close position-absolute"
                    onClick={handleClose}
                    style={{ right: "10px" }}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div style={{ overflowY: "auto", maxHeight: "550px" }}>
                      <div className="form-group">
                        <label htmlFor="name">
                          Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <div className="text-danger">
                            {formik.errors.name}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">
                          Email<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <div className="text-danger">
                            {formik.errors.email}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">
                          Phone<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          name="phone"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.phone}
                        />
                        {formik.touched.phone && formik.errors.phone ? (
                          <div className="text-danger">
                            {formik.errors.phone}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="department">
                          Department<span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-control"
                          id="department"
                          name="department"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.department}
                        >
                          <option value="">Select department</option>
                          {departmentData.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                        {formik.touched.department &&
                        formik.errors.department ? (
                          <div className="text-danger">
                            {formik.errors.department}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                          className="form-control"
                          id="gender"
                          name="gender"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {formik.touched.gender && formik.errors.gender ? (
                          <div className="text-danger">
                            {formik.errors.gender}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="qualification">
                          Qualification<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="qualification"
                          name="qualification"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.qualification}
                        />
                        {formik.touched.qualification &&
                        formik.errors.qualification ? (
                          <div className="text-danger">
                            {formik.errors.qualification}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="experience">
                          Experience<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="experience"
                          name="experience"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.experience}
                        />
                        {formik.touched.experience &&
                        formik.errors.experience ? (
                          <div className="text-danger">
                            {formik.errors.experience}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="hospitalAffiliation">
                          Hospital Affiliation
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="hospitalAffiliation"
                          name="hospitalAffiliation"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.hospitalAffiliation}
                        />
                        {formik.touched.hospitalAffiliation &&
                        formik.errors.hospitalAffiliation ? (
                          <div className="text-danger">
                            {formik.errors.hospitalAffiliation}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="licenseNumber">
                          License Number<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="licenseNumber"
                          name="licenseNumber"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.licenseNumber}
                        />
                        {formik.touched.licenseNumber &&
                        formik.errors.licenseNumber ? (
                          <div className="text-danger">
                            {formik.errors.licenseNumber}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="address">
                          Address<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          name="address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.address}
                        />
                        {formik.touched.address && formik.errors.address ? (
                          <div className="text-danger">
                            {formik.errors.address}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
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
        </div>
      ) : (
        navigate("/login")
      )}
    </>
  );
};

export default ViewDoctors;

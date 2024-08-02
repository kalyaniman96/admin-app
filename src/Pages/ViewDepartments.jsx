import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import departmentSchema from "../Schemas/DepartmentSchema";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useFormik } from "formik";
import { X } from "lucide-react";
import Loader from "../Components/Loader";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Footer from "../Components/Footer";

const ViewDepartments = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 5;
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [displayedDepartments, setDisplayedDepartments] = useState([]);
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`/department/getdata`);
      if (res.status === 200) {
        setDepartmentData(res.data.data);
        setDepartmentName(res.data.data.name);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error while fetching data: ", error);
    }
  };

  useEffect(() => {
    if (!showModal) {
      getData();
    }
  }, [showModal]);

  useEffect(() => {
    const indexOfLastDepartment = currentPage * departmentsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
    setDisplayedDepartments(
      departmentData.slice(indexOfFirstDepartment, indexOfLastDepartment)
    );
  }, [currentPage, departmentData]);

  const totalPages = Math.ceil(departmentData.length / departmentsPerPage);

  const editDepartment = (id) => {
    navigate("/editdepartment", { state: { departmentid: id } });
  };

  const viewDoctorsByDepartment = (deptId) => {
    navigate("/doctorsbydepartment", { state: { deptId } });
  };

  const viewPatientsByDepartment = (deptId) => {
    navigate("/patientsbydepartment", { state: { deptId } });
  };

  // Modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  // react sweet alert box
  const MySwal = withReactContent(Swal);

  const deleteDepartment = async (id) => {
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
          const res = await axios.delete(`/department/delete/${id}`);
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

  const handleReset = () => {
    formik.resetForm({});
  };

  // addDoctor form handling
  const formik = useFormik({
    initialValues: {
      name: departmentName,
      description: "",
    },
    validationSchema: departmentSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post("/department/create", values, {
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
  // name field of department will hold a constant value that can never be changed
  useEffect(() => {
    if (departmentName) {
      formik.setFieldValue("name", departmentName);
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
                  <div className=" container-fluid main-content">
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                      <div className="col"></div>
                      <div className="col-auto">
                        <button
                          className="btn btn-info p-20 rounded-circle"
                          onClick={handleOpen}
                          title="Add department"
                          style={{ width: "70px", height: "70px" }}
                        >
                          <i className="fa fa-building fa-2x"></i>
                          <br />
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                      <div className="col"></div>
                    </div>
                    {showModal && (
                      <>
                        {/* add department modal */}
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
                                  onSubmit={formik.handleSubmit}
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
                                      <h1>Add Department</h1>
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="name">
                                        Department name
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
                                      <label htmlFor="description">
                                        Description
                                      </label>
                                      <input
                                        name="description"
                                        className={`form-control ${
                                          formik.errors.description &&
                                          formik.touched.description &&
                                          "is-invalid"
                                        }`}
                                        type="description"
                                        placeholder="Description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.errors.description &&
                                      formik.touched.description ? (
                                        <p className="invalid-feedback">
                                          {formik.errors.description}
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
                      <table
                        className={`table ${
                          darkMode ? "table-dark" : "table-striped"
                        }`}
                      >
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Doctors</th>
                            <th scope="col">Patients</th>
                            <th scope="col">Description</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedDepartments.length > 0 ? (
                            displayedDepartments.map((department, index) => (
                              <tr key={department._id}>
                                <th scope="row">
                                  {index +
                                    1 +
                                    (currentPage - 1) * departmentsPerPage}
                                </th>
                                <td>{department.name}</td>
                                <td>
                                  <button
                                    className={`${
                                      darkMode
                                        ? "button-link-dark-mode"
                                        : "button-link"
                                    }`}
                                    onClick={() =>
                                      viewDoctorsByDepartment(department._id)
                                    }
                                  >
                                    View Doctors
                                  </button>
                                </td>
                                <td>
                                  <button
                                    className={`${
                                      darkMode
                                        ? "button-link-dark-mode"
                                        : "button-link"
                                    }`}
                                    to="/patientsbydepartment"
                                    onClick={() =>
                                      viewPatientsByDepartment(department._id)
                                    }
                                  >
                                    View Patients
                                  </button>
                                </td>
                                <td>{department.description}</td>
                                <td>
                                  {dateFormat(
                                    department.createdAt,
                                    "dd/mm/yyyy"
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-warning m-1"
                                    onClick={() =>
                                      editDepartment(department._id)
                                    }
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger m-1"
                                    onClick={() =>
                                      deleteDepartment(department._id)
                                    }
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="7"
                                className="text-danger text-center"
                              >
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3">
                      <ResponsivePagination
                        previousLabel="Prev"
                        nextLabel="Next"
                        current={currentPage}
                        total={totalPages}
                        onPageChange={setCurrentPage}
                      />
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

export default ViewDepartments;

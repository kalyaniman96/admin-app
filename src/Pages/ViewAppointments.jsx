import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import appointmentSchema from "../Schemas/AppointmentSchema";
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

const ViewAppointments = ({ notify, errorToast, darkMode, setDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  const [appointments, setAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  // const [departmentData, setDepartmentData] = useState([]);
  const [departmentName, setDepartmentName] = useState([]);
  //to select a department in the modal
  const [selectedDepartment, setSelectedDepartment] = useState("");
  // for date based search of appointments
  const [selectedDate, setSelectedDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  // const [date, setDate] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  console.log("+++All departments name: ", departmentName);
  console.log("+++ Selected department: ", selectedDepartment);

  //Get all appointments data
  const getAppointmentData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/appointment/getdata");
      console.log("+++All Appointments :", res);
      if (res.status === 200) {
        setAppointments(res.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  // get all departments data
  const getDepartmentData = async () => {
    try {
      const res = await axios.get(`/department/getdata`);
      if (res.status === 200) {
        // setDepartmentData(res.data.data);
        setDepartmentName(res.data.data.map((deparment) => deparment.name));
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error while fetching data: ", error);
    }
  };
  // get all the doctors by department name
  const getDoctorsByDepartment = async () => {
    try {
      const res = await axios.get(
        `/department/getdoctorsbydepartment/${selectedDepartment}`
      );
      console.log("+++ Doctors by department :", res);
      if (res.status === 200) {
        setDoctors(res.data.doctors.map((doctor) => doctor.name));
        console.log("+++ Doctors in selected department ", doctors);
        // setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // get all the patients by department name
  const getPatientsByDepartment = async () => {
    try {
      const res = await axios.get(
        `/department/getpatientsbydepartment/${selectedDepartment}`
      );
      console.log("+++ Patients by department :", res);
      if (res.status === 200) {
        setPatients(res.data.patients.map((patient) => patient.name));
        console.log("+++ Patients in selected department ", patients);
        // setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!showModal) {
      getAppointmentData();
      getDepartmentData();
    }
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      getDepartmentData();
    }
  }, [showModal]);

  useEffect(() => {
    if (selectedDepartment) {
      getDoctorsByDepartment();
      getPatientsByDepartment();
    }
  }, [selectedDepartment]);

  // Pagination logic
  useEffect(() => {
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment =
      indexOfLastAppointment - appointmentsPerPage;
    const filteredAppointments = appointments.filter((appointment) =>
      appointment.date.includes(selectedDate)
    );
    setDisplayedAppointments(
      filteredAppointments.slice(
        indexOfFirstAppointment,
        indexOfLastAppointment
      )
    );
  }, [currentPage, appointments, selectedDate]);

  const totalPages = Math.ceil(
    appointments.filter((appointment) =>
      appointment.date.includes(selectedDate)
    ).length / appointmentsPerPage
  );

  const editAppointment = (id) => {
    navigate("/editappointment", { state: { appointmentid: id } });
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

  const deleteAppointment = async (id) => {
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
          const res = await axios.delete(`/appointment/delete/${id}`);
          if (res.status === 200) {
            notify(res.data.message);
          }
          getAppointmentData();
        } catch (error) {
          console.log("+++ Error while deleting data: ", error);
        }
        MySwal.fire("Deleted!", "The appointment has been deleted.", "success");
      }
    });
  };

  const handleReset = () => {
    formik.handleReset({});
    setDoctors([]);
    setPatients([]);
  };

  // createAppointment form handling
  const formik = useFormik({
    initialValues: {
      department: selectedDepartment,
      doctor: "",
      patient: "",
      date: "",
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post("/appointment/create", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("+++ Response from appointment api: ", res);
        if (res.status === 200) {
          notify(res.data.message);
          setShowModal(false);
          getAppointmentData();
          formik.resetForm();
        }
      } catch (error) {
        console.error("Error occurred while creating appointment :", error);
        errorToast("Failed to create appointment");
      }
    },
  });

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
                          title="Create appointment"
                          style={{ width: "70px", height: "70px" }}
                        >
                          <i className="fa fa-calendar fa-2x"></i>
                          <br />
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                      <div className="col">
                        <div className="float-right relative z-0">
                          <input
                            className={`form-select ${
                              darkMode ? "bg-gray-600 text-white" : ""
                            }`}
                            type="date"
                            placeholder="Select date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                          {/* <option value="">All departments</option>
                            {departmentName.map((department) => (
                              <option key={department} value={department}>
                                {department}
                              </option>
                            ))} */}
                          {/* </select> */}
                        </div>
                      </div>
                    </div>
                    {showModal && (
                      <>
                        {/* create appointment modal */}
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
                                      <h1>Create Appointment</h1>
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="department">
                                        Department
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <select
                                        className="form-control"
                                        id="department"
                                        name="department"
                                        onChange={(e) => {
                                          formik.handleChange(e);
                                          setSelectedDepartment(e.target.value);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.department}
                                      >
                                        <option value="">
                                          Select department
                                        </option>
                                        {departmentName.map((department) => (
                                          <option
                                            key={department}
                                            value={department}
                                          >
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
                                      <label htmlFor="doctor">
                                        Doctor
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <select
                                        className="form-control"
                                        id="doctor"
                                        name="doctor"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.doctor}
                                      >
                                        <option value="">Select doctor</option>
                                        {doctors.map((doctor) => (
                                          <option key={doctor} value={doctor}>
                                            {doctor}
                                          </option>
                                        ))}
                                      </select>
                                      {formik.touched.doctor &&
                                      formik.errors.doctor ? (
                                        <div className="text-danger">
                                          {formik.errors.doctor}
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="patient">
                                        Patient
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <select
                                        className="form-control"
                                        id="patient"
                                        name="patient"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.patient}
                                      >
                                        <option value="">Select patient</option>
                                        {patients.map((patient) => (
                                          <option key={patient} value={patient}>
                                            {patient}
                                          </option>
                                        ))}
                                      </select>
                                      {formik.touched.patient &&
                                      formik.errors.patient ? (
                                        <div className="text-danger">
                                          {formik.errors.patient}
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="patient">
                                        Date
                                        <span style={{ color: "red" }}>*</span>
                                      </label>
                                      <br />
                                      <input
                                        className={darkMode ? "input-dark" : ""}
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.touched.date &&
                                      formik.errors.date ? (
                                        <div className="text-danger">
                                          {formik.errors.date}
                                        </div>
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
                            <th scope="col">Department</th>
                            <th scope="col">Patient</th>
                            <th scope="col">Doctor</th>
                            <th scope="col">Date</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedAppointments.length > 0 ? (
                            displayedAppointments.map((appointment, index) => (
                              <tr key={appointment._id}>
                                <th scope="row">
                                  {index +
                                    1 +
                                    (currentPage - 1) * appointmentsPerPage}
                                </th>
                                <td>{appointment.department}</td>
                                <td>{appointment.doctor}</td>
                                <td>{appointment.patient}</td>
                                <td>
                                  {dateFormat(
                                    appointment.date,
                                    "ddd mmm dd yyyy"
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-warning m-1"
                                    onClick={() =>
                                      editAppointment(appointment._id)
                                    }
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger m-1"
                                    onClick={() =>
                                      deleteAppointment(appointment._id)
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

                    <div className="p-2">
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

export default ViewAppointments;

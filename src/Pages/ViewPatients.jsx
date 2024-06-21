import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import AddPatientModal from "./AddPatientModal";

const Doctors = ({ notify }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getdata = async () => {
    try {
      const res = await axios.get(`/patient/getdata`);
      console.log("+++ API response", res);

      setPatientData(res.data.data);
      console.log("++++ All patient data :", patientData);
    } catch (error) {
      console.log("+++ Error while fetching data: ", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (!showModal) {
        getdata();
      }
    } else {
      navigate("/");
    }
  }, [isAuthenticated, showModal, navigate]);

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

  const deletePatient = async (id) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      const res = await axios.delete(`/patient/delete/${id}`);
      notify("Data deleted successfully");
      console.log("+++ API response", res);
      getdata();
    }
  };

  const editPatient = (id) => {
    navigate("/editpatient", { state: { doctorid: id } });
  };

  //modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
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

  return (
    <>
      {isAuthenticated ? (
        <>
          <div className="flex bg-gray-200">
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
                      title="Add patient"
                      style={{ width: "70px", height: "70px" }}
                    >
                      <i className="fa fa-user fa-2x"></i>
                    </button>
                  </div>
                  <div className="col">
                    <div className="float-right relative z-0">
                      <select
                        className="form-select"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        <option value="">Patients by department</option>
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
                    <div className="modal-backdrop">
                      <div className="modal-container">
                        <AddPatientModal
                          handleClose={handleClose}
                          setShowModal={setShowModal}
                        />
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
                              {index + 1 + (currentPage - 1) * patientsPerPage}
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
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-danger text-center">
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-2">
                  <ResponsivePagination
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
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default Doctors;

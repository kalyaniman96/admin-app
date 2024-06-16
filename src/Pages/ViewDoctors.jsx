import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import AddDoctorModal from "./AddDoctorModal";

const Doctors = ({ notify }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const [doctorData, setdoctorData] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getdata = async () => {
    try {
      const res = await axios.get(`/doctor/getdata`);
      console.log("+++ API response", res);

      setdoctorData(res.data.data);
      console.log("++++ All doctor data :", doctorData);
    } catch (error) {
      console.log("+++ Error while fetching data: ", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getdata();
    } else {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const filteredDoctors = doctorData.filter((doctor) =>
      doctor.specialization
        .toLowerCase()
        .includes(selectedSpecialization.toLowerCase())
    );
    setDisplayedDoctors(
      filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
    );
  }, [currentPage, doctorData, selectedSpecialization]);

  const totalPages = Math.ceil(
    doctorData.filter((doctor) =>
      doctor.specialization
        .toLowerCase()
        .includes(selectedSpecialization.toLowerCase())
    ).length / doctorsPerPage
  );

  const deleteDoctor = async (id) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      const res = await axios.delete(`/doctor/delete/${id}`);
      notify("Data deleted successfully");
      console.log("+++ API response", res);
      getdata();
    }
  };

  const editDoctor = (id) => {
    navigate("/editdoctor", { state: { doctorid: id } });
  };

  //modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    getdata();
  };

  const specializations = [
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Surgery",
    "Dermatologist",
    "Gastroenterologist",
    "Orthopedist",
  ];

  return (
    <>
      {isAuthenticated ? (
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
                    </button>
                  </div>
                  <div className="col">
                    <div className="float-right relative z-0">
                      <select
                        className="form-select"
                        value={selectedSpecialization}
                        onChange={(e) =>
                          setSelectedSpecialization(e.target.value)
                        }
                      >
                        <option value="">All Specializations</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
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
                        <AddDoctorModal handleClose={handleClose} />
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
                        <th scope="col">Specialization</th>
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
                              {index + 1 + (currentPage - 1) * doctorsPerPage}
                            </th>
                            <td>{doctor.name}</td>
                            <td>{doctor.email}</td>
                            <td>{doctor.phone}</td>
                            <td>{doctor.gender}</td>
                            <td>{doctor.specialization}</td>
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
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteDoctor(doctor._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
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

                <div className="container-fluid">
                  <div className="row d-flex justify-content-between">
                    <div className="col-auto">
                      <button onClick={() => navigate("/dashboard")}>
                        <i className="fa fa-lg fa-solid fa-arrow-left"> Home</i>
                      </button>
                    </div>
                  </div>
                </div>
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

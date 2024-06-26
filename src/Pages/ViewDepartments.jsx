import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import AddDepartmentModal from "./AddDepartmentModal";

const ViewDepartments = ({ notify }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 5;
  const [departmentData, setDepartmentData] = useState([]);
  const [displayedDepartments, setDisplayedDepartments] = useState([]);
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const getdata = async () => {
    try {
      const res = await axios.get(`/department/getdata`);
      console.log("+++ API response", res);

      setDepartmentData(res.data.data);
      console.log("++++ All department data :", departmentData);
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
    const indexOfLastDepartment = currentPage * departmentsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
    setDisplayedDepartments(
      departmentData.slice(indexOfFirstDepartment, indexOfLastDepartment)
    );
  }, [currentPage, departmentData]);

  const totalPages = Math.ceil(departmentData.length / departmentsPerPage);

  const deleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      const res = await axios.delete(`/department/delete/${id}`);
      notify("Data deleted successfully");
      console.log("+++ API response", res);
      getdata();
    }
  };

  const editDepartment = (id) => {
    navigate("/editdepartment", { state: { departmentid: id } });
  };

  //modal handling
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

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
                      title="Add department"
                      style={{ width: "70px", height: "70px" }}
                    >
                      <i className="fa fa-building fa-2x"></i>
                    </button>
                  </div>
                  <div className="col"></div>
                </div>
                {showModal && (
                  <>
                    <div className="modal-backdrop">
                      <div className="modal-container">
                        <AddDepartmentModal
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
                            <td>{department.doctors}</td>
                            <td>{department.patients}</td>
                            <td>{department.description}</td>
                            <td>
                              {dateFormat(department.createdAt, "dd/mm/yyyy")}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning m-1"
                                onClick={() => editDepartment(department._id)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>

                              <button
                                className="btn btn-sm btn-danger m-1"
                                onClick={() => deleteDepartment(department._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-danger text-center">
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

export default ViewDepartments;

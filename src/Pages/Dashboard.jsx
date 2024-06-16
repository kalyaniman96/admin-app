import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [doctorsCount, setDoctorsCount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const id = localStorage.getItem("user ID");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();
  const navigate = useNavigate();
  const totalDoctors = location.state?.totalDoctors;
  console.log(totalDoctors);

  const getData = async () => {
    const res = await axios.get(`admin/getdata/${id}`);
    console.log("+++ API response", res.data);
    setUserData(res.data.userData);
    setDoctorsCount(res.data.totalDoctors);
    if (res.data) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const appointmentsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Appointments",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81, 56, 55],
      },
    ],
  };

  const departmentData = {
    labels: [
      "Cardiology",
      "Neurology",
      "Pediatric",
      "Surgery",
      "Dermatology",
      "Gastroenterology",
      "Orthopedic",
    ],
    datasets: [
      {
        label: "Departments",
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF5733",
          "#C70039",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF5733",
          "#C70039",
        ],
        data: [300, 50, 100, 75, 200],
      },
    ],
  };

  return (
    <>
      {isAuthenticated ? (
        <div>
          {isLoading ? (
            <div>
              <p>Loading...</p>
            </div>
          ) : (
            <div>
              <div className="flex bg-gray-200">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
                  <div className="flex-1 z-0 p-6 bg-gray-100">
                    <div className="container flex-auto">
                      {/* 1st row */}
                      <div className="row flex-auto mb-4">
                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter primary flex-auto">
                            <i className="fa fa-solid fa-stethoscope"></i>
                            <span className="count-numbers">
                              {doctorsCount}
                            </span>
                            <span className="count-name">Doctors</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter info flex-auto">
                            <i className="fa fa-solid fa-users"></i>
                            <span className="count-numbers">35</span>
                            <span className="count-name">Patients</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter success flex-auto">
                            <i className="fa fa-database"></i>
                            <span className="count-numbers">6875</span>
                            <span className="count-name">Data</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter danger flex-auto">
                            <i className="fa fa-ticket"></i>
                            <span className="count-numbers">599</span>
                            <span className="count-name">Users</span>
                          </div>
                        </div>
                      </div>

                      {/* 2nd row */}
                      <div className="row flex-auto mb-4">
                        <div className="col-md-6 flex-auto">
                          <div className="card flex-auto">
                            <div className="card-header">
                              Appointments Over Time
                            </div>
                            <div className="card-body">
                              <Bar
                                data={appointmentsData}
                                options={{
                                  title: {
                                    display: true,
                                    text: "Number of Appointments per Month",
                                    fontSize: 20,
                                  },
                                  legend: {
                                    display: true,
                                    position: "right",
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 flex-auto">
                          <div className="card flex-auto">
                            <div className="card-header">
                              Patients by Department
                            </div>
                            <div className="card-body">
                              <Pie
                                data={departmentData}
                                options={{
                                  title: {
                                    display: true,
                                    text: "Patients Distribution by Department",
                                    fontSize: 20,
                                  },
                                  legend: {
                                    display: true,
                                    position: "right",
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3rd row */}
                      <div className="row flex-auto">
                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter warning flex-auto">
                            <i className="fa fa-bed"></i>
                            <span className="count-numbers">120</span>
                            <span className="count-name">Beds Occupied</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter primary flex-auto">
                            <i className="fa fa-calendar-check"></i>
                            <span className="count-numbers">75</span>
                            <span className="count-name">
                              Appointments Today
                            </span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter info flex-auto">
                            <i className="fa fa-procedures"></i>
                            <span className="count-numbers">25</span>
                            <span className="count-name">Surgeries Today</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter danger flex-auto">
                            <i className="fa fa-user-md"></i>
                            <span className="count-numbers">50</span>
                            <span className="count-name">New Patients</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default Dashboard;

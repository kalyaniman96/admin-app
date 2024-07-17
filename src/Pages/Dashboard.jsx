import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Loader from "../Components/Loader";

const Dashboard = ({ darkMode, setDarkMode }) => {
  const [userData, setUserData] = useState({});
  const [doctorsCount, setDoctorsCount] = useState();
  const [patientsData, setPatientsData] = useState();
  const [departmentsCount, setDepartmentsCount] = useState();
  const [cardiologyPatients, setCardiologyPatients] = useState([]);
  const [neurologyPatients, setNeurologyPatients] = useState([]);
  const [pediatricsPatients, setPediatricsPatients] = useState([]);
  const [gynecologyPatients, setGynecologyPatients] = useState([]);
  const [dermatologyPatients, setDermatologyPatients] = useState([]);
  const [gastroenterologyPatients, setGastroenterologyPatients] = useState([]);
  const [orthopedicsPatients, setOrthopedicsPatients] = useState([]);
  const [surgeryPatients, setSurgeryPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const id = localStorage.getItem("user ID");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();
  console.log("Dark mode is ", darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const getData = async () => {
    const res = await axios.get(`admin/getdata/${id}`);
    console.log("+++ API response", res.data);
    setUserData(res.data.userData);
    setDoctorsCount(res.data.totalDoctors);
    setPatientsData(res.data.allPatients);
    setDepartmentsCount(res.data.totalDepartments);
    setCardiologyPatients(
      res.data.allPatients.filter((item) => item.department === "Cardiology")
    );
    setNeurologyPatients(
      res.data.allPatients.filter((item) => item.department === "Neurology")
    );
    setPediatricsPatients(
      res.data.allPatients.filter((item) => item.department === "Pediatrics")
    );
    setGynecologyPatients(
      res.data.allPatients.filter((item) => item.department === "Gynecology")
    );
    setDermatologyPatients(
      res.data.allPatients.filter((item) => item.department === "Dermatology")
    );
    setGastroenterologyPatients(
      res.data.allPatients.filter(
        (item) => item.department === "Gastroenterology"
      )
    );
    setOrthopedicsPatients(
      res.data.allPatients.filter((item) => item.department === "Orthopedics")
    );
    setSurgeryPatients(
      res.data.allPatients.filter((item) => item.department === "Surgery")
    );

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
      "Pediatrics",
      "Gynecology",
      "Dermatology",
      "Gastroenterology",
      "Orthopedics",
      "Surgery",
    ],
    datasets: [
      {
        label: "patients",
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#29599B",
          "#33FF3C",
          "#208325",
          "#FFCE56",
          "#FF5733",
          "#C70039",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#29599B",
          "#33FF3C",
          "#208325",
          "#FFCE56",
          "#FF5733",
          "#C70039",
        ],

        data: [
          cardiologyPatients.length,
          neurologyPatients.length,
          pediatricsPatients.length,
          gynecologyPatients.length,
          dermatologyPatients.length,
          gastroenterologyPatients.length,
          orthopedicsPatients.length,
          surgeryPatients.length,
        ],
      },
    ],
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
            <div className={darkMode ? "dark-mode" : ""}>
              <div className="body flex bg-gray-200">
                <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="flex-1 flex flex-col">
                  <Navbar darkMode={darkMode} />
                  <div className="body flex-1 z-0 p-6 bg-gray-100 ">
                    <div className="container flex-auto">
                      {/* 1st row */}
                      <div className="row flex-auto mb-4">
                        <div className="col-md-3 flex-auto">
                          <div
                            className="card card-counter primary flex-auto cursor-pointer"
                            onClick={() => navigate("/viewdoctors")}
                          >
                            <i className="fa fa-user-md"></i>
                            <span className="count-numbers">
                              {doctorsCount}
                            </span>
                            <span className="count-name">Doctors</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div
                            className="card card-counter info flex-auto cursor-pointer"
                            onClick={() => navigate("/viewpatients")}
                          >
                            <i className="fa fa-users"></i>
                            <span className="count-numbers">
                              {patientsData.length}
                            </span>
                            <span className="count-name">Patients</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div
                            className="card card-counter success flex-auto cursor-pointer"
                            onClick={() => navigate("/viewdepartments")}
                          >
                            <i className="fa fa-building-o"></i>
                            <span className="count-numbers">
                              {departmentsCount}
                            </span>
                            <span className="count-name">Departments</span>
                          </div>
                        </div>

                        <div className="col-md-3 flex-auto">
                          <div className="card card-counter danger flex-auto">
                            <i className="fa fa-calendar"></i>
                            <span className="count-numbers">75</span>
                            <span className="count-name">Appointments</span>
                          </div>
                        </div>
                      </div>

                      {/* 2nd row */}
                      <div className="row flex-auto mb-4">
                        <div className="col-md-6 flex-auto">
                          <div className="card flex-auto h-full">
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
                                  maintainAspectRatio: false,
                                  responsive: true,
                                }}
                                height={500}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 flex-auto">
                          <div className="card flex-auto h-full ">
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
                                  // maintainAspectRatio: false,
                                  responsive: true,
                                }}
                                // height={500}
                              />
                            </div>
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

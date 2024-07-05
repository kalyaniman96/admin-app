import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import ViewDoctors from "./Pages/ViewDoctors";
import EditDoctor from "./Pages/EditDoctor";
import ViewPatients from "./Pages/ViewPatients";
import EditPatient from "./Pages/EditPatient";
import ViewDepartments from "./Pages/ViewDepartments";
import DoctorsByDepartment from "./Pages/DoctorsByDepartment";
import PatientsByDepartment from "./Pages/PatientsByDepartment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const notify = (message) =>
    toast.success(message, {
      //Using Toast Emitter for styling configurations
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  // Define toast.error function
  const errorToast = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  return (
    <div className="App">
      <Router>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={<Login notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route
            path="/dashboard"
            element={<Dashboard notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route
            path="/forgotpassword"
            element={<ForgotPassword notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route
            path="/resetpassword"
            element={<ResetPassword notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route
            path="/viewdoctors"
            element={<ViewDoctors notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route
            path="/doctorsbydepartment"
            element={
              <DoctorsByDepartment notify={notify} errorToast={errorToast} />
            }
          ></Route>
          <Route
            path="/editdoctor"
            element={<EditDoctor notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route
            path="/viewpatients"
            element={<ViewPatients notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route
            path="/patientsbydepartment"
            element={
              <PatientsByDepartment notify={notify} errorToast={errorToast} />
            }
          ></Route>
          <Route
            path="/editpatient"
            element={<EditPatient notify={notify} errorToast={errorToast} />}
          ></Route>
          <Route
            path="/viewdepartments"
            element={
              <ViewDepartments notify={notify} errorToast={errorToast} />
            }
          ></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

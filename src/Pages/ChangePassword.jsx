import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { X } from "lucide-react";
import changePasswordSchema from "../Schemas/ChangePasswordSchema";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = ({ handleClose }) => {
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
  const [togglePassword, setTogglePassword] = useState(true);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(true);
  const id = localStorage.getItem("user ID");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: changePasswordSchema,
      onSubmit: (values, action) => {
        handlePasswordChange(values);
        action.resetForm();
      },
    });

  const handlePasswordChange = async (userData) => {
    try {
      let res = await axios.post(`/admin/changepassword/${id}`, userData);
      console.log("+++ API response", res);
      if (res.status === 200) {
        navigate("/adminpanel");
        notify(res.data.message);
      }
    } catch (error) {
      console.log("+++ Error fetching data:", error);
      errorToast(error.response.data.message);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div className="container-fluid fixed inset-0 bg-slate-400 bg-opacity-30 backdrop-blur-sm">
          <ToastContainer />
          <div className="row justify-content-center">
            <div className="col-md-4 mt-10">
              <button className="float-right" onClick={handleClose}>
                <X size={30} />
              </button>
              <form
                onSubmit={handleSubmit}
                className="shadow p-3 m-5  bg-white rounded"
              >
                <div className="mb-3">
                  <h1
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Change Password
                  </h1>
                </div>
                <div className="mb-3">
                  <input
                    name="password"
                    className={`form-control ${
                      errors.password && touched.password && "is-invalid"
                    }`}
                    type={togglePassword ? "password" : "text"}
                    placeholder="New Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span
                    toggle="#password-field"
                    className={
                      togglePassword
                        ? "fa fa-fw fa-eye-slash field-icon toggle-password"
                        : "fa fa-fw fa-eye field-icon toggle-password"
                    }
                    style={{ paddingRight: "5px" }}
                    onClick={() => setTogglePassword(!togglePassword)}
                  ></span>
                  {errors.password && touched.password ? (
                    <p className="invalid-feedback">{errors.password}</p>
                  ) : null}
                </div>
                <div className="mb-3">
                  <input
                    name="confirmPassword"
                    className={`form-control ${
                      errors.confirmPassword &&
                      touched.confirmPassword &&
                      "is-invalid"
                    }`}
                    type={toggleConfirmPassword ? "password" : "text"}
                    placeholder="Confirm password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span
                    toggle="#password-field"
                    className={
                      toggleConfirmPassword
                        ? "fa fa-fw fa-eye-slash field-icon toggle-password"
                        : "fa fa-fw fa-eye field-icon toggle-password"
                    }
                    style={{ paddingRight: "5px" }}
                    onClick={() =>
                      setToggleConfirmPassword(!toggleConfirmPassword)
                    }
                  ></span>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <p className="invalid-feedback">{errors.confirmPassword}</p>
                  ) : null}
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    value="submit"
                  >
                    Update password
                  </button>
                </div>
                <div>
                  <Link to="/adminpanel">
                    <i class="fa fa-solid fa-arrow-left"> Back</i>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </div>
  );
};

export default ChangePassword;

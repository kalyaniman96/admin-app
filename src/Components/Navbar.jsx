import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { X } from "lucide-react";
import changePasswordSchema from "../Schemas/ChangePasswordSchema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// style component
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Navbar = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [togglePassword, setTogglePassword] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(true);
  const id = localStorage.getItem("user ID");
  const navigate = useNavigate();

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

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

  function openModal() {
    setIsOpen(true);
    setDropdownOpen(false);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
        setIsOpen(false);
        navigate("/dashboard");
        notify(res.data.message);
      }
    } catch (error) {
      console.log("+++ Error fetching data:", error);
      errorToast(error.response.data.message);
    }
  };

  return (
    <>
      <div className=" bg-white shadow p-4 flex z-10 justify-between items-center">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <div className="relative ">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative z-50 block p-2 bg-gray-800 text-white rounded focus:outline-none"
          >
            {dropdownOpen ? (
              <i class="fa fa-solid fa-angle-up" style={{ color: "#63E6BE" }}>
                &nbsp; Admin
              </i>
            ) : (
              <i class="fa fa-solid fa-angle-down" style={{ color: "#63E6BE" }}>
                &nbsp; Admin
              </i>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-800 rounded shadow-xl">
              <Link
                to="/profile"
                className="block px-4 py-2 text-green-300 hover:bg-gray-700"
              >
                My profile
              </Link>
              <button
                className="btn block px-4 py-2 text-green-300 hover:bg-gray-700"
                onClick={openModal}
              >
                Change Password
              </button>

              <hr style={{ color: "white" }} />
              <div className="block px-4 py-2 text-green-300 hover:bg-gray-700">
                <Logout />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Change password modal */}
      <div className="flex z-20">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button onClick={closeModal} className="change_password_close">
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
                onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
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
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Navbar;

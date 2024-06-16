import React, { useState } from "react";
import { useNavigate, link, Link } from "react-router-dom";
import { useFormik } from "formik";
import loginSchema from "../Schemas/LoginSchema";
import axios from "axios";

const Login = ({ notify, errorToast }) => {
  const [togglePassword, setTogglePassword] = useState(true);
  //   console.log(togglePassword);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: (values, action) => {
        loginWithRedirect(values);
        action.resetForm();
      },
    });

  const loginWithRedirect = async (loginCredentials) => {
    try {
      let res = await axios.post("/admin/login", loginCredentials);
      console.log("+++ API response", res);
      if (res.status === 200) {
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user ID", res.data.logindata._id);
        // const id = localStorage.getItem("user ID");
        navigate("/dashboard", {
          state: {
            userId: res.data.logindata._id,
            totalDoctors: res.data.totalDoctors,
          },
        });
        notify(res.data.message);
      }
    } catch (error) {
      console.log("+++ Error fetching data:", error);

      errorToast(error.response.data.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form
            onSubmit={handleSubmit}
            className="shadow p-3 mt-5 mb-5 bg-white rounded"
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
                Admin login
              </h1>
            </div>
            <div className="mb-3">
              <input
                name="email"
                className={`form-control ${
                  errors.email && touched.email && "is-invalid"
                }`}
                type="text"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? (
                <p className="invalid-feedback">{errors.email}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <input
                name="password"
                className={`form-control ${
                  errors.password && touched.password && "is-invalid"
                }`}
                type={togglePassword ? "password" : "text"}
                placeholder="Password"
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
              <button
                type="submit"
                className="btn btn-primary w-100"
                value="submit"
              >
                Login
              </button>
            </div>
            <div className="mb-3">
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link
                  className="link"
                  to="/forgotpassword"
                  style={{ color: "blue" }}
                >
                  Forgot password
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

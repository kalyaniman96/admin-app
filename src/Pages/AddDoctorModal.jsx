import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { X } from "lucide-react";
import doctorSchema from "../Schemas/DoctorSchema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDoctorModal = ({ handleClose, setShowModal }) => {
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

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    gender: "",
    qualification: "",
    experience: "",
    hospitalAffiliation: "",
    licenseNumber: "",
    address: "",
  });

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { errors, touched, handleBlur, handleChange, handleSubmit, resetForm } =
    useFormik({
      initialValues: formValues,
      validationSchema: doctorSchema,
      onSubmit: (values) => {
        handleAddDoctor(values);
        setShowModal(false);
      },
    });

  const handleAddDoctor = async (userdata) => {
    try {
      console.log("Form Values:", userdata); // Debug: log form values

      const res = await axios.post("/doctor/create", userdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API response", res);

      if (res.status === 200) {
        notify("New doctor added successfully");
        resetForm();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      errorToast("Failed to add user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    handleChange(e);
  };

  return (
    <div className="container-fluid fixed inset-0 bg-slate-400 bg-opacity-30 backdrop-blur-sm">
      <ToastContainer />
      <div
        className="row justify-content-center"
        // style={{
        //   maxHeight: "700px",
        //   overflow: "auto",
        // }}
      >
        <div className="col-md-4 mt-10">
          <button className="float-right" onClick={handleClose}>
            <X size={30} />
          </button>
          <form
            onSubmit={handleSubmit}
            className="shadow p-3 mt-5 mb-5 bg-white rounded"
            style={{
              maxHeight: "550px",
              overflow: "auto",
            }}
          >
            <div className="card-title text-center font-bold">
              <h1>Add Doctor</h1>
            </div>
            <div className="mb-3">
              <label htmlFor="name">Name*</label>
              <input
                name="name"
                className={`form-control ${
                  errors.name && touched.name && "is-invalid"
                }`}
                type="text"
                placeholder="Name"
                value={formValues.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.name && touched.name ? (
                <p className="invalid-feedback">{errors.name}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email*</label>
              <input
                name="email"
                className={`form-control ${
                  errors.email && touched.email && "is-invalid"
                }`}
                type="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? (
                <p className="invalid-feedback">{errors.email}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="phone">Phone*</label>
              <input
                name="phone"
                className={`form-control ${
                  errors.phone && touched.phone && "is-invalid"
                }`}
                type="text"
                placeholder="Phone"
                value={formValues.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.phone && touched.phone ? (
                <p className="invalid-feedback">{errors.phone}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="department">Department*</label>
              <input
                name="department"
                className={`form-control ${
                  errors.department && touched.department && "is-invalid"
                }`}
                type="text"
                placeholder="department"
                value={formValues.department}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.department && touched.department ? (
                <p className="invalid-feedback">{errors.department}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="gender">Gender</label>
              <input
                name="gender"
                className={`form-control ${
                  errors.gender && touched.gender && "is-invalid"
                }`}
                type="text"
                placeholder="Gender"
                value={formValues.gender}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.gender && touched.gender ? (
                <p className="invalid-feedback">{errors.gender}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="qualification">Qualification*</label>
              <input
                name="qualification"
                className={`form-control ${
                  errors.qualification && touched.qualification && "is-invalid"
                }`}
                type="text"
                placeholder="Qualification"
                value={formValues.qualification}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.qualification && touched.qualification ? (
                <p className="invalid-feedback">{errors.qualification}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="experience">Experience*</label>
              <input
                name="experience"
                className={`form-control ${
                  errors.experience && touched.experience && "is-invalid"
                }`}
                type="text"
                placeholder="Experience"
                value={formValues.experience}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.experience && touched.experience ? (
                <p className="invalid-feedback">{errors.experience}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="hospitalAffiliation">Hospital Affiliation</label>
              <input
                name="hospitalAffiliation"
                className={`form-control ${
                  errors.hospitalAffiliation &&
                  touched.hospitalAffiliation &&
                  "is-invalid"
                }`}
                type="text"
                placeholder="Hospital affiliation"
                value={formValues.hospitalAffiliation}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.hospitalAffiliation && touched.hospitalAffiliation ? (
                <p className="invalid-feedback">{errors.hospitalAffiliation}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="licenseNumber">License Number*</label>
              <input
                name="licenseNumber"
                className={`form-control ${
                  errors.licenseNumber && touched.licenseNumber && "is-invalid"
                }`}
                type="text"
                placeholder="License number"
                value={formValues.licenseNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.licenseNumber && touched.licenseNumber ? (
                <p className="invalid-feedback">{errors.licenseNumber}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="address">Address*</label>
              <input
                name="address"
                className={`form-control ${
                  errors.address && touched.address && "is-invalid"
                }`}
                type="text"
                placeholder="Address"
                value={formValues.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.address && touched.address ? (
                <p className="invalid-feedback">{errors.address}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { X } from "lucide-react";
import patientSchema from "../Schemas/PatientSchema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPatientModal = ({ handleClose, setShowModal }) => {
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
    department: "",
    gender: "",
    medicalHistory: "",
    currentMedications: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContactRelation: "",
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
      validationSchema: patientSchema,
      onSubmit: (values) => {
        handleAddPatient(values);
        setShowModal(false);
      },
    });

  const handleAddPatient = async (userdata) => {
    try {
      console.log("Form Values:", userdata); // Debug: log form values

      const res = await axios.post("/patient/create", userdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API response", res);

      if (res.status === 200) {
        notify("New patient added successfully");
        resetForm();
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      errorToast("Failed to add new patient");
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
      <div className="row justify-content-center">
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
              <h1>Add Patient</h1>
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
              <label htmlFor="medicalHistory">Medical history*</label>
              <input
                name="medicalHistory"
                className={`form-control ${
                  errors.medicalHistory &&
                  touched.medicalHistory &&
                  "is-invalid"
                }`}
                type="text"
                placeholder="Medical history"
                value={formValues.medicalHistory}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.medicalHistory && touched.medicalHistory ? (
                <p className="invalid-feedback">{errors.medicalHistory}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="currentMedications">Current Medications*</label>
              <input
                name="currentMedications"
                className={`form-control ${
                  errors.currentMedications &&
                  touched.currentMedications &&
                  "is-invalid"
                }`}
                type="text"
                placeholder="Current Medications"
                value={formValues.currentMedications}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.currentMedications && touched.currentMedications ? (
                <p className="invalid-feedback">{errors.currentMedications}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="emergencyContactName">
                Emergency Contact Name
              </label>
              <input
                name="emergencyContactName"
                className={`form-control ${
                  errors.emergencyContactName &&
                  touched.emergencyContactName &&
                  "is-invalid"
                }`}
                type="text"
                placeholder="Emergency Contact Name"
                value={formValues.emergencyContactName}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.emergencyContactName && touched.emergencyContactName ? (
                <p className="invalid-feedback">
                  {errors.emergencyContactName}
                </p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="emergencyContactPhone">
                Emergency contact number*
              </label>
              <input
                name="emergencyContactNumber"
                className={`form-control ${
                  errors.emergencyContactNumber &&
                  touched.emergencyContactNumber &&
                  "is-invalid"
                }`}
                type="text"
                placeholder="Emergency contact number"
                value={formValues.emergencyContactNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.emergencyContactNumber &&
              touched.emergencyContactNumber ? (
                <p className="invalid-feedback">
                  {errors.emergencyContactNumber}
                </p>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="emergencyContactRelation">
                Emergency contact relation*
              </label>
              <input
                name="emergencyContactRelation"
                className={`form-control ${
                  errors.emergencyContactRelation &&
                  touched.emergencyContactRelation &&
                  "is-invalid"
                }`}
                type="text"
                placeholder="Emergency contact relation"
                value={formValues.emergencyContactRelation}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.emergencyContactRelation &&
              touched.emergencyContactRelation ? (
                <p className="invalid-feedback">
                  {errors.emergencyContactRelation}
                </p>
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

export default AddPatientModal;

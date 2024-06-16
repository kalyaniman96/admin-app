import { Heading1 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return <div>{isAuthenticated ? <h1>Patient</h1> : navigate("/")}</div>;
};

export default Patients;

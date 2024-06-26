import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/admin/forgotpassword", {
        email: email,
      });
      setMessage(response.data.message);
      console.log("+++ API response: ", response);
      navigate("/resetpassword", { state: { email: email } });
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="card-title text-center font-bold">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="form-control"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block mt-3"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="row d-flex justify-content-between mt-1">
          <div className="col-auto">
            <button onClick={() => navigate("/")}>
              <i className="fa fa-sm fa-arrow-left"> Login</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();
  const emailAddress = "imankalyanh@gmail.com";

  return (
    <div>
      <footer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
          background: darkMode ? "#333" : "#f1f1f1",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
          <Link
            to="https://www.linkedin.com/in/iman-kalyan-halder-266778224"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: darkMode ? "#fff" : "#000" }}
            title="LinkedIn"
          >
            <i className="bi bi-linkedin fs-4"></i>
          </Link>
          <Link
            to={`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`}
            target="_blank"
            style={{ color: darkMode ? "#fff" : "#000" }}
            title="Email"
          >
            <i className="bi bi-envelope-at fs-4"></i>
          </Link>
          <Link
            to="https://wa.me/7908200746"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: darkMode ? "#fff" : "#000" }}
            title="WhatsApp"
          >
            <i className="bi bi-whatsapp fs-4"></i>
          </Link>
        </div>
        <div>&copy; {currentYear} Iman Kalyan Halder</div>
      </footer>
    </div>
  );
};

export default Footer;

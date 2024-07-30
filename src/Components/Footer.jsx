import React from "react";

const Footer = ({ darkMode }) => {
  return (
    <div>
      <footer
        style={{
          display: "flex",
          // position: "relative",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          background: darkMode ? "#333" : "#f1f1f1",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        &copy; {new Date().getFullYear()} Iman Kalyan Halder
      </footer>
    </div>
  );
};

export default Footer;

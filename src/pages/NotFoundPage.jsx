import React from "react";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/home">Go to Home Page</Link>
    </div>
  );
};

export default NotFoundPage;

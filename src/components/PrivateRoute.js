import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [], userRole }) => {
  if (!userRole) {
    return <div>Loading...</div>; // waiting for role fetch
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect unauthorized user
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;

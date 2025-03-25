import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../App.css";

function ProtectedRoutes() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status

  useEffect(() => {
    const token = Cookies.get("authToken"); // Retrieve the token

    if (!token) {
      navigate("/user/login"); // Redirect if token is missing
    } else {
      setIsAuthenticated(true); // Set authentication state to true if token exists
    }
  }, [navigate]);

  if (!isAuthenticated) return null; // Prevent rendering protected content until check is done

  return <Outlet />;
}

export default ProtectedRoutes;

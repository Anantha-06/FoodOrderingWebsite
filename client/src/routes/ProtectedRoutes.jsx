import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../App.css";

function ProtectedRoutes() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = Cookies.get("authToken"); 

    if (!token) {
      navigate("/user/login"); 
    } else {
      setIsAuthenticated(true); 
    }
  }, [navigate]);

  if (!isAuthenticated) return null; 

  return <Outlet />;
}

export default ProtectedRoutes;

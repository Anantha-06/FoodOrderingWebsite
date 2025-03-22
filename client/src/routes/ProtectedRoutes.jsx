import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import "../App.css";

function ProtectedRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <Outlet />;
}

export default ProtectedRoutes;

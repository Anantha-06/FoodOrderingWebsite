import React, { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import RestaurantProfile from "../../Components/User/Restaurant/RestaurantProfile.jsx";
import UpdateRestaurant from "../../Components/User/Restaurant/UpdateRestaurant.jsx";
import CreateMenu from "../../Components/User/Restaurant/CreateMenu.jsx";
import ManageMenu from "../../Components/User/Restaurant/ManageMenu.jsx";
import DeleteMenu from "../../Components/User/Restaurant/DeleteMenu.jsx";
import RestaurantOrders from "../../Components/User/Restaurant/RestaurantOrders.jsx";
import "../../PageStyle/RestaurantDashboard.css";

function RestaurantDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("restaurantToken"); // Check if token exists
    if (!token) {
      navigate("/restaurant/login"); // Redirect to login if no token
    }
  }, [navigate]);

  const handleSignOut = () => {
    Cookies.remove("restaurantToken"); // Remove the token
    alert("Sign Out Successful!");
    navigate("/restaurant/login"); // Redirect to login page
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="restaurant-dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4 gap-5">
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png"
          alt="Company Logo"
          className="img-fluid"
          style={{ maxWidth: "150px", height: "auto" }}
        />
        <button className="bg-warning border-1 rounded-2 px-4" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <Tabs defaultActiveKey="RestaurantProfile" id="restaurant-dashboard-tabs">
        <Tab eventKey="RestaurantProfile" title="Restaurant Profile">
          <RestaurantProfile />
        </Tab>
        <Tab eventKey="RestaurantOrders" title="Restaurant Orders">
          <RestaurantOrders />
        </Tab>
        <Tab eventKey="ManageMenu" title="Manage Menu">
          <ManageMenu />
        </Tab>
        <Tab eventKey="CreateMenu" title="Create Menu">
          <CreateMenu />
        </Tab>
        <Tab eventKey="DeleteMenu" title="Delete Menu">
          <DeleteMenu />
        </Tab>
        <Tab eventKey="UpdateRestaurant" title="Update Restaurant">
          <UpdateRestaurant />
        </Tab>
      </Tabs>
    </div>
  );
}

export default RestaurantDashboard;

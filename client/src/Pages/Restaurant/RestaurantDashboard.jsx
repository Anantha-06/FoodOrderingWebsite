import React, { useEffect } from "react";
import { 
  Tabs, 
  Tab, 
  Button,
  Container,
  Row,
  Col,
  Badge
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FaSignOutAlt,
  FaStore,
  FaUtensils,
  FaPlusCircle,
  FaTrash,
  FaEdit,
  FaClipboardList,
  FaUserCircle
} from "react-icons/fa";

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
    const token = Cookies.get("restaurantToken");
    if (!token) {
      navigate("/restaurant/login");
    }
  }, [navigate]);

  const handleSignOut = () => {
    Cookies.remove("restaurantToken");
    navigate("/");
  };

  return (
    <Container fluid className="p-4 restaurant-dashboard-container">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                alt="Company Logo"
                className="img-fluid me-3"
                style={{ maxWidth: "120px", height: "auto" }}
              />
              <h2 className="mb-0">Restaurant Dashboard</h2>
            </div>
            <Button 
              variant="danger" 
              onClick={handleSignOut}
              className="d-flex align-items-center"
            >
              <FaSignOutAlt className="me-2" />
              Sign Out
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Tabs 
            defaultActiveKey="RestaurantProfile" 
            id="restaurant-dashboard-tabs"
            className="mb-3 custom-tabs"
          >
            <Tab 
              eventKey="RestaurantProfile" 
              title={
                <span>
                  <FaUserCircle className="me-2" />
                  Profile
                </span>
              }
            >
              <div className="p-3 tab-content-wrapper">
                <RestaurantProfile />
              </div>
            </Tab>
            <Tab 
              eventKey="RestaurantOrders" 
              title={
                <span>
                  <FaClipboardList className="me-2" />
                  Orders
                </span>
              }
            >
              <div className="p-3 tab-content-wrapper">
                <RestaurantOrders />
              </div>
            </Tab>
            <Tab 
              eventKey="ManageMenu" 
              title={
                <span>
                  <FaUtensils className="me-2" />
                  Manage Menu
                </span>
              }
            >
              <div className="p-3 tab-content-wrapper">
                <ManageMenu />
              </div>
            </Tab>
            <Tab 
              eventKey="CreateMenu" 
              title={
                <span>
                  <FaPlusCircle className="me-2" />
                  Create Menu
                </span>
              }
            >
              <div className="p-3 tab-content-wrapper">
                <CreateMenu />
              </div>
            </Tab>
            <Tab 
              eventKey="DeleteMenu" 
              title={
                <span>
                  <FaTrash className="me-2" />
                  Delete Menu
                </span>
              }
            >
              <div className="p-3 tab-content-wrapper">
                <DeleteMenu />
              </div>
            </Tab>
            <Tab 
              eventKey="UpdateRestaurant" 
              title={
                <span>
                  <FaEdit className="me-2" />
                  Update Restaurant
                </span>
              }
            >
              <div className="p-3 tab-content-wrapper">
                <UpdateRestaurant />
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default RestaurantDashboard;
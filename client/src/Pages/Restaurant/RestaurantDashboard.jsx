import React, { useEffect } from "react";
import { 
  Tabs, 
  Tab, 
  Button,
  Container,
  Row,
  Col,
  Badge,
  Nav
} from "react-bootstrap";
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
  FaUserCircle,
  FaChartLine
} from "react-icons/fa";
import { motion } from "framer-motion";
import styled from "styled-components";

// Styled Components
const DashboardContainer = styled(Container)`
  max-width: 1800px;
  padding: 2rem;
`;

const Header = styled(Row)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  max-width: 120px;
  height: auto;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CustomTabs = styled(Tabs)`
  .nav-link {
    color: #6c757d;
    font-weight: 500;
    border: none;
    padding: 1rem 1.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      color: #f39c12;
      background: rgba(243, 156, 18, 0.1);
    }
    
    &.active {
      color: #f39c12;
      background: transparent;
      border-bottom: 3px solid #f39c12;
    }
  }
`;

const TabContentWrapper = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-height: 500px;
`;

const LogoutButton = styled(Button)`
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Import your components
import RestaurantProfile from "../../Components/User/Restaurant/RestaurantProfile.jsx";
import UpdateRestaurant from "../../Components/User/Restaurant/UpdateRestaurant.jsx";
import CreateMenu from "../../Components/User/Restaurant/CreateMenu.jsx";
import ManageMenu from "../../Components/User/Restaurant/ManageMenu.jsx";
import DeleteMenu from "../../Components/User/Restaurant/DeleteMenu.jsx";
import RestaurantOrders from "../../Components/User/Restaurant/RestaurantOrders.jsx";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardContainer fluid>
        <Header className="align-items-center">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Logo
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                  alt="Company Logo"
                  className="me-3"
                />
              </motion.div>
              <h2 className="mb-0">Restaurant Dashboard</h2>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <LogoutButton 
              variant="danger" 
              onClick={handleSignOut}
              className="d-inline-flex align-items-center"
            >
              <FaSignOutAlt className="me-2" />
              Sign Out
            </LogoutButton>
          </Col>
        </Header>

        <Row>
          <Col>
            <CustomTabs 
              defaultActiveKey="profile" 
              id="restaurant-dashboard-tabs"
              className="mb-4"
            >
              <Tab
                eventKey="profile"
                title={
                  <span className="d-flex align-items-center">
                    <FaUserCircle className="me-2" />
                    Profile
                  </span>
                }
              >
                <TabContentWrapper>
                  <RestaurantProfile />
                </TabContentWrapper>
              </Tab>
             
              <Tab
                eventKey="orders"
                title={
                  <span className="d-flex align-items-center">
                    <FaClipboardList className="me-2" />
                    Orders
                  </span>
                }
              >
                <TabContentWrapper>
                  <RestaurantOrders />
                </TabContentWrapper>
              </Tab>
              <Tab
                eventKey="manage-menu"
                title={
                  <span className="d-flex align-items-center">
                    <FaUtensils className="me-2" />
                    Manage Menu
                  </span>
                }
              >
                <TabContentWrapper>
                  <ManageMenu />
                </TabContentWrapper>
              </Tab>
              <Tab
                eventKey="create-menu"
                title={
                  <span className="d-flex align-items-center">
                    <FaPlusCircle className="me-2" />
                    Create Menu
                  </span>
                }
              >
                <TabContentWrapper>
                  <CreateMenu />
                </TabContentWrapper>
              </Tab>
              <Tab
                eventKey="Delete Menu"
                title={
                  <span className="d-flex align-items-center">
                    <FaChartLine className="me-2" />
                    Delete Menu
                  </span>
                }
              >
                <TabContentWrapper>
                <DeleteMenu/>
                </TabContentWrapper>
              </Tab>
              <Tab
                eventKey="update"
                title={
                  <span className="d-flex align-items-center">
                    <FaEdit className="me-2" />
                    Update Restaurant
                  </span>
                }
              >
                <TabContentWrapper>
                  <UpdateRestaurant />
                </TabContentWrapper>
              </Tab>
            </CustomTabs>
          </Col>
        </Row>
      </DashboardContainer>
    </motion.div>
  );
}

export default RestaurantDashboard;
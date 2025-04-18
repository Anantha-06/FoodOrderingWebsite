// AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axiosInstance.js";
import Cookies from "js-cookie";
import { FaSignOutAlt } from "react-icons/fa";
import { Container, Row, Col, Button } from "react-bootstrap";
import styled from "styled-components";
import { motion } from "framer-motion";

// Components
import AdminSidebar from "../../Components/User/Admin/AdminSidebar.jsx";
import DashboardView from "../../Components/User/Admin/DashboardView.jsx";
import RestaurantsView from "../../Components/User/Admin/RestaurantsView.jsx";
import UnverifiedView from "../../Components/User/Admin/UnverifiedView.jsx";
import SubscribersView from "../../Components/User/Admin/SubscribersView.jsx";
import TransactionsView from "../../Components/User/Admin/TransactionsView.jsx";
import UsersView from "../../Components/User/Admin/UsersView.jsx";
import CouponView from "../../Components/User/Admin/CouponView.jsx";
import RestaurantDetailsModal from "../../Components/User/Admin/RestaurantDetailsModal.jsx";

// Styled Components
const DashboardContainer = styled(Container)`
  padding: 2rem;
  max-width: 1800px;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("dashboard");
  const [restaurants, setRestaurants] = useState([]);
  const [unverifiedRestaurants, setUnverifiedRestaurants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState({
    dashboard: false,
    restaurants: false,
    unverified: false,
    transactions: false,
    users: false,
    coupon: false,
    subscribers: false,
  });

  useEffect(() => {
    const authTokenAdmin = Cookies.get("authTokenAdmin");
    if (!authTokenAdmin) {
      navigate("/admin/login");
    } else {
      fetchAllData();
    }
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading({
      dashboard: true,
      restaurants: true,
      unverified: true,
      transactions: true,
      users: true,
      subscribers: true,
    });
    try {
      const [restRes, transRes, userRes, subsRes] = await Promise.all([
        axiosInstance.get("/restaurant/all"),
        axiosInstance.get("/payment/transaction"),
        axiosInstance.get("/user/all"),
        axiosInstance.get("/subscribe/all"),
      ]);

      const restaurantList = restRes.data?.restaurant || [];
      setRestaurants(restaurantList);
      setUnverifiedRestaurants(restaurantList.filter((r) => !r.isVerified));
      setTransactions(transRes.data?.data || []);
      setUsers(userRes.data?.users || []);
      setSubscribers(subsRes.data?.subscriptions || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading({
      dashboard: false,
      restaurants: false,
      unverified: false,
      transactions: false,
      users: false,
      subscribers: false,
    });
  };

  const approveRestaurant = async (id) => {
    setLoading((prev) => ({ ...prev, unverified: true }));
    try {
      await axiosInstance.put(`/admin/verify/${id}`);
      const updatedRestaurants = await axiosInstance.get("/restaurant/all");
      const restaurantList = updatedRestaurants.data?.restaurant || [];
      setRestaurants(restaurantList);
      setUnverifiedRestaurants(restaurantList.filter((r) => !r.isVerified));
    } catch (error) {
      console.error("Error approving restaurant:", error);
    }
    setLoading((prev) => ({ ...prev, unverified: false }));
  };

  const deleteRestaurant = async (id) => {
    try {
      await axiosInstance.delete(`/restaurant/delete/${id}`);
      const updatedRestaurants = await axiosInstance.get("/restaurant/all");
      const restaurantList = updatedRestaurants.data?.restaurant || [];
      setRestaurants(restaurantList);
      setUnverifiedRestaurants(restaurantList.filter((r) => !r.isVerified));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/user/delete/${id}`);
      const response = await axiosInstance.get("/user/all");
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSignOut = () => {
    Cookies.remove("authTokenAdmin");
    navigate("/");
  };

  const filtered = (list) =>
    list.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const viewRestaurantDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetails(true);
  };

  return (
    <DashboardContainer fluid>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                  alt="Admin Logo"
                  height="60"
                  className="me-3"
                />
                <h1 className="mb-0">Admin Dashboard</h1>
              </div>
              <Button 
                variant="danger" 
                onClick={handleSignOut}
                className="d-flex align-items-center"
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Sidebar */}
          <Col md={3}>
            <AdminSidebar 
              activeKey={activeKey}
              setActiveKey={setActiveKey}
              restaurantsCount={restaurants.length}
              unverifiedCount={unverifiedRestaurants.length}
              transactionsCount={transactions.length}
              usersCount={users.length}
              subscribersCount={subscribers.length}
            />
          </Col>

          {/* Main Content */}
          <Col md={9}>
            {activeKey !== "dashboard" && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control rounded-pill"
                  style={{ padding: '0.75rem 1.25rem' }}
                />
              </div>
            )}

            {activeKey === "dashboard" && (
              <DashboardView 
                loading={loading.dashboard}
                restaurants={restaurants}
                unverifiedRestaurants={unverifiedRestaurants}
                transactions={transactions}
                users={users}
                subscribers={subscribers}
                viewRestaurantDetails={viewRestaurantDetails}
                setActiveKey={setActiveKey}
              />
            )}

            {activeKey === "restaurants" && (
              <RestaurantsView 
                loading={loading.restaurants}
                restaurants={filtered(restaurants)}
                viewRestaurantDetails={viewRestaurantDetails}
                deleteRestaurant={deleteRestaurant}
              />
            )}

            {activeKey === "unverified" && (
              <UnverifiedView 
                loading={loading.unverified}
                restaurants={filtered(unverifiedRestaurants)}
                viewRestaurantDetails={viewRestaurantDetails}
                approveRestaurant={approveRestaurant}
              />
            )}

            {activeKey === "subscribers" && (
              <SubscribersView 
                subscribers={filtered(subscribers)}
              />
            )}

            {activeKey === "transactions" && (
              <TransactionsView 
                transactions={transactions}
              />
            )}

            {activeKey === "users" && (
              <UsersView 
                users={filtered(users)}
                deleteUser={deleteUser}
              />
            )}

            {activeKey === "coupon" && (
              <CouponView 
                loading={loading.coupon}
              />
            )}
          </Col>
        </Row>

        <RestaurantDetailsModal
          show={showDetails}
          onHide={() => setShowDetails(false)}
          restaurant={selectedRestaurant}
          loading={loading.unverified}
          approveRestaurant={approveRestaurant}
          deleteRestaurant={deleteRestaurant}
        />
      </motion.div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
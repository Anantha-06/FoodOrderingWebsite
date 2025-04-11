import React, { useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  Table,
  Button,
  Form,
  Alert,
  Container,
  Row,
  Col,
  Spinner,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSignOutAlt,
  FaCheck,
  FaTimes,
  FaTrash,
  FaPlus,
  FaSearch,
  FaEnvelope,
} from "react-icons/fa";
import "../../PageStyle/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [unverifiedRestaurants, setUnverifiedRestaurants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
    minOrderVal: "",
    maxDiscValue: "",
    expiryDate: "",
    isAvailable: true,
  });
  const [dateError, setDateError] = useState("");
  const [formError, setFormError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [activeKey, setActiveKey] = useState("restaurants");
  const [loading, setLoading] = useState({
    restaurants: false,
    unverified: false,
    transactions: false,
    users: false,
    coupon: false,
    subscribers: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const authTokenAdmin = Cookies.get("authTokenAdmin");
    if (!authTokenAdmin) {
      navigate("/admin/login");
    } else {
      fetchInitialData();
    }
  }, [navigate]);

  const fetchInitialData = async () => {
    setLoading((prev) => ({
      ...prev,
      restaurants: true,
      transactions: true,
      users: true,
    }));
    try {
      await Promise.all([
        fetchRestaurants(),
        fetchTransactions(),
        fetchUsers(),
      ]);
    } finally {
      setLoading((prev) => ({
        ...prev,
        restaurants: false,
        transactions: false,
        users: false,
      }));
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/all");
      if (Array.isArray(response.data.restaurant)) {
        setRestaurants(response.data.restaurant);
        setUnverifiedRestaurants(
          response.data.restaurant.filter((r) => !r.isVerified)
        );
      }
    } catch (error) {
      setRestaurants([]);
      setUnverifiedRestaurants([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get("/payment/transaction");
      setTransactions(response.data?.data || []);
    } catch (error) {
      setTransactions([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/all");
      setUsers(response.data.users || []);
    } catch (error) {
      setUsers([]);
    }
  };

  const fetchSubscribers = async () => {
    try {
      setLoading((prev) => ({ ...prev, subscribers: true }));
      const response = await axiosInstance.get("/subscribe/all");
      setSubscribers(response.data?.subscriptions || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      setSubscribers([]);
    } finally {
      setLoading((prev) => ({ ...prev, subscribers: false }));
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/user/delete/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const approveRestaurant = async (id) => {
    try {
      setLoading((prev) => ({ ...prev, unverified: true }));
      await axiosInstance.put(`/admin/verify/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error("Error approving restaurant:", error);
    } finally {
      setLoading((prev) => ({ ...prev, unverified: false }));
    }
  };

  const handleCouponChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
    if (e.target.name === "expiryDate") {
      validateDate(e.target.value);
    }
  };

  const validateDate = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    if (inputDate < today) {
      setDateError("Expiry date must be in the future.");
    } else {
      setDateError("");
    }
  };

  const createCoupon = async () => {
    if (
      !coupon.code ||
      !coupon.discountPercentage ||
      !coupon.minOrderVal ||
      !coupon.maxDiscValue ||
      !coupon.expiryDate
    ) {
      setFormError("All fields are required.");
      return;
    }
    if (dateError) return;

    try {
      setLoading((prev) => ({ ...prev, coupon: true }));
      await axiosInstance.post("/coupon/create", coupon);
      setCoupon({
        code: "",
        discountPercentage: "",
        minOrderVal: "",
        maxDiscValue: "",
        expiryDate: "",
        isAvailable: true,
      });
      setFormError("");
      setCouponSuccess("Coupon created successfully!");
      setTimeout(() => {
        setCouponSuccess("");
      }, 3000);
    } catch (error) {
      setCouponSuccess("");
      setFormError("Failed to create coupon. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, coupon: false }));
    }
  };

  const handleSignOut = () => {
    Cookies.remove("authTokenAdmin");
    navigate("/");
  };

  const handleTabSelect = (key) => {
    setActiveKey(key);
    if (key === "subscribers") {
      fetchSubscribers();
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUnverified = unverifiedRestaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions
    .filter((transaction) => transaction && transaction.user)
    .filter((transaction) => {
      const userName = transaction.user?.name || "";
      const status = transaction.status || "";
      return (
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="admin-dashboard"
    >
      <Container className="mt-4">
        <motion.div
          className="text-center mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
            alt="Admin Logo"
            className="admin-logo"
          />
          <h1 className="text-center mt-3">Admin Dashboard</h1>
        </motion.div>

        <Row>
          <Col md={3}>
            <motion.div
              className="sidebar"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs
                activeKey={activeKey}
                onSelect={handleTabSelect}
                id="admin-dashboard-tabs"
                className="flex-column"
              >
                <Tab
                  eventKey="restaurants"
                  title={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>All Restaurants</span>
                      <Badge bg="secondary" className="ms-2">
                        {restaurants.length}
                      </Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="unverified"
                  title={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Unverified</span>
                      <Badge bg="danger" className="ms-2">
                        {unverifiedRestaurants.length}
                      </Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="transactions"
                  title={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Transactions</span>
                      <Badge bg="secondary" className="ms-2">
                        {transactions.length}
                      </Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="coupon"
                  title={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Create Coupon</span>
                      <Badge bg="success" className="ms-2">
                        <FaPlus size={10} />
                      </Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="users"
                  title={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Manage Users</span>
                      <Badge bg="secondary" className="ms-2">
                        {users.length}
                      </Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="subscribers"
                  title={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Subscribers</span>
                      <Badge bg="info" className="ms-2">
                        <FaEnvelope size={10} /> {subscribers.length}
                      </Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
              </Tabs>

              <motion.div
                className="sign-out-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="warning"
                  onClick={handleSignOut}
                  className="w-100 mt-3"
                >
                  <FaSignOutAlt className="me-2" />
                  Sign Out
                </Button>
              </motion.div>
            </motion.div>
          </Col>
          <Col md={9}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKey}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="content-area"
              >
                {/* ... (previous tab content remains the same) ... */}

                {activeKey === "subscribers" && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>Email Subscribers</h2>
                      <Badge bg="info" pill>
                        Total: {filteredSubscribers.length}
                      </Badge>
                    </div>
                    {loading.subscribers ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="info" />
                      </div>
                    ) : filteredSubscribers.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-5"
                      >
                        <h4>No subscribers found</h4>
                      </motion.div>
                    ) : (
                      <div className="table-responsive">
                        <Table striped bordered hover className="animate-table">
                          <thead>
                            <tr>
                              <th>Email</th>
                              <th>Subscribed On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSubscribers.map((subscriber, index) => (
                              <motion.tr
                                key={subscriber._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <td>{subscriber.email}</td>
                                <td>
                                  {new Date(
                                    subscriber.subscribedAt
                                  ).toLocaleDateString()}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default AdminDashboard;
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
  Badge
} from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt, FaCheck, FaTimes, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import "../../PageStyle/AdminDashboard.css"; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [unverifiedRestaurants, setUnverifiedRestaurants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
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
    coupon: false
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
    setLoading(prev => ({ ...prev, restaurants: true, transactions: true, users: true }));
    try {
      await Promise.all([fetchRestaurants(), fetchTransactions(), fetchUsers()]);
    } finally {
      setLoading(prev => ({ ...prev, restaurants: false, transactions: false, users: false }));
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/all");
      if (Array.isArray(response.data.restaurant)) {
        setRestaurants(response.data.restaurant);
        setUnverifiedRestaurants(response.data.restaurant.filter((r) => !r.isVerified));
      }
    } catch (error) {
      setRestaurants([]);
      setUnverifiedRestaurants([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get("/payment/transaction");
      setTransactions(response.data.data || []);
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
      setLoading(prev => ({ ...prev, unverified: true }));
      await axiosInstance.put(`/admin/verify/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error("Error approving restaurant:", error);
    } finally {
      setLoading(prev => ({ ...prev, unverified: false }));
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
    if (!coupon.code || !coupon.discountPercentage || !coupon.minOrderVal || !coupon.maxDiscValue || !coupon.expiryDate) {
      setFormError("All fields are required.");
      return;
    }
    if (dateError) return;

    try {
      setLoading(prev => ({ ...prev, coupon: true }));
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
      setLoading(prev => ({ ...prev, coupon: false }));
    }
  };

  const handleSignOut = () => {
    Cookies.remove("authTokenAdmin");
    navigate("/");
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUnverified = unverifiedRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction =>
    transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
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
                onSelect={(k) => setActiveKey(k)}
                id="admin-dashboard-tabs"
                className="flex-column"
              >
                <Tab
                  eventKey="restaurants"
                  title={
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span>All Restaurants</span>
                      <Badge bg="secondary" className="ms-2">{restaurants.length}</Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="unverified"
                  title={
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span>Unverified</span>
                      <Badge bg="danger" className="ms-2">{unverifiedRestaurants.length}</Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="transactions"
                  title={
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span>Transactions</span>
                      <Badge bg="secondary" className="ms-2">{transactions.length}</Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="coupon"
                  title={
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span>Create Coupon</span>
                      <Badge bg="success" className="ms-2"><FaPlus size={10} /></Badge>
                    </motion.div>
                  }
                  className="border-0"
                />
                <Tab
                  eventKey="users"
                  title={
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span>Manage Users</span>
                      <Badge bg="secondary" className="ms-2">{users.length}</Badge>
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
                <Button variant="warning" onClick={handleSignOut} className="w-100 mt-3">
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
                {activeKey === "restaurants" && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>All Restaurants</h2>
                      <Badge bg="primary" pill>
                        Total: {filteredRestaurants.length}
                      </Badge>
                    </div>
                    {loading.restaurants ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table striped bordered hover className="animate-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Contact</th>
                              <th>Email</th>
                              <th>Verified</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRestaurants.map((restaurant, index) => (
                              <motion.tr
                                key={restaurant._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <td>{restaurant.name}</td>
                                <td>{restaurant.phone}</td>
                                <td>{restaurant.email}</td>
                                <td>
                                  {restaurant.isVerified ? (
                                    <FaCheck className="text-success" />
                                  ) : (
                                    <FaTimes className="text-danger" />
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}

                {activeKey === "unverified" && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>Unverified Restaurants</h2>
                      <Badge bg="danger" pill>
                        Pending: {filteredUnverified.length}
                      </Badge>
                    </div>
                    {loading.unverified ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table striped bordered hover className="animate-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Contact</th>
                              <th>Email</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUnverified.map((restaurant, index) => (
                              <motion.tr
                                key={restaurant._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <td>{restaurant.name}</td>
                                <td>{restaurant.phone}</td>
                                <td>{restaurant.email}</td>
                                <td>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button 
                                      variant="success" 
                                      onClick={() => approveRestaurant(restaurant._id)}
                                      disabled={loading.unverified}
                                    >
                                      {loading.unverified ? (
                                        <Spinner as="span" animation="border" size="sm" />
                                      ) : (
                                        "Approve"
                                      )}
                                    </Button>
                                  </motion.div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}

                {activeKey === "transactions" && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>Transactions</h2>
                      <Badge bg="info" pill>
                        Total: {filteredTransactions.length}
                      </Badge>
                    </div>
                    {loading.transactions ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="info" />
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table striped bordered hover className="animate-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Name</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions.map((transaction, index) => (
                              <motion.tr
                                key={transaction._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                <td>{transaction.user.name}</td>
                                <td>Rs {transaction.amount.toFixed(2)}</td>
                                <td>
                                  <Badge bg={transaction.status === "completed" ? "success" : "warning"}>
                                    {transaction.status}
                                  </Badge>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}

                {activeKey === "coupon" && (
                  <div>
                    <h2 className="mb-4">Create Coupon</h2>
                    {loading.coupon ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Form className="coupon-form">
                          <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="code" 
                              placeholder="Enter coupon code" 
                              value={coupon.code} 
                              onChange={handleCouponChange} 
                              required 
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Discount Percentage</Form.Label>
                            <Form.Control 
                              type="number" 
                              name="discountPercentage" 
                              placeholder="e.g., 10 for 10%" 
                              value={coupon.discountPercentage} 
                              onChange={handleCouponChange} 
                              required 
                              min="1"
                              max="100"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Minimum Order Value</Form.Label>
                            <Form.Control 
                              type="number" 
                              name="minOrderVal" 
                              placeholder="Minimum order amount" 
                              value={coupon.minOrderVal} 
                              onChange={handleCouponChange} 
                              required 
                              min="0"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Maximum Discount Value</Form.Label>
                            <Form.Control 
                              type="number" 
                              name="maxDiscValue" 
                              placeholder="Maximum discount amount" 
                              value={coupon.maxDiscValue} 
                              onChange={handleCouponChange} 
                              required 
                              min="0"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control 
                              type="date" 
                              name="expiryDate" 
                              value={coupon.expiryDate} 
                              onChange={handleCouponChange} 
                              required 
                            />
                            {dateError && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-danger mt-2"
                              >
                                {dateError}
                              </motion.div>
                            )}
                          </Form.Group>
                          
                          {formError && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <Alert variant="danger">{formError}</Alert>
                            </motion.div>
                          )}
                          
                          {couponSuccess && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <Alert variant="success">{couponSuccess}</Alert>
                            </motion.div>
                          )}
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              variant="primary" 
                              onClick={createCoupon}
                              disabled={loading.coupon}
                              className="w-100 py-2"
                            >
                              {loading.coupon ? (
                                <>
                                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                                  Creating...
                                </>
                              ) : (
                                "Create Coupon"
                              )}
                            </Button>
                          </motion.div>
                        </Form>
                      </motion.div>
                    )}
                  </div>
                )}

                {activeKey === "users" && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>Manage Users</h2>
                      <Badge bg="secondary" pill>
                        Total: {filteredUsers.length}
                      </Badge>
                    </div>
                    {loading.users ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="secondary" />
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-5"
                      >
                        <h4>No users found</h4>
                      </motion.div>
                    ) : (
                      <div className="table-responsive">
                        <Table striped bordered hover className="animate-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Role</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((user, index) => (
                              <motion.tr
                                key={user._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                              >
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || 'N/A'}</td>
                                <td>
                                  <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                                    {user.role}
                                  </Badge>
                                </td>
                                <td>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button 
                                      variant="danger" 
                                      onClick={() => deleteUser(user._id)}
                                      disabled={user.role === 'admin'}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </motion.div>
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
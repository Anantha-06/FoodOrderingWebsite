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
  Nav,
} from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const authTokenAdmin = Cookies.get("authTokenAdmin");
    if (!authTokenAdmin) {
      navigate("/admin/login");
    } else {
      fetchRestaurants();
      fetchTransactions();
      fetchUsers();
    }
  }, [navigate]);

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
    } catch (error) {}
  };

  const approveRestaurant = async (id) => {
    try {
      await axiosInstance.put(`/admin/verify/${id}`);
      fetchRestaurants();
    } catch (error) {}
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
    }
  };

  const handleSignOut = () => {
    Cookies.remove("authTokenAdmin");
    alert("Sign Out Successful!");
    navigate("/");
    window.location.reload();
  };

  return (
    <Container fluid className="mt-4">
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
          alt="Admin Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </motion.div>
      <motion.h1
        className="text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        Admin Dashboard
      </motion.h1>
      <Tab.Container defaultActiveKey="restaurants">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {["restaurants", "unverified", "transactions", "coupon", "users"].map((tab, index) => (
                <motion.div
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Nav.Item>
                    <Nav.Link eventKey={tab} className="text-capitalize">
                      {tab === "coupon" ? "Create Coupon" : tab.replace(/^\w/, (c) => c.toUpperCase())}
                    </Nav.Link>
                  </Nav.Item>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="mt-3 bg-warning border-0" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </motion.div>
            </Nav>
          </Col>
          <Col sm={9}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Tab.Content>
                <Tab.Pane eventKey="restaurants">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.map((restaurant) => (
                        <motion.tr key={restaurant._id} whileHover={{ backgroundColor: "#f7f7f7" }}>
                          <td>{restaurant.name}</td>
                          <td>{restaurant.phone}</td>
                          <td>{restaurant.email}</td>
                          <td>{restaurant.isVerified ? "Yes" : "No"}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="unverified">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unverifiedRestaurants.map((restaurant) => (
                        <tr key={restaurant._id}>
                          <td>{restaurant.name}</td>
                          <td>{restaurant.phone}</td>
                          <td>{restaurant.email}</td>
                          <td>
                            <motion.button
                              className="btn btn-success"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => approveRestaurant(restaurant._id)}
                            >
                              Approve
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="transactions">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                          <td>{transaction.user.name}</td>
                          <td>{transaction.amount}</td>
                          <td>{transaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="coupon">
                  <Form>
                    <Form.Control type="text" name="code" placeholder="Code" value={coupon.code} onChange={handleCouponChange} required className="mb-2" />
                    <Form.Control type="number" name="discountPercentage" placeholder="Discount %" value={coupon.discountPercentage} onChange={handleCouponChange} required className="mb-2" />
                    <Form.Control type="number" name="minOrderVal" placeholder="Min Order Value" value={coupon.minOrderVal} onChange={handleCouponChange} required className="mb-2" />
                    <Form.Control type="number" name="maxDiscValue" placeholder="Max Discount Value" value={coupon.maxDiscValue} onChange={handleCouponChange} required className="mb-2" />
                    <Form.Control type="date" name="expiryDate" value={coupon.expiryDate} onChange={handleCouponChange} required className="mb-2" />
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    {couponSuccess && <Alert variant="success">{couponSuccess}</Alert>}
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <Button onClick={createCoupon}>Create Coupon</Button>
                    </motion.div>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey="users">
                  {users.length === 0 ? (
                    <p>No users found.</p>
                  ) : (
                    <Table striped bordered hover>
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
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role}</td>
                            <td>
                              <motion.button
                                className="btn btn-danger"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteUser(user._id)}
                              >
                                Delete
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </motion.div>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;

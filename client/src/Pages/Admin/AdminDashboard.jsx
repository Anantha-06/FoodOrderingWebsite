import React, { useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  Table,
  Button,
  Form,
  Alert,
  Container,
} from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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
    <Container className="mt-4">
      <div className="text-center mb-4">
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
          alt="Admin Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </div>
      <h1 className="text-center">Admin Dashboard</h1>
      <Tabs defaultActiveKey="restaurants" id="admin-dashboard-tabs" className="mb-3 flex-column">
        <Tab eventKey="restaurants" title="All Restaurants">
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
                <tr key={restaurant._id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.phone}</td>
                  <td>{restaurant.email}</td>
                  <td>{restaurant.isVerified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="unverified" title="Unverified Restaurants">
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
                    <Button variant="success" onClick={() => approveRestaurant(restaurant._id)}>
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="transactions" title="Transactions">
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
        </Tab>
        <Tab eventKey="coupon" title="Create Coupon">
          <Form>
            <Form.Control type="text" name="code" placeholder="Code" value={coupon.code} onChange={handleCouponChange} required />
            <Form.Control type="number" name="discountPercentage" placeholder="Discount %" value={coupon.discountPercentage} onChange={handleCouponChange} required />
            <Form.Control type="number" name="minOrderVal" placeholder="Min Order Value" value={coupon.minOrderVal} onChange={handleCouponChange} required />
            <Form.Control type="number" name="maxDiscValue" placeholder="Max Discount Value" value={coupon.maxDiscValue} onChange={handleCouponChange} required />
            <Form.Control type="date" name="expiryDate" value={coupon.expiryDate} onChange={handleCouponChange} required />
            {formError && <Alert variant="danger">{formError}</Alert>}
            {couponSuccess && <Alert variant="success">{couponSuccess}</Alert>}
            <Button onClick={createCoupon}>Create Coupon</Button>
          </Form>
        </Tab>
        <Tab eventKey="users" title="Manage Users">
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
                      <Button variant="danger" onClick={() => deleteUser(user._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
      <Link onClick={handleSignOut} className="">
        <button className="bg-warning border-1 rounded-2 px-4">Sign Out</button>
      </Link>
    </Container>
  );
};

export default AdminDashboard;

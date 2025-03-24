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
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
    minOrderVal: "",
    maxDiscValue: "",
    expiryDate: "",
    isAvailable: true,
  });
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    fetchRestaurants();
    fetchTransactions();
  }, []);

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
      setTransactions(response.data.data || []);
    } catch (error) {
      setTransactions([]);
    }
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
    } catch (error) {}
  };

  const handleSignOut = () => {
    Cookies.remove("token");
    alert("Sign Out Successful!");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png"
          alt="Admin Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </div>
      <h1 className="text-center">Admin Dashboard</h1>
      <Tabs defaultActiveKey="restaurants" id="admin-dashboard-tabs" className="mb-3" justify>
        <Tab eventKey="restaurants" title="All Restaurants">
          <Table responsive striped bordered hover>
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
          <Table responsive striped bordered hover>
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
          <Table responsive striped bordered hover>
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
      </Tabs>
      <div>
        <Link onClick={handleSignOut} className="text-decoration-none text-reset">
          <button className="mx-2 my-0 bg-warning px-4 rounded-3 border-1">Sign Out</button>
        </Link>
      </div>
    </Container>
  );
};

export default AdminDashboard;